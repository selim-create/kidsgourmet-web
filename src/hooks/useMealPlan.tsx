'use client';

import { useState, useEffect, useCallback } from 'react';
import { useActiveChild } from '@/contexts/ActiveChildContext';
import { mealPlanService } from '@/services/meal-plan-service';
import { MealPlan, SkipReason } from '@/lib/types';
import { toast } from 'sonner';

export function useMealPlan() {
  const { activeChild } = useActiveChild();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Haftanın Pazartesi gününü hesapla
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return monday.toISOString().split('T')[0];
  });

  // Aktif planı yükle
  const loadActivePlan = useCallback(async () => {
    if (!activeChild?.id) {
      setIsLoading(false);
      setPlan(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const activePlan = await mealPlanService.getActivePlan(activeChild.id);
      // Plan null olabilir - bu hata değil, henüz plan oluşturulmamış demek
      setPlan(activePlan);
    } catch (err: any) {
      console.error('Plan yüklenemedi:', err);
      // Sadece gerçek hatalarda error state'i set et
      if (!err?.message?.includes('404') && !err?.message?.includes('No active plan')) {
        setError('Plan yüklenirken bir hata oluştu');
      }
      setPlan(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeChild?.id]);

  useEffect(() => {
    loadActivePlan();
  }, [loadActivePlan, currentWeekStart]);

  // AI ile plan oluştur
  const generatePlan = async () => {
    if (!activeChild?.id) {
      toast.error('Lütfen önce bir çocuk profili seçin');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await mealPlanService.generatePlan({
        child_id: activeChild.id,
        week_start: currentWeekStart,
      });

      console.log('Generate plan response:', response); // Debug için

      // Response kontrolü - plan doğrudan response'ta veya response.plan'da olabilir
      const newPlan = response?.plan || response;
      
      if (newPlan && newPlan.id && newPlan.days) {
        setPlan(newPlan);
        toast.success('Haftalık plan başarıyla oluşturuldu! 🎉');
      } else {
        console.error('Invalid plan response:', response);
        toast.error('Plan oluşturuldu ancak format hatalı');
      }
    } catch (err: any) {
      console.error('Plan oluşturma hatası:', err);
      toast.error(err?.message || 'Plan oluşturulurken bir hata oluştu');
    } finally {
      setIsGenerating(false);
    }
  };

  // Slot'taki tarifi yenile
  const refreshSlot = async (slotId: string) => {
    if (!plan?.id) return;

    try {
      await mealPlanService.refreshSlot(plan.id, slotId);
      // Slot güncellendiğinde tüm planı yeniden yükle
      await loadActivePlan();
      toast.success('Alternatif tarif getirildi');
    } catch (err) {
      console.error('Slot refresh hatası:', err);
      toast.error('Tarif değiştirilemedi');
    }
  };

  // Slot'u atla
  const skipSlot = async (slotId: string, reason: SkipReason) => {
    if (!plan?.id) return;

    try {
      await mealPlanService.skipSlot(plan.id, slotId, reason);
      // Plan'ı yeniden yükle
      await loadActivePlan();
      toast.success('Öğün işaretlendi');
    } catch (err) {
      console.error('Slot skip hatası:', err);
      toast.error('İşlem başarısız');
    }
  };

  // Hafta değiştir
  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next.toISOString().split('T')[0]);
  };

  const goToPreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev.toISOString().split('T')[0]);
  };

  // Hafta tarihi formatla
  const formatWeekRange = useCallback(() => {
    const start = new Date(currentWeekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const startDay = start.getDate();
    const endDay = end.getDate();
    const endMonth = end.toLocaleDateString('tr-TR', { month: 'long' });
    
    return `${startDay} - ${endDay} ${endMonth}`;
  }, [currentWeekStart]);

  // İstatistikleri hesapla
  const stats = plan?.nutrition_summary || {
    total_meals: 0,
    vegetables_servings: 0,
    protein_servings: 0,
    grains_servings: 0,
    fruits_servings: 0,
    new_allergens_introduced: [],
  };

  return {
    plan,
    isLoading,
    isGenerating,
    error,
    currentWeekStart,
    weekRange: formatWeekRange(),
    stats,
    generatePlan,
    refreshSlot,
    skipSlot,
    goToNextWeek,
    goToPreviousWeek,
    reload: loadActivePlan,
  };
}
