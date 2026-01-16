"use client";

import React, { useEffect } from 'react';
import type { ToolSponsorData } from '@/lib/types';

interface SponsorBadgeProps {
  sponsor?: ToolSponsorData | null;
  variant?: 'header' | 'card';
}

export default function SponsorBadge({ sponsor, variant = 'header' }: SponsorBadgeProps) {
  useEffect(() => {
    // Track GAM impression
    if (sponsor?.gam_impression_url) {
      const img = new Image();
      img.src = sponsor.gam_impression_url;
    }
  }, [sponsor?.gam_impression_url]);

  if (!sponsor || sponsor.is_sponsored !== true) return null;

  if (variant === 'card') {
    return (
      <div className="absolute top-3 right-3 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
        Sponsorlu
      </div>
    );
  }

  // Header variant için light logo kullan
  return (
    <div className="flex items-center gap-2 text-sm text-white/90">
      {(sponsor.sponsor_light_logo || sponsor.sponsor_logo) && (
        <img
          src={sponsor.sponsor_light_logo || sponsor.sponsor_logo}
          alt={sponsor.sponsor_name}
          className="h-6 object-contain"
        />
      )}
      <span>
        <strong>{sponsor.sponsor_name}</strong> katkılarıyla
      </span>
    </div>
  );
}
