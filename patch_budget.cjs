const fs = require('fs');
const filepath = "/home/carlos/dados-saude/Projeto local/frontend/src/app/components/budget-distribution.tsx";
let code = fs.readFileSync(filepath, 'utf8');

if (!code.includes('import { Button }')) {
  code = code.replace(/import {([^}]+)} from "\.\/ui\/table"/, 'import { $1 } from "./ui/table"\nimport { Button } from "./ui/button"');
}

if (!code.includes('const [currentPage, setCurrentPage] = useState(1);')) {
  // Find beginning of component
  code = code.replace(/export function BudgetDistribution\(\{[^\}]+\}: BudgetDistributionProps\) \{/, match => {
    return match + `\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 5;\n  const totalPages = Math.ceil((suggestions || []).length / ITEMS_PER_PAGE);\n  const currentSuggestions = (suggestions || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);\n`;
  });
}

// update map
code = code.replace(/\{suggestions\.map\(\(item, index\)/g, '{currentSuggestions.map((item, index)');

// calculate real index (so index 0 on page 2 is 6)
code = code.replace(/<TableCell className="font-semibold text-gray-500">\{index \+ 1\}<\/TableCell>/g, `<TableCell className="font-semibold text-gray-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>`);

// add footer UI
if (!code.includes('Mostrando {')) {
  const tableEndRegex = /<\/TableBody>\s*<\/Table>/;
  const paginationUI = `</TableBody>
                  </Table>
                  {suggestions && suggestions.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between space-x-2 py-4 px-2">
                      <div className="text-sm text-gray-500">
                        Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} até {Math.min(currentPage * ITEMS_PER_PAGE, suggestions.length)} de {suggestions.length} equipamentos
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
                          disabled={currentPage === totalPages || totalPages === 0}
                        >
                          Próxima
                        </Button>
                      </div>
                    </div>
                  )}
`;
  code = code.replace(tableEndRegex, paginationUI);
}

fs.writeFileSync(filepath, code);
