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

// Age group color mapping (pastel colors)
const AGE_GROUP_COLORS: { [key: string]: string } = {
  '0-6': '#E1BEE7',   // Lila - 0-6 Ay / Hazırlık
  '6-8': '#FFCCBC',   // Şeftali - 6-8 Ay / Tadım
  '9-11': '#C8E6C9',  // Nane Yeşili - 9-11 Ay / Keşif
  '12-24': '#B3E5FC', // Gökyüzü Mavisi - 12-24 Ay / Aile
  '2+': '#FFF9C4',    // Limon Sarısı - 2+ Yaş / Gurme
};

// Border radius constants for consistency
const BORDER_RADIUS = {
  CARD: '24px',
  IMAGE_TOP: '24px 24px 0 0',
  BADGE_ASYMMETRIC: '12px 4px 12px 4px',
};

// Get shadow color based on age group
const getAgeGroupShadow = (ageGroup?: string): string => {
  if (!ageGroup) return 'rgba(0, 0, 0, 0.1)';
  
  // Extract age range from string like "Aile Sofrasına Geçiş (12-24 Ay)"
  if (ageGroup.includes('0-6')) return 'rgba(225, 190, 231, 0.4)';
  if (ageGroup.includes('6-8')) return 'rgba(255, 204, 188, 0.4)';
  if (ageGroup.includes('9-11')) return 'rgba(200, 230, 201, 0.4)';
  if (ageGroup.includes('12-24')) return 'rgba(179, 229, 252, 0.4)';
  if (ageGroup.includes('2+') || ageGroup.match(/\(24\+?\s*(Ay|yaş)/i)) return 'rgba(255, 249, 196, 0.4)';
  
  return 'rgba(0, 0, 0, 0.1)';
};

// Get background color for age group badge
const getAgeGroupColor = (ageGroup?: string, providedColor?: string): string => {
  if (providedColor) return providedColor;
  if (!ageGroup) return '#22C55E';
  
  // Extract age range from string
  if (ageGroup.includes('0-6')) return AGE_GROUP_COLORS['0-6'];
  if (ageGroup.includes('6-8')) return AGE_GROUP_COLORS['6-8'];
  if (ageGroup.includes('9-11')) return AGE_GROUP_COLORS['9-11'];
  if (ageGroup.includes('12-24')) return AGE_GROUP_COLORS['12-24'];
  if (ageGroup.includes('2+') || ageGroup.match(/\(24\+?\s*(Ay|yaş)/i)) return AGE_GROUP_COLORS['2+'];
  
  return '#22C55E';
};

// Get text color for age group badge (dark text for light backgrounds)
const getAgeGroupTextColor = (ageGroup?: string): string => {
  if (!ageGroup) return '#FFFFFF';
  
  // Light backgrounds need dark text for readability
  if (ageGroup.includes('2+') || ageGroup.match(/\(24\+?\s*(Ay|yaş)/i) || ageGroup.toLowerCase().includes('gurme')) {
    return '#92400E'; // Amber-800 - Dark brown for yellow background
  }
  if (ageGroup.includes('9-11') || ageGroup.toLowerCase().includes('keşif')) {
    return '#166534'; // Green-800 - Dark green for light green background
  }
  
  // Dark backgrounds use white text
  return '#FFFFFF';
};

// Helper function to generate ui-avatars.com URL
const generateUIAvatarURL = (name: string, backgroundColor: string): string => {
  const bgColor = backgroundColor.replace('#', '');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=128&bold=true`;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(recipe.id, 'recipe');

  // Extract author name from author object or string
  const authorName = typeof recipe.author === 'object' && recipe.author?.name 
    ? recipe.author.name 
    : typeof recipe.author === 'string' 
    ? recipe.author 
    : undefined;

  // Calculate age group colors first (needed for avatar fallback)
  const ageGroupColor = getAgeGroupColor(recipe.age_group, recipe.age_group_color);
  const ageGroupTextColor = getAgeGroupTextColor(recipe.age_group);
  const shadowColor = getAgeGroupShadow(recipe.age_group);

  // Get author avatar URL with fallback to ui-avatars.com
  const getAuthorAvatar = () => {
    // Try multiple possible avatar fields
    if (typeof recipe.author === 'object' && recipe.author) {
      // Check all possible avatar field variants
      const authorObj = recipe.author as { avatar?: string; avatar_url?: string; avatarUrl?: string };
      const avatar = authorObj.avatar || authorObj.avatar_url || authorObj.avatarUrl;
      if (avatar) return avatar;
    }
    
    // Fallback to ui-avatars.com with age group color
    if (authorName) {
      return generateUIAvatarURL(authorName, ageGroupColor);
    }
    
    return null;
  };

  const authorAvatar = getAuthorAvatar();

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
      className="group relative bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-visible flex flex-col"
      style={{
        borderRadius: BORDER_RADIUS.CARD,
        transform: 'translateY(0)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = `0 20px 40px ${shadowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Image Container - Floating inside card */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: BORDER_RADIUS.IMAGE_TOP }}
        >
          <img 
            src={recipe.image || '/placeholder-recipe.jpg'} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            alt={decodeEntities(recipe.title)} 
          />
        </div>
        
        {/* Age Group Badge - Top Left with asymmetric corners */}
        <div 
          className="absolute top-3 left-3 px-3 py-1.5 text-xs font-bold shadow-lg"
          style={{
            backgroundColor: ageGroupColor,
            color: ageGroupTextColor,
            borderRadius: BORDER_RADIUS.BADGE_ASYMMETRIC,
          }}
        >
          {decodeEntities(recipe.age_group)}
        </div>
        
        {/* Favorite Button - Top Right */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10 shadow-md"
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"}></i>
        </button>
        
        {/* Prep Time Badge - Bottom Right with glassmorphism */}
        {recipe.prep_time && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-lg">
            <i className="fa-regular fa-clock mr-1"></i> {recipe.prep_time}
          </div>
        )}
      </div>
      
      {/* Author Avatar - Overlapping between image and content */}
      {authorAvatar && authorName && (
        <div className="relative -mt-7 mx-auto z-10">
          <div 
            className="w-14 h-14 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100"
            style={{ borderWidth: '4px' }}
          >
            <img 
              src={authorAvatar}
              alt={authorName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, use fallback
                e.currentTarget.src = generateUIAvatarURL(authorName, ageGroupColor);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Content Area */}
      <div className="p-5 pt-3 flex flex-col flex-grow">
        {/* Author Name - Small, above title */}
        {authorName && (
          <div className="text-center mb-2">
            <span className="text-xs text-gray-500 font-medium">
              {recipe.expert?.approved && <i className="fa-solid fa-circle-check text-green-500 mr-1"></i>}
              {authorName}
            </span>
          </div>
        )}
        
        {/* Recipe Title */}
        <h3 className="font-sans font-bold text-base text-slate-800 mb-3 leading-tight group-hover:text-orange-500 transition-colors line-clamp-2 text-center min-h-[2.5rem]">
          {decodeEntities(recipe.title)}
        </h3>
        
        {/* Meta Info - Diet Type and Meal Type */}
        <div className="flex items-center justify-center gap-3 text-xs text-gray-500 mt-auto">
          {/* Diet Types */}
          {recipe.diet_types && recipe.diet_types.length > 0 && (
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <i className="fa-solid fa-leaf text-green-500"></i> {decodeEntities(recipe.diet_types[0])}
            </span>
          )}
          
          {/* Meal Type */}
          {recipe.meal_type && (
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <i className="fa-solid fa-utensils text-orange-500"></i> {decodeEntities(recipe.meal_type)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
