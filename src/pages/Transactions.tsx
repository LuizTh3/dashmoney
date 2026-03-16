import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Layout } from '../components/layout';
import { Card, Button, Input, Modal, Select } from '../components/ui';
import { mockTransactions, mockCategories } from '../data/mock';
import { formatCurrency, formatDate, getCategoryById } from '../utils/formatters';
import type { Transaction, TransactionType } from '../types';

type SortField = 'date' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    description: '',
  });

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        getCategoryById(t.categoryId, mockCategories)?.name.toLowerCase().includes(searchLower)
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter(t => t.categoryId === categoryFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'category') {
        const catA = getCategoryById(a.categoryId, mockCategories)?.name || '';
        const catB = getCategoryById(b.categoryId, mockCategories)?.name || '';
        comparison = catA.localeCompare(catB);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, search, typeFilter, categoryFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        date: transaction.date.toISOString().split('T')[0],
        categoryId: transaction.categoryId,
        description: transaction.description,
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'expense',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: mockCategories.find(c => c.type === 'expense')?.id || '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryType = formData.type;
    const categoriesForType = mockCategories.filter(c => c.type === categoryType || c.type === 'account');
    const defaultCategory = categoriesForType.find(c => c.id === formData.categoryId) || categoriesForType[0];

    const transaction: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
      categoryId: defaultCategory?.id || formData.categoryId,
      description: formData.description,
    };

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
    } else {
      setTransactions(prev => [transaction, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setDeleteConfirm(null);
  };

  const categoryOptions = mockCategories
    .filter(c => formData.type === 'income' ? c.type === 'income' : c.type === 'expense' || c.type === 'account')
    .map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }));

  const typeOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'income', label: 'Receita' },
    { value: 'expense', label: 'Despesa' },
  ];

  const filterCategoryOptions = [
    { value: 'all', label: 'Todas' },
    ...mockCategories.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` })),
  ];

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Lançamentos
          </h1>
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Novo
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as TransactionType | 'all')}
              options={typeOptions}
              className="w-full md:w-32"
            />
            <Select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              options={filterCategoryOptions}
              className="w-full md:w-40"
            />
          </div>
        </Card>

        {/* Tabela */}
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button 
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Data
                    {sortField === 'date' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button 
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Categoria
                    {sortField === 'category' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Descrição
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button 
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-1 ml-auto hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Valor
                    {sortField === 'amount' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => {
                const category = getCategoryById(transaction.categoryId, mockCategories);
                return (
                  <tr 
                    key={transaction.id}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span>{category?.icon || '💰'}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category?.name || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-700 dark:text-gray-300">
                      {transaction.description}
                    </td>
                    <td className={`py-3 px-2 text-sm text-right font-medium ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(transaction)}
                          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(transaction.id)}
                          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhum lançamento encontrado
            </div>
          )}
        </Card>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Tipo"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as TransactionType, categoryId: '' })}
            options={[
              { value: 'expense', label: 'Despesa' },
              { value: 'income', label: 'Receita' },
            ]}
          />
          
          <Input
            label="Valor"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            required
          />
          
          <Input
            label="Data"
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            required
          />
          
          <Select
            label="Categoria"
            value={formData.categoryId}
            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            options={categoryOptions}
            required
          />
          
          <Input
            label="Descrição"
            placeholder="Ex: Supermercado, Salário..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
          />
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {editingTransaction ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar Exclusão"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)} className="flex-1">
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1">
            Excluir
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}
