import { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Layout } from '../components/layout';
import { Card, Button, Input, Modal, Select } from '../components/ui';
import { mockCategories, mockTransactions } from '../data/mock';
import type { Category, CategoryType } from '../types';

const CATEGORY_COLORS = [
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b',
  '#84cc16', '#65a30d', '#4d4d4d', '#6b7280', '#9ca3af',
];

const EMOJI_OPTIONS = [
  '💰', '💳', '💵', '🏠', '🚗', '🍔', '🛒', '🎮', '📱', '📺',
  '💡', '💧', '🏥', '📚', '👕', '🎁', '✈️', '🎵', '💼', '📈',
  '🏋️', '👶', '🐕', '🌿', '🎨', '📦', '🔧', '🎯', '⭐', '🔥',
];

export function Categories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [typeFilter, setTypeFilter] = useState<CategoryType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    icon: '💰',
    color: '#3b82f6',
    type: 'expense' as CategoryType,
  });

  const filteredCategories = categories.filter(c => 
    typeFilter === 'all' || c.type === typeFilter
  );

  const hasTransactions = (categoryId: string) => {
    return mockTransactions.some(t => t.categoryId === categoryId);
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        icon: '💰',
        color: '#3b82f6',
        type: 'expense',
      });
    }
    setDeleteError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setDeleteError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const category: Category = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name,
      icon: formData.icon,
      color: formData.color,
      type: formData.type,
    };

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    } else {
      setCategories(prev => [...prev, category]);
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    if (hasTransactions(id)) {
      setDeleteError('Esta categoria possui transações vinculadas e não pode ser excluída.');
      return;
    }

    setCategories(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
    setDeleteError(null);
  };

  const typeOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'expense', label: 'Despesa' },
    { value: 'account', label: 'Conta Fixa' },
    { value: 'income', label: 'Receita' },
  ];

  const categoryTypeOptions = [
    { value: 'expense', label: 'Despesa' },
    { value: 'account', label: 'Conta Fixa' },
    { value: 'income', label: 'Receita' },
  ];

  const getTypeLabel = (type: CategoryType) => {
    switch (type) {
      case 'expense': return 'Despesa';
      case 'account': return 'Conta Fixa';
      case 'income': return 'Receita';
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Categorias
          </h1>
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <Select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as CategoryType | 'all')}
            options={typeOptions}
            className="w-full md:w-40"
          />
        </Card>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCategories.map(category => (
            <Card key={category.id} className="flex flex-col items-center text-center relative group">
              <button
                onClick={() => openModal(category)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              
              <button
                onClick={() => {
                  if (hasTransactions(category.id)) {
                    setDeleteError('Esta categoria possui transações vinculadas e não pode ser excluída.');
                  } else {
                    setDeleteConfirm(category.id);
                  }
                }}
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>

              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2"
                style={{ backgroundColor: category.color + '20' }}
              >
                {category.icon}
              </div>
              
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {category.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getTypeLabel(category.type)}
              </p>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <Card>
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhuma categoria encontrada
            </div>
          </Card>
        )}
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Tipo"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as CategoryType })}
            options={categoryTypeOptions}
          />
          
          <Input
            label="Nome"
            placeholder="Ex: Alimentação"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ícone
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  className={`w-8 h-8 flex items-center justify-center text-lg rounded ${
                    formData.icon === emoji 
                      ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cor
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              {CATEGORY_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {editingCategory ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => { setDeleteConfirm(null); setDeleteError(null); }}
        title="Confirmar Exclusão"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => { setDeleteConfirm(null); setDeleteError(null); }} className="flex-1">
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1">
            Excluir
          </Button>
        </div>
      </Modal>

      {/* Modal de Erro ao Excluir */}
      <Modal
        isOpen={!!deleteError && !deleteConfirm}
        onClose={() => setDeleteError(null)}
        title="Atenção"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-600 dark:text-gray-400">
            {deleteError}
          </p>
        </div>
        <div className="mt-4">
          <Button onClick={() => setDeleteError(null)} className="w-full">
            Entendi
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}
