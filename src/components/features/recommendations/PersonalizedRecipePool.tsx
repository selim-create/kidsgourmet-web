'use client';

import { useDashboardRecommendations } from '@/hooks/useDashboardRecommendations';
import { useUser } from '@/hooks/use-user';

interface PersonalizedRecipePoolProps {
  childId: string;
  mealType?: string;
  limit?: number;
  onSelectRecipe?: (recipeId: number) => void;  // Yeni prop
  isSelectable?: boolean;                        // Yeni prop
}

export default function PersonalizedRecipePool({ 
  childId, 
  mealType,
  limit = 12,
  onSelectRecipe,
  isSelectable = false
}: PersonalizedRecipePoolProps) {
  const { isAuthenticated } = useUser();
  // useDashboardRecommendations kullan - bu doğru response mapping yapıyor
  const { recommendations, isLoading, error } = useDashboardRecommendations(childId);
  
  const recipeList = Array.isArray(recommendations) ? recommendations : [];

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
      <div className="text-center py-3 text-amber-600 bg-amber-50 rounded-lg">
        <i className="fa-solid fa-triangle-exclamation text-sm"></i>
        <p className="text-xs mt-1">Öneriler yüklenemedi</p>
      </div>
    );
  }
  
  if (recipeList.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <i className="fa-solid fa-utensils text-gray-400 text-xl mb-2"></i>
        <p className="text-xs">Henüz öneri yok</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
        <i className="fa-solid fa-wand-magic-sparkles text-purple-500 mr-1"></i>
        Kişisel Öneriler
      </h4>
      
      {recipeList.slice(0, limit).map((recipe) => {
        const recipeId = (recipe as any)?.recipe_id || recipe?.id;
        
        return (
          <div
            key={recipeId || Math.random()}
            onClick={() => isSelectable && recipeId && onSelectRecipe?.(recipeId)}
            className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
              isSelectable 
                ? 'border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 hover:border-orange-300' 
                : 'border-gray-100 hover:bg-gray-50'
            }`}
          >
            {recipe?.image && (
              <img
                src={recipe.image}
                alt={recipe?.title || 'Tarif'}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
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
            {isSelectable && (
              <i className="fa-solid fa-plus text-orange-500 text-sm flex-shrink-0"></i>
            )}
          </div>
        );
      })}
    </div>
  );
}
