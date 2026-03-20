export interface Equipment {
  id: string;
  modelo: string;
  fabricante: string;
  setor: string;
  status: 'Operacional' | 'Em Manutenção' | 'Baixado' | 'Aguardando Reparo' | string;
  custo: number;
  totalCustoExterno: number;
  dataAquisicao: string;
  peso_prioridade?: number;
}

export interface ServiceOrder {
  id: string;
  equipmentId: string;
  ordemServico: string;
  custo: number;
  dataInicio: string;
  dataConclusao: string;
}

export interface SuggestedEquipment extends Equipment {
  prioridade: number;
  motivoSubstituicao: string;
}
