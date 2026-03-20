const fs = require('fs');
const filepath = "/home/carlos/dados-saude/Projeto local/frontend/src/app/components/equipment-table.tsx";
let code = fs.readFileSync(filepath, 'utf8');

if (!code.includes('const [currentPage, setCurrentPage] = useState(1);')) {
  code = code.replace(/const \[showFilters, setShowFilters\] = useState\(true\);/, `const [showFilters, setShowFilters] = useState(true);\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 10;`);
}

const tableMappingRegex = /\{filteredEquipments\[\s*'?\w+'?\]\.map/g;

// Instead of rewriting complex sort, just find the whole body of filteredEquipments since there is no sort here? Wait... let me look closer at the render. Oh, `filteredEquipments` is mapped directly. Let's slice it right before the mapping.

const filterLogicFinish = /const filteredEquipments = equipments\.filter\([\s\S]+?\}\);/;
code = code.replace(filterLogicFinish, match => {
  return match + `\n\n  const totalPages = Math.ceil(filteredEquipments.length / ITEMS_PER_PAGE);\n  const currentEquipments = filteredEquipments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);\n`;
});

// Update mappings
code = code.replace(/\{filteredEquipments\.map\(/g, '{currentEquipments.map(');

// In case the pagination UI isn't there
if (!code.includes('Mostrando {')) {
  // It has a <div className="overflow-x-auto"> wrap and then </div>
  const tableEndRegex = /<\/Table>\s*<\/div>/;
  code = code.replace(tableEndRegex, `</Table>\n        </div>\n        <div className="flex items-center justify-between space-x-2 py-4 px-2">\n          <div className="text-sm text-gray-500">\n            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} até {Math.min(currentPage * ITEMS_PER_PAGE, filteredEquipments.length)} de {filteredEquipments.length} equipamentos\n          </div>\n          <div className="flex space-x-2">\n            <Button\n              variant="outline"\n              size="sm"\n              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}\n              disabled={currentPage === 1}\n            >\n              Anterior\n            </Button>\n            <div className="flex items-center justify-center text-sm font-medium px-2">\n              Página {currentPage} de {totalPages || 1}\n            </div>\n            <Button\n              variant="outline"\n              size="sm"\n              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}\n              disabled={currentPage === totalPages || totalPages === 0}\n            >\n              Próxima\n            </Button>\n          </div>\n        </div>`);
}

// Reset page on filter changes:
code = code.replace(/(setSearchTerm\([^)]+\);)/g, '$1 setCurrentPage(1);');
code = code.replace(/(setSelectedSetor\([^)]+\);)/g, '$1 setCurrentPage(1);');
code = code.replace(/(setSelectedStatus\([^)]+\);)/g, '$1 setCurrentPage(1);');
code = code.replace(/(setMinCost\([^)]+\);)/g, '$1 setCurrentPage(1);');
code = code.replace(/(setMaxCost\([^)]+\);)/g, '$1 setCurrentPage(1);');
code = code.replace(/(setYearFilter\([^)]+\);)/g, '$1 setCurrentPage(1);');
code = code.replace(/const clearFilters = \(\) => \{[\s\S]+?\};/, match => {
  if (match.includes('setCurrentPage(1)')) return match;
  return match.replace(/};$/, '  setCurrentPage(1);\n  };');
});

fs.writeFileSync(filepath, code);
