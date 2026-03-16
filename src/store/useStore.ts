import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterPeriod } from '../types';
import type { User } from '../types';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserData, createUserDocument } from '../services/firestore';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  filterPeriod: FilterPeriod;
  loading: boolean;
  
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setFilterPeriod: (period: FilterPeriod) => void;
  initAuth: () => () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      theme: 'light',
      sidebarOpen: false,
      filterPeriod: { type: 'month' },
      loading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),

      login: async (email: string, password: string) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          let userData = await getUserData(firebaseUser.uid);
          
          if (!userData) {
            await createUserDocument(firebaseUser.uid, firebaseUser.email || email, firebaseUser.displayName || email.split('@')[0]);
            userData = await getUserData(firebaseUser.uid);
          }
          
          if (userData) {
            set({ user: userData, isAuthenticated: true });
            
            if (userData.darkMode) {
              get().setTheme('dark');
            }
            
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: async () => {
        try {
          await firebaseSignOut(auth);
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

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

      initAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            let userData = await getUserData(firebaseUser.uid);
            
            if (!userData) {
              await createUserDocument(firebaseUser.uid, firebaseUser.email || '', firebaseUser.displayName || '');
              userData = await getUserData(firebaseUser.uid);
            }
            
            if (userData) {
              set({ user: userData, isAuthenticated: true, loading: false });
              
              if (userData.darkMode) {
                get().setTheme('dark');
              }
            }
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }
        });

        return unsubscribe;
      },
    }),
    {
      name: 'moneydash-storage',
      partialize: (state) => ({ 
        theme: state.theme,
      }),
    }
  )
);
