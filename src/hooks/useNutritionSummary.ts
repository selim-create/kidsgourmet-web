'use client';

import { useState, useEffect, useCallback } from 'react';
import { nutritionService, WeeklyNutritionSummary, MissingNutrient, VarietyAnalysis } from '@/services/nutrition-service';

// Default safe values
const DEFAULT_SUMMARY: WeeklyNutritionSummary = {
  protein_servings: 0,
  vegetable_servings: 0,
  fruit_servings: 0,
  grains_servings: 0,
  dairy_servings: 0,
  iron_rich_count: 0,
  variety_score: 0,
  week_start: '',
  week_end: '',
};

/**
 * Haftalık beslenme özeti için hook
 */
export function useNutritionSummary(childId: string | undefined, weekStart?: string) {
  const [summary, setSummary] = useState<WeeklyNutritionSummary | null>(null);
  const [missingNutrients, setMissingNutrients] = useState<MissingNutrient[]>([]); // CRITICAL: Always array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    if (!childId) {
      setSummary(null);
      setMissingNutrients([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Parallel API calls with settled promises
      const [summaryResponse, missingResponse] = await Promise.allSettled([
        nutritionService.getWeeklySummary(childId, weekStart),
        nutritionService.getMissingNutrients(childId)
      ]);
      
      // Handle summary
      if (summaryResponse.status === 'fulfilled' && summaryResponse.value) {
        setSummary(summaryResponse.value);
      } else {
        setSummary(null);
      }
      
      // Handle missing nutrients - CRITICAL: Always ensure array
      if (missingResponse.status === 'fulfilled') {
        const data = missingResponse.value as any;
        // Handle different response structures
        const nutrients = Array.isArray(data) 
          ? data 
          : Array.isArray(data?.missing_nutrients) 
            ? data.missing_nutrients 
            : Array.isArray(data?.data) 
              ? data.data 
              : [];
        setMissingNutrients(nutrients);
      } else {
        setMissingNutrients([]);
      }
    } catch (err) {
      console.error('Failed to fetch nutrition data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch nutrition data');
      setSummary(null);
      setMissingNutrients([]); // CRITICAL: Always array on error
    } finally {
      setIsLoading(false);
    }
  }, [childId, weekStart]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { summary, missingNutrients, isLoading, error, refetch: fetchData };
}

/**
 * Beslenme çeşitlilik analizi için hook
 */
export function useVarietyAnalysis(childId: string | undefined, days?: number) {
  const [analysis, setAnalysis] = useState<VarietyAnalysis | null>(null);
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
