'use client';

import Link from 'next/link';
import { useNutritionSummary } from '@/hooks/useNutritionSummary';

interface MissingNutrientsAlertProps {
  childId: string;
}

export default function MissingNutrientsAlert({ childId }: MissingNutrientsAlertProps) {
  const { missingNutrients, isLoading, error } = useNutritionSummary(childId);
  
  if (isLoading) {
    return null; // Don't show loading for alerts
  }
  
  if (error || !missingNutrients || missingNutrients.length === 0) {
    return null; // Silently fail or no missing nutrients
  }
  
  // Show only top 3 most deficient nutrients
  const topMissing = missingNutrients
    .sort((a, b) => b.deficit_percentage - a.deficit_percentage)
    .slice(0, 3);
  
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i className="fa-solid fa-lightbulb text-amber-500 text-xl mt-0.5"></i>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-bold text-amber-800 mb-2">
            💡 Bu Hafta Eksik Kalan Besinler
          </h3>
          
          <div className="space-y-3">
            {topMissing.map((nutrient, index) => (
              <div key={index} className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-amber-900">
                    {nutrient.nutrient}
                  </span>
                  <span className="text-xs text-amber-700">
                    {nutrient.current_servings}/{nutrient.recommended_servings} porsiyon
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((nutrient.current_servings / nutrient.recommended_servings) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                
                {nutrient.suggested_foods.length > 0 && (
                  <p className="text-xs text-amber-700">
                    <strong>Öneriler:</strong> {nutrient.suggested_foods.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-amber-300">
            <Link 
              href="/dashboard/haftalik-plan"
              className="inline-flex items-center text-amber-800 hover:text-amber-900 font-medium text-sm"
            >
              Haftalık Planı Görüntüle
              <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
