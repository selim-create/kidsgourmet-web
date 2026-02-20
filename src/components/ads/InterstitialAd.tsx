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

    const slots = getSlotsByPlacement('interstitial');

    // Filter ALL compatible slots for current device (not just the first one)
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
  }, [adsEnabled, initialized, deviceType, getSlotsByPlacement]);

  return null;
}
