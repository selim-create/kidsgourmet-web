'use client';

/**
 * Debug Ad Slot Component - For testing and debugging
 */

import React from 'react';
import type { AdSlot } from '@/lib/ads/types';

interface DebugAdSlotProps {
  slotConfig: AdSlot;
  className?: string;
}

export function DebugAdSlot({ slotConfig, className = '' }: DebugAdSlotProps) {
  return (
    <div
      className={`debug-ad-slot border-2 border-dashed border-blue-500 bg-blue-50 p-4 ${className}`}
      style={{ minHeight: `${slotConfig.min_height || 250}px` }}
    >
      <div className="text-xs font-mono space-y-1">
        <div className="font-bold text-blue-700 mb-2">DEBUG MODE</div>
        <div><strong>Slot ID:</strong> {slotConfig.slot_id}</div>
        <div><strong>Name:</strong> {slotConfig.name}</div>
        <div><strong>Placement:</strong> {slotConfig.placement}</div>
        <div><strong>Ad Unit:</strong> {slotConfig.ad_unit_path}</div>
        <div><strong>Sizes:</strong> {slotConfig.sizes.map(s => `${s.width}x${s.height}`).join(', ')}</div>
        <div><strong>Devices:</strong> {slotConfig.devices.join(', ')}</div>
        {slotConfig.refresh_interval && (
          <div><strong>Refresh:</strong> {slotConfig.refresh_interval}s</div>
        )}
        {slotConfig.targeting && Object.keys(slotConfig.targeting).length > 0 && (
          <div>
            <strong>Targeting:</strong>
            <pre className="mt-1 text-xs bg-white p-2 rounded">
              {JSON.stringify(slotConfig.targeting, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
