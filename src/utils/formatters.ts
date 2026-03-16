import { format, parseISO, startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction, Category, KPIData, FilterPeriod } from '../types';

export const formatCurrency = (value: number, currency = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatDate = (date: Date | string, pattern = 'dd/MM/yyyy'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: ptBR });
};

export const formatDateShort = (date: Date | string): string => {
  return formatDate(date, 'dd MMM');
};

export const getDateRange = (period: FilterPeriod): { start: Date; end: Date } => {
  const now = new Date();
  
  switch (period.type) {
    case 'day':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'week':
      return { start: startOfWeek(now, { weekStartsOn: 0 }), end: endOfWeek(now, { weekStartsOn: 0 }) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'year':
      return { start: startOfYear(now), end: endOfYear(now) };
    case 'custom':
      return { start: period.startDate || startOfMonth(now), end: period.endDate || endOfMonth(now) };
    default:
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
};

export const filterTransactionsByPeriod = (transactions: Transaction[], period: FilterPeriod): Transaction[] => {
  const { start, end } = getDateRange(period);
  
  return transactions.filter(t => 
    isWithinInterval(t.date, { start, end })
  );
};

export const calculateKPIs = (
  transactions: Transaction[],
  categories: Category[],
  period: FilterPeriod
): KPIData => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);
  
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpense;
  
  const expensesByCategory = categories
    .filter(c => c.type === 'expense')
    .map(cat => ({
      category: cat,
      amount: filteredTransactions
        .filter(t => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  
  const topCategory = expensesByCategory[0]?.category || null;
  
  const { start, end } = getDateRange(period);
  const balanceHistory: { date: string; balance: number }[] = [];
  
  let currentDate = new Date(start);
  let runningBalance = 0;
  
  while (currentDate <= end) {
    const dayTransactions = transactions.filter(t => 
      format(t.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    );
    
    dayTransactions.forEach(t => {
      if (t.type === 'income') runningBalance += t.amount;
      else runningBalance -= t.amount;
    });
    
    balanceHistory.push({
      date: format(currentDate, 'dd/MM'),
      balance: runningBalance,
    });
    
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }
  
  return {
    totalIncome,
    totalExpense,
    netBalance,
    topCategory,
    expensesByCategory,
    balanceHistory,
  };
};

export const getCategoryById = (id: string, categories: Category[]): Category | undefined => {
  return categories.find(c => c.id === id);
};
