'use client';

import { useState, useEffect, useCallback } from 'react';
import { recommendationService, DashboardRecommendationsResponse } from '@/services/recommendation-service';
import { Recipe } from '@/lib/types';

const DEFAULT_DATA: DashboardRecommendationsResponse = {
  today: [],
  weekly_plan_status: null,
  nutrition_summary: null,
  alerts: [],
};

export function useDashboardRecommendations(childId: string | undefined) {
  const [data, setData] = useState<DashboardRecommendationsResponse>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!childId) {
      setData(DEFAULT_DATA);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await recommendationService.getDashboardRecommendations(childId);
      setData(response);
    } catch (err) {
      console.error('useDashboardRecommendations error:', err);
      setError(err instanceof Error ? err : new Error('Dashboard verileri alınamadı'));
      setData(DEFAULT_DATA);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // today array'i döndür - bu dashboard önerileri
    recommendations: data.today,
    weeklyPlanStatus: data.weekly_plan_status,
    nutritionSummary: data.nutrition_summary,
    alerts: data.alerts,
    isLoading,
    error,
    refetch: fetchData,
  };
}
