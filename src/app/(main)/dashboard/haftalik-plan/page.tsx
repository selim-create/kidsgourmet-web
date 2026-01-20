"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useUser } from '@/hooks/use-user';
import { useActiveChild } from '@/contexts/ActiveChildContext';
import { useMealPlan } from '@/hooks/useMealPlan';
import { useFavorites } from '@/hooks/use-favorites';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { MealSlot, MealSlotType, Recipe } from '@/lib/types';
import { mealPlanService } from '@/services/meal-plan-service';
import { recipeService } from '@/services/recipe-service';
import { toast } from 'sonner';
import PersonalizedRecipePool from '@/components/features/recommendations/PersonalizedRecipePool';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import StatCard from '@/components/features/meal-plan/StatCard';
import MealSlotCard from '@/components/features/meal-plan/MealSlotCard';
import MealRowCard from '@/components/features/meal-plan/MealRowCard';
import RecipeSuggestionCard from '@/components/features/meal-plan/RecipeSuggestionCard';

// Constants
const SEARCH_DEBOUNCE_MS = 300;
const PLACEHOLDER_RECIPE_IMAGE = 'https://placehold.co/60x60/FFF3E0/FF8A65?text=T';
const MOBILE_BREAKPOINT = 768; // Tailwind's md breakpoint
const DESKTOP_SIDEBAR_BREAKPOINT = 1280; // Tailwind's xl breakpoint

// Lightweight recipe type for sidebar cards
interface RecipeCardLite {
  id: number;
  title: string;
  image?: string;
  prep_time?: string;
}

// Slot renkleri
const SLOT_COLORS: Record<MealSlotType, { bg: string; text: string; label: string }> = {
  breakfast: { bg: 'bg-yellow-50', text: 'text-yellow-600', label: 'bg-yellow-100' },
  lunch: { bg: 'bg-green-50', text: 'text-green-600', label: 'bg-green-100' },
  dinner: { bg: 'bg-orange-50', text: 'text-orange-600', label: 'bg-orange-100' },
  snack_morning: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'bg-purple-100' },
  snack_afternoon: { bg: 'bg-pink-50', text: 'text-pink-600', label: 'bg-pink-100' },
};

export default function WeeklyPlanPage() {
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const { activeChild, children: userChildren, setActiveChild } = useActiveChild();
  const { 
    plan, 
    isLoading, 
    isGenerating, 
    weekRange, 
    isCurrentWeek,
    stats,
    generatePlan, 
    refreshSlot, 
    skipSlot,
    goToNextWeek,
    goToPreviousWeek,
    reload: reloadPlan
  } = useMealPlan();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const { refreshList } = useShoppingList();

  const [isCreatingShoppingList, setIsCreatingShoppingList] = useState(false);
  
  // View mode state - default to weekly, will be set to daily on mobile after mount
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  
  // Yeni state'ler
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);
  const [isMobileRecipePoolOpen, setIsMobileRecipePoolOpen] = useState(false);

  // Set default view mode based on screen size after mount
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      // Clear any pending timeout
      clearTimeout(timeoutId);
      
      // Debounce the state update to avoid rapid changes
      timeoutId = setTimeout(() => {
        const newViewMode = window.innerWidth < MOBILE_BREAKPOINT ? 'daily' : 'weekly';
        setViewMode(newViewMode);
      }, 150);
    };
    
    // Set initial view mode
    const initialViewMode = window.innerWidth < MOBILE_BREAKPOINT ? 'daily' : 'weekly';
    setViewMode(initialViewMode);
    
    // Listen to resize events
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Alışveriş listesi oluştur
  const handleCreateShoppingList = async () => {
    if (!plan?.id) {
      toast.error('Önce bir plan oluşturmanız gerekiyor');
      return;
    }

    setIsCreatingShoppingList(true);
    try {
      const response = await mealPlanService.generateShoppingList(plan.id);
      if (response.success) {
        // Backend listeyi kaydetti, şimdi frontend'i yenile
        await refreshList();
        toast.success(`${response.total_count} ürün alışveriş listesine eklendi! 🛒`);
        // Yönlendirme yap
        window.location.href = '/alisveris-listesi';
      }
    } catch (error) {
      console.error('Liste oluşturma hatası:', error);
      toast.error('Liste oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsCreatingShoppingList(false);
    }
  };

  // Tarif arama
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await recipeService.search(query, { per_page: 10 });
      setSearchResults(results);
    } catch (error) {
      console.error('Arama hatası:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, SEARCH_DEBOUNCE_MS);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Open mobile sheet when slot is selected on mobile
  useEffect(() => {
    if (selectedSlotId) {
      // Use matchMedia for better SSR compatibility
      const isMobile = window.matchMedia(`(max-width: ${DESKTOP_SIDEBAR_BREAKPOINT - 1}px)`).matches;
      if (isMobile) {
        setIsMobileRecipePoolOpen(true);
      }
    }
  }, [selectedSlotId]);

  // Slot'a tarif ekle
  const handleAddRecipeToSlot = async (slotId: string, recipeId: number) => {
    if (!plan?.id) return;
    
    try {
      // API çağrısı ile slot'u güncelle
      await mealPlanService.assignRecipeToSlot(plan.id, slotId, recipeId);
      await reloadPlan();
      setSelectedSlotId(null);
      setIsMobileRecipePoolOpen(false);
      toast.success('Tarif eklendi!');
    } catch (error) {
      console.error('Tarif eklenemedi:', error);
      toast.error('Tarif eklenirken hata oluştu');
    }
  };



  // Auth check
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <section className="py-16 px-4 text-center max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-calendar text-orange-500 text-4xl"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Bebeğiniz İçin Kişiselleştirilmiş Haftalık Beslenme Planı
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Çocuğunuzun yaşına, alerjenlerine ve beslenme ihtiyaçlarına özel 
            haftalık menü planı oluşturun. Yapay zeka destekli öneri sistemi ile 
            sağlıklı beslenme hiç bu kadar kolay olmamıştır.
          </p>
          
          {/* Özellikler */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-wand-magic-sparkles text-purple-500 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">AI Destekli Planlama</h3>
              <p className="text-sm text-gray-600">Çocuğunuzun profiline özel tarifler ve beslenme önerileri</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-shield-heart text-green-500 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Alerjen Kontrolü</h3>
              <p className="text-sm text-gray-600">Çocuğunuzun alerjilerine uygun güvenli yiyecek önerileri</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-chart-pie text-orange-500 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Beslenme Takibi</h3>
              <p className="text-sm text-gray-600">Haftalık sebze, protein ve tahıl tüketimi analizi</p>
            </div>
          </div>

          {/* Nasıl Çalışır */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Nasıl Çalışır?</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                <p className="text-sm text-gray-600">Çocuk profili oluşturun</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                <p className="text-sm text-gray-600">Alerjenleri belirleyin</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                <p className="text-sm text-gray-600">AI plan oluştursun</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                <p className="text-sm text-gray-600">Alışveriş listesi alın</p>
              </div>
            </div>
          </div>

          {/* CTA Butonlar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
            >
              <i className="fa-solid fa-user-plus mr-2"></i>
              Ücretsiz Hesap Oluştur
            </Link>
            <Link 
              href="/login" 
              className="bg-white border-2 border-gray-200 text-slate-800 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              <i className="fa-solid fa-right-to-bracket mr-2"></i>
              Giriş Yap
            </Link>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Sıkça Sorulan Sorular</h2>
            <div className="space-y-4">
              <details className="bg-white rounded-xl p-4 shadow-sm">
                <summary className="font-bold text-slate-800 cursor-pointer">Haftalık plan nasıl oluşturulur?</summary>
                <p className="mt-3 text-gray-600">Çocuğunuzun yaşını ve alerjenlerini girdiğinizde, yapay zeka sizin için yaşa uygun ve güvenli tariflerden oluşan bir haftalık menü hazırlar.</p>
              </details>
              <details className="bg-white rounded-xl p-4 shadow-sm">
                <summary className="font-bold text-slate-800 cursor-pointer">Alerjen kontrolü nasıl yapılıyor?</summary>
                <p className="mt-3 text-gray-600">Sisteme girdiğiniz alerjenler otomatik olarak filtrelenir ve çocuğunuza zararlı olabilecek malzemeler içeren tarifler önerilmez.</p>
              </details>
              <details className="bg-white rounded-xl p-4 shadow-sm">
                <summary className="font-bold text-slate-800 cursor-pointer">Planı değiştirebilir miyim?</summary>
                <p className="mt-3 text-gray-600">Evet, dilediğiniz öğünü değiştirebilir, farklı tarif seçebilir veya 'dışarıda yiyoruz' olarak işaretleyebilirsiniz.</p>
              </details>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fa-solid fa-baby text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Çocuk Profili Bulunamadı</h2>
          <p className="text-gray-600 mb-4">Haftalık plan oluşturmak için önce bir çocuk profili ekleyin</p>
          <Link href="/profil" className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold">
            Profil Ekle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative bg-[#FDFBF7]">

        {/* DESKTOP SIDEBAR */}
        <DashboardSidebar activePage="haftalik-plan" />

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-stone-100 flex-shrink-0">
                <span className="font-display font-bold text-lg text-slate-800">Haftalık Plan</span>
                <div className="flex gap-2">
                    <button className="text-stone-500 text-xl"><i className="fa-solid fa-print"></i></button>
                    <button className="text-orange-500 text-xl"><i className="fa-solid fa-share-nodes"></i></button>
                </div>
            </div>

            {/* PLAN HEADER & CONTROLS */}
            <header className="h-20 bg-white border-b border-stone-100 flex items-center justify-between px-6 flex-shrink-0 z-20">
                <div className="max-w-full mx-auto w-full flex items-center justify-between">
                    
                        {/* Left: Child Switcher & Date Nav */}
                        <div className="flex items-center gap-6">
                            {/* Child Dropdown */}
                            {userChildren.length > 0 && (
                              <div className="relative">
                                <button 
                                  onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                                  className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-full text-sm font-bold text-stone-800 transition-colors"
                                >
                                  <span>{activeChild.name}</span>
                                  <i className={`fa-solid fa-chevron-down text-sm transition-transform ${isChildDropdownOpen ? 'rotate-180' : ''}`}></i>
                                </button>
                                
                                {isChildDropdownOpen && userChildren.length > 1 && (
                                  <>
                                    {/* Backdrop for closing */}
                                    <div 
                                      className="fixed inset-0 z-40" 
                                      onClick={() => setIsChildDropdownOpen(false)} 
                                    />
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 z-50 p-1">
                                      {userChildren.map(child => (
                                        <button 
                                          key={child.id} 
                                          onClick={() => {
                                            setActiveChild(child);
                                            setIsChildDropdownOpen(false);
                                          }}
                                          className={`w-full text-left flex items-center gap-2 p-2 hover:bg-stone-50 rounded-lg ${
                                            activeChild?.id === child.id ? 'bg-orange-50 text-orange-600' : ''
                                          }`}
                                        >
                                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                                            {child.name.charAt(0).toUpperCase()}
                                          </div>
                                          <span className="text-sm font-medium text-slate-700">{child.name}</span>
                                          {activeChild?.id === child.id && (
                                            <i className="fa-solid fa-check text-orange-500 ml-auto text-xs"></i>
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                            {/* Date Navigator - Rounded pill style */}
                            <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-full px-2 py-1">
                              <button 
                                onClick={goToPreviousWeek}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-50 text-stone-400 hover:text-orange-500 transition-colors"
                                title="Önceki hafta"
                              >
                                <i className="fa-solid fa-chevron-left"></i>
                              </button>
                              <div className="flex flex-col items-center px-2 w-40">
                                <span className="text-sm font-bold text-stone-800">{weekRange}</span>
                                {isCurrentWeek && (
                                  <span className="text-[9px] text-orange-500 font-medium">Bu Hafta</span>
                                )}
                              </div>
                              <button 
                                onClick={goToNextWeek}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-50 text-stone-400 hover:text-orange-500 transition-colors"
                                title="Sonraki hafta"
                              >
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>
                        </div>

                        {/* Right: View Toggle & Actions */}
                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            <div className="flex bg-stone-100 rounded-lg p-1">
                              <button 
                                onClick={() => setViewMode('daily')}
                                className={`w-9 h-9 rounded-md transition-all flex items-center justify-center ${
                                  viewMode === 'daily' ? 'bg-white shadow text-orange-600' : 'text-stone-400 hover:text-stone-600'
                                }`}
                              >
                                <i className="fa-solid fa-list text-lg"></i>
                              </button>
                              <button 
                                onClick={() => setViewMode('weekly')}
                                className={`w-9 h-9 rounded-md transition-all flex items-center justify-center ${
                                  viewMode === 'weekly' ? 'bg-white shadow text-orange-600' : 'text-stone-400 hover:text-stone-600'
                                }`}
                              >
                                <i className="fa-solid fa-border-all text-lg"></i>
                              </button>
                            </div>
                            
                            <div className="h-8 w-px bg-stone-200 mx-1"></div>

                            <button 
                              onClick={handleCreateShoppingList}
                              disabled={!plan || isCreatingShoppingList}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreatingShoppingList ? (
                                  <><i className="fa-solid fa-spinner fa-spin text-lg"></i> Oluşturuluyor...</>
                                ) : (
                                  <><i className="fa-solid fa-basket-shopping text-lg"></i> Liste Oluştur</>
                                )}
                            </button>
                        </div>
                    
                </div>
            </header>

            {/* Stats Bar */}
            <div className="bg-white border-b border-stone-100 p-4 flex-shrink-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        <StatCard 
                          icon={<i className="fa-solid fa-carrot"></i>}
                          label="Sebze"
                          value={`${stats.vegetables_servings} Porsiyon`}
                          color="green"
                        />
                        <StatCard 
                          icon={<i className="fa-solid fa-drumstick-bite"></i>}
                          label="Protein"
                          value={`${stats.protein_servings} Porsiyon`}
                          color="orange"
                        />
                        <StatCard 
                          icon={<i className="fa-solid fa-wheat-awn"></i>}
                          label="Tahıl"
                          value={`${stats.grains_servings} Porsiyon`}
                          color="yellow"
                        />
                        <StatCard 
                          icon={<i className="fa-solid fa-triangle-exclamation"></i>}
                          label="Alerjen"
                          value={`${stats.new_allergens_introduced?.length || 0} Yeni`}
                          color="orange"
                        />
                    </div>
            </div>

            {/* MAIN GRID - Updated flex structure */}
            <div className="flex flex-1 overflow-hidden">
              {/* WEEK GRID */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#FDFBF7]">
                <div className="max-w-6xl mx-auto pb-24">
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <i className="fa-solid fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
                          <p className="text-gray-600">Plan yükleniyor...</p>
                        </div>
                      </div>
                    ) : !plan ? (
                      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-sm">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-500 shadow-sm text-3xl">
                              <i className="fa-solid fa-wand-magic-sparkles"></i>
                          </div>
                          <div className="text-center">
                              <h3 className="font-bold text-slate-800 text-xl mb-2">Henüz bir plan yok</h3>
                              <p className="text-gray-600">Hip AI, {activeChild.name} için bu haftaya özel beslenme planı oluştursun mu?</p>
                          </div>
                          <button 
                            onClick={generatePlan}
                            disabled={isGenerating}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-colors disabled:opacity-50"
                          >
                              {isGenerating ? (
                                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Oluşturuluyor...</>
                              ) : (
                                <><i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Otomatik Plan Oluştur</>
                              )}
                          </button>
                      </div>
                    ) : (
                      <>
                        {/* Weekly View */}
                        {viewMode === 'weekly' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 min-h-[600px]">
                              {plan.days.map((day) => {
                                const isToday = new Date(day.date).toDateString() === new Date().toDateString();
                                return (
                                  <div key={day.date} className={`flex flex-col gap-3 ${isToday ? 'bg-orange-50/30 -m-2 p-2 rounded-2xl border border-orange-100/50' : ''}`}>
                                    <div className={`text-center p-3 rounded-2xl border-b-4 shadow-sm ${
                                      isToday 
                                        ? 'bg-orange-500 text-white border-orange-600' 
                                        : 'bg-white text-stone-800 border-stone-200'
                                    }`}>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                                        isToday ? 'text-orange-100' : 'text-stone-400'
                                      }`}>
                                        {day.day_name}
                                      </span>
                                      <span className="text-xl font-black">{new Date(day.date).getDate()}</span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      {day.slots.map((slot) => (
                                        <MealSlotCard 
                                          key={slot.id} 
                                          slot={slot}
                                          isSelected={selectedSlotId === slot.id}
                                          onClick={() => setSelectedSlotId(slot.id)}
                                          onRefresh={() => refreshSlot(slot.id)}
                                          onSkip={(reason) => skipSlot(slot.id, reason)}
                                          isCompact={true}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                        
                        {/* Daily View */}
                        {viewMode === 'daily' && (
                          <div className="space-y-6">
                            {plan.days.map((day) => (
                              <div key={day.date} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3">
                                  <div className="flex items-center justify-between text-white">
                                    <span className="font-bold">{day.day_name}</span>
                                    <span className="text-orange-100">{new Date(day.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                                  </div>
                                </div>
                                <div className="p-4 space-y-3">
                                     {day.slots.map((slot) => (
                                       <MealRowCard 
                                         key={slot.id} 
                                         slot={slot}
                                         isSelected={selectedSlotId === slot.id}
                                         onClick={() => setSelectedSlotId(slot.id)}
                                         onRefresh={() => refreshSlot(slot.id)}
                                         onSkip={(reason) => skipSlot(slot.id, reason)}
                                       />
                                     ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    
                </div>
              </div>
              
              {/* RECIPE POOL SIDEBAR - Desktop Only */}
              <aside className="hidden xl:flex w-96 bg-white border-l border-stone-100 flex-col overflow-hidden">
                <div className="h-16 flex items-center justify-between px-6 border-b border-stone-100">
                  <h3 className="font-bold text-stone-800 flex items-center gap-2">
                    <i className="fa-solid fa-wand-magic-sparkles text-orange-500 text-lg"></i> 
                    Sizin İçin Seçtiklerimiz
                  </h3>
                </div>
                
                {/* Search */}
                <div className="p-4 border-b border-stone-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tarif, besin veya etiket ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-stone-400 text-lg"></i>
                    {isSearching && (
                      <i className="fa-solid fa-spinner fa-spin absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 text-sm"></i>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  
                  {selectedSlotId ? (
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-4">
                      <p className="text-sm text-orange-800 font-bold flex items-center gap-2 mb-1">
                        <i className="fa-solid fa-wand-magic-sparkles"></i> Öğün Seçildi
                      </p>
                      <p className="text-xs text-orange-600">Aşağıdaki listeden bir tarif seçerek plana ekle.</p>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 text-center italic bg-stone-50 p-2 rounded-lg border border-stone-100">
                      Önce takvimden bir öğün seçin, ardından buradan tarif ekleyin.
                    </p>
                  )}
                  
                  {/* Arama Sonuçları */}
                  {searchQuery && (
                    <div>
                      <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-search"></i> Arama Sonuçları
                      </h4>
                      {isSearching ? (
                        <div className="text-center py-4">
                          <i className="fa-solid fa-spinner fa-spin text-orange-500"></i>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map(recipe => (
                            <RecipeSuggestionCard 
                              key={recipe.id} 
                              recipe={recipe}
                              onClick={() => selectedSlotId && handleAddRecipeToSlot(selectedSlotId, recipe.id)}
                              isSelectable={!!selectedSlotId}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 text-center py-4">Sonuç bulunamadı</p>
                      )}
                    </div>
                  )}
                  
                  {/* Favorilerim */}
                  {!searchQuery && (
                    <>
                      {/* Personalized Recommendations */}
                      {activeChild && (
                        <div className="mb-6">
                          <PersonalizedRecipePool 
                            childId={activeChild.id} 
                            limit={8}
                            isSelectable={!!selectedSlotId}
                            onSelectRecipe={(recipeId) => selectedSlotId && handleAddRecipeToSlot(selectedSlotId, recipeId)}
                          />
                        </div>
                      )}
                      
                      {/* Favorites Section */}
                      <div className="pt-4 border-t border-stone-100">
                        <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <i className="fa-solid fa-heart text-red-500 text-sm"></i> Favori Tarifler
                        </h4>
                        {favoritesLoading ? (
                          <div className="text-center py-4">
                            <i className="fa-solid fa-spinner fa-spin text-orange-500"></i>
                          </div>
                        ) : favorites?.recipes && favorites.recipes.length > 0 ? (
                          <div className="space-y-2">
                            {favorites.recipes.slice(0, 5).map(recipe => (
                              <RecipeSuggestionCard 
                                key={recipe.id} 
                                recipe={recipe}
                                onClick={() => selectedSlotId && handleAddRecipeToSlot(selectedSlotId, recipe.id)}
                                isSelectable={!!selectedSlotId}
                              />
                            ))}
                            {favorites.recipes.length > 5 && (
                              <Link 
                                href="/favoriler" 
                                className="block text-center text-xs text-orange-500 hover:underline py-2"
                              >
                                Tümünü gör ({favorites.recipes.length})
                              </Link>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-stone-400">
                            <i className="fa-regular fa-heart text-2xl mb-2 block"></i>
                            <p className="text-xs">Henüz favori tarifiniz yok</p>
                            <Link href="/tarifler" className="text-xs text-orange-500 hover:underline mt-1 inline-block">
                              Tariflere göz at
                            </Link>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                </div>
              </aside>
            </div>

        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link href="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-house text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Panelim</span>
            </Link>
            <Link href="/dashboard/haftalik-plan" className="flex flex-col items-center text-orange-500">
                <i className="fa-solid fa-calendar-days text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Plan</span>
            </Link>
            <div className="relative -top-8">
                <Link href="/alisveris-listesi" className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
                    <i className="fa-solid fa-basket-shopping text-xl"></i>
                </Link>
            </div>
            <Link href="/favoriler" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-heart text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Favoriler</span>
            </Link>
            <Link href="/profil" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-user text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Profil</span>
            </Link>
        </div>

        {/* MOBILE BOTTOM SHEET - Recipe Pool */}
        {isMobileRecipePoolOpen && (
          <div className="xl:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => {
                setIsMobileRecipePoolOpen(false);
                setSelectedSlotId(null);
              }}
            />
            {/* Sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-stone-100 p-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-orange-500"></i>
                  Tarif Seç
                </h3>
                <button 
                  onClick={() => {
                    setIsMobileRecipePoolOpen(false);
                    setSelectedSlotId(null);
                  }}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-stone-500"></i>
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-4 max-h-[calc(80vh-60px)]">
                {/* Arama */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tarif, besin veya etiket ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-stone-400 text-lg"></i>
                </div>
                
                {/* Arama Sonuçları */}
                {searchQuery && (
                  <div>
                    <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3">Arama Sonuçları</h4>
                    {isSearching ? (
                      <div className="text-center py-4">
                        <i className="fa-solid fa-spinner fa-spin text-orange-500"></i>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map(recipe => (
                          <RecipeSuggestionCard 
                            key={recipe.id} 
                            recipe={recipe}
                            onClick={() => {
                              if (selectedSlotId) {
                                handleAddRecipeToSlot(selectedSlotId, recipe.id);
                              }
                            }}
                            isSelectable={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 text-center py-4">Sonuç bulunamadı</p>
                    )}
                  </div>
                )}
                
                {/* Kişisel Öneriler */}
                {!searchQuery && activeChild && (
                  <div>
                    <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-wand-magic-sparkles text-orange-500"></i> Kişisel Öneriler
                    </h4>
                    <PersonalizedRecipePool 
                      childId={activeChild.id} 
                      limit={10}
                      isSelectable={true}
                      onSelectRecipe={(recipeId) => {
                        if (selectedSlotId) {
                          handleAddRecipeToSlot(selectedSlotId, recipeId);
                        }
                      }}
                    />
                  </div>
                )}
                
                {/* Favoriler */}
                {!searchQuery && favorites?.recipes && favorites.recipes.length > 0 && (
                  <div className="pt-4 border-t border-stone-100">
                    <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-heart text-red-500"></i> Favorilerim
                    </h4>
                    <div className="space-y-2">
                      {favorites.recipes.slice(0, 8).map(recipe => (
                        <RecipeSuggestionCard
                          key={recipe.id} 
                          recipe={recipe}
                          onClick={() => {
                            if (selectedSlotId) {
                              handleAddRecipeToSlot(selectedSlotId, recipe.id);
                            }
                          }}
                          isSelectable={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

    </div>
  );
}
