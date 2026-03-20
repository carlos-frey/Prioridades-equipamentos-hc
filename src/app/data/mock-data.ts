import { Equipment, ServiceOrder } from '../types/equipment';

export const equipments: Equipment[] = [
  {
    id: 'EQ-001',
    modelo: 'Ressonância Magnética Siemens Magnetom',
    fabricante: 'Siemens',
    setor: 'Radiologia',
    status: 'Em Manutenção',
    custo: 2500000,
    totalCustoExterno: 1850000,
    dataAquisicao: '2010-03-15'
  },
  {
    id: 'EQ-002',
    modelo: 'Tomógrafo GE Discovery CT750',
    fabricante: 'GE Healthcare',
    setor: 'Radiologia',
    status: 'Operacional',
    custo: 1800000,
    totalCustoExterno: 920000,
    dataAquisicao: '2012-07-22'
  },
  {
    id: 'EQ-003',
    modelo: 'Ultrassom Philips EPIQ 7',
    fabricante: 'Philips',
    setor: 'Cardiologia',
    status: 'Operacional',
    custo: 450000,
    totalCustoExterno: 85000,
    dataAquisicao: '2018-11-10'
  },
  {
    id: 'EQ-004',
    modelo: 'Ventilador Pulmonar Dräger Evita V300',
    fabricante: 'Dräger',
    setor: 'UTI',
    status: 'Operacional',
    custo: 95000,
    totalCustoExterno: 12000,
    dataAquisicao: '2020-05-18'
  },
  {
    id: 'EQ-005',
    modelo: 'Monitor Multiparamétrico Mindray BeneView T8',
    fabricante: 'Mindray',
    setor: 'UTI',
    status: 'Baixado',
    custo: 28000,
    totalCustoExterno: 45000,
    dataAquisicao: '2008-01-25'
  },
  {
    id: 'EQ-006',
    modelo: 'Raio-X Digital Philips DigitalDiagnost',
    fabricante: 'Philips',
    setor: 'Radiologia',
    status: 'Operacional',
    custo: 380000,
    totalCustoExterno: 215000,
    dataAquisicao: '2011-09-14'
  },
  {
    id: 'EQ-007',
    modelo: 'Eletrocardiógrafo GE MAC 2000',
    fabricante: 'GE Healthcare',
    setor: 'Cardiologia',
    status: 'Aguardando Reparo',
    custo: 18000,
    totalCustoExterno: 22000,
    dataAquisicao: '2009-04-30'
  },
  {
    id: 'EQ-008',
    modelo: 'Bomba de Infusão Baxter Colleague 3',
    fabricante: 'Baxter ',
    setor: 'Emergência',
    status: 'Operacional',
    custo: 8500,
    totalCustoExterno: 1200,
    dataAquisicao: '2021-02-10'
  },
  {
    id: 'EQ-009',
    modelo: 'Desfibrilador ZOLL M Series',
    fabricante: 'ZOLL',
    setor: 'Emergência',
    status: 'Operacional',
    custo: 32000,
    totalCustoExterno: 5800,
    dataAquisicao: '2019-08-05'
  },
  {
    id: 'EQ-010',
    modelo: 'Autoclave Stermax',
    fabricante: 'Stermax',
    setor: 'Centro Cirúrgico',
    status: 'Em Manutenção',
    custo: 65000,
    totalCustoExterno: 48000,
    dataAquisicao: '2010-12-20'
  },
  {
    id: 'EQ-011',
    modelo: 'Mesa Cirúrgica Maquet Alphastar',
    fabricante: 'Maquet',
    setor: 'Centro Cirúrgico',
    status: 'Operacional',
    custo: 120000,
    totalCustoExterno: 28000,
    dataAquisicao: '2015-06-12'
  },
  {
    id: 'EQ-012',
    modelo: 'Microscópio Cirúrgico Zeiss OPMI',
    fabricante: 'Zeiss',
    setor: 'Centro Cirúrgico',
    status: 'Operacional',
    custo: 580000,
    totalCustoExterno: 125000,
    dataAquisicao: '2013-03-28'
  },
  {
    id: 'EQ-013',
    modelo: 'Analisador Hematológico Sysmex XN-1000',
    fabricante: 'Sysmex',
    setor: 'Laboratório',
    status: 'Operacional',
    custo: 320000,
    totalCustoExterno: 78000,
    dataAquisicao: '2017-10-15'
  },
  {
    id: 'EQ-014',
    modelo: 'Centrífuga Eppendorf 5810R',
    fabricante: 'Eppendorf',
    setor: 'Laboratório',
    status: 'Aguardando Reparo',
    custo: 42000,
    totalCustoExterno: 38000,
    dataAquisicao: '2009-11-08'
  },
  {
    id: 'EQ-015',
    modelo: 'Incubadora Neonatal Olidef CZ',
    fabricante: 'Olidef',
    setor: 'Neonatologia',
    status: 'Operacional',
    custo: 55000,
    totalCustoExterno: 15000,
    dataAquisicao: '2019-01-20'
  }
];

export const serviceOrders: ServiceOrder[] = [
  // EQ-001
  { id: 'OS-001', equipmentId: 'EQ-001', ordemServico: 'OS-2023-001', custo: 280000, dataInicio: '2023-01-15', dataConclusao: '2023-02-10' },
  { id: 'OS-002', equipmentId: 'EQ-001', ordemServico: 'OS-2023-045', custo: 420000, dataInicio: '2023-05-20', dataConclusao: '2023-06-30' },
  { id: 'OS-003', equipmentId: 'EQ-001', ordemServico: 'OS-2024-012', custo: 350000, dataInicio: '2024-02-10', dataConclusao: '2024-03-05' },
  { id: 'OS-004', equipmentId: 'EQ-001', ordemServico: 'OS-2024-089', custo: 480000, dataInicio: '2024-08-15', dataConclusao: '2024-09-20' },
  { id: 'OS-005', equipmentId: 'EQ-001', ordemServico: 'OS-2025-022', custo: 320000, dataInicio: '2025-03-01', dataConclusao: '2025-04-12' },
  
  // EQ-002
  { id: 'OS-006', equipmentId: 'EQ-002', ordemServico: 'OS-2023-078', custo: 180000, dataInicio: '2023-07-12', dataConclusao: '2023-08-05' },
  { id: 'OS-007', equipmentId: 'EQ-002', ordemServico: 'OS-2024-034', custo: 240000, dataInicio: '2024-04-18', dataConclusao: '2024-05-10' },
  { id: 'OS-008', equipmentId: 'EQ-002', ordemServico: 'OS-2025-056', custo: 500000, dataInicio: '2025-06-05', dataConclusao: '2025-07-20' },
  
  // EQ-003
  { id: 'OS-009', equipmentId: 'EQ-003', ordemServico: 'OS-2023-112', custo: 32000, dataInicio: '2023-11-10', dataConclusao: '2023-11-25' },
  { id: 'OS-010', equipmentId: 'EQ-003', ordemServico: 'OS-2024-145', custo: 28000, dataInicio: '2024-12-01', dataConclusao: '2024-12-15' },
  { id: 'OS-011', equipmentId: 'EQ-003', ordemServico: 'OS-2025-018', custo: 25000, dataInicio: '2025-02-20', dataConclusao: '2025-03-05' },
  
  // EQ-004
  { id: 'OS-012', equipmentId: 'EQ-004', ordemServico: 'OS-2024-067', custo: 8000, dataInicio: '2024-06-15', dataConclusao: '2024-06-22' },
  { id: 'OS-013', equipmentId: 'EQ-004', ordemServico: 'OS-2025-091', custo: 4000, dataInicio: '2025-09-10', dataConclusao: '2025-09-18' },
  
  // EQ-005
  { id: 'OS-014', equipmentId: 'EQ-005', ordemServico: 'OS-2021-034', custo: 12000, dataInicio: '2021-03-15', dataConclusao: '2021-04-02' },
  { id: 'OS-015', equipmentId: 'EQ-005', ordemServico: 'OS-2022-089', custo: 15000, dataInicio: '2022-08-20', dataConclusao: '2022-09-10' },
  { id: 'OS-016', equipmentId: 'EQ-005', ordemServico: 'OS-2023-156', custo: 18000, dataInicio: '2023-12-05', dataConclusao: '2024-01-15' },
  
  // EQ-006
  { id: 'OS-017', equipmentId: 'EQ-006', ordemServico: 'OS-2022-045', custo: 85000, dataInicio: '2022-04-10', dataConclusao: '2022-05-15' },
  { id: 'OS-018', equipmentId: 'EQ-006', ordemServico: 'OS-2023-123', custo: 65000, dataInicio: '2023-10-20', dataConclusao: '2023-11-12' },
  { id: 'OS-019', equipmentId: 'EQ-006', ordemServico: 'OS-2024-178', custo: 65000, dataInicio: '2024-11-05', dataConclusao: '2024-12-01' },
  
  // EQ-007
  { id: 'OS-020', equipmentId: 'EQ-007', ordemServico: 'OS-2022-112', custo: 8000, dataInicio: '2022-10-15', dataConclusao: '2022-11-02' },
  { id: 'OS-021', equipmentId: 'EQ-007', ordemServico: 'OS-2023-089', custo: 7000, dataInicio: '2023-08-12', dataConclusao: '2023-08-28' },
  { id: 'OS-022', equipmentId: 'EQ-007', ordemServico: 'OS-2024-134', custo: 7000, dataInicio: '2024-10-20', dataConclusao: '2024-11-08' },
  
  // EQ-008
  { id: 'OS-023', equipmentId: 'EQ-008', ordemServico: 'OS-2024-089', custo: 800, dataInicio: '2024-08-05', dataConclusao: '2024-08-10' },
  { id: 'OS-024', equipmentId: 'EQ-008', ordemServico: 'OS-2025-045', custo: 400, dataInicio: '2025-05-15', dataConclusao: '2025-05-20' },
  
  // EQ-009
  { id: 'OS-025', equipmentId: 'EQ-009', ordemServico: 'OS-2023-167', custo: 3200, dataInicio: '2023-11-20', dataConclusao: '2023-12-05' },
  { id: 'OS-026', equipmentId: 'EQ-009', ordemServico: 'OS-2025-012', custo: 2600, dataInicio: '2025-01-18', dataConclusao: '2025-02-02' },
  
  // EQ-010
  { id: 'OS-027', equipmentId: 'EQ-010', ordemServico: 'OS-2022-078', custo: 15000, dataInicio: '2022-07-10', dataConclusao: '2022-08-05' },
  { id: 'OS-028', equipmentId: 'EQ-010', ordemServico: 'OS-2023-134', custo: 18000, dataInicio: '2023-10-15', dataConclusao: '2023-11-10' },
  { id: 'OS-029', equipmentId: 'EQ-010', ordemServico: 'OS-2024-201', custo: 15000, dataInicio: '2024-12-20', dataConclusao: '2025-01-25' },
  
  // EQ-011
  { id: 'OS-030', equipmentId: 'EQ-011', ordemServico: 'OS-2023-045', custo: 12000, dataInicio: '2023-05-08', dataConclusao: '2023-05-22' },
  { id: 'OS-031', equipmentId: 'EQ-011', ordemServico: 'OS-2024-123', custo: 16000, dataInicio: '2024-09-15', dataConclusao: '2024-10-02' },
  
  // EQ-012
  { id: 'OS-032', equipmentId: 'EQ-012', ordemServico: 'OS-2023-089', custo: 45000, dataInicio: '2023-08-10', dataConclusao: '2023-09-05' },
  { id: 'OS-033', equipmentId: 'EQ-012', ordemServico: 'OS-2024-167', custo: 80000, dataInicio: '2024-11-12', dataConclusao: '2024-12-18' },
  
  // EQ-013
  { id: 'OS-034', equipmentId: 'EQ-013', ordemServico: 'OS-2023-112', custo: 28000, dataInicio: '2023-09-20', dataConclusao: '2023-10-10' },
  { id: 'OS-035', equipmentId: 'EQ-013', ordemServico: 'OS-2024-189', custo: 50000, dataInicio: '2024-12-01', dataConclusao: '2024-12-28' },
  
  // EQ-014
  { id: 'OS-036', equipmentId: 'EQ-014', ordemServico: 'OS-2022-156', custo: 12000, dataInicio: '2022-11-10', dataConclusao: '2022-12-05' },
  { id: 'OS-037', equipmentId: 'EQ-014', ordemServico: 'OS-2023-178', custo: 14000, dataInicio: '2023-12-15', dataConclusao: '2024-01-20' },
  { id: 'OS-038', equipmentId: 'EQ-014', ordemServico: 'OS-2024-134', custo: 12000, dataInicio: '2024-10-08', dataConclusao: '2024-11-02' },
  
  // EQ-015
  { id: 'OS-039', equipmentId: 'EQ-015', ordemServico: 'OS-2023-201', custo: 8000, dataInicio: '2023-12-20', dataConclusao: '2024-01-10' },
  { id: 'OS-040', equipmentId: 'EQ-015', ordemServico: 'OS-2024-145', custo: 7000, dataInicio: '2024-10-25', dataConclusao: '2024-11-15' }
];
