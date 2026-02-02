'use client';

/**
 * Page Skin Ads - 160x600
 * Left and right sticky ads for very wide screens only
 */

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';

export function PageSkinAds() {
  const deviceType = useDeviceType();
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();

  // Only show on very wide desktop screens
  if (deviceType === 'mobile' || !adsEnabled || !initialized) return null;

  const slots = getSlotsByPlacement('sidebar-sticky');
  
  // Filter by device - only desktop
  const compatibleSlots = slots.filter((slot) => {
    if (Array.isArray(slot.devices)) {
      return slot.devices.includes('desktop') || slot.devices.includes('all');
    }
    return slot.device === 'desktop' || slot.device === 'all';
  });

  if (compatibleSlots.length === 0) return null;

  // We can show up to 2 slots (left and right)
  const leftSlot = compatibleSlots[0];
  const rightSlot = compatibleSlots[1] || compatibleSlots[0]; // Use same slot if only one available

  const leftSlotId = leftSlot.slot_id || leftSlot.slotId || '';
  const rightSlotId = rightSlot.slot_id || rightSlot.slotId || '';

  return (
    <>
      {/* Left Page Skin - Only visible on extra wide screens (2xl+) */}
      <div className="hidden 2xl:block fixed left-4 top-24 z-10">
        <div className="sticky top-24">
          <AdSlot slotId={leftSlotId} className="w-40" />
        </div>
      </div>

      {/* Right Page Skin - Only visible on extra wide screens (2xl+) */}
      <div className="hidden 2xl:block fixed right-4 top-24 z-10">
        <div className="sticky top-24">
          <AdSlot slotId={rightSlotId} className="w-40" />
        </div>
      </div>
    </>
  );
}
