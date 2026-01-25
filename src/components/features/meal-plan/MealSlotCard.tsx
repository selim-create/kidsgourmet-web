import React, { useState } from 'react';
import Link from 'next/link';
import { MealSlot, MealSlotType } from '@/lib/types';

interface MealSlotCardProps {
  slot: MealSlot;
  isSelected?: boolean;
  onClick?: () => void;
  onRefresh?: () => void;
  onSkip?: (reason: 'eating_out' | 'ready_meal' | 'family_meal') => void;
  onSelectFromList?: () => void;
  isCompact?: boolean;
}

const SLOT_ICONS: Record<MealSlotType, string> = {
  breakfast: 'fa-sun',
  lunch: 'fa-utensils',
  dinner: 'fa-moon',
  snack_morning: 'fa-cookie-bite',
  snack_afternoon: 'fa-apple-whole',
};

const SLOT_COLORS: Record<MealSlotType, { bg: string; text: string; border: string }> = {
  breakfast: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
  lunch: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  dinner: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  snack_morning: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  snack_afternoon: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
};

export default function MealSlotCard({
  slot,
  isSelected = false,
  onClick,
  onRefresh,
  onSkip,
  onSelectFromList,
  isCompact = false,
}: MealSlotCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slotType = (slot.slot_type || 'breakfast') as MealSlotType;
  const colors = SLOT_COLORS[slotType];

  // 1. BOŞ SLOT DURUMU (Daha minimal)
  if (!slot.recipe || slot.status === 'empty') {
    return (
      <div 
        onClick={onClick}
        className={`
          group relative h-28 w-full border border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'border-orange-400 bg-orange-50' 
            : 'border-stone-200 hover:border-orange-300 hover:bg-stone-50'
          }
        `}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors ${isSelected ? 'bg-orange-200 text-orange-600' : 'bg-stone-100 text-stone-400 group-hover:bg-orange-100 group-hover:text-orange-500'}`}>
          <i className="fa-solid fa-plus text-xs"></i>
        </div>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide group-hover:text-orange-500">
          {slot.slot_label}
        </span>
      </div>
    );
  }

  // 2. ATLANMIŞ SLOT DURUMU
  if (slot.status === 'skipped') {
    return (
      <div className={`h-28 w-full rounded-xl border p-3 flex flex-col items-center justify-center text-center opacity-75 ${colors.bg} ${colors.border}`}>
        <i className="fa-solid fa-ban text-gray-400 mb-1"></i>
        <span className="text-[10px] font-bold text-gray-500 line-clamp-1">
          {slot.skip_reason === 'eating_out' ? 'Dışarıda' : 'Atlandı'}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onSkip?.('eating_out'); }} // Reset logic here usually
          className="mt-1 text-[9px] text-blue-500 hover:underline"
        >
          Geri Al
        </button>
      </div>
    );
  }

  // 3. DOLU SLOT (UX İyileştirilmiş)
  return (
    <div className={`
      group relative w-full h-auto bg-white rounded-xl shadow-sm border transition-all duration-200
      hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5
      ${isSelected ? 'ring-2 ring-orange-400 border-orange-400' : 'border-stone-200'}
    `}>
      
      {/* Görsel Alanı - Bilgileri Resim Üzerine Taşıdık */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl bg-stone-100">
        <img 
          src={slot.recipe.image || 'https://placehold.co/300x200/FFF3E0/FF8A65?text=Yemek'} 
          alt={slot.recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Gradient: Yazıların okunması için alttan gölge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

        {/* Slot Tipi Rozeti (Sol Üst) */}
        <div className="absolute top-1.5 left-1.5">
           <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
             <i className={`fa-solid ${SLOT_ICONS[slotType]} text-[9px] ${colors.text}`}></i>
             <span className="text-[9px] font-bold text-stone-600 uppercase">{slot.slot_label}</span>
           </div>
        </div>

        {/* Süre Bilgisi (Sağ Alt - Resim Üzerinde) */}
        <div className="absolute bottom-1.5 right-1.5 flex gap-1">
          <span className="flex items-center gap-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-[9px] backdrop-blur-sm">
            <i className="fa-regular fa-clock text-[9px]"></i>
            {slot.recipe.prep_time}
          </span>
        </div>

        {/* Menü Butonu (Sağ Üst - Sadece Hover'da belirginleşir) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className={`
            absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center text-stone-500 shadow-md 
            transition-all duration-200 hover:text-orange-500 hover:bg-orange-50
            ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
        >
          <i className="fa-solid fa-ellipsis-vertical text-[10px]"></i>
        </button>
      </div>

      {/* İçerik Alanı - Sadeleştirilmiş */}
      <Link href={`/tarifler/${slot.recipe.slug}`} className="block p-2.5">
        {/* Başlık: Max 2 satır, taşma engellendi */}
        <h4 
          className="font-bold text-xs text-slate-800 leading-tight mb-1 min-h-[2rem]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          title={slot.recipe.title} // Mouse üzerine gelince tam isim görünür
        >
          {slot.recipe.title}
        </h4>
        
    
      </Link>

      {/* Açılır Menü (Dropdown) - Pozisyonu düzeltildi */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
          <div className="absolute top-8 right-2 z-50 w-44 bg-white rounded-xl shadow-xl border border-stone-100 py-1 animation-scale-in origin-top-right">
            <button
              onClick={(e) => { e.stopPropagation(); onSelectFromList?.(); setIsMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-stone-600 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2"
            >
              <i className="fa-solid fa-list-ul w-3.5 text-center"></i> Listeden Seç
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRefresh?.(); setIsMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-stone-600 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2"
            >
              <i className="fa-solid fa-rotate w-3.5 text-center"></i> Değiştir
            </button>
            <div className="h-px bg-stone-100 my-1 mx-2"></div>
            <button
              onClick={(e) => { e.stopPropagation(); onSkip?.('eating_out'); setIsMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-stone-600 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2"
            >
              <i className="fa-solid fa-utensils w-3.5 text-center"></i> Dışarıdayız
            </button>
          </div>
        </>
      )}
    </div>
  );
}