"use client";

import React from 'react';
import Link from "next/link";

interface DashboardSidebarProps {
  activePage: 'dashboard' | 'haftalik-plan' | 'favoriler' | 'alisveris-listesi' | 'asilar' | 'buyume' | 'akilli-asistan' | 'blw-testi' | 'profil' | 'rizalarim';
}

export default function DashboardSidebar({ activePage }: DashboardSidebarProps) {
  const isActive = (page: string) => activePage === page;

  const linkClasses = (page: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      isActive(page)
        ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
        : "text-stone-600 hover:bg-orange-50 hover:text-orange-600"
    }`;

  const iconClasses = (page: string) =>
    `w-5 text-center ${isActive(page) ? "text-white" : "text-stone-400"}`;

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-stone-100 flex-col sticky top-20 h-[calc(100vh-5rem-4rem)] z-10 overflow-y-auto">
      {/* NO LOGO - Already in header */}
      {/* NO USER PROFILE - Already in header */}
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {/* Menü */}
        <p className="px-4 py-2 text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Menü</p>
        
        <Link href="/dashboard" className={linkClasses('dashboard')}>
          <i className={`fa-solid fa-house ${iconClasses('dashboard')}`}></i>
          <span className="text-sm font-semibold">Genel Bakış</span>
        </Link>

        <Link href="/dashboard/haftalik-plan" className={linkClasses('haftalik-plan')}>
          <i className={`fa-solid fa-calendar-days ${iconClasses('haftalik-plan')}`}></i>
          <span className="text-sm font-semibold">Haftalık Plan</span>
        </Link>

        <Link href="/alisveris-listesi" className={linkClasses('alisveris-listesi')}>
          <i className={`fa-solid fa-basket-shopping ${iconClasses('alisveris-listesi')}`}></i>
          <span className="text-sm font-semibold">Alışveriş Listesi</span>
        </Link>

        <Link href="/favoriler" className={linkClasses('favoriler')}>
          <i className={`fa-solid fa-heart ${iconClasses('favoriler')}`}></i>
          <span className="text-sm font-semibold">Favoriler</span>
        </Link>

        {/* Gelişim & Sağlık */}
        <p className="px-4 py-2 mt-6 text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Gelişim & Sağlık</p>
        
        <Link href="/akilli-asistan/persentil" className={linkClasses('buyume')}>
          <i className={`fa-solid fa-chart-line ${iconClasses('buyume')}`}></i>
          <span className="text-sm font-semibold">Büyüme Takibi</span>
        </Link>

        <Link href="/dashboard/saglik/asilar" className={linkClasses('asilar')}>
          <i className={`fa-solid fa-syringe ${iconClasses('asilar')}`}></i>
          <span className="text-sm font-semibold">Aşı Takvimi</span>
        </Link>

        <Link href="/akilli-asistan/blw-testi" className={linkClasses('blw-testi')}>
          <i className={`fa-solid fa-baby ${iconClasses('blw-testi')}`}></i>
          <span className="text-sm font-semibold">Ek Gıda & BLW</span>
        </Link>

        {/* Araçlar */}
        <p className="px-4 py-2 mt-6 text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Araçlar</p>
        
        <Link href="/akilli-asistan" className={linkClasses('akilli-asistan')}>
          <i className={`fa-solid fa-wand-magic-sparkles ${iconClasses('akilli-asistan')}`}></i>
          <span className="text-sm font-semibold">Akıllı Asistan</span>
        </Link>

        <Link href="/topluluk" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-stone-600 hover:bg-orange-50 hover:text-orange-600">
          <i className="fa-solid fa-user-doctor w-5 text-center text-stone-400"></i>
          <span className="text-sm font-semibold">Soru Sor</span>
        </Link>

        {/* Hesap */}
        <p className="px-4 py-2 mt-6 text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Hesap</p>
        
        <Link href="/profil" className={linkClasses('profil')}>
          <i className={`fa-solid fa-user-gear ${iconClasses('profil')}`}></i>
          <span className="text-sm font-semibold">Profil Düzenleme</span>
        </Link>

        <Link href="/dashboard/rizalarim" className={linkClasses('rizalarim')}>
          <i className={`fa-solid fa-shield-halved ${iconClasses('rizalarim')}`}></i>
          <span className="text-sm font-semibold">Rıza Yönetimi</span>
        </Link>
      </nav>
    </aside>
  );
}