"use client";

import React, { useState } from 'react';
import Link from "next/link";

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<'blw' | 'percentile' | 'water'>('blw');
  const [weight, setWeight] = useState(8);
  const [blwResultVisible, setBlwResultVisible] = useState(false);
  const [percentileResultVisible, setPercentileResultVisible] = useState(false);

  // BLW Test Logic (Mock)
  const handleBlwAnswer = (answer: boolean) => {
    // In a real app, this would track multiple questions
    setBlwResultVisible(true);
  };

  // Percentile Logic (Mock)
  const handlePercentileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPercentileResultVisible(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

        {/* MOBILE HEADER */}
        <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
            <span className="font-display font-bold text-lg text-slate-800">Akıllı Araçlar</span>
        </div>

        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">

            {/* TOOL TABS */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex overflow-x-auto hide-scroll gap-2">
                <button 
                    onClick={() => setActiveTab('blw')} 
                    className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                        activeTab === 'blw' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50 shadow-none'
                    }`}
                >
                    <i className="fa-solid fa-check-double"></i> BLW Testi
                </button>
                <button 
                    onClick={() => setActiveTab('percentile')} 
                    className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                        activeTab === 'percentile' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50 shadow-none'
                    }`}
                >
                    <i className="fa-solid fa-chart-line"></i> Persentil
                </button>
                <button 
                    onClick={() => setActiveTab('water')} 
                    className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                        activeTab === 'water' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50 shadow-none'
                    }`}
                >
                    <i className="fa-solid fa-glass-water"></i> Su İhtiyacı
                </button>
            </div>

            {/* TAB 1: BLW READINESS TEST */}
            {activeTab === 'blw' && (
                <div className="tab-content animate-fade-in">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg overflow-hidden relative">
                        {/* Progress Bar */}
                        <div className="h-2 bg-gray-100 w-full">
                            <div className={`h-full bg-green-500 transition-all duration-500 rounded-r-full ${blwResultVisible ? 'w-full' : 'w-1/4'}`}></div>
                        </div>

                        <div className="p-8 md:p-12 text-center max-w-2xl mx-auto">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm animate-bounce">
                                <i className="fa-solid fa-chair"></i>
                            </div>

                            {!blwResultVisible ? (
                                // Question Content
                                <div>
                                    <h2 className="font-display font-bold text-2xl text-slate-800 mb-4 font-sans">Bebeğiniz desteksiz oturabiliyor mu?</h2>
                                    <p className="text-gray-500 mb-8">
                                        Mama sandalyesinde veya kucağınızda, öne veya yana devrilmeden başını dik tutarak oturabiliyor olması gerekir.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button onClick={() => handleBlwAnswer(true)} className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                                            <i className="fa-solid fa-check"></i> Evet, Oturabiliyor
                                        </button>
                                        <button onClick={() => handleBlwAnswer(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                                            <i className="fa-solid fa-xmark"></i> Hayır, Henüz Değil
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Result Container
                                <div className="animate-fade-in">
                                    <h2 className="font-display font-bold text-3xl text-slate-800 mb-4 font-sans">Harika Haber! 🎉</h2>
                                    <p className="text-gray-600 mb-8 text-lg">
                                        Bebeğiniz BLW (Kendi Kendine Beslenme) yöntemine başlamak için gerekli fiziksel işaretleri gösteriyor.
                                    </p>
                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl mb-8 text-left flex gap-4">
                                        <div className="text-2xl">💡</div>
                                        <p className="text-sm text-slate-700">
                                            <strong>Uzman Notu:</strong> Her bebek farklıdır. İlk denemelerde "buharda pişmiş brokoli" veya "avokado dilimi" gibi yumuşak ve kavraması kolay gıdalar tercih edin.
                                        </p>
                                    </div>
                                    {/* Localde Link kullanın */}
                                    <Link href="/tarifler" className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all w-full sm:w-auto inline-block">
                                        İlk Tariflere Git
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: PERCENTILE CALCULATOR */}
            {activeTab === 'percentile' && (
                <div className="tab-content animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Input Form */}
                        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                            <h2 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2 font-sans">
                                <i className="fa-solid fa-ruler-combined text-orange-500"></i> Gelişim Bilgileri
                            </h2>
                            
                            <form onSubmit={handlePercentileSubmit} className="space-y-5">
                                {/* Gender */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cinsiyet</label>
                                    <div className="flex gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <input type="radio" name="gender" className="peer sr-only" defaultChecked />
                                            <div className="py-3 rounded-xl border-2 border-gray-200 text-center text-gray-500 font-bold peer-checked:border-blue-400 peer-checked:text-blue-500 peer-checked:bg-blue-50 transition-all">
                                                <i className="fa-solid fa-mars mr-1"></i> Erkek
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <input type="radio" name="gender" className="peer sr-only" />
                                            <div className="py-3 rounded-xl border-2 border-gray-200 text-center text-gray-500 font-bold peer-checked:border-pink-400 peer-checked:text-pink-500 peer-checked:bg-pink-50 transition-all">
                                                <i className="fa-solid fa-venus mr-1"></i> Kız
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Doğum Tarihi</label>
                                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors" />
                                </div>

                                {/* Weight & Height */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kilo (kg)</label>
                                        <input type="number" step="0.1" placeholder="Örn: 8.5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Boy (cm)</label>
                                        <input type="number" step="0.5" placeholder="Örn: 72" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors" />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-md transition-colors mt-2">
                                    Hesapla
                                </button>
                            </form>
                            
                            <p className="text-[10px] text-gray-400 mt-4 text-center">
                                *Bu araç sadece bilgilendirme amaçlıdır. WHO (Dünya Sağlık Örgütü) verileri baz alınmıştır. Kesin teşhis için doktorunuza danışın.
                            </p>
                        </div>

                        {/* Result Card (Interactive) */}
                        {percentileResultVisible ? (
                            <div className="bg-slate-800 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl flex flex-col justify-center animate-fade-in">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                
                                <div className="relative z-10 text-center">
                                    <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">Sonuç</div>
                                    
                                    <div className="mb-8">
                                        <h3 className="text-4xl font-display font-bold mb-1 font-sans">50. Persentil</h3>
                                        <p className="text-green-400 font-bold">Gelişimi Normal</p>
                                    </div>

                                    {/* Visual Graph Mockup */}
                                    <div className="relative h-4 bg-white/10 rounded-full mb-2 mx-4">
                                        {/* Range indicators */}
                                        <div className="absolute left-[3%] top-full h-2 w-px bg-white/30 text-[9px] mt-1">3%</div>
                                        <div className="absolute left-[50%] top-full h-2 w-px bg-white/30 text-[9px] mt-1">50%</div>
                                        <div className="absolute right-[3%] top-full h-2 w-px bg-white/30 text-[9px] mt-1">97%</div>
                                        
                                        {/* The Bar */}
                                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-400 via-green-400 to-red-400 rounded-full w-full opacity-30"></div>
                                        
                                        {/* The Indicator Dot */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-orange-500 rounded-full shadow-lg z-10"></div>
                                    </div>
                                    <div className="mt-8 text-xs text-gray-400">
                                        Bebeğinizin kilosu yaşıtlarının %50'sinden daha fazladır.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Placeholder State
                            <div className="bg-gray-100 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-gray-400">
                                <i className="fa-solid fa-chart-simple text-4xl mb-3"></i>
                                <p className="text-sm font-bold">Sonucu görmek için bilgileri girin</p>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* TAB 3: WATER CALCULATOR */}
            {activeTab === 'water' && (
                <div className="tab-content animate-fade-in">
                    <div className="bg-blue-50 rounded-[2rem] border border-blue-100 shadow-sm p-8 text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-white text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
                            <i className="fa-solid fa-droplet"></i>
                        </div>
                        <h2 className="font-display font-bold text-2xl text-slate-800 mb-2 font-sans">Su İhtiyacı Hesaplayıcı</h2>
                        <p className="text-gray-600 mb-8 text-sm">
                            Bebeğinizin kilosuna göre günlük yaklaşık sıvı ihtiyacını öğrenin. (6. aydan sonra)
                        </p>

                        <div className="bg-white p-6 rounded-2xl shadow-sm max-w-sm mx-auto mb-8">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bebeğin Kilosu</label>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="range" 
                                    min="3" 
                                    max="20" 
                                    value={weight} 
                                    step="0.5" 
                                    className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                                />
                                <div className="font-bold text-slate-800 w-16 text-right">{weight} kg</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="bg-white p-4 rounded-xl border border-blue-100">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Günlük Toplam</p>
                                <p className="text-xl font-bold text-blue-600">{Math.round(weight * 100)} ml</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-blue-100">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Su Bardağı</p>
                                <p className="text-xl font-bold text-slate-800">~{(weight * 100 / 200).toFixed(1)} Bardak</p>
                            </div>
                        </div>
                        
                        <p className="text-[10px] text-blue-400 mt-6 bg-blue-100 inline-block px-3 py-1 rounded-lg">
                            <i className="fa-solid fa-circle-info mr-1"></i> Anne sütü ve mama bu miktara dahildir.
                        </p>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
}