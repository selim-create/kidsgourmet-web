'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Child } from '@/lib/types';
import { useUser } from '@/hooks/use-user';

interface ActiveChildContextType {
  activeChild: Child | null;
  setActiveChild: (child: Child) => void;
  children: Child[];
  isLoading: boolean;
}

const ActiveChildContext = createContext<ActiveChildContextType | undefined>(undefined);

export function ActiveChildProvider({ children }: { children: ReactNode }) {
  const { 
    children: userChildren, 
    activeChild, 
    setActiveChild, 
    isLoading 
  } = useUser();

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
