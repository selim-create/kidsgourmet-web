'use client';

/**
 * Ad Zone Component - Easy placement-based ad rendering
 */

import React from 'react';
import { useAds } from '@/contexts/AdContext';
import { useDeviceType } from '@/hooks/useDeviceType';
import type { AdPlacement } from '@/lib/ads/types';
import { AdSlot } from './AdSlot';

interface AdZoneProps {
  placement: AdPlacement;
  className?: string;
  limit?: number;
}

export function AdZone({ placement, className = '', limit }: AdZoneProps) {
  const { getSlotsByPlacement, loading, initialized, isDebugMode, adsEnabled } = useAds();
  const deviceType = useDeviceType();

  // Don't render anything if ads are disabled
  if (!adsEnabled) {
    return null;
  }

  // Don't render anything while loading or before initialization
  if (loading || !initialized) {
    return null;
  }

  // Get slots for this placement
  const allSlots = getSlotsByPlacement(placement);

  // Filter by current device
  const slots = allSlots.filter((slot) => {
    // Check devices array
    if (Array.isArray(slot.devices) && slot.devices.length > 0) {
      return slot.devices.includes(deviceType);
    }
    // Check device string
    if (slot.device) {
      return slot.device === deviceType || slot.device === 'all';
    }
    // Default: show on all devices
    return true;
  });

  // If no slots for this placement/device, render nothing
  if (!slots || slots.length === 0) {
    return null;
  }

  // Apply limit if specified
  const displaySlots = limit ? slots.slice(0, limit) : slots;

  // Mobile sticky special handling
  if (placement === 'mobile-sticky') {
    // Only show on mobile
    if (deviceType !== 'mobile') {
      return null;
    }
    
    return (
      <div 
        className={`ad-zone ad-zone-mobile-sticky fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg ${className}`.trim()}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {displaySlots.map((slot) => (
          <AdSlot
            key={slot.slot_id || slot.slotId || slot.id}
            slotId={slot.slot_id || slot.slotId || slot.id}
            debug={isDebugMode}
          />
        ))}
      </div>
    );
  }

  // Sidebar sticky special handling
  if (placement === 'sidebar-sticky') {
    // Only show on desktop
    if (deviceType === 'mobile') {
      return null;
    }
    
    return (
      <div className={`ad-zone ad-zone-sidebar-sticky sticky top-24 ${className}`.trim()}>
        {displaySlots.map((slot) => (
          <AdSlot
            key={slot.slot_id || slot.slotId || slot.id}
            slotId={slot.slot_id || slot.slotId || slot.id}
            debug={isDebugMode}
          />
        ))}
      </div>
    );
  }

  // Default rendering
  return (
    <div className={`ad-zone ad-zone-${placement} ${className}`.trim()}>
      {displaySlots.map((slot) => (
        <AdSlot
          key={slot.slot_id || slot.slotId || slot.id}
          slotId={slot.slot_id || slot.slotId || slot.id}
          debug={isDebugMode}
        />
      ))}
    </div>
  );
}
