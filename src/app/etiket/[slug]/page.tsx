"use client";

import React from 'react';
import Link from "next/link";

export default function TagPage({ params }: { params: { slug: string } }) {
  // Mockup verisi: Gerçek projede slug'a göre (örn: 'blw') API'den etiket bilgileri çekilecek.
  const tag = {
    title: "#BLW",
    slug: "blw",
    description: "Bebek liderliğinde beslenme (Baby Led Weaning) hakkında tarifler, rehberler ve ipuçları.",
    heroImage: "https://placehold.co/1200x500/FFF9C4/FBC02D?text=BLW+Dunyasi",
    relatedTags: ["#parmakgıda", "#ekgıda", "#ilktadımlar", "#bebekkahvaltısı"]
  };

  return (
    <div className="bg-gray-50 min-h-screen">

        {/* TAG HERO SECTION */}
        <div className="bg-yellow-50 pb-12 pt-8 border-b border-yellow-100 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100/50 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    <div className="max-w-2xl text-center md:text-left">
                        <nav className="flex justify-center md:justify-start text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-2">
                                {/* Localde Link kullanın */}
                                <li><Link href="/" className="hover:text-yellow-600"><i className="fa-solid fa-house"></i></Link></li>
                                <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                                <li><Link href="/blog" className="hover:text-yellow-600">Etiketler</Link></li>
                                <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                                <li className="font-bold text-yellow-600">{tag.title}</li>
                            </ol>
                        </nav>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                            <div className="w-14 h-14 bg-white text-yellow-600 rounded-2xl flex items-center justify-center shadow-sm text-2xl rotate-3">
                                <i className="fa-solid fa-tag"></i>
                            </div>
                            <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-800 font-sans">{tag.title}</h1>
                        </div>
                        
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {tag.description}
                        </p>
                    </div>

                    {/* Tag Specific Info/Stats */}
                    <div className="hidden md:block w-72 bg-white p-5 rounded-3xl shadow-lg border border-yellow-100 transform -rotate-1 hover:rotate-0 transition-transform duration-300 cursor-default group">
                        <div className="text-center">
                            <span className="block text-3xl font-bold text-slate-800 mb-1">42</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">İçerik Bulundu</span>
                        </div>
                        <div className="border-t border-gray-100 my-4"></div>
                        <div className="flex justify-around text-center">
                            <div>
                                <span className="block text-lg font-bold text-slate-700">28</span>
                                <span className="text-[10px] text-gray-400">Tarif</span>
                            </div>
                            <div>
                                <span className="block text-lg font-bold text-slate-700">14</span>
                                <span className="text-[10px] text-gray-400">Yazı</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Related Tags (Pills) */}
                <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="text-sm font-bold text-gray-400 py-2 mr-2">İlgili Etiketler:</span>
                    {tag.relatedTags.map((related, index) => (
                        <button key={index} className="px-4 py-1.5 rounded-full bg-white border border-yellow-200 text-yellow-700 font-medium text-xs hover:bg-yellow-50 transition-colors">
                            {related}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* LEFT: CONTENT GRID (3 Columns Grid) */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Post 1 (Recipe) */}
                        <article className="flex flex-col group h-full">
                            {/* Localde Link kullanın */}
                            <Link href="#" className="block overflow-hidden rounded-3xl mb-4 relative aspect-[4/3]">
                                <img src="https://placehold.co/600x450/FFF9C4/FBC02D?text=Parmak+Gida" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Parmak Gıda" />
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-orange-500 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Tarif</span>
                            </Link>
                            <div className="flex-1 flex flex-col">
                                <h3 className="font-display font-bold text-lg text-slate-800 mb-2 leading-snug group-hover:text-yellow-600 transition-colors font-sans">
                                    <Link href="#">Fırında Bebek Mücveri (BLW Dostu)</Link>
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                    Yumurtasız, tam buğday unlu ve tutması çok kolay.
                                </p>
                                <div className="mt-auto flex items-center text-xs text-gray-400 gap-3">
                                    <span><i className="fa-regular fa-clock mr-1"></i> 20 dk</span>
                                    <span><i className="fa-solid fa-fire mr-1"></i> 140 kcal</span>
                                </div>
                            </div>
                        </article>

                        {/* Post 2 (Blog) */}
                        <article className="flex flex-col group h-full">
                            <Link href="#" className="block overflow-hidden rounded-3xl mb-4 relative aspect-[4/3]">
                                <img src="https://placehold.co/600x450/AED581/ffffff?text=BLW+Nedir" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="BLW Nedir" />
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-green-600 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Rehber</span>
                            </Link>
                            <div className="flex-1 flex flex-col">
                                <h3 className="font-display font-bold text-lg text-slate-800 mb-2 leading-snug group-hover:text-yellow-600 transition-colors font-sans">
                                    <Link href="#">BLW Yöntemi Nedir? Başlangıç Rehberi</Link>
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                    Bebeğinizin kendi kendine beslenmesi için bilmeniz gereken her şey.
                                </p>
                                <div className="mt-auto flex items-center text-xs text-gray-400 gap-3">
                                    <span><i className="fa-regular fa-calendar mr-1"></i> 14 Oca</span>
                                    <span><i className="fa-regular fa-clock mr-1"></i> 6 dk</span>
                                </div>
                            </div>
                        </article>

                        {/* Post 3 (Recipe) */}
                        <article className="flex flex-col group h-full">
                            <Link href="#" className="block overflow-hidden rounded-3xl mb-4 relative aspect-[4/3]">
                                <img src="https://placehold.co/600x450/F3E5F5/AB47BC?text=Pankek" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Pankek" />
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-orange-500 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Tarif</span>
                            </Link>
                            <div className="flex-1 flex flex-col">
                                <h3 className="font-display font-bold text-lg text-slate-800 mb-2 leading-snug group-hover:text-yellow-600 transition-colors font-sans">
                                    <Link href="#">Pancarlı Mini Pankek</Link>
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                    Rengini pancardan alan, şekersiz ve yumuşacık pankekler.
                                </p>
                                <div className="mt-auto flex items-center text-xs text-gray-400 gap-3">
                                    <span><i className="fa-regular fa-clock mr-1"></i> 15 dk</span>
                                    <span><i className="fa-solid fa-fire mr-1"></i> 110 kcal</span>
                                </div>
                            </div>
                        </article>

                        {/* Post 4 (Community Discussion) */}
                        <article className="flex flex-col group h-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3 text-purple-500 text-xs font-bold uppercase tracking-wide">
                                <i className="fa-solid fa-comments"></i> Topluluk Tartışması
                            </div>
                            <h3 className="font-display font-bold text-lg text-slate-800 mb-2 leading-snug group-hover:text-purple-600 transition-colors font-sans">
                                <Link href="#">BLW yaparken yerler çok kirleniyor, ne önerirsiniz?</Link>
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                                Önlük, yer örtüsü tavsiyelerinize ihtiyacım var. Temizlikten yoruldum :(
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                    <img src="https://placehold.co/50x50/FFCC80/ffffff?text=A" className="w-6 h-6 rounded-full" alt="User" />
                                    <span className="text-xs text-gray-500">Ayşe K.</span>
                                </div>
                                <span className="text-xs font-bold text-purple-500">12 Cevap</span>
                            </div>
                        </article>

                        {/* Post 5 (Recipe) */}
                        <article className="flex flex-col group h-full">
                            <Link href="#" className="block overflow-hidden rounded-3xl mb-4 relative aspect-[4/3]">
                                <img src="https://placehold.co/600x450/E0F2F1/009688?text=Kofter" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Köfte" />
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-orange-500 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Tarif</span>
                            </Link>
                            <div className="flex-1 flex flex-col">
                                <h3 className="font-display font-bold text-lg text-slate-800 mb-2 leading-snug group-hover:text-yellow-600 transition-colors font-sans">
                                    <Link href="#">Sebzeli Tavuk Köftesi</Link>
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                    İçine sebze gizlenmiş, yumuşak ve besleyici köfteler.
                                </p>
                                <div className="mt-auto flex items-center text-xs text-gray-400 gap-3">
                                    <span><i className="fa-regular fa-clock mr-1"></i> 30 dk</span>
                                    <span><i className="fa-solid fa-fire mr-1"></i> 180 kcal</span>
                                </div>
                            </div>
                        </article>

                         {/* Post 6 (Tool Promo - Contextual) */}
                         <div className="flex flex-col justify-center items-center h-full bg-blue-50/50 p-6 rounded-3xl border border-blue-100 text-center">
                            <div className="w-16 h-16 bg-white text-blue-500 rounded-full flex items-center justify-center mb-4 shadow-sm text-2xl">
                                <i className="fa-solid fa-check-double"></i>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-2">BLW'ye Hazır mı?</h3>
                            <p className="text-sm text-gray-600 mb-4">Bebeğinizin fiziksel işaretlerini test edin.</p>
                            <button className="bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors">
                                Testi Başlat
                            </button>
                        </div>

                    </div>

                    {/* Load More */}
                    <div className="mt-12 text-center">
                        <button className="bg-white border-2 border-gray-100 text-gray-600 hover:border-yellow-500 hover:text-yellow-600 font-bold py-3 px-8 rounded-full transition-all shadow-sm">
                            Daha Fazla Göster
                        </button>
                    </div>
                </div>

                {/* RIGHT: SIDEBAR (Contextual) */}
                <aside className="hidden lg:block lg:col-span-1 space-y-8">
                    
                    {/* Newsletter Widget */}
                    <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 text-center">
                        <div className="w-12 h-12 bg-white text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-xl">
                            <i className="fa-regular fa-lightbulb"></i>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2 font-sans">BLW İpuçları</h3>
                        <p className="text-xs text-gray-600 mb-4">Bu etiketle ilgili en yeni ipuçları ve tarifler e-postana gelsin.</p>
                        <input type="email" placeholder="E-posta adresin" className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm mb-2 outline-none focus:border-yellow-500" />
                        <button className="w-full bg-yellow-500 text-white font-bold py-2 rounded-xl text-sm hover:bg-yellow-600 transition-colors">Takip Et</button>
                    </div>

                    {/* Popular Tags */}
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4 text-sm font-sans">Popüler Etiketler</h3>
                        <div className="flex flex-wrap gap-2">
                            <Link href="#" className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs hover:bg-green-50 hover:text-green-600 transition-colors">#ekgıda</Link>
                            <Link href="#" className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs hover:bg-green-50 hover:text-green-600 transition-colors">#alerji</Link>
                            <Link href="#" className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs hover:bg-green-50 hover:text-green-600 transition-colors">#kahvaltı</Link>
                             <Link href="#" className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs hover:bg-green-50 hover:text-green-600 transition-colors">#çorba</Link>
                        </div>
                    </div>

                </aside>

            </div>

        </div>

    </div>
  );
}