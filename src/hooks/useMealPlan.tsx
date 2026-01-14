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

  // Hafta bazlı plan yükle
  const loadPlanForWeek = useCallback(async (weekStart: string) => {
    if (!activeChild?.id) {
      setIsLoading(false);
      setPlan(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Hafta bilgisi ile plan getir
      const activePlan = await mealPlanService.getPlanForWeek(activeChild.id, weekStart);
      setPlan(activePlan);
    } catch (err: any) {
      console.error('Plan yüklenemedi:', err);
      // 404 = O hafta için plan yok - hata değil
      if (!err?.message?.includes('404') && !err?.message?.includes('No active plan')) {
        setError('Plan yüklenirken bir hata oluştu');
      }
      setPlan(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeChild?.id]);

  // currentWeekStart veya activeChild değiştiğinde planı yükle
  useEffect(() => {
    loadPlanForWeek(currentWeekStart);
  }, [currentWeekStart, activeChild?.id, loadPlanForWeek]);

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

      // Response validation - plan can be directly in response or in response.plan
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
      // Reload entire plan after slot is updated
      await loadPlanForWeek(currentWeekStart);
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
      // Reload entire plan after slot is skipped
      await loadPlanForWeek(currentWeekStart);
      toast.success('Öğün işaretlendi');
    } catch (err) {
      console.error('Slot skip hatası:', err);
      toast.error('İşlem başarısız');
    }
  };

  // Hafta değiştir - İLERİ
  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    const nextWeekStart = next.toISOString().split('T')[0];
    
    // Önce plan'ı temizle (yeni hafta yüklenirken)
    setPlan(null);
    setCurrentWeekStart(nextWeekStart);
  };

  // Hafta değiştir - GERİ
  const goToPreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    const prevWeekStart = prev.toISOString().split('T')[0];
    
    // Önce plan'ı temizle
    setPlan(null);
    setCurrentWeekStart(prevWeekStart);
  };

  // Hafta tarihi formatla
  const formatWeekRange = useCallback(() => {
    const start = new Date(currentWeekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleDateString('tr-TR', { month: 'short' });
    const endMonth = end.toLocaleDateString('tr-TR', { month: 'long' });
    
    // Aynı ay içindeyse sadece bitiş ayını göster
    if (start.getMonth() === end.getMonth()) {
      return `${startDay} - ${endDay} ${endMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  }, [currentWeekStart]);

  // Bu hafta mı kontrol et
  const isCurrentWeek = useCallback(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const thisMondayStr = thisMonday.toISOString().split('T')[0];
    
    return currentWeekStart === thisMondayStr;
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
    setPlan, // El ile güncelleme için
    isLoading,
    isGenerating,
    error,
    currentWeekStart,
    weekRange: formatWeekRange(),
    isCurrentWeek: isCurrentWeek(),
    stats,
    generatePlan,
    refreshSlot,
    skipSlot,
    goToNextWeek,
    goToPreviousWeek,
    reload: () => loadPlanForWeek(currentWeekStart),
  };
}
