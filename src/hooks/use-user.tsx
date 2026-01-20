'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Child, UserEditUrls } from '@/lib/types';
import { authService } from '@/services/auth-service';
import { userService } from '@/services/user-service';
import { getToken } from '@/lib/api';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  children: Child[];
  activeChild: Child | null;
  setActiveChild: (child: Child | null) => void;
  login: (email: string, password: string) => Promise<{ redirect_url?: string; is_expert?: boolean }>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<{ redirect_url?: string; is_expert?: boolean }>;
  refreshUser: () => Promise<void>;
  
  // Authorization helpers
  hasEditorAccess: boolean;
  canEditPosts: boolean;
  canEditRecipes: boolean;
  canEditIngredients: boolean;
  canEditOthers: boolean;
  isAdmin: boolean;
  
  // URLs
  adminUrl: string | null;
  editUrls: UserEditUrls | null;
  
  // Helper functions
  getEditUrl: (type: 'post' | 'recipe' | 'ingredient' | 'discussion', id: number) => string | null;
  getNewContentUrl: (type: 'post' | 'recipe' | 'ingredient') => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function to check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false; // No expiry time
    
    // Check if token has expired (exp is in seconds)
    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    // If token is malformed or can't be decoded, consider it expired
    return true;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChild, setActiveChild] = useState<Child | null>(null);

  const checkAuth = async () => {
    setIsLoading(true);
    if (authService.isAuthenticated()) {
      try {
        // Check if token is expired
        const token = getToken();
        if (token && isTokenExpired(token)) {
          // Token is expired, logout
          authService.logout();
          setUser(null);
          setIsLoading(false);
          return;
        }
        
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

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    // Login sonrası tam profil al
    const userData = await userService.getFullProfile();
    setUser(userData);
    if (userData?.children && userData.children.length > 0) {
      setActiveChild(userData.children[0]);
    }
    return {
      redirect_url: response.redirect_url,
      is_expert: response.is_expert,
    };
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
    return {
      redirect_url: response.redirect_url,
      is_expert: response.is_expert,
    };
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

  // Authorization helpers
  const hasEditorAccess = user?.has_editor_access || false;
  const canEditPosts = user?.can_edit?.posts || false;
  const canEditRecipes = user?.can_edit?.recipes || false;
  const canEditIngredients = user?.can_edit?.ingredients || false;
  const canEditOthers = user?.can_edit_others?.posts || false;
  const isAdmin = user?.is_admin || false;
  const adminUrl = user?.admin_url || null;
  const editUrls = user?.edit_urls || null;

  const getEditUrl = (type: 'post' | 'recipe' | 'ingredient' | 'discussion', id: number): string | null => {
    if (!hasEditorAccess || !adminUrl) return null;
    
    // Use proper post_type parameter for custom post types
    switch (type) {
      case 'recipe':
        return `${adminUrl}post.php?post=${id}&action=edit`;
      case 'ingredient':
        return `${adminUrl}post.php?post=${id}&action=edit`;
      case 'discussion':
        return `${adminUrl}post.php?post=${id}&action=edit`;
      case 'post':
      default:
        return `${adminUrl}post.php?post=${id}&action=edit`;
    }
  };

  const getNewContentUrl = (type: 'post' | 'recipe' | 'ingredient'): string | null => {
    if (!hasEditorAccess || !editUrls) return null;
    switch (type) {
      case 'post': return editUrls.new_post;
      case 'recipe': return editUrls.new_recipe;
      case 'ingredient': return editUrls.new_ingredient;
      default: return null;
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
      hasEditorAccess,
      canEditPosts,
      canEditRecipes,
      canEditIngredients,
      canEditOthers,
      isAdmin,
      adminUrl,
      editUrls,
      getEditUrl,
      getNewContentUrl,
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
