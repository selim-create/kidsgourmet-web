'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { safetyService, SafetyCheckResult, BatchSafetyResult } from '@/services/safety-service';

const SAFE_RESULT: SafetyCheckResult = {
  is_safe: true,
  safety_score: 100,
  alerts: [],
  alternatives: [],
};

/**
 * Tarif güvenlik kontrolü için hook
 */
export function useSafetyCheck(recipeId: number | undefined, childId: string | undefined) {
  const [safetyResult, setSafetyResult] = useState<SafetyCheckResult>(SAFE_RESULT);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiError, setIsApiError] = useState(false); // YENİ: API hatası flag'i
  
  // CRITICAL: Prevent duplicate calls
  const checkedRef = useRef<string | null>(null);
  
  const checkSafety = useCallback(async () => {
    if (!recipeId || !childId) {
      setSafetyResult(SAFE_RESULT);
      setIsChecking(false);
      setIsApiError(false);
      return;
    }
    
    // Prevent duplicate calls
    const cacheKey = `${recipeId}-${childId}`;
    if (checkedRef.current === cacheKey) {
      return;
    }
    
    setIsChecking(true);
    setError(null);
    setIsApiError(false);
    checkedRef.current = cacheKey;
    
    try {
      const result = await safetyService.checkRecipeSafety(recipeId, childId);
      
      // API'den gerçek sonuç geldi mi kontrol et
      if (result && typeof result.is_safe === 'boolean') {
        setSafetyResult(result);
        setIsApiError(false);
      } else {
        // API çalıştı ama geçersiz response
        setIsApiError(true);
        setSafetyResult(SAFE_RESULT);
      }
    } catch (err) {
      console.error('Failed to check recipe safety:', err);
      setError(err instanceof Error ? err.message : 'Failed to check safety');
      setIsApiError(true); // API hatası olduğunu işaretle
      setSafetyResult(SAFE_RESULT);
    } finally {
      setIsChecking(false);
    }
  }, [recipeId, childId]);
  
  useEffect(() => {
    checkSafety();
  }, [checkSafety]);
  
  const recheckSafety = () => {
    checkedRef.current = null; // Clear cache
    checkSafety();
  };
  
  return { safetyResult, isChecking, error, isApiError, recheckSafety };
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
        setSafetyResult(result || { is_safe: true, safety_score: 100, alerts: [] });
      } catch (err) {
        console.error('Failed to check ingredient safety:', err);
        setError(err instanceof Error ? err.message : 'Failed to check safety');
        setSafetyResult({ is_safe: true, safety_score: 100, alerts: [] });
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
        setSafetyResults(results || {});
      } catch (err) {
        console.error('Failed to batch check safety:', err);
        setError(err instanceof Error ? err.message : 'Failed to check safety');
        setSafetyResults({});
      } finally {
        setIsChecking(false);
      }
    };
    
    checkBatchSafety();
  }, [recipeIdsKey, childId]);
  
  return { safetyResults, isChecking, error };
}
