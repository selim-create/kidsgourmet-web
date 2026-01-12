"use client";

import React from 'react';
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* MOBILE HEADER (Sticky) */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100">
          <span className="font-display font-bold text-lg text-slate-800">Topluluk</span>
          <button className="text-orange-500 text-xl"><i className="fa-solid fa-pen-to-square"></i></button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* LEFT SIDEBAR: CIRCLES (Topics) */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
                
                {/* Quick Actions */}
                <button className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                    <i className="fa-solid fa-pen-to-square"></i> Soru Sor
                </button>

                {/* My Circles */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="font-bold text-slate-800 text-sm">Çemberlerim</h3>
                    </div>
                    <nav className="p-2 space-y-1">
                        {/* Localde Link kullanın */}
                        <Link href="/topluluk/cember/ek-gida" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-orange-50 text-orange-500 font-medium">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Ek Gıdaya Geçiş
                        </Link>
                        <Link href="/topluluk/cember/alerji" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            Alerjik Çocuklar
                        </Link>
                        <Link href="/topluluk/cember/uyku" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            Uyku & Beslenme
                        </Link>
                    </nav>
                </div>

                {/* Trending Topics */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <h3 className="font-bold text-slate-800 text-sm mb-4">Gündemdekiler</h3>
                    <div className="flex flex-wrap gap-2">
                        {['#dişçıkarma', '#kahvaltıreddi', '#blw', '#kabızlık'].map(tag => (
                            <Link key={tag} href={`/etiket/${tag.replace('#','')}`} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>

            </aside>

            {/* MAIN FEED */}
            <main className="lg:col-span-2 space-y-6">
                
                {/* Mobile Only: Quick Filters */}
                <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 hide-scroll">
                    <button className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">Tümü</button>
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm whitespace-nowrap">Ek Gıda</button>
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm whitespace-nowrap">Alerji</button>
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm whitespace-nowrap">Tarifler</button>
                </div>

                {/* Create Post Input (Teaser) */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center cursor-pointer hover:border-orange-200 transition-colors">
                    <img src="https://placehold.co/100x100/FFCC80/ffffff?text=Siz" className="w-10 h-10 rounded-full bg-gray-100" alt="User" />
                    <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-gray-400 text-sm">
                        Aklına takılanı sor, anneler ve uzmanlar cevaplasın...
                    </div>
                    <button className="text-orange-500 text-xl"><i className="fa-regular fa-image"></i></button>
                </div>

                {/* PINNED POST (Expert Advice) */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                        <i className="fa-solid fa-thumbtack mr-1"></i> Editörün Seçimi
                    </div>
                    <div className="flex gap-4">
                        <img src="https://placehold.co/100x100/AED581/ffffff?text=Dr" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Doctor" />
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Uzm. Dr. Melis Kaya <i className="fa-solid fa-circle-check text-blue-500 ml-1"></i></h3>
                            <p className="text-xs text-gray-500">Çocuk Doktoru • 2 saat önce</p>
                        </div>
                    </div>
                    <h2 className="mt-4 font-bold text-lg text-slate-800">Mevsim geçişlerinde bağışıklık için nelere dikkat etmeliyiz?</h2>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        Havaların soğumasıyla birlikte poliklinikte en sık karşılaştığımız soru bu. İşte C vitamini deposu 3 süper gıda ve tarif önerileri...
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                        <Link href="/topluluk/bagisiklik-tavsiyeleri" className="text-xs font-bold text-blue-600 hover:underline">Tamamını Oku</Link>
                        <div className="flex items-center text-gray-400 text-xs gap-1 ml-auto">
                            <i className="fa-regular fa-heart"></i> 142
                            <span className="mx-2">•</span>
                            <i className="fa-regular fa-comment"></i> 18
                        </div>
                    </div>
                </div>

                {/* USER POST 1 (Standard) */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                            <img src="https://placehold.co/100x100/E1BEE7/8E24AA?text=A" className="w-10 h-10 rounded-full border border-gray-100" alt="User" />
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Ayşe'nin Annesi</h3>
                                <p className="text-xs text-gray-400">9 Aylık Kız Bebek • 15 dk önce</p>
                            </div>
                        </div>
                        <span className="bg-orange-50 text-orange-500 px-2 py-1 rounded-lg text-[10px] font-bold">Ek Gıda</span>
                    </div>
                    
                    <h2 className="font-bold text-base text-slate-800 mb-2">
                        <Link href="/topluluk/brokoli-reddi" className="hover:text-orange-500 transition-colors">Bebeğim brokoli yemeyi reddediyor, ne yapabilirim?</Link>
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Selam anneler, 9 aylık kızım püre halindeyken yiyordu ama BLW'ye geçince brokoliyi eline alıp atıyor. Tadını mı sevmedi acaba? Tarif önerisi olan var mı?
                    </p>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#sebzereddi</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#blw</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-sm transition-colors">
                                <i className="fa-regular fa-heart"></i> 5
                            </button>
                            <Link href="/topluluk/brokoli-reddi" className="flex items-center gap-1 text-gray-400 hover:text-blue-500 text-sm transition-colors">
                                <i className="fa-regular fa-comment"></i> 12 Cevap
                            </Link>
                        </div>
                        <button className="text-gray-400 hover:text-slate-800"><i className="fa-regular fa-bookmark"></i></button>
                    </div>
                </div>

                {/* USER POST 2 (With Expert Reply) */}
                <div className="bg-white p-6 rounded-3xl border-l-4 border-green-400 shadow-sm hover:shadow-md transition-shadow relative">
                    {/* Expert Reply Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-green-100">
                        <i className="fa-solid fa-user-doctor"></i> Uzman Yanıtladı
                    </div>

                    <div className="flex gap-3 mb-3">
                        <img src="https://placehold.co/100x100/FFF9C4/FBC02D?text=M" className="w-10 h-10 rounded-full border border-gray-100" alt="User" />
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Mert'in Babası</h3>
                            <p className="text-xs text-gray-400">12 Aylık Erkek Bebek • 2 saat önce</p>
                        </div>
                    </div>
                    
                    <h2 className="font-bold text-base text-slate-800 mb-2">
                         <Link href="/topluluk/yumurta-alerjisi" className="hover:text-orange-500 transition-colors">Yumurta beyazı alerjisi ne zaman geçer?</Link>
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Oğlumda yumurta beyazı alerjisi çıktı. Doktorumuz diyete başladı. Bu durumu yaşayan var mı? Genelde kaç yaşında tolere edebiliyorlar?
                    </p>

                    {/* Preview of Expert Reply */}
                    <div className="bg-gray-50 rounded-xl p-3 flex gap-3 mb-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <img src="https://placehold.co/50x50/AED581/ffffff?text=Dyt" className="w-8 h-8 rounded-full flex-shrink-0" alt="Expert" />
                        <div>
                            <p className="text-xs font-bold text-slate-800 mb-1">Dyt. Ayşe Yılmaz <span className="text-gray-400 font-normal">• Uzman</span></p>
                            <p className="text-xs text-gray-600 line-clamp-2">Merhaba, yumurta alerjisi çocukların %70'inde 3-4 yaşına kadar kendiliğinden geçer. Önemli olan...</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-sm">
                                <i className="fa-regular fa-heart"></i> 24
                            </button>
                            <Link href="/topluluk/yumurta-alerjisi" className="flex items-center gap-1 text-gray-400 hover:text-blue-500 text-sm">
                                <i className="fa-regular fa-comment"></i> 8 Cevap
                            </Link>
                        </div>
                        <button className="text-gray-400 hover:text-slate-800"><i className="fa-regular fa-bookmark"></i></button>
                    </div>
                </div>

            </main>

            {/* RIGHT SIDEBAR (Desktop) */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
                
                {/* Community Rules */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-shield-heart text-orange-500"></i> Topluluk Kuralları
                    </h3>
                    <ul className="text-xs text-gray-600 space-y-2">
                        <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Nazik ve destekleyici olun.</li>
                        <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Tıbbi tavsiye vermeyin.</li>
                        <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Reklam içerikli paylaşım yasaktır.</li>
                    </ul>
                    <button className="mt-3 text-xs text-orange-500 font-bold hover:underline">Tamamını Oku</button>
                </div>

                {/* Top Contributors */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-4">Haftanın Anneleri 👑</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img src="https://placehold.co/100x100/FFAB91/ffffff?text=1" className="w-8 h-8 rounded-full" alt="User 1" />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-700">Selin K.</p>
                                <p className="text-[10px] text-gray-400">150+ Katkı</p>
                            </div>
                            <i className="fa-solid fa-award text-yellow-400"></i>
                        </div>
                        <div className="flex items-center gap-3">
                            <img src="https://placehold.co/100x100/80CBC4/ffffff?text=2" className="w-8 h-8 rounded-full" alt="User 2" />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-700">Zeynep A.</p>
                                <p className="text-[10px] text-gray-400">120+ Katkı</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <img src="https://placehold.co/100x100/CE93D8/ffffff?text=3" className="w-8 h-8 rounded-full" alt="User 3" />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-700">Berna T.</p>
                                <p className="text-[10px] text-gray-400">95+ Katkı</p>
                            </div>
                        </div>
                    </div>
                </div>

            </aside>

        </div>
      </div>

      {/* MOBILE FAB */}
      <button className="lg:hidden fixed bottom-24 right-4 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-40 hover:scale-105 transition-transform">
          <i className="fa-solid fa-plus"></i>
      </button>

      {/* MOBILE BOTTOM NAVIGATION (Same as Dashboard) */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link href="dashboard.html" className="flex flex-col items-center text-gray-400 hover:text-brand-primary transition-colors">
                <i className="fa-solid fa-house text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Panelim</span>
            </Link>
            <Link href="#" className="flex flex-col items-center text-brand-primary">
                <i className="fa-solid fa-users text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Topluluk</span>
            </Link>
            <div className="relative -top-8">
                <Link href="#" className="flex items-center justify-center w-14 h-14 bg-brand-primary rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
                    <i className="fa-solid fa-magnifying-glass text-2xl"></i>
                </Link>
            </div>
            <Link href="favorites.html" className="flex flex-col items-center text-gray-400 hover:text-brand-primary transition-colors">
                <i className="fa-solid fa-heart text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Favoriler</span>
            </Link>
            <Link href="profile.html" className="flex flex-col items-center text-gray-400 hover:text-brand-primary transition-colors">
                <i className="fa-solid fa-user text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Profil</span>
            </Link>
        </div>
    </div>
  );
}