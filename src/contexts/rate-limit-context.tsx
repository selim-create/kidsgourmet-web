'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { RateLimitToast } from '@/components/ui/rate-limit-toast';
import { isRateLimitError, RateLimitError } from '@/lib/api';

interface RateLimitContextType {
  handleRateLimitError: (error: RateLimitError) => void;
  isRateLimited: boolean;
}

const RateLimitContext = createContext<RateLimitContextType | null>(null);

export function RateLimitProvider({ children }: { children: ReactNode }) {
  const [rateLimitInfo, setRateLimitInfo] = useState<{ retryAfter: number } | null>(null);

  const handleRateLimitError = useCallback((error: RateLimitError) => {
    setRateLimitInfo({ retryAfter: error.data.retry_after });
  }, []);

  const handleClose = useCallback(() => {
    setRateLimitInfo(null);
  }, []);

  return (
    <RateLimitContext.Provider
      value={{
        handleRateLimitError,
        isRateLimited: rateLimitInfo !== null,
      }}
    >
      {children}
      {rateLimitInfo && (
        <RateLimitToast
          retryAfter={rateLimitInfo.retryAfter}
          onClose={handleClose}
        />
      )}
    </RateLimitContext.Provider>
  );
}

export function useRateLimit() {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error('useRateLimit must be used within RateLimitProvider');
  }
  return context;
}
