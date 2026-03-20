import { useState } from 'react';
import { Equipment, SuggestedEquipment } from '../types/equipment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface BudgetDistributionProps {
  equipments: Equipment[];
}

export function BudgetDistribution({ equipments }: BudgetDistributionProps) {


  const [budget, setBudget] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedEquipment[]>([]);
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil((suggestions || []).length / ITEMS_PER_PAGE);
  const currentSuggestions = (suggestions || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);


  const calculatePriority = (eq: Equipment): number => {
    if (eq.peso_prioridade !== undefined) return eq.peso_prioridade;
    const currentDate = new Date();
    const acquisitionDate = new Date(eq.dataAquisicao);
    const years = (currentDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const costRatio = eq.custo > 0 ? (eq.totalCustoExterno / eq.custo) : 0;
    
    // Peso para status
    let statusWeight = 1;
    if (eq.status === 'Baixado') statusWeight = 2;
    else if (eq.status === 'Em Manutenção') statusWeight = 1.5;
    else if (eq.status === 'Aguardando Reparo') statusWeight = 1.3;
    
    // Fórmula: 40% idade + 40% razão de custo + 20% status
    return years * 0.4 + costRatio * 0.4 + statusWeight * 0.2;
  };

  const getReplacementReason = (eq: Equipment): string => {
    const currentDate = new Date();
    const acquisitionDate = new Date(eq.dataAquisicao);
    const years = Math.floor((currentDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    const costRatio = eq.custo > 0 ? (eq.totalCustoExterno / eq.custo * 100).toFixed(0) : "N/A";
    
    const reasons: string[] = [];
    
    if (years > 10) reasons.push(`${years} anos de uso`);
    if (eq.custo > 0 && eq.totalCustoExterno > eq.custo * 0.5) reasons.push(`Custo externo ${costRatio}% do valor original`);
    if (eq.status === 'Baixado') reasons.push('Equipamento baixado');
    if (eq.status === 'Em Manutenção') reasons.push('Em manutenção constante');
    if (eq.status === 'Aguardando Reparo') reasons.push('Aguardando reparo');
    
    return reasons.join('; ');
  };

  const distribuirOrcamento = async () => {
    const budgetValue = parseFloat(budget);
    
    if (isNaN(budgetValue) || budgetValue <= 0) {
      alert('Por favor, insira um valor de orçamento válido');
      return;
    }

    setIsCalculating(true);

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 800));

    // Calcular prioridade para todos os equipamentos
    const equipmentsWithPriority = equipments.map(eq => ({
      equipment: eq,
      priority: calculatePriority(eq),
      reason: getReplacementReason(eq)
    }));

    // Ordenar por prioridade (maior primeiro)
    equipmentsWithPriority.sort((a, b) => b.priority - a.priority);

    // Distribuir orçamento
    let remainingBudget = budgetValue;
    const selectedEquipments: SuggestedEquipment[] = [];

    for (const item of equipmentsWithPriority) {
      if (remainingBudget >= item.equipment.custo) {
        selectedEquipments.push({
          equipment: item.equipment,
          priority: item.priority,
          reason: item.reason
        });
        remainingBudget -= item.equipment.custo;
      }
    }

    setSuggestions(selectedEquipments);
    setCurrentPage(1);
    setTotalAllocated(budgetValue - remainingBudget);
    setIsCalculating(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPriorityLevel = (priority: number): { label: string; color: string } => {
    if (priority >= 3) return { label: 'Crítica', color: 'bg-red-100 text-red-800 border-red-200' };
    if (priority >= 2) return { label: 'Alta', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    if (priority >= 1) return { label: 'Média', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { label: 'Baixa', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  return (
    <div className="space-y-6">
      {/* Card de Input */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-base">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calculator className="h-5 w-5 text-green-700" />
            </div>
            <span>Calcular Distribuição</span>
          </CardTitle>
          <CardDescription>
            Insira o valor do orçamento disponível para receber a lista otimizada de equipamentos para substituição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Digite o valor do orçamento (R$)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="text-lg border-gray-300"
              />
            </div>
            <Button
              onClick={distribuirOrcamento}
              disabled={isCalculating}
              className="bg-green-700 hover:bg-green-800 text-white px-8"
            >
              {isCalculating ? 'Calculando...' : 'Calcular'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {suggestions.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-700" />
                  </div>
                  <span>Equipamentos Sugeridos para Substituição</span>
                </CardTitle>
                <CardDescription className="mt-2">
                  Lista otimizada baseada em idade, custo de manutenção e status operacional
                </CardDescription>
              </div>
            </div>
            
            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-blue-700 mb-1">Orçamento Total</div>
                <div className="text-2xl font-semibold text-blue-900">
                  {formatCurrency(parseFloat(budget))}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-700 mb-1">Valor Alocado</div>
                <div className="text-2xl font-semibold text-green-900">
                  {formatCurrency(totalAllocated)}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-700 mb-1">Saldo Restante</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(parseFloat(budget) - totalAllocated)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">#</TableHead>
                      <TableHead className="font-semibold text-gray-900">Equipamento</TableHead>
                      <TableHead className="font-semibold text-gray-900">Setor</TableHead>
                      <TableHead className="font-semibold text-gray-900">Prioridade</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">Custo</TableHead>
                      <TableHead className="font-semibold text-gray-900">Razão para Substituição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSuggestions.map((item, index) => {
                      const priorityInfo = getPriorityLevel(item.priority);
                      return (
                        <TableRow key={item.equipment.id} className="hover:bg-gray-50">
                          <TableCell className="font-semibold text-gray-900">
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{item.equipment.modelo}</p>
                              <p className="text-sm text-gray-500">{item.equipment.fabricante}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {item.equipment.setor}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${priorityInfo.color} border text-xs`}>
                              {priorityInfo.label} ({item.priority.toFixed(2)})
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-900">
                            {formatCurrency(item.equipment.custo)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 max-w-md">
                            {item.reason}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
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

              </div>
            </div>

            {/* Alerta de Informação */}
            <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Como funciona a priorização?</p>
                <p className="text-blue-800">
                  O algoritmo considera 40% da idade do equipamento, 40% da relação entre custo de manutenção e valor original,
                  e 20% do status operacional atual. Equipamentos com maior pontuação são priorizados para substituição.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não há sugestões */}
      {suggestions.length === 0 && budget && !isCalculating && (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Insira um orçamento e clique em "Calcular" para ver as sugestões</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
