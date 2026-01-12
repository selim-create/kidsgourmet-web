"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'; 

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || "Avokado"; // Varsayılan veya URL'den gelen sorgu
  const [activeTab, setActiveTab] = useState("Tümü");

  const tabs = ["Tümü (24)", "Tarifler (18)", "Malzemeler (1)", "Blog & Rehber (3)", "Topluluk (2)"];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* MOBILE SEARCH HEADER (Sticky) */}
        <div className="lg:hidden bg-white px-4 py-3 border-b border-gray-100 sticky top-20 z-30">
            <div className="relative">
                <input type="text" defaultValue={query} className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-orange-500 outline-none" />
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400"></i>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* SEARCH META */}
            <div className="mb-8">
                <h1 className="font-display font-bold text-2xl text-slate-800">
                    "<span className="text-orange-500">{query}</span>" için sonuçlar
                </h1>
                <p className="text-sm text-gray-500">Toplam 24 sonuç bulundu</p>
            </div>

            {/* TABS (Filters) */}
            <div className="flex gap-2 overflow-x-auto hide-scroll mb-8 pb-2 scrollbar-hide">
                {tabs.map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-full font-bold text-sm shadow-md whitespace-nowrap transition-all ${
                            activeTab === tab 
                            ? "bg-slate-800 text-white" 
                            : "bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* MAIN CONTENT */}
                <div className="lg:col-span-3 space-y-10">

                    {/* 1. INGREDIENT HIGHLIGHT (If exact match) */}
                    {(activeTab === "Tümü (24)" || activeTab === "Malzemeler (1)") && (
                        <section>
                            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-book-open text-green-500"></i> Malzeme Rehberi
                            </h2>
                            {/* Localde Link kullanın */}
                            <Link href="/malzeme-rehberi/avokado" className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow group">
                                <div className="w-full sm:w-32 h-32 rounded-2xl bg-green-50 flex-shrink-0 overflow-hidden relative">
                                    <img src="https://placehold.co/200x200/AED581/ffffff?text=Avokado" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Avokado" />
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm text-slate-800">
                                        +6 Ay
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-display font-bold text-2xl text-slate-800 mb-2 group-hover:text-green-500 transition-colors">Avokado</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        Bebekler için mükemmel bir ilk gıda! Sağlıklı yağlar, lif ve vitaminlerle dolu. Alerji riski düşük, sindirimi kolay.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Düşük Alerjen</span>
                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">Her Mevsim</span>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center justify-center">
                                    <i className="fa-solid fa-chevron-right text-gray-300 text-xl group-hover:text-green-500 transition-colors"></i>
                                </div>
                            </Link>
                        </section>
                    )}

                    {/* 2. RECIPES GRID */}
                    {(activeTab === "Tümü (24)" || activeTab === "Tarifler (18)") && (
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <i className="fa-solid fa-utensils text-orange-500"></i> Tarifler
                                </h2>
                                <Link href="#" className="text-xs font-bold text-orange-500 hover:underline">Tümünü Gör (18)</Link>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Recipe Card 1 */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    <div className="relative h-40 overflow-hidden">
                                        <img src="https://placehold.co/400x300/FFF3E0/FF8A65?text=Pure" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Püre" />
                                        <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-800">+6 Ay</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-orange-500">Muzlu Avokado Püresi</h3>
                                        <p className="text-xs text-gray-400">Kahvaltı • 5 dk</p>
                                    </div>
                                </div>

                                {/* Recipe Card 2 */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    <div className="relative h-40 overflow-hidden">
                                        <img src="https://placehold.co/400x300/E3F2FD/81D4FA?text=Tost" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Tost" />
                                        <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-800">+12 Ay</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-orange-500">Ayıcıklı Avokado Tost</h3>
                                        <p className="text-xs text-gray-400">Atıştırmalık • 10 dk</p>
                                    </div>
                                </div>

                                {/* Recipe Card 3 */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    <div className="relative h-40 overflow-hidden">
                                        <img src="https://placehold.co/400x300/F3E5F5/AB47BC?text=Makarna" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Makarna" />
                                        <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-800">+9 Ay</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-orange-500">Avokado Soslu Makarna</h3>
                                        <p className="text-xs text-gray-400">Ana Öğün • 15 dk</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 3. BLOG & COMMUNITY (List) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Blog Results */}
                        {(activeTab === "Tümü (24)" || activeTab === "Blog & Rehber (3)") && (
                            <section>
                                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-newspaper text-blue-400"></i> Blog Yazıları
                                </h2>
                                <div className="space-y-4">
                                    <Link href="#" className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <img src="https://placehold.co/100x100/E1F5FE/0288D1?text=Yaglar" className="w-16 h-16 rounded-xl object-cover" alt="Yağlar" />
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-500">Bebekler İçin Sağlıklı Yağlar</h4>
                                            <p className="text-xs text-gray-500 line-clamp-2">Zeytinyağı, avokado ve tereyağı kullanımı hakkında...</p>
                                        </div>
                                    </Link>
                                    <Link href="#" className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <img src="https://placehold.co/100x100/FFF9C4/FBC02D?text=Kahvalti" className="w-16 h-16 rounded-xl object-cover" alt="Kahvaltı" />
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-500">BLW Kahvaltı Fikirleri</h4>
                                            <p className="text-xs text-gray-500 line-clamp-2">Avokado dilimleri ve yumurta ile başlangıç...</p>
                                        </div>
                                    </Link>
                                </div>
                            </section>
                        )}

                        {/* Community Results */}
                        {(activeTab === "Tümü (24)" || activeTab === "Topluluk (2)") && (
                            <section>
                                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-comments text-purple-400"></i> Topluluk
                                </h2>
                                <div className="space-y-4">
                                    <Link href="#" className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <h4 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-purple-500">Avokado sevmeyen bebeğe nasıl yediririm?</h4>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span>Zeynep K. • 2 gün önce</span>
                                            <span><i className="fa-regular fa-comment mr-1"></i> 12 Cevap</span>
                                        </div>
                                    </Link>
                                    <Link href="#" className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <h4 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-purple-500">Avokado kararmadan nasıl saklanır?</h4>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span>Mert B. • 1 hafta önce</span>
                                            <span><i className="fa-regular fa-comment mr-1"></i> 5 Cevap</span>
                                        </div>
                                    </Link>
                                </div>
                            </section>
                        )}

                    </div>

                </div>

                {/* RIGHT SIDEBAR (Filters & Suggestions) */}
                <aside className="hidden lg:block lg:col-span-1 space-y-6">
                    
                    {/* Filters Widget */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm">Filtrele</h3>
                        
                        <div className="mb-4">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Yaş Grubu</p>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 accent-orange-500" />
                                    6-9 Ay
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 accent-orange-500" />
                                    9-12 Ay
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 accent-orange-500" />
                                    12+ Ay
                                </label>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Özellik</p>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 accent-orange-500" />
                                    BLW Uygun
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 accent-orange-500" />
                                    Yumurtasız
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Ad / Promo */}
                    <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
                        <h3 className="font-bold text-slate-800 mb-2">Haftalık Menü</h3>
                        <p className="text-xs text-gray-600 mb-4">Bebeğinize özel beslenme planı oluşturun.</p>
                        <button className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">Planla</button>
                    </div>

                </aside>

            </div>
        </div>

    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <SearchContent />
    </Suspense>
  );
}