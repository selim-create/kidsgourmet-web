'use client';

/**
 * Sidebar Ads Component - Template for sidebar ad placements
 */

import { AdZone } from './AdZone';

interface SidebarAdsProps {
  className?: string;
}

export function SidebarAds({ className = '' }: SidebarAdsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <AdZone placement="sidebar" limit={1} />
      <AdZone placement="sidebar-sticky" />
    </div>
  );
}
