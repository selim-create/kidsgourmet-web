"use client";

import React, { useState, useEffect, use } from 'react';
import Link from "next/link";
import { notFound } from 'next/navigation';
import { ingredientService } from '@/services/ingredient-service';
import { Ingredient } from '@/lib/types';

export default function IngredientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIngredient() {
      try {
        setLoading(true);
        const data = await ingredientService.getBySlug(slug);
        if (!data) {
          setIngredient(null);
        } else {
          setIngredient(data);
        }
      } catch (error) {
        console.error("Malzeme yüklenirken hata:", error);
        setIngredient(null);
      } finally {
        setLoading(false);
      }
    }
    fetchIngredient();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!ingredient) {
    return notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

        {/* BREADCRUMB */}
        <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        {/* Localde Link kullanın */}
                        <li><Link href="/" className="hover:text-green-500"><i className="fa-solid fa-house"></i></Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li><Link href="/malzeme-rehberi" className="hover:text-green-500">Malzeme Rehberi</Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li><Link href="#" className="hover:text-green-500">Meyveler</Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li className="font-semibold text-green-500 capitalize">{ingredient.name}</li>
                    </ol>
                </nav>
            </div>
        </div>

        {/* MAIN CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* LEFT COLUMN (Main Content) */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    
                    {/* HERO CARD */}
                    <div className="bg-green-50 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-sm border border-green-100">
                        {/* Decor Blobs */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
                        
                        <div className="relative z-10 flex-1 text-center md:text-left">
                            <span className="bg-white text-green-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-sm mb-4 inline-block">Süper Besin</span>
                            <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-800 mb-4 font-sans">{ingredient.name}</h1>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                {ingredient.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link href="#recipes" className="bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-green-600 transition-colors inline-flex items-center justify-center">
                                    <i className="fa-solid fa-utensils mr-2"></i> Tarifler
                                </Link>
                                <button className="bg-white text-slate-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center border border-transparent hover:border-gray-200">
                                    <i className="fa-regular fa-share-from-square mr-2"></i> Paylaş
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10 w-full md:w-1/3 flex justify-center">
                            <img src={ingredient.image || `https://placehold.co/400x400/AED581/ffffff?text=${ingredient.name}`} className="w-64 h-64 md:w-full md:h-auto rounded-[2rem] shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white object-cover" alt={ingredient.name} />
                        </div>
                    </div>

                    {/* INFO SECTIONS */}
                    <div className="space-y-8">
                        
                        {/* Section 1: Intro & Benefits */}
                        <div>
                            <h2 className="font-display font-bold text-2xl text-slate-800 mb-4 flex items-center font-sans">
                                <i className="fa-solid fa-star text-yellow-400 mr-3 text-xl"></i> Neden {ingredient.name}?
                            </h2>
                            <div className="prose prose-slate max-w-none text-gray-600 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <p className="mb-4">
                                    {ingredient.benefits}
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none pl-0">
                                    <li className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-2"></i> Beyin gelişimi için Omega-3 yağ asitleri</li>
                                    <li className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-2"></i> Sindirimi kolay lif kaynağı</li>
                                    <li className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-2"></i> Göz sağlığı için Lutein</li>
                                    <li className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-2"></i> Bağışıklık için C Vitamini</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 2: How to Serve */}
                        <div>
                            <h2 className="font-display font-bold text-2xl text-slate-800 mb-4 flex items-center font-sans">
                                <i className="fa-solid fa-spoon text-orange-500 mr-3 text-xl"></i> Nasıl Hazırlanır?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Card 6-9 */}
                                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                                    <div className="font-bold text-orange-500 mb-2 text-lg">6-9 Ay</div>
                                    <p className="text-sm text-gray-600">
                                        Olgun bir avokadoyu çatalla pürüzsüz olana kadar ezin. Anne sütü veya formül mama ile kıvamını açabilirsiniz. Kaşıkla püre olarak sunun.
                                    </p>
                                </div>
                                {/* Card 9+ */}
                                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                                    <div className="font-bold text-blue-500 mb-2 text-lg">9+ Ay (BLW)</div>
                                    <p className="text-sm text-gray-600">
                                        Avokadoyu serçe parmağı kalınlığında dilimler halinde kesin. Kayganlığını azaltmak için dilimleri ince çekilmiş ceviz, rüşeym veya ezilmiş yulafa bulayarak eline verin.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: How to Pick */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-start">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-2xl text-slate-500">
                                <i className="fa-solid fa-cart-shopping"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">Nasıl Seçilir ve Saklanır?</h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    Parmağınızla hafifçe bastırdığınızda içine hafif göçen, koyu renkli kabuklu avokadolar yemeğe hazırdır. 
                                </p>
                                <p className="text-gray-600 text-sm">
                                    <span className="font-bold text-slate-800">Püf Noktası:</span> Sert avokadoları kese kağıdında elma veya muz ile bekletmek olgunlaşmayı hızlandırır. Kesilmiş avokadoyu kararmaması için limonlayıp streçleyin.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* RELATED RECIPES GRID */}
                    <div id="recipes" className="mt-8 pt-10 border-t border-gray-100">
                        <h2 className="font-display font-bold text-3xl text-slate-800 mb-8 font-sans">{ingredient.name}lu Tarifler</h2>
                        
                        {ingredient.related_recipes && ingredient.related_recipes.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {ingredient.related_recipes.map((recipe) => (
                                <Link key={recipe.id} href={`/tarifler/${recipe.slug}`} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex gap-4 p-4 items-center group">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img src={recipe.image || 'https://placehold.co/200x200/FFF3E0/FF8A65?text=Tarif'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={recipe.title} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">{recipe.age_group}</div>
                                        <h3 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors">{recipe.title}</h3>
                                        <div className="text-xs text-gray-400 mt-2"><i className="fa-regular fa-clock mr-1"></i> {recipe.prep_time}</div>
                                    </div>
                                </Link>
                              ))}
                          </div>
                        ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recipe Card 1 */}
                            {/* Localde Link kullanın */}
                            <Link href="/tarifler/muzlu-avokado-puresi" className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex gap-4 p-4 items-center group">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img src="https://placehold.co/200x200/FFF3E0/FF8A65?text=Avokado+Puresi" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Püre" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">6-9 Ay • Kahvaltı</div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors">Muzlu Avokado Püresi</h3>
                                    <div className="text-xs text-gray-400 mt-2"><i className="fa-regular fa-clock mr-1"></i> 5 dk</div>
                                </div>
                            </Link>

                            {/* Recipe Card 2 */}
                            <Link href="#" className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex gap-4 p-4 items-center group">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img src="https://placehold.co/200x200/E3F2FD/81D4FA?text=Avokado+Sandvic" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Sandviç" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">12+ Ay • Atıştırmalık</div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors">Ayıcıklı Avokado Tost</h3>
                                    <div className="text-xs text-gray-400 mt-2"><i className="fa-regular fa-clock mr-1"></i> 10 dk</div>
                                </div>
                            </Link>
                            
                            {/* Recipe Card 3 */}
                            <Link href="#" className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex gap-4 p-4 items-center group">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img src="https://placehold.co/200x200/F3E5F5/AB47BC?text=Makarna" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Makarna" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">9+ Ay • Ana Öğün</div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors">Kremalı Avokado Soslu Makarna</h3>
                                    <div className="text-xs text-gray-400 mt-2"><i className="fa-regular fa-clock mr-1"></i> 15 dk</div>
                                </div>
                            </Link>

                            {/* Recipe Card 4 */}
                            <Link href="#" className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex gap-4 p-4 items-center group">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img src="https://placehold.co/200x200/E8F5E9/66BB6A?text=Omlet" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Omlet" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1">8+ Ay • Kahvaltı</div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors">Avokadolu Bebek Omleti</h3>
                                    <div className="text-xs text-gray-400 mt-2"><i className="fa-regular fa-clock mr-1"></i> 10 dk</div>
                                </div>
                            </Link>
                        </div>
                        )}
                        
                        <div className="mt-8 text-center">
                            <button className="text-green-600 font-bold hover:underline flex items-center justify-center w-full sm:w-auto mx-auto gap-2">
                                Tüm {ingredient.name}lu Tarifler <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (Sticky Sidebar) */}
                <div className="lg:col-span-1 hidden lg:block">
                    <div className="sticky top-24 space-y-6">
                        
                        {/* AT A GLANCE CARD */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                            <h3 className="font-bold text-slate-800 text-lg mb-6">Bir Bakışta</h3>
                            
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-500"><i className="fa-regular fa-calendar"></i></div>
                                        <span className="font-medium text-sm">Başlangıç</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{ingredient.start_age}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3 text-red-500"><i className="fa-solid fa-triangle-exclamation"></i></div>
                                        <span className="font-medium text-sm">Alerji Riski</span>
                                    </div>
                                    <span className={`font-bold ${
                                      ingredient.allergy_risk === 'Düşük' ? 'text-green-500' :
                                      ingredient.allergy_risk === 'Orta' ? 'text-yellow-500' :
                                      'text-red-500'
                                    }`}>{ingredient.allergy_risk}</span>
                                </div>

                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mr-3 text-yellow-600"><i className="fa-solid fa-sun"></i></div>
                                        <span className="font-medium text-sm">Mevsimi</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{ingredient.season}</span>
                                </div>
                            </div>
                        </div>

                        {/* PAIRINGS CARD - Commented out until API provides this data
                        <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                                <i className="fa-solid fa-link text-orange-500 mr-2"></i> Uyumlu İkililer
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">{ingredient.name} ile harika giden diğer lezzetler:</p>
                            <div className="flex flex-wrap gap-2">
                                {ingredient.pairings && ingredient.pairings.map((pairing) => (
                                    <span key={pairing} className="bg-white px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 shadow-sm border border-gray-100">
                                        {pairing}
                                    </span>
                                ))}
                            </div>
                        </div>
                        */}

                        {/* EXPERT WIDGET - Commented out until API provides this data
                        <div className="bg-white rounded-3xl p-6 border border-gray-200 text-center">
                            <img src={ingredient.expert?.image || ''} className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white shadow-md" alt="Uzman" />
                            <p className="text-sm text-gray-600 mb-3">Bu içerik <strong className="text-slate-800">{ingredient.expert?.name}</strong> tarafından kontrol edildi.</p>
                            <Link href="#" className="text-green-600 text-xs font-bold hover:underline">Rejimde.com Profilini Gör</Link>
                        </div>
                        */}

                    </div>
                </div>

                {/* Mobile Sidebar Content (Visible on Mobile Only, at bottom) */}
                 <div className="lg:hidden space-y-6">
                    {/* Mobile At a Glance */}
                     <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-bold text-slate-800 text-lg mb-4">Bir Bakışta</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Başlangıç</div>
                                <div className="font-bold text-slate-800">{ingredient.start_age}</div>
                            </div>
                            <div className="border-l border-gray-100">
                                <div className="text-xs text-gray-500 mb-1">Alerji</div>
                                <div className={`font-bold ${
                                  ingredient.allergy_risk === 'Düşük' ? 'text-green-500' :
                                  ingredient.allergy_risk === 'Orta' ? 'text-yellow-500' :
                                  'text-red-500'
                                }`}>{ingredient.allergy_risk}</div>
                            </div>
                            <div className="border-l border-gray-100">
                                <div className="text-xs text-gray-500 mb-1">Mevsim</div>
                                <div className="font-bold text-slate-800">{ingredient.season}</div>
                            </div>
                        </div>
                    </div>
                 </div>

            </div>
        </div>

    </div>
  );
}