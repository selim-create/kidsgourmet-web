'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { safetyService, SafetyCheckResult, BatchSafetyResult } from '@/services/safety-service';

/**
 * Tarif güvenlik kontrolü için hook
 */
export function useSafetyCheck(recipeId: number | undefined, childId: string | undefined) {
  const [safetyResult, setSafetyResult] = useState<SafetyCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const checkSafety = useCallback(async () => {
    if (!recipeId || !childId) {
      setSafetyResult(null);
      return;
    }
    
    setIsChecking(true);
    setError(null);
    
    try {
      const result = await safetyService.checkRecipeSafety(recipeId, childId);
      setSafetyResult(result);
    } catch (err) {
      console.error('Failed to check recipe safety:', err);
      setError(err instanceof Error ? err.message : 'Failed to check safety');
      setSafetyResult(null);
    } finally {
      setIsChecking(false);
    }
  }, [recipeId, childId]);
  
  useEffect(() => {
    checkSafety();
  }, [checkSafety]);
  
  const recheckSafety = () => {
    checkSafety();
  };
  
  return { safetyResult, isChecking, error, recheckSafety };
}

/**
 * Malzeme güvenlik kontrolü için hook
 */
export function useIngredientSafety(ingredientId: number | undefined, childId: string | undefined) {
  const [safetyResult, setSafetyResult] = useState<SafetyCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!ingredientId || !childId) {
      setSafetyResult(null);
      return;
    }
    
    const checkSafety = async () => {
      setIsChecking(true);
      setError(null);
      
      try {
        const result = await safetyService.checkIngredientSafety(ingredientId, childId);
        setSafetyResult(result);
      } catch (err) {
        console.error('Failed to check ingredient safety:', err);
        setError(err instanceof Error ? err.message : 'Failed to check safety');
        setSafetyResult(null);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkSafety();
  }, [ingredientId, childId]);
  
  return { safetyResult, isChecking, error };
}

/**
 * Toplu güvenlik kontrolü için hook
 */
export function useBatchSafety(recipeIds: number[], childId: string | undefined) {
  const [safetyResults, setSafetyResults] = useState<BatchSafetyResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Memoize the recipe IDs to avoid unnecessary re-renders
  const recipeIdsKey = useMemo(() => JSON.stringify(recipeIds), [recipeIds]);
  
  useEffect(() => {
    if (!childId || recipeIds.length === 0) {
      setSafetyResults(null);
      return;
    }
    
    const checkBatchSafety = async () => {
      setIsChecking(true);
      setError(null);
      
      try {
        const results = await safetyService.batchSafetyCheck(recipeIds, childId);
        setSafetyResults(results);
      } catch (err) {
        console.error('Failed to batch check safety:', err);
        setError(err instanceof Error ? err.message : 'Failed to check safety');
        setSafetyResults(null);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkBatchSafety();
  }, [recipeIdsKey, childId]);
  
  return { safetyResults, isChecking, error };
}
