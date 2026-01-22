'use client';

/**
 * Responsive Ad Slot Component - Device-based ad rendering
 */

import React from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useAds } from '@/contexts/AdContext';
import { AdSlot } from './AdSlot';
import type { AdPlacement } from '@/lib/ads/types';

interface ResponsiveAdSlotProps {
  placement: AdPlacement;
  className?: string;
  style?: React.CSSProperties;
  debug?: boolean;
}

export function ResponsiveAdSlot({
  placement,
  className,
  debug,
}: ResponsiveAdSlotProps) {
  const deviceType = useDeviceType();
  const { getSlotsByPlacement } = useAds();

  // Get slots for this placement
  const slots = getSlotsByPlacement(placement);

  // Find the first slot that supports the current device
  const slot = slots.find((s) => {
    if (Array.isArray(s.devices)) {
      return s.devices.includes(deviceType);
    }
    return s.device === deviceType || s.device === 'all';
  });

  if (!slot) {
    return null;
  }

  return (
    <AdSlot
      slotId={slot.slot_id || slot.slotId || ''}
      className={className}
      debug={debug}
    />
  );
}
