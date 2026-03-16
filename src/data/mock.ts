import type { Category, Transaction } from '../types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Salário', icon: '💰', color: '#22c55e', type: 'income' },
  { id: '2', name: 'Freelance', icon: '💻', color: '#10b981', type: 'income' },
  { id: '3', name: 'Investimentos', icon: '📈', color: '#14b8a6', type: 'income' },
  { id: '4', name: 'Alimentação', icon: '🍔', color: '#f97316', type: 'expense' },
  { id: '5', name: 'Transporte', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { id: '6', name: 'Moradia', icon: '🏠', color: '#8b5cf6', type: 'account' },
  { id: '7', name: 'Luz', icon: '💡', color: '#f59e0b', type: 'account' },
  { id: '8', name: 'Água', icon: '💧', color: '#06b6d4', type: 'account' },
  { id: '9', name: 'Internet', icon: '📱', color: '#6366f1', type: 'account' },
  { id: '10', name: 'Lazer', icon: '🎮', color: '#ec4899', type: 'expense' },
  { id: '11', name: 'Saúde', icon: '🏥', color: '#ef4444', type: 'expense' },
  { id: '12', name: 'Educação', icon: '📚', color: '#84cc16', type: 'expense' },
  { id: '13', name: 'Vestuário', icon: '👕', color: '#a855f7', type: 'expense' },
  { id: '14', name: 'Outros', icon: '📦', color: '#6b7280', type: 'expense' },
];

const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  
  const now = new Date();
  
  // Receitas
  transactions.push(
    { id: '1', type: 'income', amount: 5000, date: new Date(now.getFullYear(), now.getMonth(), 1), categoryId: '1', description: 'Salário mensal' },
    { id: '2', type: 'income', amount: 1500, date: new Date(now.getFullYear(), now.getMonth(), 5), categoryId: '2', description: 'Projeto freelancer' },
    { id: '3', type: 'income', amount: 350, date: new Date(now.getFullYear(), now.getMonth(), 10), categoryId: '3', description: 'Rendimento CDI' },
    { id: '4', type: 'income', amount: 800, date: new Date(now.getFullYear(), now.getMonth() - 1, 15), categoryId: '1', description: 'Salário mensal' },
    { id: '5', type: 'income', amount: 2000, date: new Date(now.getFullYear(), now.getMonth() - 1, 20), categoryId: '2', description: 'Freelance site' },
    { id: '6', type: 'income', amount: 5000, date: new Date(now.getFullYear(), now.getMonth() - 2, 1), categoryId: '1', description: 'Salário mensal' },
  );

  // Despesas
  transactions.push(
    { id: '7', type: 'expense', amount: 450, date: new Date(now.getFullYear(), now.getMonth(), 2), categoryId: '4', description: 'Supermercado' },
    { id: '8', type: 'expense', amount: 150, date: new Date(now.getFullYear(), now.getMonth(), 3), categoryId: '5', description: 'Combustível' },
    { id: '9', type: 'expense', amount: 1200, date: new Date(now.getFullYear(), now.getMonth(), 5), categoryId: '6', description: 'Aluguel' },
    { id: '10', type: 'expense', amount: 120, date: new Date(now.getFullYear(), now.getMonth(), 8), categoryId: '7', description: 'Conta de luz' },
    { id: '11', type: 'expense', amount: 80, date: new Date(now.getFullYear(), now.getMonth(), 10), categoryId: '8', description: 'Conta de água' },
    { id: '12', type: 'expense', amount: 100, date: new Date(now.getFullYear(), now.getMonth(), 12), categoryId: '9', description: 'Internet fibra' },
    { id: '13', type: 'expense', amount: 200, date: new Date(now.getFullYear(), now.getMonth(), 15), categoryId: '10', description: 'Netflix + jogos' },
    { id: '14', type: 'expense', amount: 180, date: new Date(now.getFullYear(), now.getMonth(), 18), categoryId: '11', description: 'Farmácia + médico' },
    { id: '15', type: 'expense', amount: 89, date: new Date(now.getFullYear(), now.getMonth(), 20), categoryId: '12', description: 'Curso Udemy' },
    { id: '16', type: 'expense', amount: 250, date: new Date(now.getFullYear(), now.getMonth(), 22), categoryId: '13', description: 'Roupas' },
    { id: '17', type: 'expense', amount: 120, date: new Date(now.getFullYear(), now.getMonth(), 25), categoryId: '4', description: 'Restaurante' },
    // Mês anterior
    { id: '18', type: 'expense', amount: 500, date: new Date(now.getFullYear(), now.getMonth() - 1, 3), categoryId: '4', description: 'Supermercado' },
    { id: '19', type: 'expense', amount: 200, date: new Date(now.getFullYear(), now.getMonth() - 1, 10), categoryId: '5', description: 'Uber + combustível' },
    { id: '20', type: 'expense', amount: 1200, date: new Date(now.getFullYear(), now.getMonth() - 1, 5), categoryId: '6', description: 'Aluguel' },
    { id: '21', type: 'expense', amount: 150, date: new Date(now.getFullYear(), now.getMonth() - 1, 15), categoryId: '10', description: 'Cinema + lazer' },
    { id: '22', type: 'expense', amount: 100, date: new Date(now.getFullYear(), now.getMonth() - 1, 20), categoryId: '11', description: 'Plano de saúde' },
    // 2 meses atrás
    { id: '23', type: 'expense', amount: 480, date: new Date(now.getFullYear(), now.getMonth() - 2, 2), categoryId: '4', description: 'Supermercado' },
    { id: '24', type: 'expense', amount: 1200, date: new Date(now.getFullYear(), now.getMonth() - 2, 5), categoryId: '6', description: 'Aluguel' },
    { id: '25', type: 'expense', amount: 300, date: new Date(now.getFullYear(), now.getMonth() - 2, 15), categoryId: '13', description: 'Sapato + bolsa' },
  );

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const mockTransactions: Transaction[] = generateTransactions();
