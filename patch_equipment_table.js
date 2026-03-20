const fs = require('fs');
const filepath = "/home/carlos/dados-saude/Projeto local/frontend/src/app/components/equipment-table.tsx";
let code = fs.readFileSync(filepath, 'utf8');

// replace sortedEquipments.map with currentEquipments.map
code = code.replace(/sortedEquipments\.map\(\(eq\)/g, 'currentEquipments.map((eq)');

// add state and logic
const hookInsert = `
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Equipment | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
`;
code = code.replace(/const \[sortConfig, setSortConfig\] = [^;]+;/, hookInsert.trim());

const sliceLogic = `
  const totalPages = Math.ceil(sortedEquipments.length / ITEMS_PER_PAGE);
  const currentEquipments = sortedEquipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset paginação quando mudar a ordenação
  const handleSort = (key: keyof Equipment) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
`;

// replace handleSort
code = code.replace(/const handleSort = \([^}]+\} \}\;/s, sliceLogic.trim());

// add pagination UI
const tableEnd = `</Table>`;
const paginationUI = `</Table>
      <div className="flex items-center justify-between space-x-2 py-4 px-2">
        <div className="text-sm text-gray-500">
          Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} até {Math.min(currentPage * ITEMS_PER_PAGE, sortedEquipments.length)} de {sortedEquipments.length} equipamentos
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
code = code.replace(/<\/Table>/, paginationUI);

// add Button import if not there
if (!code.includes('import { Button }')) {
  code = code.replace(/import {([^}]+)} from "\.\/ui\/table"/, 'import { $1 } from "./ui/table"\nimport { Button } from "./ui/button"');
}

fs.writeFileSync(filepath, code);
