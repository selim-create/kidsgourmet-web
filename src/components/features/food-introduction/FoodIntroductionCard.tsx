'use client';

import Link from 'next/link';
import { useFoodIntroduction } from '@/hooks/useFoodIntroduction';

interface FoodIntroductionCardProps {
  childId: string;
}

export default function FoodIntroductionCard({ childId }: FoodIntroductionCardProps) {
  const { nextSuggestion, isLoading, error } = useFoodIntroduction(childId);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error || !nextSuggestion) {
    return null; // Silently fail
  }
  
  // Don't render if no ingredient name (no hardcoded fallback)
  if (!nextSuggestion.ingredient_name) {
    return null;
  }
  
  // CRITICAL: preparation_tips array guarantee
  const preparationTips = Array.isArray(nextSuggestion?.preparation_tips) 
    ? nextSuggestion.preparation_tips 
    : [];
  
  // Safe array check for recipes
  const recipes = Array.isArray(nextSuggestion?.recipes) ? nextSuggestion.recipes : [];
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border border-green-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
          🥕
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Bu Hafta Denenebilir: {nextSuggestion.ingredient_name}
          </h3>
          
          {nextSuggestion.introduction_week && (
            <p className="text-sm text-gray-700 mb-3">
              {nextSuggestion.introduction_week} tarihinden itibaren denemeye başlayabilirsiniz.
            </p>
          )}
          
          {preparationTips.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-900 mb-2">
                <i className="fa-solid fa-lightbulb text-yellow-500 mr-1"></i>
                Hazırlama İpuçları:
              </p>
              <ul className="space-y-1">
                {preparationTips.slice(0, 3).map((tip, index) => (
                  <li key={index} className="text-xs text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {nextSuggestion.allergy_info && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs text-orange-900">
                <i className="fa-solid fa-triangle-exclamation text-orange-500 mr-1"></i>
                <strong>Alerji Bilgisi:</strong> {nextSuggestion.allergy_info}
              </p>
            </div>
          )}
          
          {recipes.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-900 mb-2">
                Tarifler:
              </p>
              <div className="flex flex-wrap gap-2">
                {recipes.slice(0, 3).map((recipe) => (
                  <Link
                    key={recipe?.id || Math.random()}
                    href={`/tarifler/${recipe?.slug || ''}`}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors text-xs font-medium text-gray-700 hover:text-green-700"
                  >
                    {recipe?.title || 'Tarif'}
                    <i className="fa-solid fa-chevron-right ml-1 text-[10px]"></i>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {nextSuggestion.ingredient_slug && (
            <Link
              href={`/beslenme-rehberi/${nextSuggestion.ingredient_slug}`}
              className="inline-flex items-center text-green-700 hover:text-green-800 font-medium text-sm"
            >
              Detaylı Bilgi
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
