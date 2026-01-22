'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAds } from '@/contexts/AdContext';
import adManager from '@/lib/ads/ad-manager';

interface AdSlotProps {
  slotId: string;
  className?: string;
  debug?: boolean;
}

export function AdSlot({ slotId, className = '', debug = false }: AdSlotProps) {
  const { getSlotById, config, initialized } = useAds();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slot = getSlotById(slotId);

  useEffect(() => {
    if (!initialized || !slot || !containerRef.current || rendered) {
      return;
    }

    try {
      const containerId = `ad-slot-${slotId}`;
      
      // Only render if ad manager is ready and we have valid config
      if (config?.network_code && config.network_code !== '0') {
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
  }, [initialized, slot, slotId, rendered, config]);

  // Don't render if no slot found
  if (!slot) {
    return null;
  }

  // Debug mode - show placeholder
  if (debug) {
    const minHeight = slot.min_height || slot.minHeight || 100;
    return (
      <div
        className={`ad-slot-debug ${className}`.trim()}
        style={{
          minHeight,
          backgroundColor: '#fff3cd',
          border: '2px dashed #856404',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#856404',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔧 DEBUG MODE</div>
        <div>Slot ID: {slot.slot_id || slot.slotId}</div>
        <div>Placement: {slot.placement}</div>
        <div>Sizes: {slot.sizes?.map((s) => `${s.width}x${s.height}`).join(', ') || 'N/A'}</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return null; // Silently fail - don't show broken ads
  }

  const minHeight = slot.min_height || slot.minHeight || 0;

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
