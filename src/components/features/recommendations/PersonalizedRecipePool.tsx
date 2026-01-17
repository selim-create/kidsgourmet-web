'use client';

import Link from 'next/link';
import { useRecommendations } from '@/hooks/useRecommendations';
import { PersonalizedRecipe } from '@/services/recommendation-service';
import { useUser } from '@/hooks/use-user';

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
  const { isAuthenticated } = useUser();
  const { recommendations, isLoading, error } = useRecommendations(childId, { 
    limit,
    meal_type: mealType,
    include_scores: false 
  });
  
  // Safe array check - API response can come in different structure
  const recipeList: PersonalizedRecipe[] = Array.isArray(recommendations) 
    ? recommendations 
    : (recommendations as any)?.recommendations || [];

  // Auth yoksa bilgilendirme göster
  if (!isAuthenticated) {
    return (
      <div className="text-center py-4 text-gray-500">
        <i className="fa-solid fa-lock text-gray-400 text-xl mb-2"></i>
        <p className="text-xs">Öneriler için giriş yapın</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // API hatası durumunda bilgilendirme
  if (error) {
    return (
      <div className="text-center py-4 text-amber-600 bg-amber-50 rounded-lg">
        <i className="fa-solid fa-triangle-exclamation text-xl mb-2"></i>
        <p className="text-xs">Öneriler şu an yüklenemiyor</p>
        <p className="text-xs text-amber-500 mt-1">Lütfen daha sonra tekrar deneyin</p>
      </div>
    );
  }
  
  if (recipeList.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <i className="fa-solid fa-utensils text-gray-400 text-xl mb-2"></i>
        <p className="text-xs">Henüz öneri oluşturulmadı</p>
        <p className="text-xs text-gray-400 mt-1">Çocuk profilinizi güncelleyin</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
        <i className="fa-solid fa-wand-magic-sparkles text-purple-500 mr-1"></i>
        Kişiselleştirilmiş Öneriler
      </h4>
      
      {recipeList.slice(0, 5).map((recipe) => (
        <Link
          key={recipe?.id || Math.random()}
          href={`/tarifler/${recipe?.slug || ''}`}
          className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          {/* img kullan - next/image hostname sorunu olmaz */}
          {recipe?.image && (
            <img
              src={recipe.image}
              alt={recipe?.title || 'Tarif'}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              loading="lazy"
              onError={(e) => {
                // Resim yüklenemezse placeholder göster
                (e.target as HTMLImageElement).src = '/images/placeholder-recipe.png';
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {recipe?.title || 'Tarif'}
            </p>
            {recipe?.prep_time && (
              <p className="text-xs text-gray-500">
                <i className="fa-regular fa-clock mr-1"></i>
                {recipe.prep_time}
              </p>
            )}
          </div>
          {recipe?.score && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
              {Math.round(recipe.score)}%
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
