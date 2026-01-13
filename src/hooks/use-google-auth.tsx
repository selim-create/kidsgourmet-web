'use client';

import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/auth-service';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          renderButton: (element: HTMLElement, config: ButtonConfig) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
}

interface ButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  width?: number;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Google Client ID - environment variable'dan al
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    // Google Sign-In script'ini yükle
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsScriptLoaded(true);
      document.head.appendChild(script);
    } else if (window.google) {
      setIsScriptLoaded(true);
    }
  }, []);

  const handleGoogleResponse = useCallback(async (response: GoogleCredentialResponse) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authResponse = await authService.googleLogin(response.credential);
      return authResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google ile giriş başarısız';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initializeGoogleButton = useCallback((elementId: string, onSuccess: (user: any) => void) => {
    if (!isScriptLoaded || !window.google || !clientId) {
      console.warn('Google Sign-In henüz yüklenmedi veya Client ID eksik');
      return;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element bulunamadı: ${elementId}`);
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          const authResponse = await handleGoogleResponse(response);
          onSuccess(authResponse.user);
        } catch (err) {
          // Error already handled in handleGoogleResponse
        }
      },
    });

    window.google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: 400,
    });
  }, [isScriptLoaded, clientId, handleGoogleResponse]);

  return {
    isLoading,
    error,
    isScriptLoaded,
    initializeGoogleButton,
    handleGoogleResponse,
    clientId,
  };
}
