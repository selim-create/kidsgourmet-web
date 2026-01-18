import React from 'react';
import { Recipe } from '@/lib/types';

interface RecipeSuggestionCardProps {
  recipe: {
    id: number;
    title: string;
    image?: string;
    prep_time?: string;
  };
  onClick: () => void;
  isSelectable?: boolean;
  matchPercentage?: number;
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/100x100/FFF3E0/FF8A65?text=Tarif';

export default function RecipeSuggestionCard({
  recipe,
  onClick,
  isSelectable = true,
  matchPercentage,
}: RecipeSuggestionCardProps) {
  return (
    <div
      onClick={isSelectable ? onClick : undefined}
      className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
        isSelectable
          ? 'border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 hover:border-orange-300'
          : 'border-gray-100 bg-gray-50 opacity-60'
      }`}
    >
      <div className="relative">
        <img
          src={recipe.image || PLACEHOLDER_IMAGE}
          alt={recipe.title}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        {matchPercentage !== undefined && matchPercentage > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {matchPercentage}%
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-700 line-clamp-2">{recipe.title}</p>
        {recipe.prep_time && (
          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
            <i className="fa-regular fa-clock"></i>
            {recipe.prep_time}
          </p>
        )}
      </div>
      {isSelectable && (
        <i className="fa-solid fa-plus text-orange-500 flex-shrink-0"></i>
      )}
    </div>
  );
}
