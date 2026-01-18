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
      <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-2">
        <i className="fa-solid fa-wand-magic-sparkles text-orange-500 mr-1"></i>
        Kişisel Öneriler
      </h4>
      
      {recipeList.slice(0, limit).map((recipe) => {
        const recipeId = (recipe as any)?.recipe_id || recipe?.id;
        
        return (
          <div
            key={recipeId || Math.random()}
            onClick={() => isSelectable && recipeId && onSelectRecipe?.(recipeId)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isSelectable 
                ? 'border-stone-100 bg-white shadow-sm cursor-pointer hover:shadow-md hover:border-orange-200 group' 
                : 'border-stone-100 hover:bg-stone-50'
            }`}
          >
            {recipe?.image && (
              <div className="w-14 h-14 rounded-lg bg-stone-50 flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0">
                <img
                  src={recipe.image}
                  alt={recipe?.title || 'Tarif'}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                {recipe?.title || 'Tarif'}
              </p>
              {recipe?.prep_time && (
                <p className="text-[10px] text-stone-400 flex items-center gap-0.5 font-medium mt-1.5">
                  <i className="fa-regular fa-clock text-[9px]"></i>
                  {recipe.prep_time}
                </p>
              )}
            </div>
            {isSelectable && (
              <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-sm">
                <i className="fa-solid fa-plus text-sm"></i>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
