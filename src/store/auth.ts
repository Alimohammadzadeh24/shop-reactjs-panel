import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { apiService } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await apiService.login({ email, password });
          set({ user: response.user, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },
      logout: () => {
        apiService.logout();
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);