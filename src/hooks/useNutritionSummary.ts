'use client';

import { useState, useEffect, useCallback } from 'react';
import { nutritionService } from '@/services/nutrition-service';
import { recommendationService } from '@/services/recommendation-service';

interface WeeklyNutritionSummary {
  protein_servings: number;
  vegetable_servings: number;
  fruit_servings: number;
  grains_servings: number;
  dairy_servings: number;
  iron_rich_count: number;
  variety_score: number;
  new_foods_introduced: string[];
  allergen_exposures: string[];
}

interface MissingNutrient {
  nutrient: string;
  current_servings: number;
  recommended_servings: number;
  deficit_percentage: number;
  suggested_foods?: string[];
}

const DEFAULT_SUMMARY: WeeklyNutritionSummary = {
  protein_servings: 0,
  vegetable_servings: 0,
  fruit_servings: 0,
  grains_servings: 0,
  dairy_servings: 0,
  iron_rich_count: 0,
  variety_score: 0,
  new_foods_introduced: [],
  allergen_exposures: [],
};

/**
 * Haftalık beslenme özeti için hook
 * API'den gelen dashboard nutrition_summary'yi kullanır
 */
export function useNutritionSummary(childId: string | undefined) {
  const [summary, setSummary] = useState<WeeklyNutritionSummary>(DEFAULT_SUMMARY);
  const [missingNutrients, setMissingNutrients] = useState<MissingNutrient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!childId) {
      setSummary(DEFAULT_SUMMARY);
      setMissingNutrients([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Dashboard endpoint'inden nutrition_summary al
      const dashboardData = await recommendationService.getDashboardRecommendations(childId);
      
      console.log('Dashboard data:', dashboardData); // Debug için
      console.log('Nutrition summary:', dashboardData?.nutrition_summary); // Debug için
      
      if (dashboardData?.nutrition_summary) {
        setSummary({
          ...DEFAULT_SUMMARY,
          ...dashboardData.nutrition_summary,
        });
      }

      // Missing nutrients ayrı endpoint'ten al (opsiyonel)
      try {
        const missingData = await nutritionService.getMissingNutrients(childId);
        setMissingNutrients(Array.isArray(missingData) ? missingData : []);
      } catch {
        // Missing nutrients opsiyonel, hata olursa boş array
        setMissingNutrients([]);
      }
    } catch (err) {
      console.error('useNutritionSummary error:', err);
      setError(err instanceof Error ? err : new Error('Beslenme verileri alınamadı'));
      setSummary(DEFAULT_SUMMARY);
      setMissingNutrients([]);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    summary,
    missingNutrients,
    isLoading,
    error,
    refetch: fetchData,
  };
}

/**
 * Beslenme çeşitlilik analizi için hook
 */
export function useVarietyAnalysis(childId: string | undefined, days?: number) {
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!childId) {
      setAnalysis(null);
      return;
    }
    
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await nutritionService.getVarietyAnalysis(childId, days);
        setAnalysis(data);
      } catch (err) {
        console.error('Failed to fetch variety analysis:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch variety analysis');
        setAnalysis(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [childId, days]);
  
  return { analysis, isLoading, error };
}
