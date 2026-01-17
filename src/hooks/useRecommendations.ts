'use client';

import { useState, useEffect } from 'react';
import { recommendationService, DashboardRecommendations, PersonalizedRecipe, PersonalizedRecipesOptions } from '@/services/recommendation-service';
import { RecipeCard } from '@/lib/types';

/**
 * Dashboard önerileri için hook
 */
export function useDashboardRecommendations(childId: string | undefined) {
  const [recommendations, setRecommendations] = useState<DashboardRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!childId) {
      setRecommendations(null);
      return;
    }
    
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await recommendationService.getDashboardRecommendations(childId);
        setRecommendations(data);
      } catch (err) {
        console.error('Failed to fetch dashboard recommendations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
        setRecommendations(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [childId]);
  
  return { recommendations, isLoading, error };
}

/**
 * Kişiselleştirilmiş tarifler için hook
 */
export function useRecommendations(childId: string | undefined, options?: PersonalizedRecipesOptions) {
  const [recommendations, setRecommendations] = useState<PersonalizedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!childId) {
      setRecommendations([]);
      return;
    }
    
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await recommendationService.getPersonalizedRecipes(childId, options);
        setRecommendations(data);
      } catch (err) {
        console.error('Failed to fetch personalized recipes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [childId, options?.limit, options?.meal_type, options?.include_scores]);
  
  return { recommendations, isLoading, error };
}

/**
 * Benzer güvenli tarifler için hook
 */
export function useSimilarSafeRecipes(recipeId: number | undefined, childId: string | undefined) {
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!recipeId || !childId) {
      setRecipes([]);
      return;
    }
    
    const fetchSimilarRecipes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await recommendationService.getSimilarSafeRecipes(recipeId, childId);
        setRecipes(data);
      } catch (err) {
        console.error('Failed to fetch similar safe recipes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch similar recipes');
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSimilarRecipes();
  }, [recipeId, childId]);
  
  return { recipes, isLoading, error };
}
