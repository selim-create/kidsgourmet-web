'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRecommendations } from '@/hooks/useRecommendations';

interface PersonalizedRecipePoolProps {
  childId: string;
  mealType?: string;
  limit?: number;
}

export default function PersonalizedRecipePool({ 
  childId, 
  mealType,
  limit = 12 
}: PersonalizedRecipePoolProps) {
  const { recommendations, isLoading, error } = useRecommendations(childId, { 
    limit,
    meal_type: mealType,
    include_scores: false 
  });
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error || !recommendations || recommendations.length === 0) {
    return null; // Silently fail
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        <i className="fa-solid fa-star text-yellow-500 mr-2"></i>
        Sizin İçin Seçtiklerimiz
      </h3>
      
      {recommendations.map((recipe) => (
        <Link 
          key={recipe.id} 
          href={`/tarifler/${recipe.slug}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
              {recipe.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="inline-flex items-center">
                <i className="fa-solid fa-clock mr-1"></i>
                {recipe.prep_time}
              </span>
              {recipe.age_group && (
                <span 
                  className="px-2 py-0.5 rounded-full text-white text-xs"
                  style={{ backgroundColor: recipe.age_group_color || '#FF8A65' }}
                >
                  {recipe.age_group}
                </span>
              )}
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
        </Link>
      ))}
    </div>
  );
}
