'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAds } from '@/contexts/AdContext';
import { useDeviceType } from '@/hooks/useDeviceType';
import adManager from '@/lib/ads/ad-manager';
import type { SlotRenderEndedEvent } from '@/lib/ads/types';

interface AdSlotProps {
  slotId: string;
  containerId?: string; // NEW: Optional custom container ID for multiple instances
  className?: string;
  debug?: boolean;
}

export function AdSlot({ slotId, containerId, className = '', debug = false }: AdSlotProps) {
  const { getSlotById, config, initialized, adsEnabled, isDebugMode } = useAds();
  const deviceType = useDeviceType();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slotDefinedRef = useRef(false);

  const slot = getSlotById(slotId);
  
  // Use containerId if provided, otherwise fall back to slotId
  const actualContainerId = containerId || `ad-slot-${slotId}`;

  // Use debug prop OR global debug mode
  const showDebug = debug || isDebugMode;

  // Reset rendered state when containerId changes
  useEffect(() => {
    setRendered(false);
    setError(null);
    slotDefinedRef.current = false;
  }, [actualContainerId]);

  // Add event listener for empty slot handling
  useEffect(() => {
    if (typeof window === 'undefined' || !window.googletag || !initialized) {
      return;
    }
    
    const handleSlotRenderEnded = (event: SlotRenderEndedEvent) => {
      const slotElementId = event.slot.getSlotElementId();
      if (slotElementId === actualContainerId) {
        const container = document.getElementById(actualContainerId);
        if (container && event.isEmpty) {
          container.style.minHeight = '0';
          container.style.height = '0';
          container.style.overflow = 'hidden';
        }
      }
    };
    
    window.googletag.cmd.push(() => {
      window.googletag.pubads().addEventListener('slotRenderEnded', handleSlotRenderEnded);
    });
    
    return () => {
      if (window.googletag) {
        window.googletag.cmd.push(() => {
          window.googletag.pubads().removeEventListener('slotRenderEnded', handleSlotRenderEnded);
        });
      }
    };
  }, [actualContainerId, initialized]);

  // Slot render effect
  useEffect(() => {
    if (!adsEnabled || !initialized || !slot || !containerRef.current || rendered || showDebug) {
      return;
    }

    if (slotDefinedRef.current) {
      return; // Already defined
    }

    try {
      const networkCode = config?.network_code || config?.networkCode;
      
      // Only render if ad manager is ready and we have valid config
      if (networkCode && networkCode !== '0' && networkCode !== '') {
        // Pass the actual container ID to ad manager
        adManager.defineSlot(slot, actualContainerId);
        adManager.display(actualContainerId);
        setRendered(true);
        slotDefinedRef.current = true;
      }
    } catch (err) {
      console.error('Error rendering ad slot:', err);
      setError('Failed to render ad');
    }
  }, [adsEnabled, initialized, actualContainerId, rendered, showDebug, slot, config]);

  // Cleanup ONLY on unmount
  useEffect(() => {
    return () => {
      try {
        adManager.destroySlot(actualContainerId);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [actualContainerId]);

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
          <div><strong>Container:</strong> {actualContainerId}</div>
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
      id={actualContainerId}
      className={`ad-slot ${className}`.trim()}
      style={{ minHeight: minHeight > 0 ? minHeight : undefined }}
      data-slot-id={slotId}
      data-container-id={actualContainerId}
      data-placement={slot.placement}
    />
  );
}