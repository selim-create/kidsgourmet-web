'use client';

/**
 * Page Ad Wrapper - Wraps page content with AdProvider
 * Note: Currently AdProvider doesn't support pageType/category/tags parameters
 * These are defined for future enhancements but not used yet
 */

import { ReactNode } from 'react';
import { AdProvider } from '@/contexts/AdContext';

interface PageAdWrapperProps {
  children: ReactNode;
}

export function PageAdWrapper({ 
  children,
}: PageAdWrapperProps) {
  return (
    <AdProvider>
      {children}
    </AdProvider>
  );
}
