import React, { useState } from 'react';
import Link from 'next/link';
import { MealSlot, MealSlotType } from '@/lib/types';

interface MealRowCardProps {
  slot: MealSlot;
  isSelected?: boolean;
  onClick?: () => void;
  onRefresh?: () => void;
  onSkip?: (reason: 'eating_out' | 'ready_meal' | 'family_meal') => void;
}

const SLOT_COLORS: Record<MealSlotType, { bg: string; text: string; badge: string; icon: string }> = {
  breakfast: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-600',
    icon: 'fa-solid fa-mug-hot',
  },
  lunch: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    badge: 'bg-green-100 text-green-600',
    icon: 'fa-solid fa-sun',
  },
  dinner: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-600',
    icon: 'fa-solid fa-moon',
  },
  snack_morning: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-600',
    icon: 'fa-solid fa-cookie-bite',
  },
  snack_afternoon: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-600',
    icon: 'fa-solid fa-cookie-bite',
  },
};

const MEAL_TIMES: Record<MealSlotType, string> = {
  breakfast: '08:30',
  snack_morning: '10:30',
  lunch: '12:30',
  snack_afternoon: '15:30',
  dinner: '18:30',
};

export default function MealRowCard({
  slot,
  isSelected = false,
  onClick,
  onRefresh,
  onSkip,
}: MealRowCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const colors = SLOT_COLORS[slot.slot_type] || SLOT_COLORS.breakfast;
  const time = slot.time_range || MEAL_TIMES[slot.slot_type] || '';

  // Skipped state
  if (slot.status === 'skipped') {
    return (
      <div className={`${colors.bg} p-4 rounded-2xl border border-gray-200 opacity-60 flex items-center gap-4`}>
        <div className={`w-12 h-12 rounded-full ${colors.badge} flex items-center justify-center flex-shrink-0`}>
          <i className={colors.icon}></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-700">{slot.slot_label}</span>
            <span className="text-xs text-gray-400">{time}</span>
          </div>
          <p className="text-sm text-gray-500 italic">
            {slot.skip_reason === 'eating_out'
              ? 'Dışarıda yiyoruz'
              : slot.skip_reason === 'ready_meal'
              ? 'Hazır mama'
              : slot.skip_reason === 'family_meal'
              ? 'Aile yemeği'
              : 'Atlandı'}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSkip) onSkip('eating_out');
          }}
          className="text-gray-400 hover:text-orange-500"
        >
          <i className="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    );
  }

  // Empty state
  if (slot.status === 'empty' || !slot.recipe) {
    return (
      <button
        onClick={onClick}
        className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all flex items-center gap-4 ${
          isSelected
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
        }`}
      >
        <div className={`w-12 h-12 rounded-full ${colors.badge} flex items-center justify-center flex-shrink-0`}>
          <i className={colors.icon}></i>
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-gray-700">{slot.slot_label}</span>
            <span className="text-xs text-gray-400">{time}</span>
          </div>
          <p className="text-xs text-gray-400">Tarif ekle</p>
        </div>
      </button>
    );
  }

  // Filled state
  return (
    <div
      className={`bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer relative ${
        isSelected ? 'ring-2 ring-orange-400' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Icon & Time */}
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full ${colors.badge} flex items-center justify-center mb-1`}>
            <i className={colors.icon}></i>
          </div>
          <p className="text-[10px] text-center text-gray-400 font-medium">{time}</p>
        </div>

        {/* Recipe Info */}
        <Link href={`/tarifler/${slot.recipe.slug}`} className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3">
            <img
              src={slot.recipe.image || 'https://placehold.co/100x100/FFF3E0/FF8A65?text=Tarif'}
              className="w-20 h-20 rounded-xl object-cover"
              alt={slot.recipe.title}
            />
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${colors.badge}`}>
                {slot.slot_label}
              </span>
              <p className="text-base font-bold text-slate-800 line-clamp-2 mt-1">{slot.recipe.title}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <i className="fa-regular fa-clock"></i> {slot.recipe.prep_time}
              </p>
            </div>
          </div>
        </Link>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="text-gray-400 hover:text-orange-500 p-2"
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-100 p-1 z-50 min-w-[160px]">
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
      </div>
    </div>
  );
}
