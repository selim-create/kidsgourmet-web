"use client";

import React, { useState } from 'react';
import Link from "next/link";

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("Tümü");

  const tabs = [
    { name: "Tümü", count: 24 },
    { name: "Tarifler", count: 18 },
    { name: "Malzemeler", count: 1 },
    { name: "Blog & Rehber", count: 3 },
    { name: "Topluluk", count: 2 }
  ];

  return (
    <div className="flex min-h-screen relative">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-20 h-[calc(100vh-5rem)] z-10 overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
                {/* Localde Link kullanın */}
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-house"></i> Genel Bakış
                </Link>
                <Link href="/dashboard/haftalik-plan" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-calendar-days"></i> Haftalık Plan
                </Link>
                {/* Active State */}
                <Link href="/favoriler" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
                    <i className="fa-solid fa-heart"></i> Favorilerim
                </Link>
                <Link href="/alisveris-listesi" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-basket-shopping"></i> Alışveriş Listesi
                </Link>
                <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hesap</p>
                </div>
                <Link href="/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-user"></i> Profilim
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-50 mt-auto">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Çıkış Yap
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100">
                <span className="font-display font-bold text-lg text-slate-800">Favorilerim</span>
                <button className="text-gray-500 text-xl"><i className="fa-solid fa-plus"></i></button>
            </div>

            {/* FAVORITES CONTENT */}
            <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">

                {/* 1. COLLECTIONS (Folders) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-bold text-xl text-slate-800">Koleksiyonlarım</h2>
                        <button className="text-orange-500 text-sm font-bold hover:underline">+ Yeni Oluştur</button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {/* Collection 1 */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group text-center">
                            <div className="w-12 h-12 mx-auto bg-orange-50 rounded-full flex items-center justify-center text-orange-500 text-xl mb-3 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-mug-hot"></i>
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm">Kahvaltılar</h3>
                            <p className="text-xs text-gray-400 mt-1">12 Tarif</p>
                        </div>

                        {/* Collection 2 */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group text-center">
                            <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-xl mb-3 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-snowflake"></i>
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm">Buzluk İçin</h3>
                            <p className="text-xs text-gray-400 mt-1">5 Tarif</p>
                        </div>

                        {/* Collection 3 */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group text-center">
                            <div className="w-12 h-12 mx-auto bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xl mb-3 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-carrot"></i>
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm">Sebzeli</h3>
                            <p className="text-xs text-gray-400 mt-1">8 Tarif</p>
                        </div>

                        {/* Add New (Placeholder Visual) */}
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-colors cursor-pointer h-full">
                            <i className="fa-solid fa-plus text-xl mb-2"></i>
                            <span className="text-xs font-bold">Yeni Liste</span>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-200" />

                {/* 2. FILTER TABS & SEARCH */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        
                        {/* Tabs (Horizontal Scroll) */}
                        <div className="flex gap-2 overflow-x-auto hide-scroll pb-2 w-full md:w-auto scrollbar-hide">
                            {tabs.map((tab) => (
                                <button 
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm whitespace-nowrap transition-all border ${
                                        activeTab === tab.name 
                                        ? "bg-slate-800 text-white border-slate-800" 
                                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500"
                                    }`}
                                >
                                    {tab.name} <span className={`ml-1 text-xs ${activeTab === tab.name ? "text-gray-300" : "text-gray-400"}`}>({tab.count})</span>
                                </button>
                            ))}
                        </div>
                        
                        {/* Search Within Favorites */}
                        <div className="relative w-full md:w-64 flex-shrink-0">
                            <input type="text" placeholder="Favorilerde ara..." className="w-full bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-2.5 text-gray-400 text-xs"></i>
                        </div>
                    </div>

                    {/* CONTENT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        
                        {/* Render content based on active tab (Mockup logic) */}
                        {(activeTab === "Tümü" || activeTab === "Tarifler") && (
                            <>
                                {/* Recipe Card 1 */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        <img src="https://placehold.co/400x300/FFF8E1/FF8A65?text=Pankek" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Pankek" />
                                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform">
                                            <i className="fa-solid fa-heart"></i>
                                        </button>
                                        <div className="absolute bottom-3 left-3">
                                            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                                +8 Ay
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col">
                                        <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">Muzlu Bebek Pankeki</h3>
                                        <p className="text-xs text-gray-500 mb-3">Kahvaltılar</p>
                                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                                            <span className="text-xs text-gray-400"><i className="fa-regular fa-clock mr-1"></i> 15 dk</span>
                                            <button className="text-gray-400 hover:text-slate-600"><i className="fa-solid fa-ellipsis"></i></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Recipe Card 2 */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        <img src="https://placehold.co/400x300/E8F5E9/AED581?text=Corba" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Çorba" />
                                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform">
                                            <i className="fa-solid fa-heart"></i>
                                        </button>
                                        <div className="absolute bottom-3 left-3">
                                            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                                +6 Ay
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col">
                                        <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">Brokoli Çorbası</h3>
                                        <p className="text-xs text-gray-500 mb-3">Sebzeli, Buzluk İçin</p>
                                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                                            <span className="text-xs text-gray-400"><i className="fa-regular fa-clock mr-1"></i> 25 dk</span>
                                            <button className="text-gray-400 hover:text-slate-600"><i className="fa-solid fa-ellipsis"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Ingredient Card (Mockup for other tabs) */}
                        {(activeTab === "Tümü" || activeTab === "Malzemeler") && (
                             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col relative">
                                <div className="absolute top-3 right-3 z-10">
                                    <button className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-heart"></i>
                                    </button>
                                </div>
                                <div className="w-full h-40 bg-green-50 relative overflow-hidden">
                                    <img src="https://placehold.co/400x300/AED581/ffffff?text=Avokado" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Avokado" />
                                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                                        +6 Ay
                                    </div>
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <h3 className="font-bold text-slate-800 mb-1 group-hover:text-green-500 transition-colors">Avokado</h3>
                                    <p className="text-xs text-gray-500 mb-3">Malzeme Rehberi</p>
                                    <div className="mt-auto pt-3 border-t border-gray-50">
                                         <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded border border-green-200">Düşük Alerjen</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Blog Post Card */}
                        {(activeTab === "Tümü" || activeTab === "Blog & Rehber") && (
                             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col relative">
                                <div className="absolute top-3 right-3 z-10">
                                    <button className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-heart"></i>
                                    </button>
                                </div>
                                <div className="w-full h-40 bg-blue-50 relative overflow-hidden">
                                    <img src="https://placehold.co/400x300/E3F2FD/81D4FA?text=Su+Tuketimi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Su Tüketimi" />
                                    <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-blue-500 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                        Sağlık
                                    </span>
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-500 transition-colors line-clamp-2">Bebekler Ne Zaman Su İçmeli?</h3>
                                    <p className="text-xs text-gray-500 mb-3">Blog Yazısı</p>
                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                                        <span className="text-xs text-gray-400">4 dk okuma</span>
                                        <button className="text-gray-400 hover:text-slate-600"><i className="fa-solid fa-ellipsis"></i></button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </section>

            </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {/* Localde Link kullanın */}
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
            <Link href="/favoriler" className="flex flex-col items-center text-orange-500 transition-colors">
                <i className="fa-solid fa-heart text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Favoriler</span>
            </Link>
            <Link href="/profil" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-user text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Profil</span>
            </Link>
        </div>

    </div>
  );
}