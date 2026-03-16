import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, FilterPeriod } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  filterPeriod: FilterPeriod;
  
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setFilterPeriod: (period: FilterPeriod) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      theme: 'light',
      sidebarOpen: false,
      filterPeriod: { type: 'month' },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email: string, password: string) => {
        // Mock login - posteriormente integrar com Firebase Auth
        if (email && password) {
          const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            currency: 'BRL',
          };
          set({ user: mockUser, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      setTheme: (theme) => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setFilterPeriod: (period) => set({ filterPeriod: period }),
    }),
    {
      name: 'moneydash-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
