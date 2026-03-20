const getBaseUrl = () => {
  const isGitHubPages = window.location.hostname.includes('github.io');
  return isGitHubPages ? '/dados-saude' : '';
};

import { Equipment, SuggestedEquipment } from '../types/equipment';

export const api = {
  getEquipamentos: async (): Promise<Equipment[]> => {
    const url = `${getBaseUrl()}/data/equipamentos-prioritarios.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao buscar equipamentos listados em ' + url);
    const data = await response.json();
    
    return data.map((item: any) => ({
      id: item.identificador,
      modelo: item.modelo || 'Desconhecido',
      fabricante: item.fabricante || 'Desconhecido',
      setor: item.setor || 'N/A',
      status: item.status,
      custo: item.custo_aquisicao,
      totalCustoExterno: item.custo_total_externo,
      dataAquisicao: item.data_aquisicao ? new Date(item.data_aquisicao).toISOString() : new Date().toISOString(),
      peso_prioridade: item.peso_prioridade
    }));
  },
  
  getTop5Substituicao: async (): Promise<SuggestedEquipment[]> => {
    const url = `${getBaseUrl()}/data/top-5-substituicao.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao buscar top 5 em ' + url);
    const data = await response.json();

    return data.map((item: any) => ({
      id: item.identificador,
      modelo: item.modelo || 'Desconhecido',
      fabricante: item.fabricante || 'Desconhecido',
      setor: item.setor || 'N/A',
      status: item.status,
      custo: item.custo,
      totalCustoExterno: item.totalCustoExterno,
      dataAquisicao: item.dataAquisicao ? new Date(item.dataAquisicao).toISOString() : new Date().toISOString(),
      prioridade: item.prioridadeScore,
      motivoSubstituicao: 'Alto custo de manutenção vs valor de aquisição',
    }));
  },

  getEstatisticas: async () => {
    const url = `${getBaseUrl()}/data/estatisticas.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao buscar estatísticas em ' + url);
    const data = await response.json();
    
    return {
      total: data.total_equipamentos,
      emManutencao: data.quantidade_em_manutencao || 0
    };
  },
  
  getOrdensServico: async (equipamentoId: string): Promise<any[]> => {
    const encodedId = encodeURIComponent(equipamentoId);
    const url = `${getBaseUrl()}/data/ordens/${encodedId}.json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Falha ao buscar ordens de serviço em ' + url);
      }
      const data = await response.json();
      return data.map((item: any) => ({
        id: item.ordemServico,
        equipmentId: item.identificadorEquipamento,
        ordemServico: item.ordemServico,
        custo: item.custo,
        dataInicio: item.dataInicio || '',
        dataConclusao: item.dataConclusao || ''
      }));
    } catch (e) {
      console.warn("Nenhuma ordem encontrada para o equipamento:", equipamentoId);
      return [];
    }
  }
};
