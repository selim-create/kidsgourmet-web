'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global SWR ayarları
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: true,
        errorRetryCount: 2,
        errorRetryInterval: 5000,
        dedupingInterval: 60000, // Default 1 dakika
        
        // Loading state için
        keepPreviousData: true,
        
        // Error handling
        onError: (error, key) => {
          if (process.env.NODE_ENV === 'development') {
            console.error(`SWR Error [${key}]:`, error);
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
