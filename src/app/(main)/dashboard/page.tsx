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

const SidebarItem = ({ iconClass, label, active = false, badge, href = "#" }: {
  iconClass: string;
  label: string;
  active?: boolean;
  badge?: string;
  href?: string;
}) => (
  <Link href={href} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'text-stone-600 hover:bg-orange-50 hover:text-orange-600'}`}>
    <i className={`${iconClass} w-5 text-center ${active ? "text-white" : "text-stone-400 group-hover:text-orange-500"}`}></i>
    <span className="text-sm font-semibold">{label}</span>
    {badge && <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white text-orange-500' : badge === '!' ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-600'}`}>{badge}</span>}
  </Link>
);

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

  // Mock data for recommended recipes (as per design spec)
  const recommendedRecipes = useMemo(() => [
    { id: 1, title: "Sebzeli Mücver", image: "🥦", time: "25 dk", match: "95" },
    { id: 2, title: "Muzlu Yulaf Bar", image: "🍌", time: "15 dk", match: "88" },
    { id: 3, title: "Bal Kabaklı Çorba", image: "🎃", time: "30 dk", match: "92" },
  ], []);

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
    <div className="flex min-h-screen relative bg-[#FDFBF7]">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-stone-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] fixed h-screen z-30">
          {/* Logo Area */}
          <div className="p-6 border-b border-stone-100">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">KG</span>
              </div>
              <div>
                <h1 className="font-black text-stone-900 text-lg">KidsGourmet</h1>
                <p className="text-[10px] text-stone-500 font-medium">Sağlıklı Bebek Beslenmesi</p>
              </div>
            </Link>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-3 mb-3">
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="User" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-lg font-bold text-orange-700 border-2 border-white shadow-sm">
                    {user.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-900 text-sm truncate">{user.display_name || user.name}</p>
                  <p className="text-[10px] text-stone-600">Premium Üye ⭐</p>
                </div>
              </div>
              {activeChild && (
                <div className="text-[10px] bg-white/60 backdrop-blur px-2 py-1 rounded-lg text-stone-700 font-medium">
                  Aktif: <span className="font-bold">{activeChild.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
            {/* Menü Section */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-3 px-4">Menü</h3>
              <div className="space-y-1">
                <SidebarItem iconClass="fa-solid fa-house" label="Dashboard" active={true} href="/dashboard" />
                <SidebarItem iconClass="fa-solid fa-calendar-days" label="Haftalık Plan" href="/dashboard/haftalik-plan" />
                <SidebarItem iconClass="fa-solid fa-utensils" label="Tarifler" href="/tarifler" badge="Yeni" />
                <SidebarItem iconClass="fa-solid fa-basket-shopping" label="Alışveriş Listesi" href="/alisveris-listesi" />
              </div>
            </div>

            {/* Gelişim & Sağlık Section */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-3 px-4">Gelişim &amp; Sağlık</h3>
              <div className="space-y-1">
                <SidebarItem iconClass="fa-solid fa-chart-line" label="Büyüme Takibi" href="/akilli-asistan/persentil" />
                <SidebarItem iconClass="fa-solid fa-syringe" label="Aşı Takvimi" href="/dashboard/saglik/asilar" badge="!" />
                <SidebarItem iconClass="fa-solid fa-brain" label="BLW Hazırlık" href="/akilli-asistan/blw-testi" />
                <SidebarItem iconClass="fa-solid fa-apple-whole" label="Beslenme Rehberi" href="/beslenme-rehberi" />
              </div>
            </div>

            {/* Topluluk Section */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-3 px-4">Topluluk</h3>
              <div className="space-y-1">
                <SidebarItem iconClass="fa-solid fa-users" label="Çemberler" href="/topluluk" badge="24" />
                <SidebarItem iconClass="fa-solid fa-heart" label="Favoriler" href="/favoriler" />
                <SidebarItem iconClass="fa-solid fa-user" label="Profil" href="/profil" />
              </div>
            </div>
          </nav>

          {/* Bottom CTA */}
          <div className="p-4 border-t border-stone-100">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <p className="text-[10px] font-black uppercase tracking-wider opacity-80 mb-1">Yeni Özellik</p>
              <p className="font-bold text-sm mb-2">AI Asistan ile Sohbet Et! 🤖</p>
              <Link href="/akilli-asistan" className="block w-full bg-white text-purple-600 text-center py-2 rounded-xl text-xs font-bold hover:bg-purple-50 transition-colors">
                Hemen Dene
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 w-full min-w-0 lg:ml-72">
            
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
            <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">

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
                                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-orange-100 shadow-xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 transition-all duration-300 flex items-center justify-center">
                                          <span className="text-4xl md:text-5xl font-bold text-orange-500">
                                            {activeChild.name.charAt(0).toUpperCase()}
                                          </span>
                                      </div>
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

                {/* 3. ÖNERİLEN TARİFLER - Horizontal Scroll */}
                {activeChild && (
                  <div>
                      <div className="flex items-center justify-between mb-4">
                          <h2 className="font-display font-black text-xl text-stone-900">✨ Önerilen Tarifler</h2>
                          <Link href="/tarifler" className="text-sm font-bold text-orange-500 hover:underline">Tümünü Gör</Link>
                      </div>

                      {/* Recipe Cards - Horizontal Scroll */}
                      <div className="flex gap-4 overflow-x-auto pb-4 hide-scroll scrollbar-hide">
                          {recommendedRecipes.map((recipe) => (
                            <div key={recipe.id} className="flex-shrink-0 w-64 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                              <div className="h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center text-6xl relative overflow-hidden">
                                {recipe.image}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-black text-orange-500">
                                  {recipe.match}% uygun
                                </div>
                              </div>
                              <div className="p-4">
                                <h4 className="font-bold text-stone-900 text-sm mb-2 group-hover:text-orange-500 transition-colors">{recipe.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-stone-500">
                                  <span className="flex items-center gap-1"><i className="fa-regular fa-clock text-[10px]"></i> {recipe.time}</span>
                                  <span className="flex items-center gap-1"><i className="fa-solid fa-fire text-[10px]"></i> Kolay</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                  </div>
                )}

                {/* 4. HAFTALIK BAKIŞ - 7 Day Calendar */}
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

                {/* 3. INFO WIDGETS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Shopping List Widget */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden group cursor-pointer hover:border-orange-200 transition-colors">
                        <div className="absolute -right-4 -top-4 bg-orange-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                        <h3 className="font-bold text-stone-800 mb-4 flex items-center">
                            <i className="fa-solid fa-basket-shopping text-orange-500 mr-2"></i> Alışveriş Listesi
                        </h3>
                        {shoppingList.length > 0 ? (
                          <>
                            <ul className="space-y-3 mb-4">
                                {shoppingList.slice(0, 3).map((item) => (
                                  <li key={item.id} className="flex items-center text-sm text-stone-600">
                                      <span className={`w-2 h-2 ${item.checked ? 'bg-stone-400' : 'bg-green-400'} rounded-full mr-2`}></span>
                                      <span className={item.checked ? 'line-through text-stone-400' : ''}>{item.ingredient} {item.amount && `(${item.amount})`}</span>
                                  </li>
                                ))}
                            </ul>
                            <Link href="/alisveris-listesi" className="block w-full bg-stone-50 text-stone-600 font-bold py-2 rounded-xl text-sm hover:bg-stone-100 transition-colors text-center">
                                Tüm Listeyi Gör ({shoppingList.length})
                            </Link>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-stone-500 mb-4">Henüz alışveriş listeniz boş.</p>
                            <Link href="/tarifler" className="block w-full bg-stone-50 text-stone-600 font-bold py-2 rounded-xl text-sm hover:bg-stone-100 transition-colors text-center">
                                Tarif Keşfet
                            </Link>
                          </>
                        )}
                    </div>

                    {/* Expert Tip Widget (Rejimde.com) */}
                    <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 shadow-sm relative">
                        <span className="absolute top-4 right-4 bg-white text-green-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm">Uzman İpucu</span>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm">
                                <i className="fa-solid fa-user-doctor"></i>
                            </div>
                            <h3 className="font-bold text-stone-800 text-sm">Dyt. Ayşe Yılmaz</h3>
                        </div>
                        <p className="text-sm text-stone-700 italic mb-3">
                            &ldquo;{activeChild ? activeChild.name : 'Çocuğunuz'} için beslenme takvimi oluşturmayı unutmayın. Düzenli öğünler gelişim için önemlidir...&rdquo;
                        </p>
                        <Link href="#" className="text-xs font-bold text-green-600 hover:underline">Devamını Oku (Rejimde.com)</Link>
                    </div>

                    {/* Tools Widget */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                        <h3 className="font-bold text-stone-800 mb-4 flex items-center">
                            <i className="fa-solid fa-toolbox text-blue-400 mr-2"></i> Hızlı Araçlar
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/beslenme-rehberi" className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-3 rounded-2xl transition-colors">
                                <i className="fa-solid fa-magnifying-glass text-blue-500 mb-1"></i>
                                <span className="text-xs font-bold text-blue-700">Gıda Ara</span>
                            </Link>
                            <Link href="/akilli-asistan" className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 p-3 rounded-2xl transition-colors">
                                <i className="fa-solid fa-chart-line text-purple-500 mb-1"></i>
                                <span className="text-xs font-bold text-purple-700">Gelişim</span>
                            </Link>
                        </div>
                    </div>

                    {/* Vaccine Widget */}
                    {activeChild && (
                      <DashboardVaccineWidget 
                        childId={activeChild.id} 
                        childName={activeChild.name}
                      />
                    )}

                    {/* BLW Test Results Widget */}
                    {blwResults.length > 0 && (
                      <div className="bg-white rounded-2xl border border-stone-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-stone-800 flex items-center gap-2">
                            <i className="fa-solid fa-baby text-green-500"></i>
                            BLW Hazırlık Testi
                          </h3>
                          <Link href="/akilli-asistan/blw-testi" className="text-sm text-orange-500 hover:underline">
                            Tekrar Test Et
                          </Link>
                        </div>
                        
                        {blwResults.slice(0, 3).map((result, index) => {
                          // Çocuk adını bul (children array'inden)
                          const childName = result.child_id 
                            ? children.find(c => c.id === result.child_id)?.name || result.child_name
                            : null;
                          
                          // BLW sonuç kategorisi (threshold: 80 ve 55)
                          const getBLWResultCategory = (score: number) => {
                            if (score >= 80) return { text: 'Hazır', color: 'green', emoji: '✅', bg: 'bg-green-500' };
                            if (score >= 55) return { text: 'Neredeyse Hazır', color: 'amber', emoji: '⏳', bg: 'bg-amber-500' };
                            return { text: 'Biraz Daha Zaman', color: 'red', emoji: '⏰', bg: 'bg-red-500' };
                          };
                          
                          const category = getBLWResultCategory(result.score);
                          
                          return (
                            <div key={index} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl mb-2 last:mb-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${category.bg}`}>
                                {Math.round(result.score)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-stone-800">{category.text}</p>
                                  <span className="text-lg">{category.emoji}</span>
                                </div>
                                <p className="text-xs text-stone-500">
                                  {childName && <span className="font-medium text-stone-600">{childName} • </span>}
                                  {formatDate(result.created_at)}
                                </p>
                              </div>
                              {result.red_flags && result.red_flags.length > 0 && (
                                <div className="relative group">
                                  <div className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center cursor-help">
                                    <i className="fa-solid fa-exclamation text-xs"></i>
                                  </div>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <p className="font-bold mb-1">Dikkat Edilmesi Gerekenler:</p>
                                    {result.red_flags.slice(0, 2).map((flag, i) => (
                                      <p key={i}>• {flag.message}</p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Percentile Results Widget - Büyüme Takibi */}
                    {percentileResults.length > 0 && (
                      <div className="bg-white rounded-2xl border border-stone-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-stone-800 flex items-center gap-2">
                            <i className="fa-solid fa-chart-line text-blue-500"></i>
                            Büyüme Takibi
                          </h3>
                          <Link href="/akilli-asistan/persentil" className="text-sm text-orange-500 hover:underline">
                            Yeni Ölçüm
                          </Link>
                        </div>
                        
                        {percentileResults.slice(0, 3).map((result, index) => {
                          // Çocuk adını bul
                          const childName = result.child_id 
                            ? children.find(c => c.id === result.child_id)?.name 
                            : null;
                          
                          // Ölçüm türlerini göster
                          const getMeasurementSummary = () => {
                            if (!result.percentiles || result.percentiles.length === 0) return 'Ölçüm yok';
                            
                            const items: string[] = [];
                            const weight = result.percentiles.find(p => p.measurement_type === 'weight_for_age');
                            const height = result.percentiles.find(p => p.measurement_type === 'height_for_age');
                            const head = result.percentiles.find(p => p.measurement_type === 'head_for_age');
                            
                            if (weight) items.push(`Kilo: ${Math.round(weight.percentile)}p`);
                            if (height) items.push(`Boy: ${Math.round(height.percentile)}p`);
                            if (head) items.push(`Baş: ${Math.round(head.percentile)}p`);
                            
                            return items.length > 0 ? items.join(' • ') : 'Ölçüm yok';
                          };
                          
                          // Genel durum rengi
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
                          const hasWarnings = result.red_flags && result.red_flags.length > 0;
                          
                          return (
                            <div key={index} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl mb-2 last:mb-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${status.bg}`}>
                                <i className={`fa-solid ${status.icon} text-lg`}></i>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-stone-800 text-sm">
                                  {getMeasurementSummary()}
                                </p>
                                <p className="text-xs text-stone-500">
                                  {childName && <span className="font-medium text-stone-600">{childName} • </span>}
                                  {result.age_in_months > 0 && `${result.age_in_months} aylık • `}
                                  {formatDate(result.created_at)}
                                </p>
                              </div>
                              {hasWarnings && (
                                <div className="relative group">
                                  <div className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center cursor-help">
                                    <i className="fa-solid fa-exclamation text-xs"></i>
                                  </div>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                    <p className="font-bold mb-1">Dikkat Edilmesi Gerekenler:</p>
                                    {result.red_flags.slice(0, 2).map((flag, i) => (
                                      <p key={i}>• {flag.message}</p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Solid Food Readiness Results Widget */}
                    {solidFoodResults.length > 0 && (
                      <div className="bg-white rounded-2xl border border-stone-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-stone-800 flex items-center gap-2">
                            <i className="fa-solid fa-utensils text-orange-500"></i>
                            Ek Gıda Hazırlık
                          </h3>
                          <Link href="/akilli-asistan/ek-gidaya-baslama" className="text-sm text-orange-500 hover:underline">
                            Tekrar Test Et
                          </Link>
                        </div>
                        
                        {solidFoodResults.slice(0, 3).map((result, index) => {
                          // Çocuk adını bul
                          const childName = result.child_id 
                            ? children.find(c => c.id === result.child_id)?.name || result.child_name
                            : null;
                          
                          // Ek Gıda sonuç kategorisi (threshold: 80 ve 50)
                          const getSolidFoodResultCategory = (score: number) => {
                            if (score >= 80) return { text: 'Hazır', color: 'green', emoji: '🎉', bg: 'bg-green-500' };
                            if (score >= 50) return { text: 'Neredeyse Hazır', color: 'amber', emoji: '💪', bg: 'bg-amber-500' };
                            return { text: 'Biraz Daha Zaman', color: 'red', emoji: '🕐', bg: 'bg-red-500' };
                          };
                          
                          const category = getSolidFoodResultCategory(result.score);
                          
                          return (
                            <div key={index} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl mb-2 last:mb-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${category.bg}`}>
                                {Math.round(result.score)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-stone-800">{category.text}</p>
                                  <span className="text-lg">{category.emoji}</span>
                                </div>
                                <p className="text-xs text-stone-500">
                                  {childName && <span className="font-medium text-stone-600">{childName} • </span>}
                                  {formatDate(result.created_at)}
                                </p>
                              </div>
                              {result.red_flags && result.red_flags.length > 0 && (
                                <div className="relative group">
                                  <div className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center cursor-help">
                                    <i className="fa-solid fa-exclamation text-xs"></i>
                                  </div>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <p className="font-bold mb-1">Dikkat Edilmesi Gerekenler:</p>
                                    {result.red_flags.slice(0, 2).map((flag, i) => (
                                      <p key={i}>• {flag}</p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                </div>

                {/* 4. NEW FEATURE WIDGETS */}
                {activeChild && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Today's Menu Widget */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl border border-orange-100 shadow-sm">
                      <h3 className="font-bold text-stone-800 mb-4 flex items-center">
                        <i className="fa-solid fa-sun text-yellow-500 mr-2"></i> Bugünün Menüsü
                      </h3>
                      <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                            <i className="fa-solid fa-bowl-food text-orange-500 text-2xl"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-stone-800 text-sm">Sebzeli Pirinç Pilavı</h4>
                            <p className="text-xs text-stone-500">{activeChild.age_months ? `${activeChild.age_months} ay` : 'Bebek'} • 25 dk</p>
                          </div>
                        </div>
                        <Link href="/tarifler" className="block w-full bg-orange-500 text-white text-center py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors">
                          Tarifi Gör
                        </Link>
                      </div>
                    </div>

                    {/* My Circles Widget */}
                    <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 shadow-sm">
                      <h3 className="font-bold text-stone-800 mb-4 flex items-center">
                        <i className="fa-solid fa-users text-purple-500 mr-2"></i> Çemberlerim
                      </h3>
                      <div className="space-y-2 mb-4">
                        <div className="bg-white rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-pointer">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-carrot text-purple-500 text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-stone-800">BLW Deneyimleri</p>
                            <p className="text-xs text-stone-500">24 yeni mesaj</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-pointer">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-apple-whole text-green-500 text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-stone-800">İlk 1000 Gün</p>
                            <p className="text-xs text-stone-500">12 yeni mesaj</p>
                          </div>
                        </div>
                      </div>
                      <Link href="/topluluk" className="block w-full bg-purple-500 text-white text-center py-2 rounded-xl text-sm font-bold hover:bg-purple-600 transition-colors">
                        Tüm Çemberler
                      </Link>
                    </div>

                    {/* Quick Shortcuts Widget */}
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm">
                      <h3 className="font-bold text-stone-800 mb-4 flex items-center">
                        <i className="fa-solid fa-bolt text-blue-500 mr-2"></i> Kısayollar
                      </h3>
                      <div className="space-y-2">
                        <Link href="/akilli-asistan/persentil" className="flex items-center gap-3 bg-white rounded-xl p-3 hover:shadow-sm transition-shadow">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-chart-line text-blue-500"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-stone-800">Büyüme Grafiği</p>
                            <p className="text-xs text-stone-500">Boy & kilo takibi</p>
                          </div>
                          <i className="fa-solid fa-chevron-right text-stone-300"></i>
                        </Link>
                        <Link href="/dashboard/saglik/asilar" className="flex items-center gap-3 bg-white rounded-xl p-3 hover:shadow-sm transition-shadow">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-syringe text-green-500"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-stone-800">Aşı Takvimi</p>
                            <p className="text-xs text-stone-500">Aşı hatırlatıcı</p>
                          </div>
                          <i className="fa-solid fa-chevron-right text-stone-300"></i>
                        </Link>
                      </div>
                    </div>

                  </div>
                )}

            </div>
        </main>

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