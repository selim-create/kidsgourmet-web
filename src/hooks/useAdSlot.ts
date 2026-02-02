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

    // Cleanup - only destroy on unmount, not on dependency changes
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      adManager.stopAutoRefresh(slotId);
      // Only destroy if this is actual unmount
      slotDefinedRef.current = false;
      currentSlotIdRef.current = '';
      // Note: Don't destroy slot here - let it persist
    };
  }, [slotId, enabled]);  // Remove slotConfig from deps, use only slotId

  return {
    slotRef,
    slotConfig,
    isDebugMode,
  };
}
