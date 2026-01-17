"use client";

import React from 'react';
import Link from "next/link";
import { useUser } from "@/hooks/use-user";

interface DashboardSidebarProps {
  activePage: 'dashboard' | 'haftalik-plan' | 'favoriler' | 'alisveris-listesi' | 'asilar' | 'buyume' | 'akilli-asistan' | 'blw-testi' | 'profil';
}

export default function DashboardSidebar({ activePage }: DashboardSidebarProps) {
  const { user } = useUser();

  const isActive = (page: string) => activePage === page;

  const linkClasses = (page: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
      isActive(page)
        ? "bg-orange-100 text-orange-500 font-bold"
        : "text-gray-500 hover:bg-gray-50 hover:text-slate-800"
    }`;

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-20 h-[calc(100vh-5rem)] z-10 overflow-y-auto">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* Genel Bakış */}
        <Link href="/dashboard" className={linkClasses('dashboard')}>
          <i className="fa-solid fa-house"></i> Genel Bakış
        </Link>

        {/* Haftalık Plan */}
        <Link href="/dashboard/haftalik-plan" className={linkClasses('haftalik-plan')}>
          <i className="fa-solid fa-calendar-days"></i> Haftalık Plan
        </Link>

        {/* Favorilerim */}
        <Link href="/favoriler" className={linkClasses('favoriler')}>
          <i className="fa-solid fa-heart"></i> Favorilerim
        </Link>

        {/* Alışveriş Listesi */}
        <Link href="/alisveris-listesi" className={linkClasses('alisveris-listesi')}>
          <i className="fa-solid fa-basket-shopping"></i> Alışveriş Listesi
        </Link>

        {/* Sağlık Kategorisi */}
        <div className="pt-6 pb-2">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sağlık</p>
        </div>
        <Link href="/dashboard/saglik/asilar" className={linkClasses('asilar')}>
          <i className="fa-solid fa-syringe"></i> Aşı Takvimi
        </Link>
        <Link href="/akilli-asistan/persentil" className={linkClasses('buyume')}>
          <i className="fa-solid fa-chart-line"></i> Büyüme Takibi
        </Link>

        {/* Araçlar Kategorisi */}
        <div className="pt-6 pb-2">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Araçlar</p>
        </div>
        <Link href="/akilli-asistan" className={linkClasses('akilli-asistan')}>
          <i className="fa-solid fa-toolbox"></i> Akıllı Asistan
        </Link>
        <Link href="/akilli-asistan/blw-testi" className={linkClasses('blw-testi')}>
          <i className="fa-solid fa-check-double"></i> BLW Testi
        </Link>
      </nav>

      {/* User Profile (Bottom) */}
      <div className="p-4 border-t border-gray-50 mt-auto">
        <Link href="/profil" className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
          isActive('profil') ? 'bg-orange-50' : 'hover:bg-gray-50'
        }`}>
          {user?.avatar_url ? (
            <img 
              src={user.avatar_url} 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
              alt={user?.name ? `${user.name} profil fotoğrafı` : 'Kullanıcı profil fotoğrafı'} 
            />
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
  );
}
