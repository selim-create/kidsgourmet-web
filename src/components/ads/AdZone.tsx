'use client';

/**
 * Ad Zone Component - Easy placement-based ad rendering
 * Updated: Added instanceId support for multiple instances of same placement
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
  instanceId?: string | number; // NEW: Unique identifier for multiple instances
}

export function AdZone({ placement, className = '', style, debug = false, limit, instanceId }: AdZoneProps) {
  const { getSlotsByPlacement, loading, initialized, isDebugMode, adsEnabled, config } = useAds();
  const deviceType = useDeviceType();

  // Show debug info if debug mode is enabled globally or via prop
  const showDebug = debug || isDebugMode;

  // Debug logging
  if (showDebug) {
    console.log(`🔧 [AdZone:${placement}${instanceId ? `-${instanceId}` : ''}] adsEnabled=${adsEnabled}, initialized=${initialized}, loading=${loading}`);
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
        <div>🔄 Loading ads... (placement: {placement}{instanceId ? ` #${instanceId}` : ''})</div>
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
      return slot.devices.includes(deviceType) || slot.devices.includes('all');
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

  // Generate unique container ID suffix if instanceId is provided
  const getContainerId = (baseId: string) => {
    return instanceId ? `${baseId}-instance-${instanceId}` : baseId;
  };

  // Footer sticky mobile special handling
  if (placement === 'footer-sticky-mobile') {
    // Only show on mobile
    if (deviceType !== 'mobile') {
      return null;
    }
    
    return (
      <div 
        className={`ad-zone ad-zone-footer-sticky-mobile fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg ${className}`.trim()}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', ...style }}
      >
        {displaySlots.map((slot) => {
          const baseSlotId = slot.slot_id || slot.slotId || slot.id;
          return (
            <AdSlot
              key={getContainerId(baseSlotId)}
              slotId={baseSlotId}
              containerId={getContainerId(baseSlotId)}
              debug={showDebug}
            />
          );
        })}
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
        {displaySlots.map((slot) => {
          const baseSlotId = slot.slot_id || slot.slotId || slot.id;
          return (
            <AdSlot
              key={getContainerId(baseSlotId)}
              slotId={baseSlotId}
              containerId={getContainerId(baseSlotId)}
              debug={showDebug}
            />
          );
        })}
      </div>
    );
  }

  // Default rendering
  return (
    <div 
      className={`ad-zone ad-zone-${placement} ${className}`.trim()} 
      style={{ minHeight: 0, ...style }}
    >
      {displaySlots.map((slot) => {
        const baseSlotId = slot.slot_id || slot.slotId || slot.id;
        return (
          <AdSlot
            key={getContainerId(baseSlotId)}
            slotId={baseSlotId}
            containerId={getContainerId(baseSlotId)}
            debug={showDebug}
          />
        );
      })}
    </div>
  );
}