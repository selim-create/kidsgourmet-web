"use client";

import React from 'react';
import Link from 'next/link';
import { RecipeCard as RecipeCardType } from '@/lib/types';
import { decodeEntities } from '@/utils/textHelpers';

interface RecipeCardProps {
  recipe: RecipeCardType & {
    age_group_color?: string;
    diet_types?: string[];
    meal_type?: string;
    rating?: number;
    rating_count?: number;
    expert?: {
      name: string;
      title: string;
      approved: boolean;
    };
    is_featured?: boolean;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/tarifler/${recipe.slug}`}
      data-type="recipe"
      className="featured-card flex-shrink-0 w-[85vw] md:w-[420px] snap-center bg-white rounded-4xl shadow-md hover:shadow-xl overflow-hidden relative flex flex-col group cursor-pointer border border-gray-100 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-56 relative overflow-hidden bg-orange-100">
        <img
          src={recipe.image || 'https://placehold.co/800x400/FF8A65/ffffff?text=Tarif'}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={decodeEntities(recipe.title)}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-500 shadow-sm flex items-center gap-1">
          <i className="fa-solid fa-utensils"></i> Haftanın Tarifi
        </div>
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
          <i className="fa-regular fa-clock"></i> {recipe.prep_time}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-xl text-slate-800 mb-2 leading-tight group-hover:text-orange-500 transition-colors">
          {decodeEntities(recipe.title)}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {recipe.excerpt ? decodeEntities(recipe.excerpt) : 'Lezzetli ve sağlıklı bir tarif'}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <span
            className="text-xs font-bold bg-green-50 px-2 py-1 rounded-lg"
            style={{ color: recipe.age_group_color || '#22C55E' }}
          >
            {recipe.age_group}
          </span>
          {recipe.rating && recipe.rating_count && (
            <span className="text-xs text-gray-400">
              {recipe.rating} <i className="fa-solid fa-star text-yellow-400"></i> ({recipe.rating_count})
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
