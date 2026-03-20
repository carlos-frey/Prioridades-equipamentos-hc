const fs = require('fs');
const filepath = "/home/carlos/dados-saude/Projeto local/frontend/src/app/components/budget-distribution.tsx";
let code = fs.readFileSync(filepath, 'utf8');

const badInjection = `  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil((suggestions || []).length / ITEMS_PER_PAGE);
  const currentSuggestions = (suggestions || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);`;

code = code.replace(badInjection, '');

const insertAfterStates = `  const [isCalculating, setIsCalculating] = useState(false);`;
const goodInjection = `\n  const [currentPage, setCurrentPage] = useState(1);\n  const ITEMS_PER_PAGE = 5;\n  const totalPages = Math.ceil((suggestions || []).length / ITEMS_PER_PAGE);\n  const currentSuggestions = (suggestions || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);\n`;

code = code.replace(insertAfterStates, insertAfterStates + goodInjection);

fs.writeFileSync(filepath, code);
