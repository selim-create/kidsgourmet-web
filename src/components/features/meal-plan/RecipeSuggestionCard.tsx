import React from 'react';

// Lightweight recipe type for suggestions
export interface RecipeSuggestion {
  id: number;
  title: string;
  image?: string;
  prep_time?: string;
}

interface RecipeSuggestionCardProps {
  recipe: RecipeSuggestion;
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
      className={`flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group ${
        isSelectable ? 'cursor-pointer' : 'opacity-60'
      }`}
    >
      <div className="relative w-14 h-14 rounded-lg bg-stone-50 flex items-center justify-center text-2xl shadow-inner overflow-hidden flex-shrink-0">
        {recipe.image ? (
          <img
            src={recipe.image || PLACEHOLDER_IMAGE}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span role="img" aria-label="Recipe placeholder">🍽️</span>
        )}
        {matchPercentage !== undefined && matchPercentage > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {matchPercentage}%
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-stone-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{recipe.title}</p>
        {recipe.prep_time && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-stone-400 flex items-center gap-0.5 font-medium">
              <i className="fa-regular fa-clock text-[9px]"></i> {recipe.prep_time}
            </span>
          </div>
        )}
      </div>
      {isSelectable && (
        <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-sm">
          <i className="fa-solid fa-plus text-sm"></i>
        </div>
      )}
    </div>
  );
}
