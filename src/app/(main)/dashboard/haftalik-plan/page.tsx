"use client";

import React, { useState } from 'react';
import Link from "next/link"; 

export default function WeeklyPlanPage() {
  // Mockup Verisi: Kullanıcının çocukları
  const children = [
    { id: 1, name: "Deniz", age: "9 Aylık", image: "https://placehold.co/100x100/FFF3E0/FF8A65?text=D" },
    { id: 2, name: "Ada", age: "3 Yaş", image: "https://placehold.co/100x100/E1BEE7/8E24AA?text=A" }
  ];

  const [activeChildId, setActiveChildId] = useState(1);
  const activeChild = children.find(c => c.id === activeChildId) || children[0];

  return (
    <div className="flex min-h-screen relative">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-20 h-[calc(100vh-5rem)] z-10 overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
                {/* Localde Link kullanın */}
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-house"></i> Genel Bakış
                </Link>
                <Link href="/dashboard/haftalik-plan" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
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

            <div className="p-4 border-t border-gray-50 mt-auto">
                <Link href="/profil" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <img src="https://placehold.co/100x100/FFCC80/ffffff?text=E" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">Elif Yılmaz</p>
                        <p className="text-xs text-gray-400 truncate">Hesabım</p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                </Link>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100 flex-shrink-0">
                <span className="font-display font-bold text-lg text-slate-800">Haftalık Plan</span>
                <div className="flex gap-2">
                    <button className="text-gray-500 text-xl"><i className="fa-solid fa-print"></i></button>
                    <button className="text-orange-500 text-xl"><i className="fa-solid fa-share-nodes"></i></button>
                </div>
            </div>

            {/* PLAN HEADER & CONTROLS */}
            <div className="bg-white border-b border-gray-100 p-4 md:p-6 z-20 shadow-sm md:shadow-none flex-shrink-0">
                <div className="max-w-6xl mx-auto">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        
                        {/* Child Switcher & Date Nav */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            {/* Child Dropdown (Mock) */}
                            <div className="relative group cursor-pointer bg-orange-50 px-4 py-2 rounded-full flex items-center gap-2 border border-orange-100 hover:bg-orange-100 transition-colors">
                                <img src={activeChild.image} className="w-6 h-6 rounded-full" alt={activeChild.name} />
                                <span className="text-sm font-bold text-slate-800">{activeChild.name} ({activeChild.age})</span>
                                <i className="fa-solid fa-chevron-down text-xs text-orange-500"></i>
                                
                                {/* Dropdown Menu (Hidden by default, shown on hover in real implementation) */}
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:block p-1">
                                    {children.map(child => (
                                        <div key={child.id} onClick={() => setActiveChildId(child.id)} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                                            <img src={child.image} className="w-6 h-6 rounded-full" alt={child.name} />
                                            <span className="text-sm font-medium text-slate-700">{child.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Date Nav */}
                            <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-200">
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <span className="px-4 text-sm font-bold text-slate-700">12 - 18 Ocak</span>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                                <i className="fa-solid fa-basket-shopping"></i> Liste Oluştur
                            </button>
                            <button className="hidden md:flex bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors gap-2 items-center">
                                <i className="fa-solid fa-print"></i> Yazdır
                            </button>
                        </div>
                    </div>

                    {/* Weekly Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <i className="fa-solid fa-leaf"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-green-600 uppercase">Sebze</p>
                                <p className="text-sm font-bold text-slate-800">12 Porsiyon</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <i className="fa-solid fa-egg"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-600 uppercase">Protein</p>
                                <p className="text-sm font-bold text-slate-800">8 Porsiyon</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                <i className="fa-solid fa-wheat-awn"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-yellow-600 uppercase">Tahıl</p>
                                <p className="text-sm font-bold text-slate-800">6 Porsiyon</p>
                            </div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-red-600 uppercase">Alerjen</p>
                                <p className="text-sm font-bold text-slate-800">2 Yeni</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* MAIN GRID & RECIPE POOL */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* WEEK GRID (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto pb-24">
                        
                        {/* Desktop: 7 Columns Grid / Mobile: Vertical Stack */}
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-[600px]">
                            
                            {/* Day Column: Monday */}
                            <div className="flex flex-col gap-3">
                                <div className="text-center p-2 bg-white rounded-xl shadow-sm border-b-2 border-orange-500">
                                    <span className="text-xs text-gray-400 font-bold uppercase">Pazartesi</span>
                                    <div className="text-lg font-bold text-slate-800">12</div>
                                </div>
                                
                                {/* Breakfast Slot */}
                                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative cursor-pointer">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-[10px] font-bold text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded">Kahvaltı</span>
                                        <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-xmark"></i></button>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src="https://placehold.co/100x100/FFF9C4/FBC02D?text=Omlet" className="w-10 h-10 rounded-lg object-cover" alt="Meal" />
                                        <p className="text-xs font-bold text-slate-700 line-clamp-2">Avokadolu Omlet</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1"><i className="fa-regular fa-clock"></i> 10 dk</p>
                                </div>

                                {/* Lunch Slot */}
                                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative cursor-pointer">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Öğle</span>
                                        <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-xmark"></i></button>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src="https://placehold.co/100x100/DCEDC8/689F38?text=Corba" className="w-10 h-10 rounded-lg object-cover" alt="Meal" />
                                        <p className="text-xs font-bold text-slate-700 line-clamp-2">Yeşil Mercimek Çorbası</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1"><i className="fa-regular fa-clock"></i> 30 dk</p>
                                </div>

                                {/* Snack Slot (Empty) */}
                                <button className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all h-20 group">
                                    <i className="fa-solid fa-plus mr-1 group-hover:scale-110 transition-transform"></i> <span className="text-xs font-bold">Ara Öğün</span>
                                </button>

                                {/* Dinner Slot */}
                                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative cursor-pointer">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">Akşam</span>
                                        <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-xmark"></i></button>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src="https://placehold.co/100x100/FFCC80/E65100?text=Kofte" className="w-10 h-10 rounded-lg object-cover" alt="Meal" />
                                        <p className="text-xs font-bold text-slate-700 line-clamp-2">Sebzeli Somon Köfte</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1"><i className="fa-regular fa-clock"></i> 20 dk</p>
                                </div>
                            </div>

                            {/* Day Column: Tuesday (Simplified for Mockup) */}
                            <div className="flex flex-col gap-3 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="text-center p-2 bg-white rounded-xl shadow-sm border-b-2 border-gray-200">
                                    <span className="text-xs text-gray-400 font-bold uppercase">Salı</span>
                                    <div className="text-lg font-bold text-slate-800">13</div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-[10px] font-bold text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded mb-2 inline-block">Kahvaltı</span>
                                    <p className="text-xs font-bold text-slate-700">Yulaflı Muzlu Lapa</p>
                                </div>
                                <button className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center text-gray-400 h-20 text-xs font-bold hover:bg-gray-50 transition-colors">Öğle Ekle</button>
                                <button className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center text-gray-400 h-20 text-xs font-bold hover:bg-gray-50 transition-colors">Ara Ekle</button>
                                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded mb-2 inline-block">Akşam</span>
                                    <p className="text-xs font-bold text-slate-700">Buharda Brokoli & Patates</p>
                                </div>
                            </div>

                            {/* Other days placeholder columns */}
                            {['Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, i) => (
                                <div key={day} className="hidden md:flex flex-col gap-3 opacity-50 hover:opacity-100 transition-opacity">
                                    <div className="text-center p-2 bg-white rounded-xl shadow-sm"><span className="text-xs text-gray-400 font-bold">{day}</span><div className="text-lg font-bold">{14 + i}</div></div>
                                    <div className="flex-1 bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 text-sm font-bold hover:border-orange-300 hover:text-orange-300 hover:bg-orange-50 cursor-pointer transition-all">Planla</div>
                                </div>
                            ))}

                        </div>
                        
                        {/* AI Suggestion Box (Bottom) */}
                        <div className="mt-8 bg-purple-50 border border-purple-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-500 shadow-sm text-2xl flex-shrink-0">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-bold text-slate-800 mb-1">Plan yapmakla uğraşma!</h3>
                                <p className="text-sm text-gray-600">Hip AI, {activeChild.name}'in alerjilerine ve gelişim ihtiyaçlarına göre haftayı otomatik doldursun mu?</p>
                            </div>
                            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-colors whitespace-nowrap">
                                Otomatik Doldur
                            </button>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDEBAR: RECIPE POOL (Desktop Only) */}
                <aside className="hidden lg:flex w-80 bg-white border-l border-gray-100 flex-col z-10 shadow-lg shadow-gray-100/50">
                    <div className="p-4 border-b border-gray-50">
                        <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Tarif Havuzu</h3>
                        <div className="relative">
                            <input type="text" placeholder="Tarif ara..." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Favorilerim</p>
                        
                        {/* Draggable Recipe Card */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-orange-500 cursor-move group transition-colors">
                            <div className="flex gap-3">
                                <img src="https://placehold.co/100x100/E8F5E9/AED581?text=Pancake" className="w-12 h-12 rounded-lg object-cover" alt="Recipe" />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-orange-500 transition-colors">Ispanaklı Pankek</h4>
                                    <div className="flex gap-2 text-[10px] text-gray-500 mt-1">
                                        <span><i className="fa-regular fa-clock"></i> 20 dk</span>
                                        <span><i className="fa-solid fa-fire"></i> 140 kcal</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Draggable Recipe Card */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-orange-500 cursor-move group transition-colors">
                            <div className="flex gap-3">
                                <img src="https://placehold.co/100x100/FFF3E0/FF8A65?text=Muffin" className="w-12 h-12 rounded-lg object-cover" alt="Recipe" />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-orange-500 transition-colors">Havuçlu Muffin</h4>
                                    <div className="flex gap-2 text-[10px] text-gray-500 mt-1">
                                        <span><i className="fa-regular fa-clock"></i> 35 dk</span>
                                        <span><i className="fa-solid fa-fire"></i> 180 kcal</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Bu Hafta Önerilenler</p>
                        
                        {/* Suggested Recipe */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-orange-500 cursor-move group transition-colors">
                            <div className="flex gap-3">
                                <img src="https://placehold.co/100x100/E3F2FD/81D4FA?text=Yogurt" className="w-12 h-12 rounded-lg object-cover" alt="Recipe" />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-orange-500 transition-colors">Ev Yapımı Yoğurt</h4>
                                    <div className="flex gap-2 text-[10px] text-gray-500 mt-1">
                                        <span><i className="fa-regular fa-clock"></i> 8 sa</span>
                                        <span><i className="fa-solid fa-leaf"></i> Probiyotik</span>
                                    </div>
                                </div>
                            </div>
                        </div>

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

    </div>
  );
}