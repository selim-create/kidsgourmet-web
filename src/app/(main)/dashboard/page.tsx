"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { useActiveChild } from "@/contexts/ActiveChildContext";
import { userService } from "@/services/user-service";
import { toolService } from "@/services/tool-service";
import { RecipeCard, ShoppingListItem, BLWTestResult, PercentileResult, SolidFoodReadinessResult, PercentileValue } from "@/lib/types";
import AllergyBanner from "@/components/features/AllergyBanner";
import { formatAge } from "@/utils/ageFormatter";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const { activeChild, children, setActiveChild } = useActiveChild();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [blwResults, setBlwResults] = useState<BLWTestResult[]>([]);
  const [percentileResults, setPercentileResults] = useState<PercentileResult[]>([]);
  const [solidFoodResults, setSolidFoodResults] = useState<SolidFoodReadinessResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // Fetch all data in parallel
        const [shoppingListData, blwResultsData, percentileResultsData, solidFoodResultsData] = await Promise.all([
          userService.getShoppingList(),
          toolService.getUserBLWResults().catch(() => []),
          toolService.getUserPercentileResults().catch(() => []),
          toolService.getUserSolidFoodResults().catch(() => []),
        ]);
        
        setShoppingList(shoppingListData);
        setBlwResults(blwResultsData);
        setPercentileResults(percentileResultsData);
        setSolidFoodResults(solidFoodResultsData);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Veriler yüklenirken hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Loading state
  if (userLoading || !isAuthenticated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
    <div className="flex min-h-screen relative">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-20 h-[calc(100vh-5rem)] z-10 overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
                {/* Localde Link kullanın */}
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
                    <i className="fa-solid fa-house"></i> Genel Bakış
                </Link>
                <Link href="/dashboard/haftalik-plan" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-calendar-days"></i> Haftalık Plan
                </Link>
                <Link href="/favoriler" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-heart"></i> Favorilerim
                </Link>
                <Link href="/alisveris-listesi" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-basket-shopping"></i> Alışveriş Listesi
                </Link>
                
                <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Araçlar</p>
                </div>
                <Link href="/akilli-asistan" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-chart-line"></i> Gelişim Takibi
                </Link>
                <Link href="/akilli-asistan" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-check-double"></i> BLW Testi
                </Link>
            </nav>

            {/* User Profile (Bottom) */}
            <div className="p-4 border-t border-gray-50 mt-auto">
                <Link href="/profil" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold">
                        {user?.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.display_name || user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">Hesabım</p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                </Link>
            </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 w-full min-w-0">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} className="w-8 h-8 rounded-full border border-gray-100" alt="User" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold">
                        {user?.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                    <span className="font-bold text-slate-800">Merhaba, {user?.display_name || user?.name}!</span>
                </div>
                <button className="text-gray-500 text-xl relative">
                    <i className="fa-regular fa-bell"></i>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>

            {/* DASHBOARD CONTENT */}
            <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">

                {/* 1. HERO: Child Status & Switcher */}
                <div className="bg-gradient-to-r from-orange-400 to-orange-300 rounded-[2rem] p-6 md:p-10 text-white relative overflow-hidden shadow-lg transition-all duration-500">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

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
                                            ? "bg-white/20 backdrop-blur border-white/40 shadow-sm ring-2 ring-white" 
                                            : "bg-black/10 hover:bg-black/20 border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border ${activeChild?.id === child.id ? "border-white" : "border-white/50"} bg-white/20 flex items-center justify-center text-xs font-bold`}>
                                          {child.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`text-sm ${activeChild?.id === child.id ? "font-bold" : "font-medium"}`}>{child.name}</span>
                                    </button>
                                ))}
                                
                                <Link href="/profil" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center border border-white/20 transition-all text-sm" title="Çocuk Ekle">
                                    <i className="fa-solid fa-plus"></i>
                                </Link>
                            </div>

                            {/* Active Child Profile */}
                            {activeChild && (
                              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                  {/* Child Photo/Avatar */}
                                  <div className="relative flex-shrink-0">
                                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/30 shadow-xl overflow-hidden bg-white transition-all duration-300 flex items-center justify-center">
                                          <span className="text-4xl md:text-5xl font-bold text-orange-500">
                                            {activeChild.name.charAt(0).toUpperCase()}
                                          </span>
                                      </div>
                                      <div className="absolute bottom-0 right-0 bg-white text-orange-500 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-orange-100">
                                          {activeChild.birth_date ? formatAge(activeChild.birth_date) : activeChild.age_months ? `${activeChild.age_months} Aylık` : 'Bebek'}
                                      </div>
                                  </div>

                                  <div className="text-center md:text-left flex-1">
                                      <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">{activeChild.name} bugün harika görünüyor! 🌟</h1>
                                      <p className="text-orange-100 text-sm md:text-base mb-4 max-w-xl">
                                          {activeChild.notes || 'Çocuğunuzun gelişimi için özel tarifler ve öneriler burada.'}
                                      </p>
                                      
                                      {/* Quick Stats/Info */}
                                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                          {((activeChild.allergies && activeChild.allergies.length > 0) || (activeChild.allergens && activeChild.allergens.length > 0)) && (
                                            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2 text-xs md:text-sm font-bold border border-white/10">
                                                <i className="fa-solid fa-triangle-exclamation"></i> {(activeChild.allergies || activeChild.allergens || []).length} Alerjen
                                            </div>
                                          )}
                                          <Link href="/profil" className="bg-white text-orange-500 px-4 py-2 rounded-xl text-xs md:text-sm font-bold shadow-sm hover:bg-orange-50 transition-colors">
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
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                              <i className="fa-solid fa-child text-5xl"></i>
                            </div>
                            <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">Hoş Geldiniz! 👋</h1>
                            <p className="text-orange-100 text-sm md:text-base mb-4 max-w-xl mx-auto">
                              Çocuk profili ekleyerek size özel menüler ve önerilere ulaşabilirsiniz.
                            </p>
                            <Link href="/profil" className="inline-flex bg-white text-orange-500 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-orange-50 transition-colors">
                              <i className="fa-solid fa-plus mr-2"></i> İlk Çocuğunuzu Ekleyin
                            </Link>
                          </div>
                        )}
                    </div>
                </div>

                {/* Allergy Warning Banner */}
                {activeChild && (
                  <AllergyBanner child={activeChild} />
                )}

                {/* 2. WEEKLY PLAN (Scrollable) */}
                {activeChild && (
                  <div>
                      <div className="flex items-center justify-between mb-4">
                          <h2 className="font-display font-bold text-xl text-slate-800">{activeChild.name} için Haftalık Plan</h2>
                          <Link href="/dashboard/haftalik-plan" className="text-sm font-bold text-orange-500 hover:underline">Tümünü Gör</Link>
                      </div>

                      {/* Days Navigation */}
                      <div className="flex gap-2 overflow-x-auto pb-4 hide-scroll scrollbar-hide">
                          {/* Active Day */}
                          <button className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 bg-orange-500 text-white rounded-2xl shadow-md transition-transform transform scale-105">
                              <span className="text-xs font-medium opacity-80">Pzt</span>
                              <span className="text-lg font-bold">12</span>
                          </button>
                          {/* Other Days */}
                          {['Sal', 'Çar', 'Per', 'Cum'].map((day, index) => (
                              <button key={day} className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:border-orange-500/50 hover:text-orange-500 transition-all">
                                  <span className="text-xs font-medium">{day}</span>
                                  <span className="text-lg font-bold">{13 + index}</span>
                              </button>
                          ))}
                      </div>

                      {/* Meals Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Breakfast */}
                          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                              <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
                                  <img src="https://placehold.co/100x100/FFF9C4/FBC02D?text=Yumurta" className="w-12 h-12 rounded-xl object-cover" alt="Meal" />
                              </div>
                              <div>
                                  <span className="text-xs font-bold text-yellow-500 uppercase tracking-wide">Kahvaltı</span>
                                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Avokadolu Omlet</h4>
                                  <p className="text-xs text-gray-400">10 dk • {activeChild.age_months ? `${activeChild.age_months} ay` : 'Bebek'}</p>
                              </div>
                              <div className="ml-auto w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 hover:bg-green-50 hover:border-green-200 hover:text-green-500 transition-all">
                                  <i className="fa-solid fa-check"></i>
                              </div>
                          </div>

                          {/* Lunch */}
                          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                  <img src="https://placehold.co/100x100/DCEDC8/689F38?text=Corba" className="w-12 h-12 rounded-xl object-cover" alt="Meal" />
                              </div>
                              <div>
                                  <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Öğle</span>
                                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Yeşil Mercimek Çorbası</h4>
                                  <p className="text-xs text-gray-400">30 dk • {activeChild.age_months ? `${activeChild.age_months} ay` : 'Bebek'}</p>
                              </div>
                              <div className="ml-auto w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 hover:bg-green-50 hover:border-green-200 hover:text-green-500 transition-all">
                                  <i className="fa-solid fa-check"></i>
                              </div>
                          </div>

                          {/* Dinner */}
                          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                  <img src="https://placehold.co/100x100/FFCC80/E65100?text=Kofte" className="w-12 h-12 rounded-xl object-cover" alt="Meal" />
                              </div>
                              <div>
                                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">Akşam</span>
                                  <h4 className="font-bold text-slate-800 text-sm md:text-base">Sebzeli Somon Köfte</h4>
                                  <p className="text-xs text-gray-400">20 dk • {activeChild.age_months ? `${activeChild.age_months} ay` : 'Bebek'}</p>
                              </div>
                              <div className="ml-auto w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 hover:bg-green-50 hover:border-green-200 hover:text-green-500 transition-all">
                                  <i className="fa-solid fa-check"></i>
                              </div>
                          </div>
                      </div>
                  </div>
                )}

                {/* 3. INFO WIDGETS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Shopping List Widget */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer hover:border-orange-200 transition-colors">
                        <div className="absolute -right-4 -top-4 bg-orange-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                            <i className="fa-solid fa-basket-shopping text-orange-500 mr-2"></i> Alışveriş Listesi
                        </h3>
                        {shoppingList.length > 0 ? (
                          <>
                            <ul className="space-y-3 mb-4">
                                {shoppingList.slice(0, 3).map((item) => (
                                  <li key={item.id} className="flex items-center text-sm text-gray-600">
                                      <span className={`w-2 h-2 ${item.checked ? 'bg-gray-400' : 'bg-green-400'} rounded-full mr-2`}></span>
                                      <span className={item.checked ? 'line-through text-gray-400' : ''}>{item.ingredient} {item.amount && `(${item.amount})`}</span>
                                  </li>
                                ))}
                            </ul>
                            <Link href="/alisveris-listesi" className="block w-full bg-gray-50 text-gray-600 font-bold py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors text-center">
                                Tüm Listeyi Gör ({shoppingList.length})
                            </Link>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 mb-4">Henüz alışveriş listeniz boş.</p>
                            <Link href="/tarifler" className="block w-full bg-gray-50 text-gray-600 font-bold py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors text-center">
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
                            <h3 className="font-bold text-slate-800 text-sm">Dyt. Ayşe Yılmaz</h3>
                        </div>
                        <p className="text-sm text-slate-700 italic mb-3">
                            &ldquo;{activeChild ? activeChild.name : 'Çocuğunuz'} için beslenme takvimi oluşturmayı unutmayın. Düzenli öğünler gelişim için önemlidir...&rdquo;
                        </p>
                        <Link href="#" className="text-xs font-bold text-green-600 hover:underline">Devamını Oku (Rejimde.com)</Link>
                    </div>

                    {/* Tools Widget */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
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

                    {/* BLW Test Results Widget */}
                    {blwResults.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
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
                          
                          // Tarih formatla (Invalid Date kontrolü)
                          const formatDate = (dateStr: string) => {
                            try {
                              const date = new Date(dateStr);
                              if (isNaN(date.getTime())) return 'Tarih bilinmiyor';
                              return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
                            } catch {
                              return 'Tarih bilinmiyor';
                            }
                          };
                          
                          // Sonuç kategorisi
                          const getResultCategory = (score: number) => {
                            if (score >= 80) return { text: 'Hazır', color: 'green', emoji: '✅', bg: 'bg-green-500' };
                            if (score >= 55) return { text: 'Neredeyse Hazır', color: 'amber', emoji: '⏳', bg: 'bg-amber-500' };
                            return { text: 'Biraz Daha Zaman', color: 'red', emoji: '⏰', bg: 'bg-red-500' };
                          };
                          
                          const category = getResultCategory(result.score);
                          
                          return (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-2 last:mb-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${category.bg}`}>
                                {Math.round(result.score)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-slate-800">{category.text}</p>
                                  <span className="text-lg">{category.emoji}</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {childName && <span className="font-medium text-slate-600">{childName} • </span>}
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
                                      <p key={i}>• {typeof flag === 'string' ? flag : flag.message}</p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Percentile Results Widget */}
                    {percentileResults.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
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
                            ? children.find(c => c.id === result.child_id)?.name || result.child_name
                            : null;
                          
                          // Tarih formatla
                          const formatDate = (dateStr: string) => {
                            try {
                              const date = new Date(dateStr);
                              if (isNaN(date.getTime())) return 'Tarih bilinmiyor';
                              return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
                            } catch {
                              return 'Tarih bilinmiyor';
                            }
                          };
                          
                          // Ölçüm türlerini göster
                          const getMeasurementSummary = (percentiles: PercentileValue[]) => {
                            const items = [];
                            const weight = percentiles.find(p => p.measurement_type === 'weight_for_age');
                            const height = percentiles.find(p => p.measurement_type === 'height_for_age');
                            const head = percentiles.find(p => p.measurement_type === 'head_for_age');
                            
                            if (weight) items.push(`Kilo: ${weight.percentile}p`);
                            if (height) items.push(`Boy: ${height.percentile}p`);
                            if (head) items.push(`Baş: ${head.percentile}p`);
                            
                            return items.join(' • ') || 'Ölçüm yok';
                          };
                          
                          // Genel durum rengi
                          const getOverallColor = (percentiles: PercentileValue[]) => {
                            const hasVeryLow = percentiles.some(p => p.category === 'very_low');
                            const hasVeryHigh = percentiles.some(p => p.category === 'very_high');
                            const hasLowOrHigh = percentiles.some(p => p.category === 'low' || p.category === 'high');
                            
                            if (hasVeryLow || hasVeryHigh) return { color: 'red', bg: 'bg-red-500' };
                            if (hasLowOrHigh) return { color: 'amber', bg: 'bg-amber-500' };
                            return { color: 'green', bg: 'bg-green-500' };
                          };
                          
                          const overallColor = getOverallColor(result.percentiles);
                          const hasWarnings = result.red_flags && result.red_flags.length > 0;
                          
                          return (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-2 last:mb-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${overallColor.bg}`}>
                                <i className="fa-solid fa-ruler-vertical text-lg"></i>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-800 text-sm">
                                  {getMeasurementSummary(result.percentiles)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {childName && <span className="font-medium text-slate-600">{childName} • </span>}
                                  {result.age_in_months > 0 ? `${result.age_in_months} aylık` : ''} 
                                  {result.age_in_months > 0 && ' • '}
                                  {formatDate(result.created_at)}
                                </p>
                              </div>
                              {hasWarnings && (
                                <div className="relative group">
                                  <div className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center cursor-help">
                                    <i className="fa-solid fa-exclamation text-xs"></i>
                                  </div>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <p className="font-bold mb-1">Dikkat:</p>
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
                      <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
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
                          
                          // Tarih formatla
                          const formatDate = (dateStr: string) => {
                            try {
                              const date = new Date(dateStr);
                              if (isNaN(date.getTime())) return 'Tarih bilinmiyor';
                              return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
                            } catch {
                              return 'Tarih bilinmiyor';
                            }
                          };
                          
                          // Sonuç kategorisi
                          const getResultCategory = (score: number) => {
                            if (score >= 80) return { text: 'Hazır', color: 'green', emoji: '🎉', bg: 'bg-green-500' };
                            if (score >= 50) return { text: 'Neredeyse Hazır', color: 'amber', emoji: '💪', bg: 'bg-amber-500' };
                            return { text: 'Biraz Daha Zaman', color: 'red', emoji: '🕐', bg: 'bg-red-500' };
                          };
                          
                          const category = getResultCategory(result.score);
                          
                          return (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-2 last:mb-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${category.bg}`}>
                                {Math.round(result.score)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-slate-800">{category.text}</p>
                                  <span className="text-lg">{category.emoji}</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {childName && <span className="font-medium text-slate-600">{childName} • </span>}
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
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <i className="fa-solid fa-sun text-yellow-500 mr-2"></i> Bugünün Menüsü
                      </h3>
                      <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                            <i className="fa-solid fa-bowl-food text-orange-500 text-2xl"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">Sebzeli Pirinç Pilavı</h4>
                            <p className="text-xs text-gray-500">{activeChild.age_months ? `${activeChild.age_months} ay` : 'Bebek'} • 25 dk</p>
                          </div>
                        </div>
                        <Link href="/tarifler" className="block w-full bg-orange-500 text-white text-center py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors">
                          Tarifi Gör
                        </Link>
                      </div>
                    </div>

                    {/* My Circles Widget */}
                    <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <i className="fa-solid fa-users text-purple-500 mr-2"></i> Çemberlerim
                      </h3>
                      <div className="space-y-2 mb-4">
                        <div className="bg-white rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-pointer">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-carrot text-purple-500 text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-slate-800">BLW Deneyimleri</p>
                            <p className="text-xs text-gray-500">24 yeni mesaj</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-pointer">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-apple-whole text-green-500 text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-slate-800">İlk 1000 Gün</p>
                            <p className="text-xs text-gray-500">12 yeni mesaj</p>
                          </div>
                        </div>
                      </div>
                      <Link href="/topluluk" className="block w-full bg-purple-500 text-white text-center py-2 rounded-xl text-sm font-bold hover:bg-purple-600 transition-colors">
                        Tüm Çemberler
                      </Link>
                    </div>

                    {/* Quick Shortcuts Widget */}
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <i className="fa-solid fa-bolt text-blue-500 mr-2"></i> Kısayollar
                      </h3>
                      <div className="space-y-2">
                        <Link href="/akilli-asistan" className="flex items-center gap-3 bg-white rounded-xl p-3 hover:shadow-sm transition-shadow">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-chart-line text-blue-500"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-slate-800">Büyüme Grafiği</p>
                            <p className="text-xs text-gray-500">Boy & kilo takibi</p>
                          </div>
                          <i className="fa-solid fa-chevron-right text-gray-300"></i>
                        </Link>
                        <Link href="/akilli-asistan" className="flex items-center gap-3 bg-white rounded-xl p-3 hover:shadow-sm transition-shadow">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-syringe text-green-500"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-slate-800">Aşı Takvimi</p>
                            <p className="text-xs text-gray-500">Aşı hatırlatıcı</p>
                          </div>
                          <i className="fa-solid fa-chevron-right text-gray-300"></i>
                        </Link>
                      </div>
                    </div>

                  </div>
                )}

            </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION (Sticky) */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link href="/dashboard" className="flex flex-col items-center text-orange-500">
                <i className="fa-solid fa-house text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Panelim</span>
            </Link>
            <Link href="/dashboard/haftalik-plan" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-calendar-days text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Plan</span>
            </Link>
            
            {/* Search FAB (Floating Action Button style in navbar) */}
            <div className="relative -top-8">
                <Link href="#" className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
                    <i className="fa-solid fa-magnifying-glass text-2xl"></i>
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

    </div>
  );
}