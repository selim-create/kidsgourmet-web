"use client";

import React from 'react';
import Link from 'next/link';
import { FeaturedItem } from '@/services/featured-service';

interface ToolCardProps {
  item: FeaturedItem;
}

// Smart Assistant Tools
// İkonlar kullanıcı isteğine göre güncellendi (tam sınıf adları ile)
const SMART_TOOLS = [
  { name: 'Sunum Önerileri', path: '/beslenme-rehberi/sunum-onerileri', icon: 'fa-solid fa-plate-wheat' },
  { name: 'Ek Gıda Rehberi', path: '/akilli-asistan/ek-gida-rehberi', icon: 'fa-solid fa-carrot' },
  { name: 'Ek Gıdaya Başlama Kontrolü', path: '/akilli-asistan/ek-gidaya-baslama', icon: 'fa-solid fa-utensils' },
  { name: 'Bu Gıda Verilir mi?', path: '/akilli-asistan/bu-gida-verilir-mi', icon: 'fa-solid fa-magnifying-glass' },
  { name: 'Besin Deneme Takvimi', path: '/akilli-asistan/besin-takvimi', icon: 'fa-solid fa-seedling' },
  { name: 'BLW Hazırlık Testi', path: '/akilli-asistan/blw-testi', icon: 'fa-solid fa-baby' },
  { name: 'Persentil Hesaplayıcı', path: '/akilli-asistan/persentil', icon: 'fa-solid fa-chart-line' },
  { name: 'Su İhtiyacı Hesaplayıcı', path: '/akilli-asistan/su-ihtiyaci', icon: 'fa-solid fa-glass-water' },
  { name: 'Alerjen Deneme Planlayıcı', path: '/akilli-asistan/alerjen-planlayici', icon: 'fa-solid fa-shield-heart' },
  { name: 'Banyo Rutini Planlayıcı', path: '/akilli-asistan/banyo-planlayici', icon: 'fa-solid fa-bath' },
  { name: 'Günlük Hijyen Hesaplayıcı', path: '/akilli-asistan/gunluk-hijyen', icon: 'fa-solid fa-hand-sparkles' },
  { name: 'Akıllı Bez Hesaplayıcı', path: '/akilli-asistan/bez-hesaplayici', icon: 'fa-solid fa-baby-carriage' },
  { name: 'Hava Kalitesi Rehberi', path: '/akilli-asistan/hava-kalitesi', icon: 'fa-solid fa-wind' },
  { name: 'Leke Ansiklopedisi', path: '/akilli-asistan/leke-rehberi', icon: 'fa-solid fa-tshirt' },
  { name: '3 Gün Kuralı', path: '/beslenme-rehberi/3-gun-kurali', icon: 'fa-solid fa-clock-rotate-left' },
];

export default function ToolCard({ item }: ToolCardProps) {
  // Pick a random tool - use useState to ensure it stays consistent across renders
  const [randomTool] = React.useState(() => {
    return SMART_TOOLS[Math.floor(Math.random() * SMART_TOOLS.length)];
  });

  return (
    <Link
      href={randomTool.path}
      data-type="tool"
      className="featured-card flex-shrink-0 w-[85vw] md:w-[420px] snap-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-4xl shadow-md hover:shadow-xl overflow-hidden relative flex flex-col group transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-6 flex flex-col h-full relative text-white">
        {/* Badge */}
        <div className="flex justify-between items-start mb-4">
          <span className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-white/30">
            <i className="fa-solid fa-wand-magic-sparkles"></i> Akıllı Asistan
          </span>
          <i className="fa-solid fa-robot text-white/20 text-5xl absolute top-4 right-4"></i>
        </div>

        {/* Tool Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl border border-white/30">
            {/* fa-solid prefixi kaldırıldı çünkü datada artık mevcut */}
            <i className={randomTool.icon}></i>
          </div>
          <div>
            <h3 className="font-display font-bold text-xl leading-tight">
              {randomTool.name}
            </h3>
            <p className="text-white/80 text-xs mt-1">Interaktif faydalı araç</p>
          </div>
        </div>

        <p className="text-white/90 text-sm mb-6 leading-relaxed">
          Bebeğinizin sağlığı ve gelişimi için kişiselleştirilmiş öneriler ve hesaplamalar.
        </p>

        {/* CTA Button */}
        <div className="mt-auto pt-4">
          <button className="w-full py-3 rounded-xl bg-white text-purple-600 text-sm font-bold shadow-lg group-hover:bg-white/95 transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-sparkles"></i>
            Hemen Dene
            <i className="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>
    </Link>
  );
}