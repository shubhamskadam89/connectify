import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import type { User } from '../api/auth';

export type AuthView =
  | 'login'
  | 'register'
  | 'verifyEmail'
  | 'forgotPassword'
  | 'resetPassword'
  | 'dashboard';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  currentView: AuthView;
  setCurrentView: (view: AuthView) => void;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  
  // Shared temporary state for flow transitions
  tempEmail: string | null;
  setTempEmail: (email: string | null) => void;
  resetToken: string | null;
  setResetToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AuthView>('login');
  
  // Temp data helpers
  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setRefreshToken(savedRefreshToken);
      try {
        setUser(JSON.parse(savedUser));
        setCurrentView('dashboard');
      } catch (e) {
        // Clear corrupt state
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = useCallback((token: string, refresh: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(token);
    setRefreshToken(refresh);
    setUser(userData);
    setCurrentView('dashboard');
  }, []);

  const updateUser = useCallback((userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setResetToken(null);
    setTempEmail(null);
    setCurrentView('login');
  }, []);

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isAuthenticated,
        currentView,
        setCurrentView,
        login,
        updateUser,
        logout,
        tempEmail,
        setTempEmail,
        resetToken,
        setResetToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
