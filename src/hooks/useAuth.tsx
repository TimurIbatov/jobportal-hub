import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/lib/types';
import * as api from '@/lib/mock-api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, first_name: string, last_name: string, role: UserRole, phone?: string, company_name?: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.seedIfEmpty();
    const auth = api.getAuthUser();
    if (auth) setUser(auth.user);
    setIsInitialized(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = api.login(email, password);
      setUser(user);
      return user;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, first_name: string, last_name: string, role: UserRole, phone?: string, company_name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = api.register(email, password, first_name, last_name, role, phone, company_name);
      setUser(user);
      return user;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return React.createElement(AuthContext.Provider, {
    value: { user, isAuthenticated: !!user, isInitialized, isLoading, error, login, register, logout },
  }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
