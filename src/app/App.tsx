import { useState, useEffect } from 'react';
import { Equipment, SuggestedEquipment, ServiceOrder } from './types/equipment';
import { api } from './services/api';
import { KPICards } from './components/kpi-cards';
import { EquipmentTable } from './components/equipment-table';
import { ServiceOrdersPanel } from './components/service-orders-panel';
import { BudgetDistribution } from './components/budget-distribution';
import { Activity } from 'lucide-react';

function App() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [modalServiceOrders, setModalServiceOrders] = useState<ServiceOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [topPriorities, setTopPriorities] = useState<SuggestedEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [eqData, topData] = await Promise.all([
          api.getEquipamentos(),
          api.getTop5Substituicao()
        ]);
        setEquipments(eqData);
        setTopPriorities(topData);
      } catch (error) {
        console.error("Erro ao buscar dados do backend", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Buscar ordens de serviço quando um equipamento é selecionado
  useEffect(() => {
    async function fetchOrders() {
      if (selectedEquipment) {
        setLoadingOrders(true);
        try {
          const orders = await api.getOrdensServico(selectedEquipment.id);
          setModalServiceOrders(orders);
        } catch (error) {
          console.error("Erro ao buscar ordens de serviço:", error);
          setModalServiceOrders([]);
        } finally {
          setLoadingOrders(false);
        }
      } else {
        setModalServiceOrders([]);
      }
    }
    
    fetchOrders();
  }, [selectedEquipment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Gestão de Equipamentos
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Hospital das Clínicas
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Total Equipamentos</div>
                <div className="text-2xl font-semibold text-gray-900">{equipments.length}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPIs */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Indicadores Gerais
            </h2>
            <p className="text-sm text-gray-500 mt-1">Visão geral do parque tecnológico</p>
          </div>
          <KPICards equipments={equipments} topPriorities={topPriorities} />
        </section>

        {/* Tabela de Equipamentos */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Catálogo de Equipamentos
            </h2>
            <p className="text-sm text-gray-500 mt-1">Listagem completa com filtros</p>
          </div>
          <EquipmentTable
            equipments={equipments}
            onSelectEquipment={setSelectedEquipment}
            selectedEquipment={selectedEquipment}
          />
        </section>

        {/* Distribuição de Orçamento */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Distribuição de Orçamento
            </h2>
            <p className="text-sm text-gray-500 mt-1">Otimização de investimentos baseada em priorização</p>
          </div>
          <BudgetDistribution equipments={equipments} />
        </section>
      </main>

      {/* Modal de Ordens de Serviço */}
      {selectedEquipment && (
        <ServiceOrdersPanel
          equipment={selectedEquipment}
          serviceOrders={modalServiceOrders}
          isLoading={loadingOrders}
          onClose={() => setSelectedEquipment(null)}
        />
      )}
    </div>
  );
}

export default App;