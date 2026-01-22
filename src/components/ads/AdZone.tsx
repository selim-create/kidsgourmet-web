'use client';

/**
 * Ad Zone Component - Easy placement-based ad rendering
 */

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';
import type { AdZoneProps } from '@/lib/ads/types';

export function AdZone({
  placement,
  deviceType,
  className = '',
  style,
  debug,
  limit,
}: AdZoneProps) {
  const detectedDevice = useDeviceType();
  const { getSlotsByPlacement } = useAds();

  // Use provided device type or detected one
  const targetDevice = deviceType || detectedDevice;

  // Get all slots for this placement
  const slots = getSlotsByPlacement(placement);

  // Find slots that support the target device
  const compatibleSlots = slots.filter((slot) =>
    slot.devices.includes(targetDevice)
  );

  if (compatibleSlots.length === 0) {
    return null;
  }

  // Limit the number of slots to render
  const slotsToRender = limit ? compatibleSlots.slice(0, limit) : compatibleSlots.slice(0, 1);

  return (
    <div className={`ad-zone ad-zone-${placement} ${className}`} style={style}>
      {slotsToRender.map((slot) => (
        <AdSlot key={slot.slot_id} slotId={slot.slot_id} debug={debug} />
      ))}
    </div>
  );
}
