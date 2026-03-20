import { Equipment, ServiceOrder } from '../types/equipment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { X, FileText, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from "react";

interface ServiceOrdersPanelProps {
  equipment: Equipment | null;
  serviceOrders: ServiceOrder[];
  isLoading?: boolean;
  onClose: () => void;
}

export function ServiceOrdersPanel({ equipment, serviceOrders, isLoading, onClose }: ServiceOrdersPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  if (!equipment) return null;

  // Como agora o backend já nos envia apenas as ordens do próprio equipamento, não precisamos filtrar.
  // Mas para manter a retrocompatibilidade com o caso estático, deixamos o filter:
  const equipmentOrders = serviceOrders.filter(so => so.equipmentId === equipment.id);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    // Fix non-standard SQL dates like "2018-06-04 15:00:00.000000" to "2018-06-04T15:00:00.000Z"
    const parsedString = dateString.replace(' ', 'T').split('.')[0] + 'Z';
    const date = new Date(parsedString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR');
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return '-';
    const parsedStart = start.replace(' ', 'T').split('.')[0] + 'Z';
    const parsedEnd = end.replace(' ', 'T').split('.')[0] + 'Z';
    const startDate = new Date(parsedStart);
    const endDate = new Date(parsedEnd);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '-';
    const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const totalCostOrders = equipmentOrders.reduce((sum, order) => sum + order.custo, 0);

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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-blue-900 text-white border-b border-blue-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Ordens de Serviço</h2>
                  <p className="text-blue-100 text-sm mt-0.5">Histórico completo de manutenções</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-blue-200 mb-1">Equipamento</div>
                  <div className="font-semibold">{equipment.id}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-blue-200 mb-1">Setor</div>
                  <div className="font-semibold">{equipment.setor}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-blue-200 mb-1">Fabricante</div>
                  <div className="font-semibold truncate">{equipment.fabricante}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-xs text-blue-200 mb-1">Status</div>
                  <div className="font-semibold">{equipment.status}</div>
                </div>
              </div>

              <div className="mt-3 p-3 bg-white/10 rounded-lg">
                <p className="text-sm font-medium">{equipment.modelo}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-4 text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Carregando ordens de serviço...</p>
            </div>
          ) : equipmentOrders.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma ordem de serviço encontrada</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="text-sm text-gray-600">Total de Ordens</div>
                  </div>
                  <div className="text-3xl font-semibold text-gray-900">
                    {equipmentOrders.length}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-red-700" />
                    </div>
                    <div className="text-sm text-gray-600">Custo Total</div>
                  </div>
                  <div className="text-3xl font-semibold text-red-700">
                    {formatCurrency(totalCostOrders)}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-700" />
                    </div>
                    <div className="text-sm text-gray-600">Custo Médio/OS</div>
                  </div>
                  <div className="text-3xl font-semibold text-green-700">
                    {formatCurrency(totalCostOrders / equipmentOrders.length)}
                  </div>
                </div>
              </div>

              {/* Tabela */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">Ordem de Serviço</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Custo</TableHead>
                        <TableHead className="font-semibold text-gray-900">Data Início</TableHead>
                        <TableHead className="font-semibold text-gray-900">Data Conclusão</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Duração</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrders.map((order) => {
                          const duration = calculateDuration(order.dataInicio, order.dataConclusao);
                          return (
                            <TableRow
                              key={order.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-mono font-medium text-blue-700">
                                {order.ordemServico}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="font-semibold text-red-700">
                                  {formatCurrency(order.custo)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-700">{formatDate(order.dataInicio)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-700">{formatDate(order.dataConclusao)}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                                  {duration === '-' ? '-' : `${duration} ${duration === 1 ? 'dia' : 'dias'}`}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
