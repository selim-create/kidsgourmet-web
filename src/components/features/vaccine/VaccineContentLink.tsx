"use client";

import React from 'react';
import Link from 'next/link';

interface VaccineContentLinkProps {
  type: 'fever_guide' | 'side_effects' | 'vaccine_info';
  vaccineCode?: string;
  className?: string;
}

const contentLinks = {
  fever_guide: {
    title: 'Aşı Sonrası Ateş Nasıl Düşürülür?',
    url: '/rehber/asi-sonrasi-ates',
    icon: '🌡️',
    description: 'Aşı sonrası ateşi düşürme yöntemleri ve ne zaman doktora başvurulmalı',
  },
  side_effects: {
    title: 'Aşı Yan Etkileri Rehberi',
    url: '/rehber/asi-yan-etkileri',
    icon: '💉',
    description: 'Normal yan etkiler ve acil müdahale gerektiren durumlar',
  },
  vaccine_info: {
    title: 'Aşı Bilgilendirme',
    url: '/rehber/asilar',
    icon: '📚',
    description: 'Tüm aşılar hakkında detaylı bilgiler',
  },
};

export default function VaccineContentLink({ 
  type, 
  vaccineCode,
  className = '' 
}: VaccineContentLinkProps) {
  const content = contentLinks[type];
  
  // If specific vaccine code is provided, append to URL
  const url = vaccineCode && type === 'vaccine_info' 
    ? `${content.url}/${vaccineCode}` 
    : content.url;

  return (
    <Link
      href={url}
      className={`block p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl hover:shadow-md transition-all ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-xl">{content.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
            {content.title}
            <i className="fa-solid fa-arrow-right text-xs text-blue-500"></i>
          </p>
          <p className="text-xs text-gray-600">{content.description}</p>
        </div>
      </div>
    </Link>
  );
}
