'use client';

import { useState } from 'react';
import { useMealTypes } from '@/hooks/useMealTypes';

interface MealTypeFilterProps {
  onFilterChange?: (selectedSlug: string | null) => void;
}

export default function MealTypeFilter({ onFilterChange }: MealTypeFilterProps) {
  const { mealTypes, isLoading } = useMealTypes();
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  const handleMealTypeClick = (slug: string) => {
    const newSelection = selectedMealType === slug ? null : slug;
    setSelectedMealType(newSelection);
    if (onFilterChange) {
      onFilterChange(newSelection);
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-full"></div>
        <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-full"></div>
        <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-full"></div>
      </div>
    );
  }

  if (!mealTypes || mealTypes.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {mealTypes.map((mealType) => {
        const isSelected = selectedMealType === mealType.slug;
        const icon = mealType.meal_type_meta?.icon || '🍽️';
        const colorCode = mealType.meal_type_meta?.color_code || '#f97316';
        
        return (
          <button
            key={mealType.id}
            onClick={() => handleMealTypeClick(mealType.slug)}
            className="px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 border-2"
            style={{
              backgroundColor: isSelected ? colorCode : 'transparent',
              borderColor: isSelected ? colorCode : '#e5e7eb',
              color: isSelected ? '#ffffff' : '#4b5563',
            }}
          >
            <span className="text-base">{icon}</span>
            <span>{mealType.name}</span>
          </button>
        );
      })}
    </div>
  );
}
