import { create } from 'zustand';

type Role = 'employee' | 'hr';

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  login: (accessToken: string, role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  role: null,
  login: (accessToken, role) => {
    localStorage.setItem('accessToken', accessToken);
    set({ isAuthenticated: true, role });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ isAuthenticated: false, role: null });
  },
}));