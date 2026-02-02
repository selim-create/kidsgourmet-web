'use client';

/**
 * Sidebar Ads Component - Template for sidebar ad placements
 * Desktop only - showing sidebar-top, sidebar-middle, and sidebar-bottom
 */

import { useDeviceType } from '@/hooks/useDeviceType';
import { AdZone } from './AdZone';

interface SidebarAdsProps {
  className?: string;
}

export function SidebarAds({ className = '' }: SidebarAdsProps) {
  const deviceType = useDeviceType();
  
  // Only show on desktop/tablet, not on mobile
  if (deviceType === 'mobile') {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <AdZone placement="sidebar-top" />
      <AdZone placement="sidebar-middle" />
      <AdZone placement="sidebar-bottom" />
    </div>
  );
}
