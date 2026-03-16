import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Layout } from '../components/layout';
import { Card, Select } from '../components/ui';
import { KPICard } from '../components/dashboard/KPICard';
import { useStore } from '../store/useStore';
import { mockTransactions, mockCategories } from '../data/mock';
import { formatCurrency, formatDate, calculateKPIs, getCategoryById } from '../utils/formatters';
import type { FilterPeriod } from '../types';

const periodOptions = [
  { value: 'day', label: 'Dia' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
  { value: 'year', label: 'Ano' },
];

export function Home() {
  const { filterPeriod, setFilterPeriod } = useStore();
  const [period, setPeriod] = useState(filterPeriod.type);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as FilterPeriod['type'];
    setPeriod(newPeriod);
    setFilterPeriod({ type: newPeriod });
  };

  const kpis = useMemo(() => 
    calculateKPIs(mockTransactions, mockCategories, filterPeriod),
    [filterPeriod]
  );

  const pieData = kpis.expensesByCategory.map(item => ({
    name: item.category.name,
    value: item.amount,
    color: item.category.color,
  }));

  const lineData = kpis.balanceHistory;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Filtros */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <Select
            value={period}
            onChange={handlePeriodChange}
            options={periodOptions}
            className="w-32"
          />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard
            title="Receitas"
            value={formatCurrency(kpis.totalIncome)}
            type="income"
          />
          <KPICard
            title="Despesas"
            value={formatCurrency(kpis.totalExpense)}
            type="expense"
          />
          <KPICard
            title="Saldo Líquido"
            value={formatCurrency(kpis.netBalance)}
            type="balance"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pizza - Gastos por categoria */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Gastos por Categoria
            </h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg, #fff)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Nenhuma despesa no período
              </div>
            )}
          </Card>

          {/* Linha - Evolução do saldo */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Evolução do Saldo
            </h3>
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    tickFormatter={(value) => formatCurrency(value).replace(',00', '')}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg, #fff)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Sem dados no período
              </div>
            )}
          </Card>
        </div>

        {/* Ranking de Categorias */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Top Categorias
          </h3>
          <div className="space-y-3">
            {kpis.expensesByCategory.slice(0, 5).map(item => (
              <div key={item.category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.category.icon}</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-16 h-2 rounded-full"
                    style={{ 
                      backgroundColor: item.category.color,
                      width: `${(item.amount / kpis.totalExpense) * 100}%`,
                      maxWidth: '64px'
                    }}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Últimos Lançamentos */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Últimos Lançamentos
          </h3>
          <div className="space-y-3">
            {mockTransactions.slice(0, 5).map(transaction => {
              const category = getCategoryById(transaction.categoryId, mockCategories);
              return (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category?.icon || '💰'}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category?.name} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <span className={`font-medium ${
                    transaction.type === 'income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
