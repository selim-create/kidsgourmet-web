'use client';

import { useState, useEffect } from 'react';
import { nutritionService, WeeklyNutritionSummary, MissingNutrient, VarietyAnalysis } from '@/services/nutrition-service';

/**
 * Haftalık beslenme özeti için hook
 */
export function useNutritionSummary(childId: string | undefined, weekStart?: string) {
  const [summary, setSummary] = useState<WeeklyNutritionSummary | null>(null);
  const [missingNutrients, setMissingNutrients] = useState<MissingNutrient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!childId) {
      setSummary(null);
      setMissingNutrients([]);
      return;
    }
    
    const fetchNutritionData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [summaryData, missingData] = await Promise.all([
          nutritionService.getWeeklySummary(childId, weekStart),
          nutritionService.getMissingNutrients(childId)
        ]);
        
        setSummary(summaryData);
        setMissingNutrients(missingData);
      } catch (err) {
        console.error('Failed to fetch nutrition data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch nutrition data');
        setSummary(null);
        setMissingNutrients([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNutritionData();
  }, [childId, weekStart]);
  
  return { summary, missingNutrients, isLoading, error };
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
