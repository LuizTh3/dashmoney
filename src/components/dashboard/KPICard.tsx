import { Card } from '../ui';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  type: 'income' | 'expense' | 'balance';
  icon?: React.ReactNode;
}

export function KPICard({ title, value, type, icon }: KPICardProps) {
  const colors = {
    income: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
    expense: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
    balance: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
  };

  const icons = {
    income: <TrendingUp className="w-5 h-5" />,
    expense: <TrendingDown className="w-5 h-5" />,
    balance: <DollarSign className="w-5 h-5" />,
  };

  return (
    <Card className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[type]}`}>
        {icon || icons[type]}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-xl font-bold ${colors[type].split(' ')[0]}`}>
          {value}
        </p>
      </div>
    </Card>
  );
}
