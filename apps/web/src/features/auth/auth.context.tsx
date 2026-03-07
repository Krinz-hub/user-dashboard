import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme: 'dark' | 'light';
    focusDurationMinutes: number;
    breakDurationMinutes: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('devos_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        // Provide immediate demo login for local development if empty
        setUser({
          id: 'dev-user-001',
          name: 'Lead Developer',
          email: 'developer@devos.local',
          preferences: { theme: 'dark', focusDurationMinutes: 25, breakDurationMinutes: 5 },
        });
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get<{ user: User }>('/auth/me');
        setUser(res.user);
      } catch (err) {
        console.warn('Failed to verify existing session:', err);
        // Fallback demo user
        setUser({
          id: 'dev-user-001',
          name: 'Lead Developer',
          email: 'developer@devos.local',
          preferences: { theme: 'dark', focusDurationMinutes: 25, breakDurationMinutes: 5 },
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
    localStorage.setItem('devos_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<{ user: User; token: string }>('/auth/register', { name, email, password });
    localStorage.setItem('devos_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('devos_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
