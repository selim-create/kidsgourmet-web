'use client';

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';

export function MobileStickyAd() {
  const deviceType = useDeviceType();
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();

  // Only show on mobile
  if (deviceType !== 'mobile' || !adsEnabled || !initialized) return null;

  const slots = getSlotsByPlacement('footer-sticky-mobile');
  const slot = slots[0];
  if (!slot) return null;

  const slotId = slot.slot_id || slot.slotId || '';

  return (
    <div className="ad-zone ad-zone-footer-sticky fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg flex justify-center py-2">
      <AdSlot slotId={slotId} className="mx-auto" />
    </div>
  );
}
