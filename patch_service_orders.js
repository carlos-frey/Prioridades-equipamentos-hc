const fs = require('fs');
const filepath = "/home/carlos/dados-saude/Projeto local/frontend/src/app/components/service-orders-panel.tsx";
let code = fs.readFileSync(filepath, 'utf8');

const importAdd = `import { useState } from "react";\nimport { Button } from "./ui/button";`;
if (!code.includes('import { useState }')) {
  code = code.replace(/import \{[^\}]+\} from 'lucide-react';/, match => importAdd + '\n' + match);
}

const componentStartRegex = /(export function ServiceOrdersPanel\([^)]+\) \{)/;

const hookInsert = `
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
`;
code = code.replace(componentStartRegex, '$1\n' + hookInsert);


// Logic to sort and then slice
code = code.replace(/{equipmentOrders\s*\n\s*\.sort\((.*?)\)\n\s*\.map/s, function(match, sortFn) {
  // we will replace the mapping logic inside JSX
  return match; // return it back since it's easier to replace whole table body block
});

// We need to pull the sort logic outside or apply it properly inside. Actually easier to sort outside:

const totalCostInsertRegex = /(const totalCostOrders = equipmentOrders\.reduce\(\([^)]+\) => sum \+ order\.custo, 0\);)/;

const sortAndSliceLogic = `
  const sortedOrders = [...equipmentOrders].sort((a, b) => {
    const dateA = a.dataInicio ? new Date(a.dataInicio.replace(' ', 'T').split('.')[0] + 'Z').getTime() : 0;
    const dateB = b.dataInicio ? new Date(b.dataInicio.replace(' ', 'T').split('.')[0] + 'Z').getTime() : 0;
    return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
  });

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
`;
code = code.replace(totalCostInsertRegex, '$1\n' + sortAndSliceLogic);

// Replace mapping inside the JSX
code = code.replace(/{equipmentOrders[\s\S]*?\.map\(\(order\) => \{/g, '{currentOrders.map((order) => {');

// Add pagination UI
const tableEndRegex = /<\/TableBody>\s*<\/Table>/;
const paginationUI = `</TableBody>
                  </Table>
                  <div className="flex items-center justify-between space-x-2 py-4 px-2">
                    <div className="text-sm text-gray-500">
                      Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} até {Math.min(currentPage * ITEMS_PER_PAGE, sortedOrders.length)} de {sortedOrders.length} ordens de serviço
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <div className="flex items-center justify-center text-sm font-medium px-2">
                        Página {currentPage} de {totalPages || 1}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages || totalPages === 0}
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>`;
code = code.replace(tableEndRegex, paginationUI);

fs.writeFileSync(filepath, code);
