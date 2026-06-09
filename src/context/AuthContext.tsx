import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../api/index';

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'github' | 'microsoft';
  role?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  oauthLogin: (provider: string, token: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    isSuccess: false,
  });

  // Проверить сессию при монтировании
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Сначала проверим localStorage
        const savedUser = localStorage.getItem('user');
        const savedAuth = localStorage.getItem('isAuthenticated');

        if (savedUser && savedAuth === 'true') {
          const user = JSON.parse(savedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isSuccess: true,
          });
          return;
        }

        // Если в localStorage ничего нет, просто завершим загрузку
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      } catch (err) {
        console.error('Session check error:', err);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkSession();
  }, []);

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

  const getAuthMessage = (response: Awaited<ReturnType<typeof authAPI.login>>, fallback: string) =>
    response.message || response.Message || fallback;

  const getAuthData = (response: Awaited<ReturnType<typeof authAPI.login>>) =>
    response.data || response.Data;

  const getAuthUser = (
    response: Awaited<ReturnType<typeof authAPI.login>>,
    fallbackUsername: string,
    fallbackEmail: string
  ) => {
    const data = getAuthData(response);
    const role = data?.role || data?.Role;

    return {
      id: data?.id || data?.Id || 0,
      username: data?.username || data?.Username || fallbackUsername,
      email: data?.email || data?.Email || fallbackEmail,
      role: role === 1 || role === '1' || role === 'Admin' ? 'Admin' : 'User',
    };
  };

  const isSuccessfulAuth = (response: Awaited<ReturnType<typeof authAPI.login>>) =>
    response.isSuccess ?? response.IsSuccess ?? Boolean(response.token || response.Token);

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'data' in error.response
    ) {
      const data = error.response.data as { message?: string; Message?: string };
      return data.message || data.Message || fallback;
    }

    return error instanceof Error ? error.message : fallback;
  };

  // ЛОГИН
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      const response = await authAPI.login({ email, password });
      console.log('Login response:', response); // Отладка

      // Проверяем наличие токена
      if (!isSuccessfulAuth(response)) {
        handleError(getAuthMessage(response, 'Неверный e-mail или пароль'));
        return false;
      }

      if (!response.token && !response.Token) {
        handleError(getAuthMessage(response, 'Не удалось войти в аккаунт'));
        return false;
      }

      const authUser = getAuthUser(response, email.split('@')[0], email);
      const user: User = {
        ...authUser,
        provider: 'email',
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isSuccess: true,
      });

      // 🔴 Сохранить в localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    } catch (err) {
      console.error('Login error:', err); // Отладка
      handleError(getErrorMessage(err, 'Неверный e-mail или пароль'));
      return false;
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

      const response = await authAPI.register({ username, email, password });

      if (!isSuccessfulAuth(response)) {
        handleError(getAuthMessage(response, 'Не удалось зарегистрироваться'));
        return false;
      }

      if (!response.token && !response.Token) {
        handleError(getAuthMessage(response, 'Не удалось войти после регистрации'));
        return false;
      }

      const authUser = getAuthUser(response, username, email);
      const user: User = {
        ...authUser,
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
      return true;
    } catch (err) {
      handleError(getErrorMessage(err, 'Не удалось зарегистрироваться'));
      return false;
    }
  }, []);

  // OAuth
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

  const updateUser = useCallback((user: User) => {
    setAuthState((prev) => ({
      ...prev,
      user,
      isAuthenticated: true,
      error: null,
    }));
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    oauthLogin,
    logout,
    clearError,
    updateUser,
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
