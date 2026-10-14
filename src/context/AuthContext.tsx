import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (displayName: string, email: string, password: string, lang?: 'en' | 'hi') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Bootstrap: restore user from localStorage and optionally re-validate with backend
  useEffect(() => {
    const stored = localStorage.getItem('ss_user');
    const token = localStorage.getItem('ss_access_token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        localStorage.removeItem('ss_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login({ email, password });
    const me = await authApi.getMe();
    setUser(me);
  }, []);

  const signup = useCallback(async (displayName: string, email: string, password: string, lang: 'en' | 'hi' = 'en') => {
    await authApi.signup({ display_name: displayName, email, password, preferred_language: lang });
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    authApi.logout();
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await authApi.getMe();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
