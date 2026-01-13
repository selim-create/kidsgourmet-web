"use client";

import React, { useState } from 'react';
import Link from "next/link";

export default function ShoppingListPage() {
  const [newItem, setNewItem] = useState("");
  
  // Mock Data
  const categories = [
    {
      id: "manav",
      name: "Meyve & Sebze",
      icon: "fa-apple-whole",
      color: "green",
      items: [
        { id: 1, name: "Avokado", qty: "2 adet", checked: false },
        { id: 2, name: "Muz", qty: "1 salkım", checked: true },
        { id: 3, name: "Bal Kabağı", qty: "1 dilim", checked: false },
      ]
    },
    {
      id: "kasap",
      name: "Et & Protein",
      icon: "fa-drumstick-bite",
      color: "red",
      items: [
        { id: 4, name: "Kuzu Kıyma", qty: "200 gr", checked: false },
        { id: 5, name: "Organik Yumurta", qty: "6'lı", checked: false },
      ]
    },
    {
      id: "kuru",
      name: "Kuru Gıda",
      icon: "fa-wheat-awn",
      color: "yellow",
      items: [
        { id: 6, name: "Tam Buğday Unu", qty: "1 paket", checked: true },
        { id: 7, name: "İrmik", qty: "500 gr", checked: false },
      ]
    },
    {
      id: "diger",
      name: "Diğer",
      icon: "fa-basket-shopping",
      color: "blue",
      items: [
        { id: 8, name: "Zeytinyağı", qty: "1 şişe", checked: false },
      ]
    }
  ];

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
                {/* Active State */}
                <Link href="/alisveris-listesi" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
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
                <button className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Çıkış Yap
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100">
                <span className="font-display font-bold text-lg text-slate-800">Alışveriş Listesi</span>
                <button className="text-orange-500 text-xl"><i className="fa-solid fa-share-nodes"></i></button>
            </div>

            {/* SHOPPING LIST CONTENT */}
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">

                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div>
                        <h1 className="font-display font-bold text-2xl text-slate-800">Bu Haftanın İhtiyaçları</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            <span className="font-bold text-orange-500">4</span> tamamlandı, <span className="font-bold text-slate-800">12</span> kaldı
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none bg-green-50 text-green-600 hover:bg-green-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2" onClick={() => alert('WhatsApp açılıyor...')}>
                            <i className="fa-brands fa-whatsapp text-lg"></i> Paylaş
                        </button>
                        <button className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-600 hover:border-gray-300 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                            <i className="fa-solid fa-print"></i> Yazdır
                        </button>
                    </div>
                </div>

                {/* ADD ITEM INPUT */}
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Hızlıca ürün ekle (Örn: Bebek bisküvisi)" 
                        className="w-full py-4 pl-6 pr-14 rounded-2xl border-2 border-gray-100 shadow-sm focus:border-orange-500 outline-none text-gray-700 transition-colors"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                    />
                    <button className="absolute right-2 top-2 bottom-2 bg-orange-500 hover:bg-orange-600 text-white w-12 rounded-xl font-bold transition-colors text-xl">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>

                {/* CATEGORIES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className={`bg-${cat.color}-50 p-4 border-b border-${cat.color}-100 flex justify-between items-center`}>
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <i className={`fa-solid ${cat.icon} text-${cat.color}-500`}></i> {cat.name}
                                </h3>
                                <span className={`text-xs font-bold text-${cat.color}-600 bg-white px-2 py-1 rounded-lg`}>{cat.items.length} Ürün</span>
                            </div>
                            <div className="p-2">
                                {cat.items.map((item) => (
                                    <label key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors select-none">
                                        <input 
                                            type="checkbox" 
                                            defaultChecked={item.checked}
                                            className="item-checkbox w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer" 
                                        />
                                        <div className={`flex-1 flex justify-between items-center transition-all ${item.checked ? 'line-through text-gray-400 opacity-60' : ''}`}>
                                            <span className="font-medium text-slate-700">{item.name}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.checked ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{item.qty}</span>
                                        </div>
                                        <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all px-2">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

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
                <Link href="/alisveris-listesi" className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
                    <i className="fa-solid fa-basket-shopping text-2xl"></i>
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