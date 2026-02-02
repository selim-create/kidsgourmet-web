'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAds } from '@/contexts/AdContext';
import { useDeviceType } from '@/hooks/useDeviceType';
import adManager from '@/lib/ads/ad-manager';

interface AdSlotProps {
  slotId: string;
  className?: string;
  debug?: boolean;
}

export function AdSlot({ slotId, className = '', debug = false }: AdSlotProps) {
  const { getSlotById, config, initialized, adsEnabled, isDebugMode } = useAds();
  const deviceType = useDeviceType();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slot = getSlotById(slotId);

  // Use debug prop OR global debug mode
  const showDebug = debug || isDebugMode;

  useEffect(() => {
    // Reset rendered state when slot changes
    setRendered(false);
    setError(null);
  }, [slotId]);

  useEffect(() => {
    if (!adsEnabled || !initialized || !slot || !containerRef.current || rendered || showDebug) {
      return;
    }

    try {
      const containerId = `ad-slot-${slotId}`;
      const networkCode = config?.network_code || config?.networkCode;
      
      // Only render if ad manager is ready and we have valid config
      if (networkCode && networkCode !== '0' && networkCode !== '') {
        adManager.defineSlot(slot, containerId);
        adManager.display(containerId);
        setRendered(true);
      }
    } catch (err) {
      console.error('Error rendering ad slot:', err);
      setError('Failed to render ad');
    }

    return () => {
      // Cleanup on unmount
      try {
        adManager.destroySlot(`ad-slot-${slotId}`);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [adsEnabled, initialized, slot, slotId, rendered, config, showDebug]);

  // Don't render if ads disabled and not in debug mode
  if (!adsEnabled && !showDebug) {
    return null;
  }

  // Don't render if no slot found
  if (!slot) {
    return null;
  }

  // Get responsive min height
  const getMinHeight = (): number => {
    if (slot.responsive_min_height) {
      return slot.responsive_min_height[deviceType] || slot.min_height || slot.minHeight || 90;
    }
    return slot.min_height || slot.minHeight || 90;
  };

  const minHeight = getMinHeight();

  // Debug mode - show placeholder with slot info
  if (showDebug) {
    const sizesLabel = slot.sizes?.map((s) => `${s.width}x${s.height}`).join(', ') || 'N/A';
    const devicesLabel = Array.isArray(slot.devices) ? slot.devices.join(', ') : (slot.device || 'all');
    
    return (
      <div
        className={`ad-slot-debug ${className}`.trim()}
        style={{
          minHeight,
          backgroundColor: '#fff3cd',
          border: '2px dashed #856404',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '12px',
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#856404',
          margin: '4px 0',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '13px' }}>
          🔧 AD DEBUG
        </div>
        <div style={{ textAlign: 'center', lineHeight: 1.4 }}>
          <div><strong>Slot:</strong> {slot.slot_id || slot.slotId}</div>
          <div><strong>Name:</strong> {slot.name || 'N/A'}</div>
          <div><strong>Placement:</strong> {slot.placement}</div>
          <div><strong>Sizes:</strong> {sizesLabel}</div>
          <div><strong>Devices:</strong> {devicesLabel}</div>
          <div><strong>Current:</strong> {deviceType}</div>
          <div><strong>Min Height:</strong> {minHeight}px</div>
        </div>
      </div>
    );
  }

  // Error state - silently fail
  if (error) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      id={`ad-slot-${slotId}`}
      className={`ad-slot ${className}`.trim()}
      style={{ minHeight: minHeight > 0 ? minHeight : undefined }}
      data-slot-id={slotId}
      data-placement={slot.placement}
    />
  );
}
