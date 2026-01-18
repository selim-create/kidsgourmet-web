"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { useActiveChild } from "@/contexts/ActiveChildContext";
import { userService } from "@/services/user-service";
import { toolService } from "@/services/tool-service";
import { ShoppingListItem, BLWTestResult, PercentileResult, SolidFoodReadinessResult } from "@/lib/types";
import AllergyBanner from "@/components/features/AllergyBanner";
import DashboardVaccineWidget from "@/components/features/vaccine/DashboardVaccineWidget";
import OverdueVaccineBanner from "@/components/features/vaccine/OverdueVaccineBanner";
import { formatAge } from "@/utils/ageFormatter";
import DailyRecommendations from "@/components/features/recommendations/DailyRecommendations";
import NutritionSummaryCard from "@/components/features/nutrition/NutritionSummaryCard";
import MissingNutrientsAlert from "@/components/features/nutrition/MissingNutrientsAlert";
import FoodIntroductionCard from "@/components/features/food-introduction/FoodIntroductionCard";
import { useMealPlan } from "@/hooks/useMealPlan";
import ChildWizard from "@/components/features/ChildWizard";
import ChildAvatarUpload from "@/components/features/ChildAvatarUpload";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

// --- SUB COMPONENTS ---

function MealCard({ title, category, time, calories, icon, color, isDone, onClick }: { 
  title: string; 
  category: string; 
  time: string; 
  calories: string; 
  icon: string; 
  color: 'yellow' | 'green' | 'orange'; 
  isDone: boolean;
  onClick?: () => void;
}) {
   const colors = {
      yellow: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-100", iconBg: "bg-yellow-100" },
      green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-100", iconBg: "bg-green-100" },
      orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100", iconBg: "bg-orange-100" },
   };
   const theme = colors[color];

   return (
      <div 
        onClick={onClick}
        className={`p-4 rounded-2xl border ${theme.border} ${theme.bg} flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer`}
      >
         <div className={`w-14 h-14 rounded-xl ${theme.iconBg} flex items-center justify-center text-2xl shadow-sm z-10`}>
            {icon}
         </div>
         <div className="flex-1 min-w-0 z-10">
            <span className={`text-[10px] font-black uppercase tracking-wider opacity-60 ${theme.text}`}>{category}</span>
            <h4 className="font-bold text-stone-900 text-sm leading-tight mt-0.5 truncate">{title}</h4>
            <div className="flex items-center gap-3 mt-1.5 opacity-70">
               <span className="text-xs font-medium flex items-center gap-1"><i className="fa-regular fa-clock text-[10px]"></i> {time}</span>
               <span className="text-xs font-medium flex items-center gap-1"><i className="fa-solid fa-fire text-[10px]"></i> {calories}</span>
            </div>
         </div>
         <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 bg-white/50 text-stone-300 hover:border-green-400 hover:text-green-400'}`}>
            <i className="fa-solid fa-check"></i>
         </div>
      </div>
   )
}

function NutritionBar({ label, current, total, iconClass, color, bgColor, textColor }: {
  label: string;
  current: number;
  total: number;
  iconClass: string;
  color: string;
  bgColor: string;
  textColor: string;
}) {
   const percent = Math.min((current / total) * 100, 100);
   return (
      <div>
         <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`flex items-center gap-1.5 font-bold ${textColor}`}>
               <i className={iconClass}></i> {label}
            </span>
            <span className="font-bold text-stone-600">{current}/{total} porsiyon</span>
         </div>
         <div className={`h-2.5 w-full ${bgColor} rounded-full overflow-hidden`}>
            <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
         </div>
      </div>
   )
}

// Constants for MealCard display
const MEAL_COLORS = ['yellow', 'green', 'orange'] as const;
const MEAL_ICONS = ['🌅', '🍱', '🌙'];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: userLoading, refreshUser } = useUser();
  const { activeChild, children, setActiveChild } = useActiveChild();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [blwResults, setBlwResults] = useState<BLWTestResult[]>([]);
  const [percentileResults, setPercentileResults] = useState<PercentileResult[]>([]);
  const [solidFoodResults, setSolidFoodResults] = useState<SolidFoodReadinessResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<any>(null);
  
  // Meal plan hook
  const { plan, isLoading: mealPlanLoading } = useMealPlan();

  // Calculate today's meals from the plan
  const todaysMeals = useMemo(() => {
    if (!plan?.days) return [];
    const today = new Date().toISOString().split('T')[0];
    const todayPlan = plan.days.find(d => d.date === today);
    return todayPlan?.slots || [];
  }, [plan]);

  // Removed mock data - using real data only

  // Today's formatted date
  const todayFormatted = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
  }, []);

  // Calculate week days dynamically - 7 days
  const weekDays = useMemo(() => {
    const today = new Date();
    const daysOfWeek = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    
    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + i);
      const dayOfWeek = dayDate.getDay();
      const isToday = i === 0;
      
      return {
        dayName: daysOfWeek[dayOfWeek],
        dayNumber: dayDate.getDate(),
        isToday
      };
    });
  }, []);

  // Helper function: Format date with fallback for invalid dates
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Tarih bilinmiyor';
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return 'Tarih bilinmiyor';
    }
  };

  // Auth guard
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [userLoading, isAuthenticated, router]);

  // Role-based redirect for experts
  useEffect(() => {
    if (user?.role && ['administrator', 'editor', 'kg_expert'].includes(user.role)) {
      // Expert kullanıcılar için özel dashboard'a yönlendir
      // veya burada expert widget'larını göster
      // Şimdilik yönlendirme yapmıyoruz, expert panele link veriyoruz
    }
  }, [user?.role]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel - hatalar sessizce handle edilir
        const [shoppingListData, blwResultsData, percentileResultsData, solidFoodResultsData] = await Promise.all([
          userService.getShoppingList().catch(() => []),
          toolService.getUserBLWResults().catch(() => []),
          toolService.getUserPercentileResults().catch(() => []),
          toolService.getUserSolidFoodResults().catch(() => []),  // 404 hatası sessizce handle edilir
        ]);
        
        setShoppingList(shoppingListData || []);
        setBlwResults(blwResultsData || []);
        setPercentileResults(percentileResultsData || []);
        setSolidFoodResults(solidFoodResultsData || []);
      } catch (err) {
        // Sadece kritik hatalar için error state set et
        console.error('Dashboard data fetch error:', err);
        // Error state'i set etme - widget'lar boş gösterilsin
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Loading state
  if (userLoading || !isAuthenticated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7]">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Bir Hata Oluştu</h2>
          <p className="text-stone-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDFBF7] overflow-hidden">

        {/* SOL SIDEBAR - Navigation Only */}
        <DashboardSidebar activePage="dashboard" />

        {/* MAIN CONTENT - Scrollable */}
        <main className="flex-1 overflow-y-auto lg:ml-0">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-100">
                <div className="flex items-center gap-2">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} className="w-8 h-8 rounded-full border border-stone-100" alt="User" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold">
                        {user?.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                    <span className="font-bold text-stone-800">Merhaba, {user?.display_name || user?.name}!</span>
                </div>
                <button className="text-stone-500 text-xl relative">
                    <i className="fa-regular fa-bell"></i>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>

            {/* DASHBOARD CONTENT */}
            <div className="p-4 md:p-8 space-y-8 pb-24">

                {/* 1. HERO: Child Status & Switcher - NEW WHITE CARD DESIGN */}
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-lg transition-all duration-500">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-50 rounded-full blur-2xl -ml-10 -mb-10"></div>

                    <div className="relative z-10">
                        
                        {children.length > 0 ? (
                          <>
                            {/* Multi-Child Selector */}
                            <div className="flex items-center gap-3 mb-6 overflow-x-auto hide-scroll pb-2">
                                {children.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() => setActiveChild(child)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                                            activeChild?.id === child.id 
                                            ? "bg-orange-500 text-white border-orange-500 shadow-sm ring-2 ring-orange-200" 
                                            : "bg-stone-50 hover:bg-stone-100 border-stone-200 opacity-70 hover:opacity-100 text-stone-700"
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border ${activeChild?.id === child.id ? "border-white bg-white/20" : "border-stone-300 bg-white"} flex items-center justify-center text-xs font-bold ${activeChild?.id === child.id ? "text-white" : "text-orange-500"}`}>
                                          {child.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`text-sm ${activeChild?.id === child.id ? "font-bold" : "font-medium"}`}>{child.name}</span>
                                    </button>
                                ))}
                                
                                <button 
                                  onClick={() => setIsChildModalOpen(true)}
                                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-orange-100 flex items-center justify-center border border-stone-200 hover:border-orange-300 transition-all text-sm text-stone-600 hover:text-orange-500" 
                                  title="Çocuk Ekle"
                                >
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>

                            {/* Active Child Profile */}
                            {activeChild && (
                              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                  {/* Child Photo/Avatar */}
                                  <div className="relative flex-shrink-0">
                                      <ChildAvatarUpload
                                        childId={activeChild.id}
                                        currentAvatarUrl={activeChild.avatar_url}
                                        childName={activeChild.name}
                                        size="lg"
                                        onAvatarChange={() => {
                                          // Refresh children list to get updated avatar
                                          if (user) {
                                            refreshUser();
                                          }
                                        }}
                                      />
                                      <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                          {activeChild.birth_date ? formatAge(activeChild.birth_date) : activeChild.age_months ? `${activeChild.age_months} Aylık` : 'Bebek'}
                                      </div>
                                  </div>

                                  <div className="text-center md:text-left flex-1">
                                      <h1 className="font-display font-black text-2xl md:text-3xl mb-2 text-stone-900">{activeChild.name} bugün harika görünüyor! 🌟</h1>
                                      <p className="text-stone-600 text-sm md:text-base mb-4 max-w-xl">
                                          {activeChild.notes || 'Çocuğunuzun gelişimi için özel tarifler ve öneriler burada.'}
                                      </p>
                                      
                                      {/* Quick Stats/Info */}
                                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                          {((activeChild.allergies && activeChild.allergies.length > 0) || (activeChild.allergens && activeChild.allergens.length > 0)) && (
                                            <div className="bg-red-50 px-4 py-2 rounded-xl flex items-center gap-2 text-xs md:text-sm font-bold border border-red-100 text-red-600">
                                                <i className="fa-solid fa-triangle-exclamation"></i> {(activeChild.allergies || activeChild.allergens || []).length} Alerjen
                                            </div>
                                          )}
                                          <Link href="/profil" className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs md:text-sm font-bold shadow-sm hover:bg-orange-600 transition-colors">
                                              Profili Düzenle
                                          </Link>
                                      </div>
                                  </div>
                              </div>
                            )}
                          </>
                        ) : (
                          // Empty state - no children
                          <div className="text-center py-8">
                            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-orange-100">
                              <i className="fa-solid fa-child text-5xl text-orange-500"></i>
                            </div>
                            <h1 className="font-display font-black text-2xl md:text-3xl mb-2 text-stone-900">Hoş Geldiniz! 👋</h1>
                            <p className="text-stone-600 text-sm md:text-base mb-4 max-w-xl mx-auto">
                              Çocuk profili ekleyerek size özel menüler ve önerilere ulaşabilirsiniz.
                            </p>
                            <button 
                              onClick={() => setIsChildModalOpen(true)}
                              className="inline-flex bg-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-orange-600 transition-colors"
                            >
                              <i className="fa-solid fa-plus mr-2"></i> İlk Çocuğunuzu Ekleyin
                            </button>
                          </div>
                        )}
                    </div>
                </div>

                {/* Allergy Warning Banner */}
                {activeChild && (
                  <AllergyBanner child={activeChild} />
                )}

                {/* Overdue Vaccine Warning Banner */}
                {activeChild && (
                  <OverdueVaccineBanner 
                    childId={activeChild.id} 
                    childName={activeChild.name}
                  />
                )}

                {/* Missing Nutrients Alert */}
                {activeChild && (
                  <MissingNutrientsAlert childId={activeChild.id} />
                )}

                {/* Daily Recommendations */}
                {activeChild && (
                  <DailyRecommendations childId={activeChild.id} />
                )}

                {/* Food Introduction Card */}
                {activeChild && (
                  <FoodIntroductionCard childId={activeChild.id} />
                )}

                {/* Nutrition Summary */}
                {activeChild && (
                  <NutritionSummaryCard childId={activeChild.id} />
                )}

                {/* 2. BUGÜNÜN MENÜSÜ - 3-Column MealCard Grid */}
                {activeChild && (
                  <div>
                      <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2 className="font-display font-black text-xl text-stone-900">☀️ Bugünün Menüsü</h2>
                            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">{todayFormatted}</p>
                          </div>
                          <Link href="/dashboard/haftalik-plan" className="text-sm font-bold text-orange-500 hover:underline">Tümünü Gör</Link>
                      </div>

                      {/* Meals Grid - 3 Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {todaysMeals.length > 0 ? (
                            todaysMeals.filter(slot => slot.recipe).slice(0, 3).map((slot, idx) => {
                              return (
                                <MealCard
                                  key={slot.id}
                                  title={slot.recipe?.title || 'Öğün'}
                                  category={slot.slot_label}
                                  time={slot.recipe?.prep_time ? `${slot.recipe.prep_time} dk` : '25 dk'}
                                  calories="180 kcal"
                                  icon={MEAL_ICONS[idx % 3]}
                                  color={MEAL_COLORS[idx % 3]}
                                  isDone={false}
                                  onClick={() => {}}
                                />
                              );
                            })
                          ) : (
                            <div className="col-span-3 text-center py-8 bg-white rounded-2xl border border-stone-100">
                              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <i className="fa-solid fa-utensils text-orange-500 text-2xl"></i>
                              </div>
                              <p className="text-stone-600 mb-4">Bugün için plan oluşturulmamış</p>
                              <Link 
                                href="/dashboard/haftalik-plan"
                                className="inline-flex items-center bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                              >
                                <i className="fa-solid fa-plus mr-2"></i>
                                Plan Oluştur
                              </Link>
                            </div>
                          )}
                      </div>
                  </div>
                )}

                {/* 3. HAFTALIK BAKIŞ - 7 Day Calendar */}
                {activeChild && (
                  <div className="bg-stone-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                          <h2 className="font-display font-black text-xl text-stone-900">📅 Haftalık Bakış</h2>
                          <Link href="/dashboard/haftalik-plan" className="text-sm font-bold text-orange-500 hover:underline">Detaylı Plan</Link>
                      </div>

                      {/* Days Navigation - 7 Days */}
                      <div className="grid grid-cols-7 gap-2">
                          {weekDays.map((day, index) => (
                            <button 
                              key={index}
                              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                                day.isToday 
                                  ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                                  : 'bg-white border border-stone-200 text-stone-400 hover:border-orange-500/50 hover:text-orange-500'
                              }`}
                            >
                              <span className={`text-[10px] font-black uppercase ${day.isToday ? 'opacity-80' : ''}`}>
                                {day.dayName}
                              </span>
                              <span className="text-lg font-bold mt-1">{day.dayNumber}</span>
                              {day.isToday && <span className="text-[8px] mt-1">●</span>}
                            </button>
                          ))}
                      </div>
                  </div>
                )}

            </div>
        </main>

        {/* SAĞ SIDEBAR - Widgets (hidden on mobile/tablet, shown xl+) */}
        <aside className="hidden xl:block w-80 bg-white border-l border-stone-100 overflow-y-auto p-6 space-y-6">
          
          {activeChild && (
            <>
              {/* Shopping List Widget */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 relative overflow-hidden group hover:border-orange-200 transition-colors">
                  <div className="absolute -right-4 -top-4 bg-orange-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                  <h3 className="font-bold text-stone-800 mb-4 flex items-center relative z-10">
                      <i className="fa-solid fa-basket-shopping text-orange-500 mr-2"></i> Alışveriş Listesi
                  </h3>
                  {shoppingList.length > 0 ? (
                    <>
                      <ul className="space-y-3 mb-4 relative z-10">
                          {shoppingList.slice(0, 3).map((item) => (
                            <li key={item.id} className="flex items-center text-sm text-stone-600">
                                <span className={`w-2 h-2 ${item.checked ? 'bg-stone-400' : 'bg-green-400'} rounded-full mr-2`}></span>
                                <span className={item.checked ? 'line-through text-stone-400' : ''}>{item.ingredient} {item.amount && `(${item.amount})`}</span>
                            </li>
                          ))}
                      </ul>
                      <Link href="/alisveris-listesi" className="block w-full bg-white text-stone-600 font-bold py-2 rounded-xl text-sm hover:bg-stone-100 transition-colors text-center relative z-10">
                          Tüm Listeyi Gör ({shoppingList.length})
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-stone-500 mb-4 relative z-10">Henüz alışveriş listeniz boş.</p>
                      <Link href="/tarifler" className="block w-full bg-white text-stone-600 font-bold py-2 rounded-xl text-sm hover:bg-stone-100 transition-colors text-center relative z-10">
                          Tarif Keşfet
                      </Link>
                    </>
                  )}
              </div>

              {/* Growth Tracking Widget */}
              {percentileResults.length > 0 && (
                <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-stone-800 flex items-center gap-2">
                      <i className="fa-solid fa-chart-line text-blue-500"></i>
                      Büyüme Takibi
                    </h3>
                    <Link href="/akilli-asistan/persentil" className="text-sm text-orange-500 hover:underline">
                      Yeni
                    </Link>
                  </div>
                  
                  {percentileResults.slice(0, 2).map((result, index) => {
                    const childName = result.child_id 
                      ? children.find(c => c.id === result.child_id)?.name 
                      : null;
                    
                    const getMeasurementSummary = () => {
                      if (!result.percentiles || result.percentiles.length === 0) return 'Ölçüm yok';
                      
                      const items: string[] = [];
                      const weight = result.percentiles.find(p => p.measurement_type === 'weight_for_age');
                      const height = result.percentiles.find(p => p.measurement_type === 'height_for_age');
                      
                      if (weight) items.push(`Kilo: ${Math.round(weight.percentile)}p`);
                      if (height) items.push(`Boy: ${Math.round(height.percentile)}p`);
                      
                      return items.length > 0 ? items.join(' • ') : 'Ölçüm yok';
                    };
                    
                    const getOverallStatus = () => {
                      if (!result.percentiles || result.percentiles.length === 0) {
                        return { bg: 'bg-stone-500', icon: 'fa-question' };
                      }
                      
                      const hasVeryLow = result.percentiles.some(p => p.category === 'very_low');
                      const hasVeryHigh = result.percentiles.some(p => p.category === 'very_high');
                      const hasLowOrHigh = result.percentiles.some(p => p.category === 'low' || p.category === 'high');
                      
                      if (hasVeryLow || hasVeryHigh) return { bg: 'bg-red-500', icon: 'fa-triangle-exclamation' };
                      if (hasLowOrHigh) return { bg: 'bg-amber-500', icon: 'fa-circle-exclamation' };
                      return { bg: 'bg-green-500', icon: 'fa-circle-check' };
                    };
                    
                    const status = getOverallStatus();
                    
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl mb-2 last:mb-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${status.bg}`}>
                          <i className={`fa-solid ${status.icon} text-sm`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-800 text-xs truncate">
                            {getMeasurementSummary()}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">
                            {formatDate(result.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BLW Readiness Widget */}
              {blwResults.length > 0 && (
                <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-stone-800 flex items-center gap-2">
                      <i className="fa-solid fa-baby text-green-500"></i>
                      BLW Hazırlık
                    </h3>
                    <Link href="/akilli-asistan/blw-testi" className="text-sm text-orange-500 hover:underline">
                      Test Et
                    </Link>
                  </div>
                  
                  {blwResults.slice(0, 2).map((result, index) => {
                    const getBLWResultCategory = (score: number) => {
                      if (score >= 80) return { text: 'Hazır', emoji: '✅', bg: 'bg-green-500' };
                      if (score >= 55) return { text: 'Neredeyse', emoji: '⏳', bg: 'bg-amber-500' };
                      return { text: 'Bekle', emoji: '⏰', bg: 'bg-red-500' };
                    };
                    
                    const category = getBLWResultCategory(result.score);
                    
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl mb-2 last:mb-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${category.bg} text-sm`}>
                          {Math.round(result.score)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-stone-800 text-xs">{category.text}</p>
                            <span className="text-sm">{category.emoji}</span>
                          </div>
                          <p className="text-[10px] text-stone-500 truncate">
                            {formatDate(result.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Daily Nutrition Widget */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                <h3 className="font-bold text-stone-800 mb-4 flex items-center">
                  <i className="fa-solid fa-apple-whole text-green-500 mr-2"></i> Günlük Beslenme
                </h3>
                <NutritionSummaryCard childId={activeChild.id} />
              </div>

              {/* Vaccine Calendar Widget */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                <DashboardVaccineWidget 
                  childId={activeChild.id} 
                  childName={activeChild.name}
                />
              </div>

              {/* Quick Tools Widget */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                  <h3 className="font-bold text-stone-800 mb-4 flex items-center">
                      <i className="fa-solid fa-toolbox text-blue-400 mr-2"></i> Hızlı Araçlar
                  </h3>
                  <div className="space-y-2">
                      <Link href="/beslenme-rehberi" className="flex items-center gap-3 bg-white hover:bg-blue-50 p-3 rounded-xl transition-colors">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
                          </div>
                          <div className="flex-1">
                              <p className="text-sm font-bold text-stone-800">Gıda Ara</p>
                              <p className="text-xs text-stone-500">Besin değerleri</p>
                          </div>
                      </Link>
                      <Link href="/akilli-asistan" className="flex items-center gap-3 bg-white hover:bg-purple-50 p-3 rounded-xl transition-colors">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <i className="fa-solid fa-robot text-purple-500"></i>
                          </div>
                          <div className="flex-1">
                              <p className="text-sm font-bold text-stone-800">AI Asistan</p>
                              <p className="text-xs text-stone-500">Sohbet et</p>
                          </div>
                      </Link>
                  </div>
              </div>
            </>
          )}
        </aside>

        {/* MOBILE BOTTOM NAVIGATION (Sticky) */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link href="/dashboard" className="flex flex-col items-center text-orange-500">
                <i className="fa-solid fa-house text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Panelim</span>
            </Link>
            <Link href="/dashboard/haftalik-plan" className="flex flex-col items-center text-stone-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-calendar-days text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Plan</span>
            </Link>
            
            {/* Food Search FAB (Floating Action Button style in navbar) */}
            <div className="relative -top-8">
                <Link href="/beslenme-rehberi" className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform" title="Gıda Ara">
                    <i className="fa-solid fa-magnifying-glass text-2xl"></i>
                </Link>
            </div>

            <Link href="/favoriler" className="flex flex-col items-center text-stone-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-heart text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Favoriler</span>
            </Link>
            <Link href="/profil" className="flex flex-col items-center text-stone-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-user text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Profil</span>
            </Link>
        </div>

        {/* Child Wizard Modal */}
        <ChildWizard
          isOpen={isChildModalOpen}
          onClose={() => {
            setIsChildModalOpen(false);
            setEditingChild(null);
          }}
          onSave={async (childData) => {
            try {
              // Type guard: check if this is an update (has id) or create (no id)
              const isUpdate = childData && typeof childData === 'object' && 'id' in childData && childData.id;
              
              if (isUpdate) {
                // Update existing child
                await userService.updateChild(childData.id, childData);
              } else {
                // Add new child
                await userService.addChild(childData);
              }
              // Refresh user to get updated children list
              await refreshUser();
              setIsChildModalOpen(false);
            } catch (error) {
              console.error('Error saving child:', error);
              throw error; // Re-throw so ChildWizard can handle it
            }
          }}
          child={editingChild}
        />

    </div>
  );
}