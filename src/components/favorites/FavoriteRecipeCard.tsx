"use client";

import React from 'react';
import Link from 'next/link';
import { FavoriteRecipeCard as FavoriteRecipeCardType } from '@/lib/types';
import { decodeEntities } from '@/utils/textHelpers';
import { useFavorites } from '@/hooks/use-favorites';

interface FavoriteRecipeCardProps {
  recipe: FavoriteRecipeCardType;
}

export default function FavoriteRecipeCard({ recipe }: FavoriteRecipeCardProps) {
  const { toggleFavorite } = useFavorites();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(recipe.id, 'recipe');
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
    }
  };

  return (
    <Link
      href={`/tarifler/${recipe.slug}`}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image || 'https://placehold.co/400x300/FFF8E1/FF8A65?text=Tarif'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={decodeEntities(recipe.title)}
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform"
        >
          <i className="fa-solid fa-heart"></i>
        </button>
        <div className="absolute bottom-3 left-3">
          <span
            className="text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm"
            style={{ backgroundColor: recipe.age_group_color || '#22C55E' }}
          >
            {decodeEntities(recipe.age_group)}
          </span>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
          {decodeEntities(recipe.title)}
        </h3>
        {recipe.categories && recipe.categories.length > 0 && (
          <p className="text-xs text-gray-500 mb-3">
            {recipe.categories.map(decodeEntities).join(', ')}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">
            <i className="fa-regular fa-clock mr-1"></i> {recipe.prep_time}
          </span>
          <button className="text-gray-400 hover:text-slate-600">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
      </div>
    </Link>
  );
}
