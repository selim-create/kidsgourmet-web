"use client";

import React, { useState, use } from 'react';
import Link from "next/link";

export default function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // Mockup Verisi
  const user = {
    name: "Elif Yılmaz",
    username: "@elif_yilmaz",
    image: "https://placehold.co/200x200/FFCC80/ffffff?text=EY",
    bio: "👩‍🍳 2 Çocuk Annesi (9 Ay & 3 Yaş) \n 🥑 BLW ve Doğal Beslenme Tutkunu \n 📍 İstanbul",
    stats: {
      recipes: 14,
      collections: 8,
      followers: 245
    },
    isVerified: true
  };

  const [activeTab, setActiveTab] = useState("tarifler");

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
                <Link href="/alisveris-listesi" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-basket-shopping"></i> Alışveriş Listesi
                </Link>
                <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hesap</p>
                </div>
                <Link href="/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
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
            <div className="lg:hidden bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-20 z-30 border-b border-gray-100">
                <Link href="/topluluk" className="text-slate-800 text-lg"><i className="fa-solid fa-arrow-left"></i></Link>
                <span className="font-display font-bold text-lg text-slate-800">{user.username}</span>
                <button className="ml-auto text-gray-500 text-lg"><i className="fa-solid fa-ellipsis-vertical"></i></button>
            </div>

            {/* HERO COVER & PROFILE INFO */}
            <div className="bg-white border-b border-gray-100">
                {/* Cover Image */}
                <div className="h-32 md:h-48 bg-gradient-to-r from-orange-100 to-pink-100 w-full relative"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="flex flex-col md:flex-row items-end md:items-center -mt-12 md:-mt-16 gap-6 relative z-10">
                        {/* Avatar */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex-shrink-0">
                            <img src={user.image} className="w-full h-full object-cover" alt={user.name} />
                        </div>

                        {/* Info & Actions */}
                        <div className="flex-1 w-full md:w-auto">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-bold text-2xl text-slate-800 flex items-center gap-2">
                                        {user.name} {user.isVerified && <i className="fa-solid fa-circle-check text-blue-400 text-sm" title="Onaylı Ebeveyn"></i>}
                                    </h1>
                                    <p className="text-gray-500 text-sm">{user.username}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-sm hover:bg-orange-600 transition-colors">
                                        Takip Et
                                    </button>
                                    <button className="bg-white border border-gray-200 text-gray-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                                        <i className="fa-solid fa-share-nodes"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio & Stats */}
                    <div className="mt-6 md:pl-40"> 
                        <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-2xl mb-4 whitespace-pre-line">
                            {user.bio}
                        </p>
                        
                        <div className="flex gap-6 text-sm">
                            <div className="flex gap-1">
                                <span className="font-bold text-slate-800">{user.stats.recipes}</span>
                                <span className="text-gray-500">Tarif</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="font-bold text-slate-800">{user.stats.collections}</span>
                                <span className="text-gray-500">Koleksiyon</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="font-bold text-slate-800">{user.stats.followers}</span>
                                <span className="text-gray-500">Takipçi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS & CONTENT */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scroll scrollbar-hide">
                    <button 
                        onClick={() => setActiveTab('tarifler')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'tarifler' ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent hover:text-slate-800'}`}
                    >
                        Tarifler ({user.stats.recipes})
                    </button>
                    <button 
                        onClick={() => setActiveTab('koleksiyonlar')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'koleksiyonlar' ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent hover:text-slate-800'}`}
                    >
                        Koleksiyonlar ({user.stats.collections})
                    </button>
                    <button 
                        onClick={() => setActiveTab('hakkinda')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'hakkinda' ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent hover:text-slate-800'}`}
                    >
                        Hakkında
                    </button>
                </div>

                {/* RECIPE GRID (Tab Content) */}
                {activeTab === 'tarifler' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        
                        {/* Recipe Card 1 */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                                <img src="https://placehold.co/400x300/E8F5E9/AED581?text=Muffin" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Muffin" />
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                        +12 Ay
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">Ispanaklı Peynirli Muffin</h3>
                                <p className="text-xs text-gray-500 mb-3">Beslenme Çantası</p>
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                                    <span className="text-xs text-gray-400"><i className="fa-regular fa-clock mr-1"></i> 35 dk</span>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors"><i className="fa-regular fa-heart"></i></button>
                                </div>
                            </div>
                        </div>

                        {/* Recipe Card 2 */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                                <img src="https://placehold.co/400x300/FFF3E0/FF8A65?text=Smoothie" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Smoothie" />
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                        +8 Ay
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">Şeftalili Yoğurt Smoothie</h3>
                                <p className="text-xs text-gray-500 mb-3">Ara Öğün</p>
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                                    <span className="text-xs text-gray-400"><i className="fa-regular fa-clock mr-1"></i> 5 dk</span>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors"><i className="fa-regular fa-heart"></i></button>
                                </div>
                            </div>
                        </div>

                        {/* Recipe Card 3 */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                                <img src="https://placehold.co/400x300/F3E5F5/AB47BC?text=Pancake" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Pancake" />
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                        +9 Ay
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">Pancarlı Mini Pankek</h3>
                                <p className="text-xs text-gray-500 mb-3">Kahvaltı, BLW</p>
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                                    <span className="text-xs text-gray-400"><i className="fa-regular fa-clock mr-1"></i> 20 dk</span>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors"><i className="fa-regular fa-heart"></i></button>
                                </div>
                            </div>
                        </div>

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