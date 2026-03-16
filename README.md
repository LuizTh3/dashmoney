# MoneyDash - Dashboard Financeiro Pessoal

Aplicação web para controle financeiro pessoal com React, TypeScript e Firebase.

## Funcionalidades

- **Dashboard Inteligente**: Gráficos e métricas filtradas por período (dia, semana, mês, ano)
- **Lançamentos**: Cadastro de receitas e despesas com categorias, datas e valores
- **Categorias**: Gerenciamento de categorias customizáveis (ícone, cor, tipo)
- **Dark Mode**: Alternância de tema escuro/claro
- **KPIs**: Total de Receitas, Total de Despesas, Saldo Líquido, Categoria Top, Gráfico de Pizza, Gráfico de Linha
- **Mobile First**: Layout responsivo com sidebar Hamburguer no mobile

## Tech Stack

| Tecnologia | Uso |
|------------|-----|
| React 19 + Vite | Framework SPA |
| TypeScript | Tipagem |
| Tailwind CSS v4 | Estilização |
| Zustand | Estado global |
| React Router v6 | Roteamento |
| Recharts | Gráficos |
| date-fns | Datas |
| lucide-react | Ícones |
| Firebase (pronto) | Backend/Auth |

## Getting Started

```bash
# Instalar dependências
npm install

# Executar desenvolvimento
npm run dev

# Build produção
npm run build
```

## Estrutura de Pastas

```
src/
├── components/     # Componentes reutilizáveis
│   ├── ui/         # Card, Button, Input, Modal, Select
│   ├── layout/     # Layout, Sidebar, Header
│   └── dashboard/  # KPICard
├── pages/          # Páginas da aplicação
├── store/          # Zustand store
├── types/          # Interfaces TypeScript
├── data/           # Dados mockados
└── utils/          # Funções utilitárias
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/login` | Tela de autenticação |
| `/home` | Dashboard |
| `/transactions` | Lista de lançamentos |
| `/categories` | Gerenciar categorias |
| `/settings` | Configurações |

## Autenticação

Atualmente usando mock. Para habilitar Firebase Auth:

1. Configure o Firebase no arquivo `src/lib/firebase.ts`
2. Atualize a função `login` em `src/store/useStore.ts`

## Deploy

Deploy automático via Firebase Hosting configurado no projeto.

## Licença

MIT
