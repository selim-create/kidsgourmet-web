'use client';

/**
 * Page Ad Wrapper - Wraps page content with AdProvider
 */

import { ReactNode } from 'react';
import { AdProvider } from '@/contexts/AdContext';

interface PageAdWrapperProps {
  children: ReactNode;
  pageType?: string;
  category?: string;
  tags?: string[];
}

export function PageAdWrapper({ 
  children, 
  pageType,
  category, 
  tags 
}: PageAdWrapperProps) {
  return (
    <AdProvider>
      {children}
    </AdProvider>
  );
}
