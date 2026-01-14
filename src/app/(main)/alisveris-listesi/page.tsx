"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useUser } from '@/hooks/use-user';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { ShoppingCategory } from '@/lib/types';
import { toast } from 'sonner';

// Kategori konfigürasyonu
const CATEGORY_CONFIG: Record<ShoppingCategory, { name: string; icon: string; colorClasses: { bg: string; border: string; text: string; badge: string } }> = {
  fruits_vegetables: { 
    name: 'Meyve & Sebze', 
    icon: 'fa-apple-whole', 
    colorClasses: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-500', badge: 'bg-white text-green-600' }
  },
  meat_protein: { 
    name: 'Et & Protein', 
    icon: 'fa-drumstick-bite', 
    colorClasses: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-500', badge: 'bg-white text-red-600' }
  },
  dairy: { 
    name: 'Süt Ürünleri', 
    icon: 'fa-cheese', 
    colorClasses: { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-500', badge: 'bg-white text-yellow-600' }
  },
  grains: { 
    name: 'Kuru Gıda', 
    icon: 'fa-wheat-awn', 
    colorClasses: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-500', badge: 'bg-white text-amber-600' }
  },
  other: { 
    name: 'Diğer', 
    icon: 'fa-basket-shopping', 
    colorClasses: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-500', badge: 'bg-white text-blue-600' }
  },
};

export default function ShoppingListPage() {
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const { items, isLoading, addItems, removeItem, toggleItem, shareWhatsapp } = useShoppingList();
  const [newItem, setNewItem] = useState("");

  // Kategorilere göre grupla
  const groupedItems = items.reduce((acc, item) => {
    const itemWithCategory = item as typeof item & { category?: ShoppingCategory };
    const category = itemWithCategory.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Yeni item ekle
  const handleAddItem = async () => {
    if (!newItem.trim()) {
      toast.error('Lütfen bir ürün adı girin');
      return;
    }

    try {
      await addItems([{
        ingredient: newItem.trim(),
        checked: false,
      }]);
      setNewItem('');
      toast.success('Ürün eklendi');
    } catch {
      toast.error('Ürün eklenemedi');
    }
  };

  // İstatistikler
  const totalCount = items.length;
  const checkedCount = items.filter(i => i.checked).length;
  const remainingCount = totalCount - checkedCount;

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fa-solid fa-lock text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-gray-600 mb-4">Alışveriş listenizi görüntülemek için giriş yapın</p>
          <Link href="/giris" className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-20 h-[calc(100vh-5rem)] z-10 overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-house"></i> Genel Bakış
                </Link>
                <Link href="/dashboard/haftalik-plan" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-calendar-days"></i> Haftalık Plan
                </Link>
                <Link href="/favoriler" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-heart"></i> Favorilerim
                </Link>
                <Link href="/alisveris-listesi" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
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

            <div className="p-4 border-t border-gray-50 mt-auto">
                <Link href="/profil" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <img src={user?.avatar_url || 'https://placehold.co/100x100/FFCC80/ffffff?text=U'} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.display_name}</p>
                        <p className="text-xs text-gray-400 truncate">Hesabım</p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                </Link>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100">
                <span className="font-display font-bold text-lg text-slate-800">Alışveriş Listesi</span>
                <button onClick={shareWhatsapp} className="text-orange-500 text-xl">
                  <i className="fa-solid fa-share-nodes"></i>
                </button>
            </div>

            {/* SHOPPING LIST CONTENT */}
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">

                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div>
                        <h1 className="font-display font-bold text-2xl text-slate-800">Alışveriş Listem</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            <span className="font-bold text-orange-500">{checkedCount}</span> tamamlandı, 
                            <span className="font-bold text-slate-800"> {remainingCount}</span> kaldı
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          onClick={shareWhatsapp}
                          className="flex-1 md:flex-none bg-green-50 text-green-600 hover:bg-green-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <i className="fa-brands fa-whatsapp text-lg"></i> Paylaş
                        </button>
                        <button className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-600 hover:border-gray-300 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                            <i className="fa-solid fa-print"></i> Yazdır
                        </button>
                    </div>
                </div>

                {/* ADD ITEM INPUT */}
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Hızlıca ürün ekle (Örn: Bebek bisküvisi)" 
                        className="w-full py-4 pl-6 pr-14 rounded-2xl border-2 border-gray-100 shadow-sm focus:border-orange-500 outline-none text-gray-700 transition-colors"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                    />
                    <button 
                      onClick={handleAddItem}
                      className="absolute right-2 top-2 bottom-2 bg-orange-500 hover:bg-orange-600 text-white w-12 rounded-xl font-bold transition-colors text-xl"
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <i className="fa-solid fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
                      <p className="text-gray-600">Yükleniyor...</p>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && items.length === 0 && (
                  <div className="bg-gray-50 rounded-3xl p-12 text-center">
                    <i className="fa-solid fa-basket-shopping text-5xl text-gray-300 mb-4"></i>
                    <h3 className="font-bold text-xl text-slate-800 mb-2">Liste boş</h3>
                    <p className="text-gray-600">
                      Haftalık planınızdan alışveriş listesi oluşturabilir veya manuel olarak ürün ekleyebilirsiniz.
                    </p>
                  </div>
                )}

                {/* CATEGORIES GRID */}
                {!isLoading && items.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {Object.entries(groupedItems).map(([categoryKey, categoryItems]) => {
                        const category = categoryKey as ShoppingCategory;
                        const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
                        
                        return (
                          <div key={category} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                              <div className={`${config.colorClasses.bg} p-4 ${config.colorClasses.border} border-b flex justify-between items-center`}>
                                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                      <i className={`fa-solid ${config.icon} ${config.colorClasses.text}`}></i> {config.name}
                                  </h3>
                                  <span className={`text-xs font-bold ${config.colorClasses.badge} px-2 py-1 rounded-lg`}>
                                    {categoryItems.length} Ürün
                                  </span>
                              </div>
                              <div className="p-2">
                                  {categoryItems.map((item) => (
                                      <label 
                                        key={item.id} 
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors select-none"
                                      >
                                          <input 
                                              type="checkbox" 
                                              checked={item.checked}
                                              onChange={() => toggleItem(item.id)}
                                              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer" 
                                          />
                                          <div className={`flex-1 flex justify-between items-center transition-all ${item.checked ? 'line-through text-gray-400 opacity-60' : ''}`}>
                                              <span className="font-medium text-slate-700">{item.ingredient}</span>
                                              {item.amount && (
                                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.checked ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                                                  {item.amount}
                                                </span>
                                              )}
                                          </div>
                                          <button 
                                            onClick={(e) => {
                                              e.preventDefault();
                                              removeItem(item.id);
                                            }}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all px-2"
                                          >
                                              <i className="fa-solid fa-trash-can"></i>
                                          </button>
                                      </label>
                                  ))}
                              </div>
                          </div>
                        );
                      })}

                  </div>
                )}

            </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link href="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-house text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Panelim</span>
            </Link>
            <Link href="/dashboard/haftalik-plan" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-calendar-days text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Plan</span>
            </Link>
            <div className="relative -top-8">
                <Link href="/alisveris-listesi" className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
                    <i className="fa-solid fa-basket-shopping text-2xl"></i>
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
