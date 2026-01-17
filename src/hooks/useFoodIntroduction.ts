'use client';

import { useState, useEffect } from 'react';
import { foodIntroductionService, SuggestedFood, NextFoodSuggestion } from '@/services/food-introduction-service';

/**
 * Önerilen besinler için hook
 */
export function useSuggestedFoods(childId: string | undefined) {
  const [suggestedFoods, setSuggestedFoods] = useState<SuggestedFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!childId) {
      setSuggestedFoods([]);
      return;
    }
    
    const fetchSuggestedFoods = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await foodIntroductionService.getSuggestedFoods(childId);
        setSuggestedFoods(data);
      } catch (err) {
        console.error('Failed to fetch suggested foods:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch suggested foods');
        setSuggestedFoods([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestedFoods();
  }, [childId]);
  
  return { suggestedFoods, isLoading, error };
}

/**
 * Sonraki besin önerisi için hook
 */
export function useFoodIntroduction(childId: string | undefined) {
  const [nextSuggestion, setNextSuggestion] = useState<NextFoodSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!childId) {
      setNextSuggestion(null);
      return;
    }
    
    const fetchNextSuggestion = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await foodIntroductionService.getNextSuggestion(childId);
        setNextSuggestion(data);
      } catch (err) {
        console.error('Failed to fetch next food suggestion:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch suggestion');
        setNextSuggestion(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNextSuggestion();
  }, [childId]);
  
  return { nextSuggestion, isLoading, error };
}
