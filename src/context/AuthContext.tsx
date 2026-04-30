import React, { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../utils/api';

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'github' | 'microsoft';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  oauthLogin: (provider: string, token: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const handleError = (error: string) => {
    setAuthState((prev) => ({
      ...prev,
      error,
      isLoading: false,
      isSuccess: false,
    }));
  };

  const clearError = useCallback(() => {
    setAuthState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // ЛОГИН
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      // 🔴 РЕАЛЬНЫЙ API ВЫЗОВ!
      const response = await authAPI.login({ email, password });

      if (!response.isSuccess) {
        handleError(response.message || 'Login failed');
        return;
      }

      // Создаём объект пользователя
      const user: User = {
        id: response.data?.id || 0,
        username: response.data?.username || email.split('@')[0],
        email: response.data?.email || email,
        provider: 'email',
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isSuccess: true,
      });

      // Сохраняем в localStorage (на продакшене используй httpOnly cookies)
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Login failed');
    }
  }, []);

  // РЕГИСТРАЦИЯ
  const signup = useCallback(async (username: string, email: string, password: string) => {
    try {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      // 🔴 РЕАЛЬНЫЙ API ВЫЗОВ!
      const response = await authAPI.register({ username, email, password });

      if (!response.isSuccess) {
        handleError(response.message || 'Registration failed');
        return;
      }

      // После регистрации сразу логиним пользователя
      const user: User = {
        id: response.data?.id || 0,
        username: response.data?.username || username,
        email: response.data?.email || email,
        provider: 'email',
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isSuccess: true,
      });

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Registration failed');
    }
  }, []);

  // OAuth (пока оставляем как есть)
  const oauthLogin = useCallback(async (provider: string, _token?: string) => {
    try {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      const mockUser: User = {
        id: Math.random(),
        email: `user@${provider}.com`,
        username: 'OAuth User',
        provider: provider as 'email' | 'google' | 'github' | 'microsoft',
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isSuccess: true,
      });

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
    } catch (err) {
      handleError(err instanceof Error ? err.message : `${provider} login failed`);
    }
  }, []);

  // ЛОГАУТ
  const logout = useCallback(async () => {
    try {
      // 🔴 РЕАЛЬНЫЙ API ВЫЗОВ!
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isSuccess: false,
    });

    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    oauthLogin,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};