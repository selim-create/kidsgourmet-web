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
  style?: React.CSSProperties;
  debug?: boolean;
  limit?: number;
}

export function AdZone({ placement, className = '', style, debug = false, limit }: AdZoneProps) {
  const { getSlotsByPlacement, loading, initialized, isDebugMode, adsEnabled, config } = useAds();
  const deviceType = useDeviceType();

  // Show debug info if debug mode is enabled globally or via prop
  const showDebug = debug || isDebugMode;

  // Debug logging
  if (showDebug) {
    console.log(`🔧 [AdZone:${placement}] adsEnabled=${adsEnabled}, initialized=${initialized}, loading=${loading}`);
  }

  // Don't render anything if ads are disabled (but show debug if debug mode)
  if (!adsEnabled && !showDebug) {
    return null;
  }

  // Show loading/debug state
  if (showDebug && (loading || !initialized)) {
    return (
      <div 
        className={`ad-zone-debug ${className}`}
        style={{
          padding: '20px',
          backgroundColor: '#e3f2fd',
          border: '2px dashed #1976d2',
          borderRadius: '4px',
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: '12px',
          ...style,
        }}
      >
        <div>🔄 Loading ads... (placement: {placement})</div>
        <div>adsEnabled: {String(adsEnabled)}</div>
        <div>initialized: {String(initialized)}</div>
      </div>
    );
  }

  // Don't render anything while loading or before initialization (non-debug)
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
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', ...style }}
      >
        {displaySlots.map((slot) => (
          <AdSlot
            key={slot.slot_id || slot.slotId || slot.id}
            slotId={slot.slot_id || slot.slotId || slot.id}
            debug={showDebug}
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
      <div className={`ad-zone ad-zone-sidebar-sticky sticky top-24 ${className}`.trim()} style={style}>
        {displaySlots.map((slot) => (
          <AdSlot
            key={slot.slot_id || slot.slotId || slot.id}
            slotId={slot.slot_id || slot.slotId || slot.id}
            debug={showDebug}
          />
        ))}
      </div>
    );
  }

  // Default rendering
  return (
    <div className={`ad-zone ad-zone-${placement} ${className}`.trim()} style={style}>
      {displaySlots.map((slot) => (
        <AdSlot
          key={slot.slot_id || slot.slotId || slot.id}
          slotId={slot.slot_id || slot.slotId || slot.id}
          debug={showDebug}
        />
      ))}
    </div>
  );
}
