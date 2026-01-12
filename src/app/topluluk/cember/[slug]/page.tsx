"use client";

import React from 'react';
import Link from "next/link";

export default function CircleDetailPage({ params }: { params: { slug: string } }) {
  
  // Mockup verisi (Slug'a göre değişecek)
  const circle = {
    title: "Alerjik Çocuklar",
    description: "Besin alerjileri, diyet tarifleri ve tecrübe paylaşımları.",
    color: "green-400", // Tailwind color name part
    members: 1240,
    posts: 356
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* MOBILE HEADER (Sticky) */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-20 z-30 border-b border-gray-100">
          {/* Localde Link kullanın */}
          <Link href="/topluluk" className="text-gray-500 text-lg"><i className="fa-solid fa-arrow-left"></i></Link>
          <span className="font-display font-bold text-lg text-slate-800">{circle.title}</span>
      </div>

      {/* CIRCLE HERO */}
      <div className={`bg-${circle.color}/10 border-b border-${circle.color}/20 pt-8 pb-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-${circle.color} flex items-center justify-center text-white text-3xl shadow-md`}>
                      <i className="fa-solid fa-shield-virus"></i>
                  </div>
                  <div>
                      <h1 className="font-display font-bold text-3xl text-slate-800">{circle.title}</h1>
                      <p className="text-gray-600">{circle.description}</p>
                  </div>
              </div>
              <div className="flex gap-4 text-sm font-bold text-gray-500">
                  <div className="flex flex-col items-center">
                      <span className="text-slate-800 text-lg">{circle.members}</span>
                      <span className="text-xs uppercase tracking-wide">Üye</span>
                  </div>
                  <div className="w-px h-10 bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                      <span className="text-slate-800 text-lg">{circle.posts}</span>
                      <span className="text-xs uppercase tracking-wide">Paylaşım</span>
                  </div>
                  <button className={`ml-4 px-6 py-2 bg-${circle.color} text-white rounded-full hover:opacity-90 transition-opacity`}>
                      Katıl
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* MAIN FEED (Circle Posts) */}
            <main className="lg:col-span-3 space-y-6">
                
                {/* Create Post Input (Contextual) */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center cursor-pointer hover:border-brand-primary/30 transition-colors">
                    <img src="https://placehold.co/100x100/FFCC80/ffffff?text=Siz" className="w-10 h-10 rounded-full bg-gray-100" alt="User" />
                    <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-gray-400 text-sm">
                        {circle.title} çemberinde bir soru sor...
                    </div>
                    <button className="text-brand-primary text-xl"><i className="fa-regular fa-image"></i></button>
                </div>

                {/* POST 1 (Pinned in Circle) */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                        <i className="fa-solid fa-thumbtack mr-1"></i> Sabitlenmiş
                    </div>
                    <div className="flex gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full bg-${circle.color} flex items-center justify-center text-white`}>
                            <i className="fa-solid fa-bullhorn"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Topluluk Yöneticisi</h3>
                            <p className="text-xs text-gray-400">1 hafta önce</p>
                        </div>
                    </div>
                    <h2 className="font-bold text-base text-slate-800 mb-2">Alerjik çocuklar için güvenli tarif paylaşım kuralları</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Lütfen paylaştığınız tariflerdeki potansiyel alerjenleri (süt, yumurta, gluten vb.) başlıkta veya açıklamanın en başında belirtiniz.
                    </p>
                </div>

                {/* USER POST 1 */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                            <img src="https://placehold.co/100x100/FFF9C4/FBC02D?text=M" className="w-10 h-10 rounded-full border border-gray-100" alt="User" />
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Mert'in Babası</h3>
                                <p className="text-xs text-gray-400">12 Aylık Erkek Bebek • 2 saat önce</p>
                            </div>
                        </div>
                    </div>
                    
                    <h2 className="font-bold text-base text-slate-800 mb-2">
                         {/* Localde Link kullanın */}
                         <Link href="/topluluk/yumurta-alerjisi" className="hover:text-brand-primary transition-colors">Yumurta beyazı alerjisi ne zaman geçer?</Link>
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Oğlumda yumurta beyazı alerjisi çıktı. Doktorumuz diyete başladı. Bu durumu yaşayan var mı? Genelde kaç yaşında tolere edebiliyorlar?
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-sm transition-colors">
                                <i className="fa-regular fa-heart"></i> 24
                            </button>
                            <Link href="/topluluk/yumurta-alerjisi" className="flex items-center gap-1 text-gray-400 hover:text-blue-500 text-sm transition-colors">
                                <i className="fa-regular fa-comment"></i> 8 Cevap
                            </Link>
                        </div>
                        <button className="text-gray-400 hover:text-slate-800"><i className="fa-regular fa-bookmark"></i></button>
                    </div>
                </div>

            </main>

            {/* RIGHT SIDEBAR (Related) */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
                
                {/* Related Circles */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-3">İlgili Çemberler</h3>
                    <nav className="space-y-1">
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Ek Gıdaya Geçiş
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            Tarif Önerileri
                        </Link>
                    </nav>
                </div>

                {/* Popular Tags in this Circle */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-4">Popüler Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">#sütalerjisi</Link>
                        <Link href="#" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">#yumurta</Link>
                        <Link href="#" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">#diyet</Link>
                    </div>
                </div>

            </aside>

        </div>
      </div>
      
      {/* MOBILE FAB */}
      <button className="lg:hidden fixed bottom-24 right-4 w-14 h-14 bg-brand-primary text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-40 hover:scale-105 transition-transform">
          <i className="fa-solid fa-plus"></i>
      </button>

    </div>
  );
}