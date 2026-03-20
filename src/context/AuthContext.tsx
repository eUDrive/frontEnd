import React, { createContext, useContext, useState, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
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
  signup: (email: string, password: string, name: string) => Promise<void>;
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
    }));
  };

  const clearError = useCallback(() => {
    setAuthState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    try {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      // TODO: Replace with actual API call
      // In production: validate credentials against backend
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        provider: 'email',
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isSuccess: true,
      });

      // Store token in localStorage (in production, use secure httpOnly cookies)
      localStorage.setItem('auth_token', 'mock-token');
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Login failed');
    }
  }, []);

  const signup = useCallback(async (email: string, _password: string, name: string) => {
    try {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      // TODO: Replace with actual API call
      // In production: hash password and store user in database
      const mockUser: User = {
        id: '2',
        email,
        name,
        provider: 'email',
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isSuccess: true,
      });

      localStorage.setItem('auth_token', 'mock-token');
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Signup failed');
    }
  }, []);

  const oauthLogin = useCallback(async (provider: string, token: string) => {
    try {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      // TODO: Replace with actual API call
      const mockUser: User = {
        id: '3',
        email: `user@${provider}.com`,
        name: 'OAuth User',
        provider: provider as any,
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isSuccess: true,
      });

      localStorage.setItem('auth_token', token);
    } catch (err) {
      handleError(err instanceof Error ? err.message : `${provider} login failed`);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isSuccess: false,
    });
    localStorage.removeItem('auth_token');
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
