'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDashboardRecommendations } from '@/hooks/useDashboardRecommendations';

interface DailyRecommendationsProps {
  childId: string;
}

export default function DailyRecommendations({ childId }: DailyRecommendationsProps) {
  const { recommendations, isLoading, error } = useDashboardRecommendations(childId);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return null; // Silently fail - don't show error to user
  }
  
  // recommendations artık doğru şekilde today array'inden geliyor
  const recipeList = Array.isArray(recommendations) ? recommendations : [];
  
  if (recipeList.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          <i className="fa-solid fa-sparkles text-orange-500 mr-2"></i>
          Bugün İçin Öneriler
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipeList.slice(0, 6).map((recipe) => (
          <Link 
            key={(recipe as any)?.recipe_id || recipe?.id || Math.random()}
            href={`/tarifler/${recipe?.slug || ''}`}
            className="group block"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
              {recipe?.image && (
                <Image
                  src={recipe.image}
                  alt={recipe?.title || 'Tarif'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              {(recipe as any)?.age_group && (
                <div 
                  className="absolute top-2 left-2 px-2 py-1 rounded-full text-white text-xs font-medium"
                  style={{ backgroundColor: (recipe as any).age_group_color || '#FF8A65' }}
                >
                  {(recipe as any).age_group}
                </div>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors line-clamp-2">
              {recipe?.title || 'Tarif'}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <i className="fa-solid fa-clock mr-1"></i>
              {(recipe as any)?.prep_time}
            </div>
            {(recipe as any)?.score && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-purple-600 font-bold">
                  %{Math.round((recipe as any).score)} uyumlu
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link 
          href="/tarifler"
          className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium text-sm"
        >
          Tüm Tarifleri Görüntüle
          <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
        </Link>
      </div>
    </div>
  );
}
