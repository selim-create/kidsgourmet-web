'use client';

import { useEffect, useState } from 'react';

interface RateLimitToastProps {
  retryAfter: number;
  onClose: () => void;
}

export function RateLimitToast({ retryAfter, onClose }: RateLimitToastProps) {
  const [countdown, setCountdown] = useState(retryAfter);

  useEffect(() => {
    if (countdown <= 0) {
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg 
              className="h-5 w-5 text-orange-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-orange-800">
              Çok fazla istek
            </h4>
            <p className="text-sm text-orange-700 mt-1">
              Lütfen biraz bekleyin ve tekrar deneyin.
            </p>
            <div className="flex items-center gap-2 mt-2 text-orange-600">
              <svg 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="text-sm font-medium">
                {countdown} saniye kaldı
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-orange-400 hover:text-orange-600 flex-shrink-0"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
