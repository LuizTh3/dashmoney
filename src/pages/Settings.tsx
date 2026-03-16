import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User, Mail, Loader2, Save } from 'lucide-react';
import { Layout } from '../components/layout';
import { Card, Button, Select, Input } from '../components/ui';
import { useStore } from '../store/useStore';
import { updateUserPreferences } from '../services/firestore';

const CURRENCY_OPTIONS = [
  { value: 'BRL', label: 'Real (R$)' },
  { value: 'USD', label: 'Dólar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
];

export function Settings() {
  const navigate = useNavigate();
  const { user, theme, logout, setTheme, updateProfile } = useStore();
  const [currency, setCurrency] = useState(user?.currency || 'BRL');
  
  const [name, setName] = useState(user?.displayName || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (user?.currency) {
      setCurrency(user.currency);
    }
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user?.currency, user?.displayName]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    if (password && password.length < 6) {
      setProfileError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password && password !== confirmPassword) {
      setProfileError('As senhas não conferem');
      return;
    }

    setProfileLoading(true);
    try {
      const result = await updateProfile(name, password || undefined);
      if (result.success) {
        setProfileSuccess(true);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        setProfileError(result.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      setProfileError('Erro ao atualizar perfil');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCurrencyChange = async (value: string) => {
    setCurrency(value);
    if (user?.uid) {
      try {
        await updateUserPreferences(user.uid, { currency: value });
      } catch (error) {
        console.error('Error updating currency:', error);
      }
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (user?.uid) {
      try {
        await updateUserPreferences(user.uid, { darkMode: newTheme === 'dark' });
      } catch (error) {
        console.error('Error updating theme preference:', error);
      }
    }
  };

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
              onClick={handleThemeToggle}
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
              onChange={e => handleCurrencyChange(e.target.value)}
              options={CURRENCY_OPTIONS}
            />
          </div>
        </Card>

        {/* Perfil */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Editar Perfil
          </h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Nome"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome completo"
            />
            
            <Input
              type="password"
              label="Nova Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres (deixe vazio para manter)"
            />
            
            <Input
              type="password"
              label="Confirmar Senha"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
            />

            {profileError && (
              <p className="text-sm text-red-500">{profileError}</p>
            )}

            {profileSuccess && (
              <p className="text-sm text-green-500">Perfil atualizado com sucesso!</p>
            )}

            <Button
              type="submit"
              disabled={profileLoading}
              className="w-full"
            >
              {profileLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </form>
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
                  {user?.displayName || 'Usuário'}
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
