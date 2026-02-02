'use client';

/**
 * Ad Slot Management Hook
 */

import { useEffect, useRef } from 'react';
import { useAds } from '@/contexts/AdContext';
import adManager from '@/lib/ads/ad-manager';

interface UseAdSlotOptions {
  slotId: string;
  lazyLoad?: boolean;
  refreshInterval?: number;
  enabled?: boolean;  // NEW: Allow disabling the hook
}

export function useAdSlot({ slotId, lazyLoad = false, refreshInterval, enabled = true }: UseAdSlotOptions) {
  const { getSlotById, isDebugMode } = useAds();
  const slotRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const displayedRef = useRef(false);
  const slotDefinedRef = useRef(false);  // NEW: Track if slot is defined
  const currentSlotIdRef = useRef<string>('');  // NEW: Track current slot ID

  const slotConfig = slotId ? getSlotById(slotId) : undefined;

  useEffect(() => {
    // Skip if disabled or no valid slotId
    if (!enabled || !slotId || !slotConfig || !slotRef.current) {
      return;
    }

    // Skip if already defined for this slot
    if (slotDefinedRef.current && currentSlotIdRef.current === slotId) {
      return;
    }

    currentSlotIdRef.current = slotId;
    slotDefinedRef.current = true;

    // Define the slot
    adManager.defineSlot(slotConfig);

    // Handle lazy loading
    if (lazyLoad || slotConfig.lazy_load) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !displayedRef.current) {
              adManager.displaySlot(slotId);
              displayedRef.current = true;

              // Start auto-refresh if configured
              const interval = refreshInterval || slotConfig.refresh_interval;
              if (interval) {
                adManager.startAutoRefresh(slotId, interval);
              }

              // Disconnect observer after first display
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '200px',
          threshold: 0.01,
        }
      );

      observer.observe(slotRef.current);
      observerRef.current = observer;
    } else {
      // Display immediately
      adManager.displaySlot(slotId);
      displayedRef.current = true;

      // Start auto-refresh if configured
      const interval = refreshInterval || slotConfig.refresh_interval;
      if (interval) {
        adManager.startAutoRefresh(slotId, interval);
      }
    }

    // Cleanup function - runs on dependency changes AND unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      adManager.stopAutoRefresh(slotId);
      // Reset tracking refs to allow re-initialization if slotId changes
      slotDefinedRef.current = false;
      currentSlotIdRef.current = '';
      // Note: Slot is not destroyed here to prevent premature removal during re-renders
      // Actual slot cleanup should be handled by parent component on unmount
    };
  }, [slotId, enabled]);  // Note: lazyLoad and refreshInterval intentionally omitted - these are set at initialization and should not trigger re-renders

  return {
    slotRef,
    slotConfig,
    isDebugMode,
  };
}
