"use client";

import React from 'react';
import { FeaturedItem } from '@/services/featured-service';
import { decodeEntities } from '@/utils/textHelpers';

interface SponsorCardProps {
  item: FeaturedItem;
}

export default function SponsorCard({ item }: SponsorCardProps) {
  const imageUrl = item.image || 'https://placehold.co/800x400/E8E8E8/666666?text=Sponsor';
  
  // Sponsor meta verileri
  const sponsorName = item.meta?.sponsor_name || '';
  const sponsorLogo = item.meta?.sponsor_logo || '';
  const sponsorUrl = item.meta?.sponsor_url || '';
  const directRedirect = item.meta?.direct_redirect || false;
  const hasDiscount = item.meta?.has_discount || false;
  const discountText = item.meta?.discount_text || 'İndirim';
  const readTime = item.meta?.read_time || '5 dk';

  // URL - direct_redirect'e göre karar ver
  const href = directRedirect && sponsorUrl ? sponsorUrl : `/blog/${item.slug}`;

  return (
    <a
      href={href}
      data-type="sponsor"
      className="featured-card flex-shrink-0 w-[85vw] md:w-[420px] snap-center bg-white rounded-4xl shadow-md hover:shadow-xl overflow-hidden relative flex flex-col group border border-gray-100 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-48 relative overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={sponsorName || 'Sponsorlu İçerik'}
        />
        
        {/* Sponsorlu Badge - Sağ Üst */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-extrabold text-gray-500 shadow-sm uppercase tracking-wider flex items-center gap-1">
          <i className="fa-solid fa-badge-check text-blue-500"></i> Sponsorlu
        </div>

        {/* Sponsor Logo - Sol Alt */}
        {sponsorLogo && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded">
            <img src={sponsorLogo} alt={sponsorName} className="h-4 object-contain" />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Sponsor Adı */}
        {sponsorName && (
          <div className="text-xs text-gray-400 mb-1">
            <span className="font-bold text-blue-600">{sponsorName}</span> tarafından
          </div>
        )}
        
        <h3 className="font-display font-bold text-xl text-slate-800 mb-2 leading-tight group-hover:text-orange-500 transition-colors">
          {decodeEntities(item.title)}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {item.excerpt ? decodeEntities(item.excerpt) : ''}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          {/* İndirim Badge */}
          {hasDiscount && discountText && (
            <span className="bg-red-50 text-red-600 font-bold px-2 py-1 rounded-lg text-xs">
              <i className="fa-solid fa-tag mr-1"></i> {discountText}
            </span>
          )}
          
          <span className="text-blue-500 text-sm font-bold group-hover:translate-x-1 transition-transform">
            İncele <i className="fa-solid fa-arrow-right ml-2"></i>
          </span>
        </div>
      </div>
    </a>
  );
}
