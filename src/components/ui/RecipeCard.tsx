"use client";

import React from 'react';
import Link from 'next/link';
import { RecipeCard as RecipeCardType } from '@/lib/types';
import { decodeEntities } from '@/utils/textHelpers';
import { useFavorites } from '@/hooks/use-favorites';

interface RecipeCardProps {
  recipe: RecipeCardType & {
    age_group_color?: string;
    diet_types?: string[];
    meal_type?: string;
    rating?: number;
    author?: string;
    expert?: {
      name: string;
      title: string;
      approved: boolean;
    };
    is_featured?: boolean;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(recipe.id, 'recipe');

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
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="h-56 relative overflow-hidden bg-gray-50">
        <img 
          src={recipe.image || 'https://placehold.co/600x400/FFF8E1/FF8A65?text=Tarif'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          alt={decodeEntities(recipe.title)} 
        />
        
        {/* Prep Time Badge - Top Left */}
        {recipe.prep_time && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
            <i className="fa-regular fa-clock text-orange-500 mr-1"></i> {recipe.prep_time}
          </div>
        )}
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"}></i>
        </button>
        
        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
          {/* Age Group Badge with dynamic color */}
          <span 
            className="text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm"
            style={{ backgroundColor: recipe.age_group_color || '#22C55E' }}
          >
            {decodeEntities(recipe.age_group)}
          </span>
          
          {/* Featured Badge */}
          {recipe.is_featured && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
              Haftanın Tarifi
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-sans font-bold text-lg text-slate-800 mb-1 leading-tight group-hover:text-orange-500 transition-colors">
          {decodeEntities(recipe.title)}
        </h3>
        
        {/* Recipe Info */}
        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3 flex-wrap">
          {/* Diet Types */}
          {recipe.diet_types && recipe.diet_types.length > 0 && (
            <span>
              <i className="fa-solid fa-leaf mr-1"></i> {decodeEntities(recipe.diet_types[0])}
            </span>
          )}
          
          {/* Meal Type */}
          {recipe.meal_type && (
            <span>
              <i className="fa-solid fa-utensils mr-1"></i> {decodeEntities(recipe.meal_type)}
            </span>
          )}
          
          {/* Rating */}
          {recipe.rating && (
            <span>
              <i className="fa-solid fa-star text-yellow-400 mr-1"></i> {recipe.rating}
            </span>
          )}
        </div>
        
        {/* Expert Approval */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          {recipe.expert?.approved ? (
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] mr-2">👨‍⚕️</span>
              <span className="text-xs text-gray-500 font-medium">
                {recipe.expert.title} {recipe.expert.name} tarafından onaylandı
              </span>
            </div>
          ) : recipe.author ? (
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] mr-2">✍️</span>
              <span className="text-xs text-gray-500 font-medium">
                {recipe.author}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
