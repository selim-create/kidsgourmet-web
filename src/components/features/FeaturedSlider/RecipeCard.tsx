"use client";

import React from 'react';
import Link from 'next/link';
import { FeaturedItem } from '@/services/featured-service';
import { decodeEntities } from '@/utils/textHelpers';
import { useFavorites } from '@/hooks/use-favorites';

interface RecipeCardProps {
  item: FeaturedItem;
}

export default function RecipeCard({ item }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(item.id, 'recipe');

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(item.id, 'recipe');
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
    }
  };

  return (
    <Link
      href={`/tarifler/${item.slug}`}
      data-type="recipe"
      className="featured-card flex-shrink-0 w-[85vw] md:w-[420px] snap-center bg-white rounded-4xl shadow-md hover:shadow-xl overflow-hidden relative flex flex-col group cursor-pointer border border-gray-100 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-56 relative overflow-hidden bg-orange-100">
        <img
          src={item.image || 'https://placehold.co/800x400/FF8A65/ffffff?text=Tarif'}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={decodeEntities(item.title)}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-500 shadow-sm flex items-center gap-1">
          <i className="fa-solid fa-utensils"></i> Haftanın Tarifi
        </div>
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"}></i>
        </button>
        
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
          <i className="fa-regular fa-clock"></i> {item.meta?.prep_time || '15 dk'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-xl text-slate-800 mb-2 leading-tight group-hover:text-orange-500 transition-colors">
          {decodeEntities(item.title)}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {item.excerpt ? decodeEntities(item.excerpt) : 'Lezzetli ve sağlıklı bir tarif'}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold bg-green-50 px-2 py-1 rounded-lg"
              style={{ color: item.meta?.age_group_color || '#22C55E' }}
            >
              {decodeEntities(item.meta?.age_group || '+6 Ay')}
            </span>
            {item.meta?.diet_types && item.meta.diet_types.length > 0 && (
              <span className="text-xs text-gray-500">
                <i className="fa-solid fa-leaf mr-1"></i>{decodeEntities(item.meta.diet_types[0])}
              </span>
            )}
          </div>
          {/* Meal type moved to right corner */}
          {item.meta?.meal_type && (
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              <i className="fa-solid fa-utensils mr-1"></i>{decodeEntities(item.meta.meal_type)}
            </span>
          )}
          {/* Only show rating if both rating and rating_count exist and are > 0 */}
          {item.meta?.rating && item.meta?.rating_count && item.meta.rating_count > 0 && (
            <span className="text-xs text-gray-400">
              {item.meta.rating} <i className="fa-solid fa-star text-yellow-400"></i> ({item.meta.rating_count})
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
