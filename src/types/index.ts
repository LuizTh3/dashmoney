import type { Timestamp } from 'firebase/firestore';

export type TransactionType = 'income' | 'expense';

export type CategoryType = 'expense' | 'account' | 'income';

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  createdAt: Timestamp | Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: Timestamp | Date;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  currency: string;
  darkMode: boolean;
  photoURL?: string;
  createdAt: Timestamp | Date;
}

export interface FilterPeriod {
  type: 'day' | 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export interface KPIData {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  topCategory: Category | null;
  expensesByCategory: { category: Category; amount: number }[];
  balanceHistory: { date: string; balance: number }[];
}
