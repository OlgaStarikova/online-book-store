import { create } from 'zustand';

interface AuthState {
  token: string | null;
  email: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  setAuth: (token: string, email: string, isAdmin: boolean) => void;
  logout: () => void;
}

const savedToken = localStorage.getItem('token');
const savedEmail = localStorage.getItem('email');
const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';

export const useAuthStore = create<AuthState>((set) => ({
  token: savedToken,
  email: savedEmail,
  isAdmin: savedIsAdmin,
  isAuthenticated: !!savedToken,

  setAuth: (token, email, isAdmin) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('isAdmin', String(isAdmin));
    set({ token, email, isAdmin, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
    set({ token: null, email: null, isAdmin: false, isAuthenticated: false });
  },
}));
