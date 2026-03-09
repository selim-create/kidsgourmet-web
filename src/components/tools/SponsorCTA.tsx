"use client";

import React from 'react';
import type { ToolSponsorData } from '@/lib/types';

interface SponsorCTAProps {
  sponsor?: ToolSponsorData | null;
}

export default function SponsorCTA({ sponsor }: SponsorCTAProps) {
  if (!sponsor || sponsor.is_sponsored !== true) return null;

  const handleClick = () => {
    // Track GAM click (fire-and-forget)
    if (sponsor.gam_click_url) {
      const clickUrl = sponsor.gam_click_url.replace(
        '%%CACHEBUSTER%%',
        Math.floor(Math.random() * 1000000000).toString()
      );
      // Use sendBeacon when available (reliable during page navigation), otherwise Image fallback
      if (navigator.sendBeacon) {
        navigator.sendBeacon(clickUrl);
      } else {
        new Image().src = clickUrl;
      }
    }
    
    // Navigate to sponsor URL
    window.open(sponsor.sponsor_cta_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        {sponsor.sponsor_logo && (
          <img
            src={sponsor.sponsor_logo}
            alt={sponsor.sponsor_name}
            className="h-12 object-contain flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{sponsor.sponsor_tagline}</p>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {sponsor.sponsor_cta_text}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
