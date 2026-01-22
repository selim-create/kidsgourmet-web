'use client';

/**
 * Ad Zone Component - Easy placement-based ad rendering
 */

import React from 'react';
import { useAds } from '@/contexts/AdContext';
import type { AdPlacement, DeviceType } from '@/lib/ads/types';
import { AdSlot } from './AdSlot';

interface AdZoneProps {
  placement: AdPlacement;
  deviceType?: DeviceType;
  className?: string;
  limit?: number;
}

export function AdZone({ placement, deviceType, className = '', limit }: AdZoneProps) {
  const { getSlotsByPlacement, loading, initialized, isDebugMode } = useAds();

  // Don't render anything while loading or before initialization
  if (loading || !initialized) {
    return null;
  }

  // Safely get slots
  const slots = getSlotsByPlacement(placement);

  // If no slots for this placement, render nothing
  if (!slots || slots.length === 0) {
    return null;
  }

  // Apply limit if specified
  const displaySlots = limit ? slots.slice(0, limit) : slots;

  // Filter by device type if specified
  const filteredSlots = deviceType
    ? displaySlots.filter((slot) => {
        if (Array.isArray(slot.devices)) {
          return slot.devices.includes(deviceType);
        }
        return slot.device === deviceType || slot.device === 'all';
      })
    : displaySlots;

  if (filteredSlots.length === 0) {
    return null;
  }

  return (
    <div className={`ad-zone ad-zone-${placement} ${className}`.trim()}>
      {filteredSlots.map((slot) => (
        <AdSlot
          key={slot.slot_id || slot.slotId || slot.id}
          slotId={slot.slot_id || slot.slotId || slot.id}
          debug={isDebugMode}
        />
      ))}
    </div>
  );
}
