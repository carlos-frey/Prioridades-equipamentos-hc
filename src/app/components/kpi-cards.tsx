import { Equipment, SuggestedEquipment } from '../types/equipment';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Clock } from 'lucide-react';

interface KPICardsProps {
  equipments: Equipment[];
  topPriorities: SuggestedEquipment[] | Equipment[];
}

export function KPICards({ equipments, topPriorities }: KPICardsProps) {
  // Calcular percentual de equipamentos antigos (>10 anos)
  const currentDate = new Date();
  const oldEquipments = equipments.filter(eq => {
    const acquisitionDate = new Date(eq.dataAquisicao);
    const years = (currentDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return years > 10;
  });
  
  const percentOld = equipments.length > 0 
    ? ((oldEquipments.length / equipments.length) * 100).toFixed(1)
    : "0.0";
  
  const getPriorityScore = (eq: any) => {
    if (eq.prioridade !== undefined) return eq.prioridade;
    if (eq.peso_prioridade !== undefined) return eq.peso_prioridade;
    
    // Fallback if backend does not provide
    const acquisitionDate = new Date(eq.dataAquisicao);
    const years = (currentDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const costRatio = eq.custo > 0 ? (eq.totalCustoExterno / eq.custo) : 0;
    const statusWeight = eq.status === 'Em Manutenção' ? 1.5 : eq.status === 'Aguardando Reparo' ? 1.3 : eq.status === 'Baixado' ? 2 : 1;
    return years * 0.4 + costRatio * 0.4 + statusWeight * 0.2;
  };

  const circumference = 2 * Math.PI * 56;
  const offset = circumference * (1 - parseFloat(percentOld) / 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Percentual de Equipamentos Antigos */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-base">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="h-5 w-5 text-amber-700" />
            </div>
            <span>Equipamentos Antigos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1">
              <div className="space-y-3">
                <div>
                  <div className="text-5xl font-semibold text-amber-700">
                    {percentOld}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">do parque com +10 anos</div>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">{oldEquipments.length}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Antigos</div>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">{equipments.length - oldEquipments.length}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Recentes</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#fef3c7"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#b45309"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Equipamentos com Maior Prioridade */}
      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-base">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
            <span>Top 5 Prioridades</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topPriorities.map((eq, index) => {
              const priority = getPriorityScore(eq);
              const acquisitionDate = new Date(eq.dataAquisicao);
              const years = Math.floor((currentDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
              
              return (
                <div
                  key={eq.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center font-semibold text-white text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-gray-900">{eq.modelo}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-600">{eq.setor}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-amber-700 font-medium">{years} anos</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="px-3 py-1 bg-red-700 rounded-md">
                      <div className="text-xs font-semibold text-white">{priority.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
