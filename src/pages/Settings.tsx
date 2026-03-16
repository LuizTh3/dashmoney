import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User, Mail } from 'lucide-react';
import { Layout } from '../components/layout';
import { Card, Button, Select } from '../components/ui';
import { useStore } from '../store/useStore';

const CURRENCY_OPTIONS = [
  { value: 'BRL', label: 'Real (R$)' },
  { value: 'USD', label: 'Dólar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];

export function Settings() {
  const navigate = useNavigate();
  const { user, theme, toggleTheme, logout } = useStore();
  const [currency, setCurrency] = useState(user?.currency || 'BRL');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Configurações
        </h1>

        {/* Aparência */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Aparência
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                Tema Escuro
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </Card>

        {/* Preferências */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Preferências
          </h2>
          <div className="space-y-4">
            <Select
              label="Moeda"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              options={CURRENCY_OPTIONS}
            />
          </div>
        </Card>

        {/* Conta */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Conta
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user?.email || 'email@exemplo.com'}
                </p>
              </div>
            </div>

            <Button 
              variant="secondary" 
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </div>
        </Card>

        {/* Sobre */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Sobre
          </h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>MoneyDash</strong> - v1.0.0</p>
            <p>Dashboard financeiro pessoal</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Dados armazenados localmente (mock)
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
