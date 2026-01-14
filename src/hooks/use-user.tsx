'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Child } from '@/lib/types';
import { authService } from '@/services/auth-service';
import { userService } from '@/services/user-service';

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
    setIsLoading(true);
    if (authService.isAuthenticated()) {
      try {
        // Tam profil bilgisini al (children dahil)
        const userData = await userService.getFullProfile();
        setUser(userData);
        if (userData?.children?.length) {
          setActiveChild(userData.children[0]);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    // Login sonrası tam profil al
    const userData = await userService.getFullProfile();
    setUser(userData);
    if (userData?.children && userData.children.length > 0) {
      setActiveChild(userData.children[0]);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setActiveChild(null);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authService.register({ email, password, name });
    // Register sonrası tam profil al
    const userData = await userService.getFullProfile();
    setUser(userData);
  };

  const refreshUser = async () => {
    try {
      const userData = await userService.getFullProfile();
      setUser(userData);
      // Active child'ı da güncelle
      if (userData?.children?.length) {
        const currentActiveId = activeChild?.id;
        const stillExists = userData.children.find(c => c.id === currentActiveId);
        if (!stillExists) {
          setActiveChild(userData.children[0]);
        }
      } else {
        setActiveChild(null);
      }
    } catch (error) {
      console.error('Refresh user failed:', error);
    }
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
