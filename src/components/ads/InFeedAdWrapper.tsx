'use client';

/**
 * In-Feed Ad Wrapper
 * Handles logic for integrating ads into card grids
 * Replaces specific card positions with ads when available
 */

import React, { ReactNode } from 'react';
import { useAds } from '@/contexts/AdContext';
import { useDeviceType } from '@/hooks/useDeviceType';
import { AdSlot } from './AdSlot';

interface InFeedAdWrapperProps {
  children: ReactNode[];
  adPositions?: number[]; // 0-indexed positions where ads should appear
  totalItems?: number; // Total number of items to show (including ads)
  className?: string;
}

/**
 * Integrates in-feed ads into a grid of content items
 * @param children - Array of content items to display
 * @param adPositions - Array of positions (0-indexed) where ads should appear instead of content
 * @param totalItems - Total number of items to show (if provided, will limit the content items)
 * @param className - Additional CSS classes for the ad wrapper
 */
export function InFeedAdWrapper({ 
  children, 
  adPositions = [2], // Default to 3rd item in grid (0-indexed position 2)
  totalItems,
  className = ''
}: InFeedAdWrapperProps) {
  const { getSlotsByPlacement, adsEnabled, initialized } = useAds();
  const deviceType = useDeviceType();

  // Get in-feed ad slots
  const slots = getSlotsByPlacement('content-in-feed');
  
  // Filter by device
  const compatibleSlots = slots.filter((slot) => {
    if (Array.isArray(slot.devices)) {
      return slot.devices.includes(deviceType) || slot.devices.includes('all');
    }
    return slot.device === deviceType || slot.device === 'all';
  });

  const hasAds = adsEnabled && initialized && compatibleSlots.length > 0;

  // If no ads, just render all children (or limited by totalItems if provided)
  if (!hasAds) {
    if (totalItems && totalItems < children.length) {
      return <>{children.slice(0, totalItems)}</>;
    }
    return <>{children}</>;
  }

  // When ads are active:
  // - If totalItems is provided: show (totalItems - number of ads) content items + ads
  // - If totalItems is not provided: show all children + ads at specified positions
  const contentCount = totalItems ? totalItems - adPositions.length : children.length;
  const displayChildren = children.slice(0, contentCount);

  // Build the final array with ads inserted at specified positions
  const items: ReactNode[] = [];
  let contentIndex = 0;
  let adIndex = 0;

  // Loop through total positions (content + ads)
  const maxItems = totalItems || (children.length + adPositions.length);
  for (let i = 0; i < maxItems; i++) {
    if (adPositions.includes(i) && adIndex < compatibleSlots.length) {
      // Insert ad at this position
      const slot = compatibleSlots[adIndex];
      const slotId = slot.slot_id || slot.slotId || '';
      items.push(
        <div key={`ad-${i}`} className={`ad-wrapper flex justify-center items-center ${className}`}>
          <AdSlot slotId={slotId} className="mx-auto" />
        </div>
      );
      adIndex++;
    } else if (contentIndex < displayChildren.length) {
      // Insert content at this position
      items.push(
        <React.Fragment key={`content-${contentIndex}`}>
          {displayChildren[contentIndex]}
        </React.Fragment>
      );
      contentIndex++;
    }
  }

  return <>{items}</>;
}
