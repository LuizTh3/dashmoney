export type TransactionType = 'income' | 'expense';

export type CategoryType = 'expense' | 'account' | 'income';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  categoryId: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
  photoURL?: string;
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
