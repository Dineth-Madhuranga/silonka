import React, { createContext, useContext, useState, useCallback } from 'react';
import { logout as apiLogout } from '@/lib/api';

export interface UserInfo {
  _id?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  token?: string;
  picture?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  setUser: (userData: UserInfo) => void;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserInfo | null>(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setUser = useCallback((userData: UserInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserState(userData);
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore api errors on logout
    }
    localStorage.removeItem('userInfo');
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
