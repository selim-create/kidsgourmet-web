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
}

export function useAdSlot({ slotId, lazyLoad = false, refreshInterval }: UseAdSlotOptions) {
  const { getSlotById, isDebugMode } = useAds();
  const slotRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const displayedRef = useRef(false);

  const slotConfig = getSlotById(slotId);

  useEffect(() => {
    if (!slotConfig || !slotRef.current) {
      return;
    }

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

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      adManager.stopAutoRefresh(slotId);
      adManager.destroySlots([slotId]);
    };
  }, [slotId, slotConfig, lazyLoad, refreshInterval]);

  return {
    slotRef,
    slotConfig,
    isDebugMode,
  };
}
