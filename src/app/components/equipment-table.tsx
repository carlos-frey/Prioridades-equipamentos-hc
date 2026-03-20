import { useState } from 'react';
import { Equipment } from '../types/equipment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface EquipmentTableProps {
  equipments: Equipment[];
  onSelectEquipment: (equipment: Equipment) => void;
  selectedEquipment: Equipment | null;
}

export function EquipmentTable({ equipments, onSelectEquipment, selectedEquipment }: EquipmentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetor, setSelectedSetor] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Obter setores únicos
  const setores = Array.from(new Set(equipments.map(eq => eq.setor))).sort();
  
  // Obter status únicos
  const statusOptions = Array.from(new Set(equipments.map(eq => eq.status))).sort();

  // Filtrar equipamentos
  const filteredEquipments = equipments.filter(eq => {
    const matchesSearch = 
      eq.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSetor = selectedSetor === 'all' || eq.setor === selectedSetor;
    const matchesStatus = selectedStatus === 'all' || eq.status === selectedStatus;
    
    const matchesCost = 
      (minCost === '' || eq.custo >= parseFloat(minCost)) &&
      (maxCost === '' || eq.custo <= parseFloat(maxCost));
    
    const matchesYear = yearFilter === '' || eq.dataAquisicao.startsWith(yearFilter);

    return matchesSearch && matchesSetor && matchesStatus && matchesCost && matchesYear;
  });

  const totalPages = Math.ceil(filteredEquipments.length / ITEMS_PER_PAGE);
  const currentEquipments = filteredEquipments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operante':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Manutenção':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Aguardando Reparo':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Baixado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const clearFilters = () => {
    setSearchTerm(''); setCurrentPage(1);
    setSelectedSetor('all'); setCurrentPage(1);
    setSelectedStatus('all'); setCurrentPage(1);
    setMinCost(''); setCurrentPage(1);
    setMaxCost(''); setCurrentPage(1);
    setYearFilter(''); setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedSetor !== 'all' || selectedStatus !== 'all' || minCost || maxCost || yearFilter;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Barra de Pesquisa */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por modelo, fabricante ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border-gray-300"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Painel de Filtros */}
      {showFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Setor</label>
              <Select value={selectedSetor} onValueChange={setSelectedSetor}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {setores.map(setor => (
                    <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Custo Mínimo</label>
              <Input
                type="number"
                placeholder="R$ 0"
                value={minCost}
                onChange={(e) => setMinCost(e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Custo Máximo</label>
              <Input
                type="number"
                placeholder="R$ 0"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Ano de Aquisição</label>
              <Input
                type="text"
                placeholder="AAAA"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                maxLength={4}
                className="bg-white border-gray-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-4">
          Mostrando <span className="font-semibold text-gray-900">{filteredEquipments.length}</span> de <span className="font-semibold text-gray-900">{equipments.length}</span> equipamentos
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900">ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Modelo</TableHead>
                <TableHead className="font-semibold text-gray-900">Fabricante</TableHead>
                <TableHead className="font-semibold text-gray-900">Setor</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Custo</TableHead>
                <TableHead className="font-semibold text-gray-900">Data Aquisição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEquipments.map((equipment) => (
                <TableRow
                  key={equipment.id}
                  onClick={() => onSelectEquipment(equipment)}
                  className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedEquipment?.id === equipment.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <TableCell className="font-mono text-sm text-blue-700 font-medium">
                    {equipment.id}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{equipment.modelo}</TableCell>
                  <TableCell className="text-gray-700">{equipment.fabricante}</TableCell>
                  <TableCell className="text-gray-700">{equipment.setor}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(equipment.status)} border text-xs`}>
                      {equipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900">
                    {formatCurrency(equipment.custo)}
                  </TableCell>
                  <TableCell className="text-gray-700">{formatDate(equipment.dataAquisicao)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4 px-2">
          <div className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} até {Math.min(currentPage * ITEMS_PER_PAGE, filteredEquipments.length)} de {filteredEquipments.length} equipamentos
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

        {filteredEquipments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum equipamento encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
