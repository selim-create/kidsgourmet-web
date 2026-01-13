"use client";

import React, { useState } from 'react';
import Link from "next/link";

export default function AskQuestionPage() {
  const [selectedCircle, setSelectedCircle] = useState("");

  const circles = [
    { id: "ek-gida", name: "Ek Gıdaya Geçiş", color: "bg-orange-500" },
    { id: "alerji", name: "Alerjik Çocuklar", color: "bg-green-400" },
    { id: "uyku", name: "Uyku & Beslenme", color: "bg-purple-400" },
    { id: "tarif", name: "Tarif Önerileri", color: "bg-yellow-400" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-12">
        
        {/* MOBILE BACK HEADER */}
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-20 z-40">
            {/* Localde Link kullanın */}
            <Link href="/topluluk" className="text-gray-500 text-lg"><i className="fa-solid fa-arrow-left"></i></Link>
            <span className="font-bold text-slate-800 text-sm">Soru Sor</span>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                
                <h1 className="font-display font-bold text-2xl text-slate-800 mb-6">Ne sormak istersiniz?</h1>

                <form className="space-y-6">
                    
                    {/* Circle Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">İlgili Çemberi Seçin</label>
                        <div className="flex flex-wrap gap-3">
                            {circles.map((circle) => (
                                <button
                                    key={circle.id}
                                    type="button"
                                    onClick={() => setSelectedCircle(circle.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                                        selectedCircle === circle.id
                                        ? `border-${circle.color.replace("bg-", "")} bg-gray-50 ring-2 ring-offset-1 ring-${circle.color.replace("bg-", "")}`
                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${circle.color}`}></span>
                                    {circle.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Konu Başlığı</label>
                        <input 
                            type="text" 
                            id="title" 
                            placeholder="Örn: 9 aylık bebeğim brokoli yemiyor, ne yapabilirim?" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-800 placeholder-gray-400"
                        />
                    </div>

                    {/* Content Input */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">Detaylar</label>
                        <textarea 
                            id="content" 
                            rows={6} 
                            placeholder="Durumu detaylıca anlatın, diğer annelerin tecrübelerine ihtiyacınız var..." 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-800 placeholder-gray-400 resize-none"
                        ></textarea>
                    </div>

                    {/* Tags Input (Simplified) */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-bold text-gray-700 mb-2">Etiketler (Opsiyonel)</label>
                        <input 
                            type="text" 
                            id="tags" 
                            placeholder="#blw, #sebzereddi..." 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-800 placeholder-gray-400"
                        />
                        <p className="text-xs text-gray-400 mt-2">Virgül ile ayırarak birden fazla etiket ekleyebilirsiniz.</p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-end gap-4">
                        <button type="button" className="text-gray-500 font-bold text-sm hover:text-slate-800 transition-colors">İptal</button>
                        <button type="submit" className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-0.5">
                            Yayınla
                        </button>
                    </div>

                </form>

            </div>
            
            {/* Rules Reminder */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                <i className="fa-solid fa-circle-info text-blue-500 mt-1"></i>
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">Hatırlatma</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Burada tıbbi tavsiye vermek veya istemek yasaktır. Acil durumlar için lütfen doktorunuza danışın. Topluluk kurallarına uygun paylaşımlar yapmaya özen gösterin.
                    </p>
                </div>
            </div>

        </div>

    </div>
  );
}