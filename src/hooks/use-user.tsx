'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Child } from '@/lib/types';
import { authService } from '@/services/auth-service';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  children: Child[];
  activeChild: Child | null;
  setActiveChild: (child: Child | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChild, setActiveChild] = useState<Child | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        if (userData?.children?.length) {
          setActiveChild(userData.children[0]);
        }
      } catch (error) {
        authService.logout();
      }
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    setUser(response.user);
    // children undefined olabilir, kontrol et
    if (response.user?.children && response.user.children.length > 0) {
      setActiveChild(response.user.children[0]);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setActiveChild(null);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authService.register({ email, password, name });
    setUser(response.user);
  };

  const refreshUser = async () => {
    const userData = await authService.getCurrentUser();
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      children: user?.children || [],
      activeChild,
      setActiveChild,
      login,
      logout,
      register,
      refreshUser,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
