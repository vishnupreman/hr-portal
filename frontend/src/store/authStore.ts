import { create } from "zustand";
type Role = "hr" | "employee"

interface User{
    id:string;
    email:string;
    role:Role
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),

  logout: () =>
    set({
      accessToken: null,
      user: null,
    }),
}));