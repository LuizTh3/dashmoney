import type { Category, Transaction } from '../types';
import { toDate } from '../utils/formatters';

const USER_ID = 'PprVMHxTJteTMLqv1JsoF2nYpb63';

export const mockCategories: Category[] = [
  { id: '1', userId: USER_ID, name: 'Salário', icon: '💰', color: '#22c55e', type: 'income', createdAt: new Date() },
  { id: '2', userId: USER_ID, name: 'Freelance', icon: '💻', color: '#10b981', type: 'income', createdAt: new Date() },
  { id: '3', userId: USER_ID, name: 'Investimentos', icon: '📈', color: '#14b8a6', type: 'income', createdAt: new Date() },
  { id: '4', userId: USER_ID, name: 'Alimentação', icon: '🍔', color: '#f97316', type: 'expense', createdAt: new Date() },
  { id: '5', userId: USER_ID, name: 'Transporte', icon: '🚗', color: '#3b82f6', type: 'expense', createdAt: new Date() },
  { id: '6', userId: USER_ID, name: 'Moradia', icon: '🏠', color: '#8b5cf6', type: 'account', createdAt: new Date() },
  { id: '7', userId: USER_ID, name: 'Luz', icon: '💡', color: '#f59e0b', type: 'account', createdAt: new Date() },
  { id: '8', userId: USER_ID, name: 'Água', icon: '💧', color: '#06b6d4', type: 'account', createdAt: new Date() },
  { id: '9', userId: USER_ID, name: 'Internet', icon: '📱', color: '#6366f1', type: 'account', createdAt: new Date() },
  { id: '10', userId: USER_ID, name: 'Lazer', icon: '🎮', color: '#ec4899', type: 'expense', createdAt: new Date() },
  { id: '11', userId: USER_ID, name: 'Saúde', icon: '🏥', color: '#ef4444', type: 'expense', createdAt: new Date() },
  { id: '12', userId: USER_ID, name: 'Educação', icon: '📚', color: '#84cc16', type: 'expense', createdAt: new Date() },
  { id: '13', userId: USER_ID, name: 'Vestuário', icon: '👕', color: '#a855f7', type: 'expense', createdAt: new Date() },
  { id: '14', userId: USER_ID, name: 'Outros', icon: '📦', color: '#6b7280', type: 'expense', createdAt: new Date() },
];

const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  
  const now = new Date();
  const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  transactions.push(
    { id: '1', userId: USER_ID, type: 'income', amount: 5000, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1), categoryId: '1', description: 'Salário mensal', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', userId: USER_ID, type: 'income', amount: 1500, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 5), categoryId: '2', description: 'Projeto freelancer', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', userId: USER_ID, type: 'income', amount: 350, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 10), categoryId: '3', description: 'Rendimento CDI', createdAt: new Date(), updatedAt: new Date() },
    { id: '4', userId: USER_ID, type: 'income', amount: 800, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 15), categoryId: '1', description: 'Salário mensal', createdAt: new Date(), updatedAt: new Date() },
    { id: '5', userId: USER_ID, type: 'income', amount: 2000, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 20), categoryId: '2', description: 'Freelance site', createdAt: new Date(), updatedAt: new Date() },
    { id: '6', userId: USER_ID, type: 'income', amount: 5000, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 2, 1), categoryId: '1', description: 'Salário mensal', createdAt: new Date(), updatedAt: new Date() },
  );

  transactions.push(
    { id: '7', userId: USER_ID, type: 'expense', amount: 450, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 2), categoryId: '4', description: 'Supermercado', createdAt: new Date(), updatedAt: new Date() },
    { id: '8', userId: USER_ID, type: 'expense', amount: 150, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 3), categoryId: '5', description: 'Combustível', createdAt: new Date(), updatedAt: new Date() },
    { id: '9', userId: USER_ID, type: 'expense', amount: 1200, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 5), categoryId: '6', description: 'Aluguel', createdAt: new Date(), updatedAt: new Date() },
    { id: '10', userId: USER_ID, type: 'expense', amount: 120, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 8), categoryId: '7', description: 'Conta de luz', createdAt: new Date(), updatedAt: new Date() },
    { id: '11', userId: USER_ID, type: 'expense', amount: 80, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 10), categoryId: '8', description: 'Conta de água', createdAt: new Date(), updatedAt: new Date() },
    { id: '12', userId: USER_ID, type: 'expense', amount: 100, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 12), categoryId: '9', description: 'Internet fibra', createdAt: new Date(), updatedAt: new Date() },
    { id: '13', userId: USER_ID, type: 'expense', amount: 200, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 15), categoryId: '10', description: 'Netflix + jogos', createdAt: new Date(), updatedAt: new Date() },
    { id: '14', userId: USER_ID, type: 'expense', amount: 180, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 18), categoryId: '11', description: 'Farmácia + médico', createdAt: new Date(), updatedAt: new Date() },
    { id: '15', userId: USER_ID, type: 'expense', amount: 89, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 20), categoryId: '12', description: 'Curso Udemy', createdAt: new Date(), updatedAt: new Date() },
    { id: '16', userId: USER_ID, type: 'expense', amount: 250, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 22), categoryId: '13', description: 'Roupas', createdAt: new Date(), updatedAt: new Date() },
    { id: '17', userId: USER_ID, type: 'expense', amount: 120, date: new Date(baseDate.getFullYear(), baseDate.getMonth(), 25), categoryId: '4', description: 'Restaurante', createdAt: new Date(), updatedAt: new Date() },
    { id: '18', userId: USER_ID, type: 'expense', amount: 500, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 3), categoryId: '4', description: 'Supermercado', createdAt: new Date(), updatedAt: new Date() },
    { id: '19', userId: USER_ID, type: 'expense', amount: 200, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 10), categoryId: '5', description: 'Uber + combustível', createdAt: new Date(), updatedAt: new Date() },
    { id: '20', userId: USER_ID, type: 'expense', amount: 1200, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 5), categoryId: '6', description: 'Aluguel', createdAt: new Date(), updatedAt: new Date() },
    { id: '21', userId: USER_ID, type: 'expense', amount: 150, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 15), categoryId: '10', description: 'Cinema + lazer', createdAt: new Date(), updatedAt: new Date() },
    { id: '22', userId: USER_ID, type: 'expense', amount: 100, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 20), categoryId: '11', description: 'Plano de saúde', createdAt: new Date(), updatedAt: new Date() },
    { id: '23', userId: USER_ID, type: 'expense', amount: 480, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 2, 2), categoryId: '4', description: 'Supermercado', createdAt: new Date(), updatedAt: new Date() },
    { id: '24', userId: USER_ID, type: 'expense', amount: 1200, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 2, 5), categoryId: '6', description: 'Aluguel', createdAt: new Date(), updatedAt: new Date() },
    { id: '25', userId: USER_ID, type: 'expense', amount: 300, date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 2, 15), categoryId: '13', description: 'Sapato + bolsa', createdAt: new Date(), updatedAt: new Date() },
  );

  return transactions.sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime());
};

export const mockTransactions: Transaction[] = generateTransactions();
