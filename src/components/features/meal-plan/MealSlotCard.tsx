import React, { useState } from 'react';
import Link from 'next/link';
import { MealSlot, MealSlotType } from '@/lib/types';

interface MealSlotCardProps {
  slot: MealSlot;
  isSelected?: boolean;
  onClick?: () => void;
  onRefresh?: () => void;
  onSkip?: (reason: 'eating_out' | 'ready_meal' | 'family_meal') => void;
  isCompact?: boolean;
}

const SLOT_COLORS: Record<MealSlotType, { bg: string; text: string; badge: string }> = {
  breakfast: { bg: 'bg-yellow-50', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-600' },
  lunch: { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-100 text-green-600' },
  dinner: { bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-600' },
  snack_morning: { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-600' },
  snack_afternoon: { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-600' },
};

export default function MealSlotCard({
  slot,
  isSelected = false,
  onClick,
  onRefresh,
  onSkip,
  isCompact = false,
}: MealSlotCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const colors = SLOT_COLORS[slot.slot_type] || SLOT_COLORS.breakfast;

  // Skipped state
  if (slot.status === 'skipped') {
    return (
      <div className={`${colors.bg} p-3 rounded-2xl border border-gray-200 opacity-60`}>
        <div className="flex items-start justify-between mb-2">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${colors.badge}`}>
            {slot.slot_label}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onSkip) onSkip('eating_out');
            }}
            className="text-gray-400 hover:text-orange-500 text-xs"
          >
            <i className="fa-solid fa-rotate-left"></i>
          </button>
        </div>
        <p className="text-xs text-gray-500 italic">
          {slot.skip_reason === 'eating_out'
            ? 'Dışarıda yiyoruz'
            : slot.skip_reason === 'ready_meal'
            ? 'Hazır mama'
            : slot.skip_reason === 'family_meal'
            ? 'Aile yemeği'
            : 'Atlandı'}
        </p>
      </div>
    );
  }

  // Empty state
  if (slot.status === 'empty' || !slot.recipe) {
    return (
      <button
        onClick={onClick}
        className={`h-24 w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 ${
          isSelected
            ? 'border-orange-500 bg-orange-50 text-orange-500'
            : 'border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <i className="fa-solid fa-plus text-xs"></i>
        </div>
        <span className="text-[10px] font-bold uppercase">{slot.slot_label}</span>
      </button>
    );
  }

  // Filled state
  return (
    <div
      className={`h-28 bg-white rounded-2xl border shadow-sm p-2 relative group hover:shadow-md transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-orange-400' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${colors.badge}`}>
          {slot.slot_label}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-orange-500 transition-opacity"
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-100 p-1 z-50 min-w-[160px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRefresh?.();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
              >
                <i className="fa-solid fa-rotate text-blue-500"></i> Değiştir
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSkip?.('eating_out');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
              >
                <span className="text-orange-500">🍽️</span> Dışarıdayız
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSkip?.('ready_meal');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
              >
                <span className="text-purple-500">🍼</span> Hazır Mama
              </button>
            </div>
          </>
        )}
      </div>

      {/* Recipe Info */}
      <Link href={`/tarifler/${slot.recipe.slug}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <img
            src={slot.recipe.image || 'https://placehold.co/100x100/FFF3E0/FF8A65?text=Tarif'}
            className="w-12 h-12 rounded-xl object-cover"
            alt={slot.recipe.title}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-stone-800 line-clamp-2">{slot.recipe.title}</p>
            <p className="text-[9px] text-stone-400 flex items-center gap-1 mt-0.5">
              <i className="fa-regular fa-clock"></i> {slot.recipe.prep_time}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
