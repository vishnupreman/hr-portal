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
  role: localStorage.getItem('role') as Role | null,
  login: (accessToken, role) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('role', role);
    set({ isAuthenticated: true, role });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    set({ isAuthenticated: false, role: null });
  },
}));
