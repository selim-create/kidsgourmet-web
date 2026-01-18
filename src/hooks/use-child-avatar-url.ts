import { useState, useEffect, useCallback, useRef } from 'react';
import { userService } from '@/services/user-service';

interface UseChildAvatarUrlResult {
  avatarUrl: string | null;
  isLoading: boolean;
  refreshUrl: () => Promise<void>;
}

/**
 * Custom hook for managing child avatar URLs with automatic refresh
 * Signed URLs expire after 15 minutes (900 seconds)
 * This hook automatically refreshes the URL at 80% of expiry time (12 minutes)
 */
export function useChildAvatarUrl(childId: string | null, hasAvatar: boolean = false): UseChildAvatarUrlResult {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const expiresAtRef = useRef<number>(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refreshUrl = useCallback(async () => {
    if (!childId || !hasAvatar) {
      setAvatarUrl(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await userService.getChildAvatarUrl(childId);
      setAvatarUrl(response.url);
      
      // Calculate expiry time (80% of expires_in for safety margin)
      const now = Date.now();
      const expiresIn = response.expires_in * 1000; // Convert to milliseconds
      const refreshAt = now + (expiresIn * 0.8); // Refresh at 80% of expiry
      expiresAtRef.current = refreshAt;

      // Schedule next refresh
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      const timeUntilRefresh = refreshAt - now;
      if (timeUntilRefresh > 0) {
        refreshTimeoutRef.current = setTimeout(() => {
          refreshUrl();
        }, timeUntilRefresh);
      }
    } catch (error) {
      console.error('Failed to fetch child avatar URL:', error);
      setAvatarUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [childId, hasAvatar]);

  useEffect(() => {
    if (childId && hasAvatar) {
      refreshUrl();
    } else {
      setAvatarUrl(null);
    }

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [childId, hasAvatar]); // Removed refreshUrl from dependencies to prevent infinite loop

  return { avatarUrl, isLoading, refreshUrl };
}
