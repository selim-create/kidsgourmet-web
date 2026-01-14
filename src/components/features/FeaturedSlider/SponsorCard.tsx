"use client";

import React from 'react';
import { BlogPost } from '@/services/blog-service';
import { decodeEntities } from '@/utils/textHelpers';

interface SponsorCardProps {
  sponsor: BlogPost & {
    sponsor_url?: string;
    sponsor_image?: string;
    read_time?: string;
    has_discount?: boolean;
  };
}

export default function SponsorCard({ sponsor }: SponsorCardProps) {
  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');
  const sponsorData = sponsor.sponsor_data;
  const imageUrl = sponsor.sponsor_image || 
                   sponsor._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                   'https://placehold.co/800x400/E8E8E8/666666?text=Sponsor';
  
  const url = sponsor.sponsor_url || sponsorData?.sponsor_url || `/blog/${sponsor.slug}`;

  return (
    <a
      href={url}
      data-type="sponsor"
      className="featured-card flex-shrink-0 w-[85vw] md:w-[420px] snap-center bg-white rounded-4xl shadow-md hover:shadow-xl overflow-hidden relative flex flex-col group border border-gray-100 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-48 relative overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={sponsorData?.sponsor_name || 'Sponsorlu İçerik'}
        />
        
        {/* Sponsorlu Badge - Sağ Üst */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-extrabold text-gray-500 shadow-sm uppercase tracking-wider flex items-center gap-1">
          <i className="fa-solid fa-badge-check text-blue-500"></i> Sponsorlu
        </div>

        {/* Kategori Badge - Sol Üst */}
        <div className="absolute top-4 left-4 bg-slate-900/70 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 backdrop-blur">
          <i className="fa-solid fa-bullhorn"></i> Öneri
        </div>

        {/* Marka İçeriği - Sol Alt */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-[10px] px-2 py-1 rounded text-slate-600 font-bold">
          <i className="fa-regular fa-bookmark"></i> Marka İçeriği
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-xl text-slate-800 mb-2 leading-tight group-hover:text-orange-500 transition-colors">
          {decodeEntities(stripHtml(sponsor.title.rendered))}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {sponsor.excerpt ? decodeEntities(stripHtml(sponsor.excerpt.rendered)) : ''}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {sponsor.read_time && (
              <span className="bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-lg">
                <i className="fa-regular fa-clock mr-1"></i> {sponsor.read_time}
              </span>
            )}
            {sponsor.has_discount && (
              <span className="bg-slate-50 text-slate-600 font-bold px-2 py-1 rounded-lg">
                <i className="fa-solid fa-tag mr-1"></i> İndirim
              </span>
            )}
          </div>
          <span className="text-blue-500 text-sm font-bold group-hover:translate-x-1 transition-transform">
            İncele <i className="fa-solid fa-arrow-right ml-2"></i>
          </span>
        </div>
      </div>
    </a>
  );
}
