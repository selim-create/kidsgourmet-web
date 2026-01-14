'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Child } from '@/lib/types';
import { useUser } from '@/hooks/use-user';

interface ActiveChildContextType {
  activeChild: Child | null;
  setActiveChild: (child: Child) => void;
  children: Child[];
  isLoading: boolean;
}

const ActiveChildContext = createContext<ActiveChildContextType | undefined>(undefined);

const STORAGE_KEY = 'kg_active_child_id';

export function ActiveChildProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: userLoading, children: userChildren } = useUser();
  const [activeChild, setActiveChildState] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load active child from localStorage or set first child as active
  useEffect(() => {
    if (!userLoading && userChildren.length > 0) {
      const savedChildId = typeof window !== 'undefined' 
        ? localStorage.getItem(STORAGE_KEY)
        : null;

      if (savedChildId) {
        const savedChild = userChildren.find(c => c.id === savedChildId);
        if (savedChild) {
          setActiveChildState(savedChild);
        } else {
          // If saved child not found, use first child
          setActiveChildState(userChildren[0]);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, userChildren[0].id);
          }
        }
      } else {
        // No saved child, use first child
        setActiveChildState(userChildren[0]);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, userChildren[0].id);
        }
      }
      setIsLoading(false);
    } else if (!userLoading && userChildren.length === 0) {
      setActiveChildState(null);
      setIsLoading(false);
    }
  }, [userLoading, userChildren]);

  const setActiveChild = useCallback((child: Child) => {
    setActiveChildState(child);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, child.id);
    }
    
    // TODO: Invalidate React Query cache when switching children
    // This will be handled when React Query is integrated
  }, []);

  return (
    <ActiveChildContext.Provider
      value={{
        activeChild,
        setActiveChild,
        children: userChildren,
        isLoading,
      }}
    >
      {children}
    </ActiveChildContext.Provider>
  );
}

export function useActiveChild() {
  const context = useContext(ActiveChildContext);
  if (context === undefined) {
    throw new Error('useActiveChild must be used within an ActiveChildProvider');
  }
  return context;
}
