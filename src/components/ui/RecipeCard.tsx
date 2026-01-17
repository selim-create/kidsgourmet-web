"use client";

import React from 'react';
import Link from 'next/link';
import { RecipeCard as RecipeCardType } from '@/lib/types';
import { decodeEntities } from '@/utils/textHelpers';
import { useFavorites } from '@/hooks/use-favorites';
import { EditButton } from '@/components/ui/EditButton';

interface RecipeCardProps {
  recipe: RecipeCardType & {
    age_group_color?: string;
    diet_types?: string[];
    meal_type?: string;
    rating?: number;
    rating_count?: number;
    comment_count?: number;
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

  // Extract author name from author object or string
  const authorName = typeof recipe.author === 'object' && recipe.author?.name 
    ? recipe.author.name 
    : typeof recipe.author === 'string' 
    ? recipe.author 
    : undefined;

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
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col min-h-[420px]"
    >
      <div className="h-56 relative overflow-hidden bg-gray-50 flex-shrink-0">
        <img 
          src={recipe.image || '/placeholder-recipe.jpg'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          alt={decodeEntities(recipe.title)} 
        />
        
        {/* Edit Button - Hover'da görünür */}
        <EditButton 
          contentType="recipe" 
          contentId={recipe.id}
          authorId={recipe.author?.id}
          variant="text"
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
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-sans font-bold text-lg text-slate-800 mb-2 leading-tight group-hover:text-orange-500 transition-colors line-clamp-2 min-h-[3.5rem]">
          {decodeEntities(recipe.title)}
        </h3>
        
        {/* Recipe Info - Diet Type (RIGHT) and Meal Type (LEFT) */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3 gap-2">
          {/* Meal Type - LEFT */}
          {recipe.meal_type && (
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-utensils"></i> {decodeEntities(recipe.meal_type)}
            </span>
          )}
          
          {/* Diet Types - RIGHT */}
          {recipe.diet_types && recipe.diet_types.length > 0 && (
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-leaf"></i> {decodeEntities(recipe.diet_types[0])}
            </span>
          )}
        </div>
        
        {/* Expert Approval or Author - Redesigned */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          {recipe.expert?.approved ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-check text-green-600 text-xs"></i>
              </div>
              <span className="text-xs text-gray-600 font-medium truncate">
                {recipe.expert.title} {recipe.expert.name}
              </span>
            </div>
          ) : authorName ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-user text-gray-500 text-xs"></i>
              </div>
              <span className="text-xs text-gray-600 font-medium truncate">
                {authorName}
              </span>
            </div>
          ) : (
            <div className="flex-1"></div>
          )}
          
          {/* Comment Count - RIGHT */}
          {recipe.comment_count !== undefined && recipe.comment_count > 0 && (
            <span className="text-xs text-gray-400 flex items-center gap-1 ml-2 flex-shrink-0">
              <i className="fa-regular fa-comment"></i> {recipe.comment_count}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
