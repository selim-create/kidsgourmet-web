"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { userService } from "@/services/user-service";
import { Child, RecipeCard, ShoppingListItem } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useUser();
  const [children, setChildren] = useState<Child[]>([]);
  const [favorites, setFavorites] = useState<RecipeCard[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [childrenData, favoritesData, shoppingListData] = await Promise.all([
          userService.getChildren(),
          userService.getFavorites(),
          userService.getShoppingList(),
        ]);
        
        setChildren(childrenData);
        setFavorites(favoritesData);
        setShoppingList(shoppingListData);
        
        // Set active child to first child if available
        if (childrenData.length > 0) {
          setActiveChildId(childrenData[0].id);
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Veriler yüklenirken hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const activeChild = children.find(c => c.id === activeChildId) || children[0];

  // Loading state
  if (isLoading) {
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
                <Link href="/araclar" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-chart-line"></i> Gelişim Takibi
                </Link>
                <Link href="/araclar" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
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
                                        onClick={() => setActiveChildId(child.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                                            activeChildId === child.id 
                                            ? "bg-white/20 backdrop-blur border-white/40 shadow-sm ring-2 ring-white" 
                                            : "bg-black/10 hover:bg-black/20 border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border ${activeChildId === child.id ? "border-white" : "border-white/50"} bg-white/20 flex items-center justify-center text-xs font-bold`}>
                                          {child.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`text-sm ${activeChildId === child.id ? "font-bold" : "font-medium"}`}>{child.name}</span>
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
                                          {activeChild.age_months ? `${activeChild.age_months} Aylık` : 'Bebek'}
                                      </div>
                                  </div>

                                  <div className="text-center md:text-left flex-1">
                                      <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">{activeChild.name} bugün harika görünüyor! 🌟</h1>
                                      <p className="text-orange-100 text-sm md:text-base mb-4 max-w-xl">
                                          {activeChild.notes || 'Çocuğunuzun gelişimi için özel tarifler ve öneriler burada.'}
                                      </p>
                                      
                                      {/* Quick Stats/Info */}
                                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                          {activeChild.allergens && activeChild.allergens.length > 0 && (
                                            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2 text-xs md:text-sm font-bold border border-white/10">
                                                <i className="fa-solid fa-triangle-exclamation"></i> {activeChild.allergens.length} Alerjen
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
                            "{activeChild ? activeChild.name : 'Çocuğunuz'} için beslenme takvimi oluşturmayı unutmayın. Düzenli öğünler gelişim için önemlidir..."
                        </p>
                        <Link href="#" className="text-xs font-bold text-green-600 hover:underline">Devamını Oku (Rejimde.com)</Link>
                    </div>

                    {/* Tools Widget */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                            <i className="fa-solid fa-toolbox text-blue-400 mr-2"></i> Hızlı Araçlar
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/malzeme-rehberi" className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-3 rounded-2xl transition-colors">
                                <i className="fa-solid fa-magnifying-glass text-blue-500 mb-1"></i>
                                <span className="text-xs font-bold text-blue-700">Gıda Ara</span>
                            </Link>
                            <Link href="/araclar" className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 p-3 rounded-2xl transition-colors">
                                <i className="fa-solid fa-chart-line text-purple-500 mb-1"></i>
                                <span className="text-xs font-bold text-purple-700">Gelişim</span>
                            </Link>
                        </div>
                    </div>

                </div>

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