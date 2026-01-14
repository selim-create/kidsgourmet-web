"use client";

import { useState } from "react";
import Link from 'next/link'; 
import { useUser } from '@/hooks/use-user';
import ChildBirthDatePicker from '@/components/features/age/ChildBirthDatePicker';
import UserDropdown from '@/components/ui/UserDropdown';
import ChildSwitcher from '@/components/features/ChildSwitcher';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-white" id="main-header">
        
        {/* 1. TOP BAR (Ecosystem) */}
        <div className="bg-green-50 border-b border-green-100 text-xs py-2 px-4 transition-all" id="top-bar">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="font-bold text-green-700 hidden sm:inline">KidsGourmet Ailesi:</span>
                    {/* Localde Link kullanın: <Link href="..."> */}
                    <Link href="https://rejimde.com" target="_blank" className="flex items-center hover:text-orange-500 transition-colors font-medium text-slate-600">
                        <i className="fa-solid fa-user-doctor mr-1.5"></i> Rejimde.com
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link href="https://tariften.com" target="_blank" className="flex items-center hover:text-orange-500 transition-colors font-medium text-slate-600">
                        <i className="fa-solid fa-utensils mr-1.5"></i> Tariften.com
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-2 text-gray-500">
                    <i className="fa-solid fa-shield-heart text-orange-500"></i>
                    <span>Güvenilir Ebeveyn İçeriği</span>
                </div>
            </div>
        </div>

        {/* 2. MAIN NAVBAR */}
        <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    
                    {/* Logo (Original Design Restored) */}
                    {/* Localde Link kullanın: <Link href="/"> */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            {/* FontAwesome ikonunu orijinal görsel yerine kullanarak kırılma riskini önlüyoruz, ama stil aynı */}
                            <div className="relative w-10 h-10 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                                <i className="fa-solid fa-carrot text-orange-500 text-3xl"></i>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-bold text-2xl tracking-tight text-slate-800 leading-none">
                                Kids<span className="text-orange-500">Gourmet</span>
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-wide">Sağlıklı Nesiller</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <Link href="/tarifler" className="px-4 py-2 rounded-full text-slate-600 hover:bg-orange-50 hover:text-orange-500 font-bold text-sm transition-all font-display">Tarifler</Link>
                        <Link href="/malzeme-rehberi" className="px-4 py-2 rounded-full text-slate-600 hover:bg-green-50 hover:text-green-600 font-bold text-sm transition-all font-display">Beslenme Rehberi</Link>
                        <Link href="/araclar" className="px-4 py-2 rounded-full text-slate-600 hover:bg-blue-50 hover:text-blue-500 font-bold text-sm transition-all font-display">Araçlar</Link>
                        <Link href="/blog" className="px-4 py-2 rounded-full text-slate-600 hover:bg-yellow-50 hover:text-yellow-600 font-bold text-sm transition-all font-display">Blog</Link>
                        <Link href="/topluluk" className="px-4 py-2 rounded-full text-slate-600 hover:bg-purple-50 hover:text-purple-500 font-bold text-sm transition-all">Topluluk</Link>

                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        
                        {/* Child Switcher (for authenticated users with children) */}
                        {isAuthenticated && user && user.children?.length > 0 && (
                          <ChildSwitcher />
                        )}
                        
                        {/* Child Age Picker */}
                        <ChildBirthDatePicker />
                        
                        {/* Search Trigger (Desktop) */}
                        <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>

                        {/* User State: Login Button or User Menu */}
                        {isAuthenticated && user ? (
                          <div className="hidden md:flex items-center gap-3">
                            <Link href="/favoriler" className="relative w-10 h-10 rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center">
                              <i className="fa-regular fa-heart"></i>
                            </Link>
                            <UserDropdown />
                          </div>
                        ) : (
                          <Link href="/login" className="hidden md:inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-full text-white bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                              <i className="fa-solid fa-child mr-2"></i>
                              Giriş Yap
                          </Link>
                        )}
                        
                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden text-slate-800 text-2xl p-2 focus:outline-none"
                        >
                            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. MOBILE MENU (Overlay) */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl lg:hidden max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="p-4 space-y-4">
                        <div className="relative">
                            <input type="text" placeholder="Ne arıyorsunuz?" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-300" />
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400"></i>
                        </div>

                        <nav className="space-y-1">
                            <Link href="/tarifler" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-slate-700 font-bold transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500"><i className="fa-solid fa-utensils"></i></div>
                                Tarifler
                            </Link>
                            <Link href="/malzeme-rehberi" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-slate-700 font-bold transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><i className="fa-solid fa-apple-whole"></i></div>
                                Beslenme Rehberi
                            </Link>
                            <Link href="/araclar" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700 font-bold transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500"><i className="fa-solid fa-calculator"></i></div>
                                Araçlar
                            </Link>
                            <Link href="/blog" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-yellow-50 text-slate-700 font-bold transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600"><i className="fa-solid fa-book-open"></i></div>
                                Blog
                            </Link>
                        </nav>

                        <div className="border-t border-gray-100 my-4"></div>

                        <div className="space-y-3">
                            {isAuthenticated && user ? (
                              <>
                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-bold hover:bg-orange-100 transition-colors">
                                    <i className="fa-solid fa-gauge-high"></i> Dashboard
                                </Link>
                                <Link href="/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                                    <i className="fa-solid fa-user-pen"></i> Profili Düzenle
                                </Link>
                                <Link 
                                  href={`/profil/${user.name ? user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 'profil'}`}
                                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    <i className="fa-solid fa-user"></i> Profili Görüntüle
                                </Link>
                                <Link href="/topluluk/soru-sor" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                                    <i className="fa-solid fa-circle-question"></i> Soru Sor
                                </Link>
                                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors">
                                    <i className="fa-solid fa-right-from-bracket"></i> Çıkış Yap
                                </button>
                              </>
                            ) : (
                              <Link href="/login" className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-orange-500 text-white font-bold shadow-md hover:bg-orange-600 transition-colors">
                                  <i className="fa-solid fa-user mr-2"></i> Giriş Yap / Kayıt Ol
                              </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </header>
  );
}