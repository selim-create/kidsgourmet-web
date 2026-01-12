"use client";

import React from 'react';
import Link from "next/link";

export default function ProfileSettingsPage() {
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
                <Link href="/favoriler" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-heart"></i> Favorilerim
                </Link>
                <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hesap</p>
                </div>
                <Link href="/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
                    <i className="fa-solid fa-user"></i> Profilim
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-credit-card"></i> Abonelik
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
                <span className="font-display font-bold text-lg text-slate-800">Profilim</span>
                <button className="text-red-500 text-sm font-bold">Çıkış</button>
            </div>

            {/* PROFILE CONTENT */}
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">

                {/* 1. CHILDREN MANAGEMENT (Top Priority) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-bold text-xl text-slate-800">Çocuklarım</h2>
                        <button className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2">
                            <i className="fa-solid fa-plus"></i> <span className="hidden sm:inline">Yeni Ekle</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Child Card 1 */}
                        <div className="bg-white rounded-3xl border-2 border-orange-500 shadow-sm p-6 relative overflow-hidden group">
                            <div className="absolute top-3 right-3">
                                <button className="text-gray-300 hover:text-orange-500 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <img src="https://placehold.co/100x100/FFF3E0/FF8A65?text=D" className="w-16 h-16 rounded-full border-2 border-orange-500 p-0.5" alt="Deniz" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Deniz</h3>
                                    <p className="text-sm text-orange-500 font-medium">9 Aylık</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Cinsiyet</span>
                                    <span className="font-medium text-slate-700">Erkek</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Beslenme</span>
                                    <span className="font-medium text-slate-700">BLW + Püre</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400 mb-2 font-bold uppercase">Alerjenler</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-bold border border-red-100">İnek Sütü</span>
                                    <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-bold border border-yellow-100">Domates</span>
                                </div>
                            </div>
                        </div>

                        {/* Child Card 2 */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden hover:shadow-md transition-shadow">
                            <div className="absolute top-3 right-3">
                                <button className="text-gray-300 hover:text-orange-500 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <img src="https://placehold.co/100x100/E1BEE7/8E24AA?text=A" className="w-16 h-16 rounded-full border border-gray-100" alt="Ada" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Ada</h3>
                                    <p className="text-sm text-gray-500 font-medium">3 Yaş</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Cinsiyet</span>
                                    <span className="font-medium text-slate-700">Kız</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Beslenme</span>
                                    <span className="font-medium text-slate-700">Her Şey</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400 mb-2 font-bold uppercase">Alerjenler</p>
                                <span className="text-xs text-green-500 font-medium"><i className="fa-solid fa-check mr-1"></i> Bilinen alerji yok</span>
                            </div>
                        </div>

                        {/* Add New Child Card */}
                        <button className="border-2 border-dashed border-gray-300 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all group h-full min-h-[200px]">
                            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center text-xl mb-3 transition-colors">
                                <i className="fa-solid fa-plus"></i>
                            </div>
                            <span className="font-bold text-sm">Yeni Çocuk Ekle</span>
                        </button>

                    </div>
                </section>

                <hr className="border-gray-200" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* 2. PARENT PROFILE */}
                    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-id-card text-orange-500"></i> Ebeveyn Bilgileri
                        </h2>
                        
                        <form className="space-y-5">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ad Soyad</label>
                                    <input type="text" defaultValue="Elif Yılmaz" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-Posta</label>
                                    <input type="email" defaultValue="elif@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Şifre Değiştir</label>
                                <input type="password" placeholder="Yeni şifreniz (Değiştirmek istemiyorsanız boş bırakın)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors" />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button type="button" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-slate-700 transition-colors">
                                    Bilgileri Güncelle
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* 3. SUBSCRIPTION & SETTINGS */}
                    <section className="space-y-6">
                        
                        {/* Subscription Card */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            
                            <div className="relative z-10 flex items-start justify-between">
                                <div>
                                    <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">Üyelik Durumu</span>
                                    <h3 className="font-display font-bold text-2xl mb-1">KidsGourmet Free</h3>
                                    <p className="text-purple-200 text-sm mb-4">Bazı özellikler kısıtlı.</p>
                                </div>
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                                    <i className="fa-solid fa-crown"></i>
                                </div>
                            </div>
                            
                            <button className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl hover:bg-purple-50 transition-colors shadow-sm">
                                Premium'a Yükselt (₺29.99/ay)
                            </button>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Tercihler</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Haftalık Bülten (E-posta)</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Yeni Tarif Bildirimleri</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>

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
            <Link href="/profil" className="flex flex-col items-center text-orange-500 transition-colors">
                <i className="fa-solid fa-user text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Profil</span>
            </Link>
        </div>

    </div>
  );
}