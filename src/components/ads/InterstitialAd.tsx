'use client';

import { useEffect, useRef } from 'react';
import { useAds } from '@/contexts/AdContext';
import { useDeviceType } from '@/hooks/useDeviceType';
import adManager from '@/lib/ads/ad-manager';

export function InterstitialAd() {
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();
  const deviceType = useDeviceType();
  const definedRef = useRef(false);

  useEffect(() => {
    if (!adsEnabled || !initialized || definedRef.current) return;

    // Small delay to ensure normal ad slots have been defined and SRA batch sent
    // This prevents race conditions with the initial ad request
    const timer = setTimeout(() => {
      if (definedRef.current) return;

      const slots = getSlotsByPlacement('interstitial');

      // Filter ALL compatible slots for current device
      const compatibleSlots = slots.filter((slot) => {
        if (Array.isArray(slot.devices)) {
          return slot.devices.includes(deviceType) || slot.devices.includes('all');
        }
        return slot.device === deviceType || slot.device === 'all';
      });

      if (compatibleSlots.length === 0) return;

      // Define ALL compatible interstitial slots
      compatibleSlots.forEach((slot) => {
        adManager.defineInterstitialSlot(slot);
      });

      definedRef.current = true;
    }, 1500);

    return () => clearTimeout(timer);
  }, [adsEnabled, initialized, deviceType, getSlotsByPlacement]);

  // Interstitial ads don't need a DOM container - GPT creates its own overlay
  return null;
}
