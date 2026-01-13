"use client";

import React, { useState, useEffect, use } from 'react';
import Link from "next/link";
import { notFound } from 'next/navigation';
import { ingredientService } from '@/services/ingredient-service';
import { Ingredient, PrepByAge, IngredientPairing } from '@/lib/types';
import { sanitizeHTML, decodeHTMLEntities } from '@/utils/helpers';
import ClientHead from '@/components/seo/ClientHead';

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

  // Besin değerleri listesi oluştur
  const nutritionItems = [];
  if (ingredient.nutrition?.vitamins) {
    ingredient.nutrition.vitamins.split(',').forEach(v => {
      nutritionItems.push({ icon: 'fa-check', text: `${v.trim()} Vitamini` });
    });
  }
  if (ingredient.nutrition?.fiber) {
    nutritionItems.push({ icon: 'fa-check', text: `${ingredient.nutrition.fiber} lif` });
  }
  if (ingredient.nutrition?.protein) {
    nutritionItems.push({ icon: 'fa-check', text: `${ingredient.nutrition.protein} protein` });
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
        {/* SEO Meta Tags */}
        <ClientHead
          title={`${decodeHTMLEntities(ingredient.name)} - Malzeme Rehberi - KidsGourmet`}
          description={decodeHTMLEntities(ingredient.description).substring(0, 160)}
          keywords={[ingredient.name, ingredient.category || '', 'bebek beslenmesi', 'ek gıda']}
          ogImage={ingredient.image}
          url={typeof window !== 'undefined' ? window.location.href : undefined}
        />

        {/* BREADCRUMB */}
        <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li><Link href="/" className="hover:text-green-500"><i className="fa-solid fa-house"></i></Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li><Link href="/malzeme-rehberi" className="hover:text-green-500">Malzeme Rehberi</Link></li>
                        {ingredient.category && (
                          <>
                            <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                            <li><Link href={`/malzeme-rehberi?kategori=${ingredient.category}`} className="hover:text-green-500">{ingredient.category}</Link></li>
                          </>
                        )}
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
                    
                    {/* HERO CARD - Mobile only, image moved to sidebar on desktop */}
                    <div className="bg-green-50 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-sm border border-green-100">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
                        
                        <div className="relative z-10 flex-1 text-center md:text-left">
                            {ingredient.category && (
                              <span className="bg-white text-green-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-sm mb-4 inline-block">
                                {decodeHTMLEntities(ingredient.category)}
                              </span>
                            )}
                            <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-800 mb-4 font-sans">{decodeHTMLEntities(ingredient.name)}</h1>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                {decodeHTMLEntities(ingredient.description)}
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

                        {/* Image visible only on mobile */}
                        <div className="relative z-10 w-full md:w-1/3 flex justify-center lg:hidden">
                            <img 
                              src={ingredient.image || `https://placehold.co/400x400/AED581/ffffff?text=${encodeURIComponent(ingredient.name)}`} 
                              alt={ingredient.name}
                              className="w-64 h-64 md:w-full md:h-auto rounded-[2rem] shadow-xl transform hover:scale-105 transition-transform object-cover"
                            />
                        </div>
                    </div>

                    {/* INFO SECTIONS */}
                    <div className="space-y-8">
                        
                        {/* Section 1: Benefits */}
                        {ingredient.benefits && (
                          <div>
                              <h2 className="font-display font-bold text-2xl text-slate-800 mb-4 flex items-center font-sans">
                                  <i className="fa-solid fa-star text-yellow-400 mr-3 text-xl"></i> Neden {decodeHTMLEntities(ingredient.name)}?
                              </h2>
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                  <div 
                                    className="prose prose-slate max-w-none text-gray-600 mb-4"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(ingredient.benefits) }}
                                  />
                                  {nutritionItems.length > 0 && (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none pl-0">
                                      {nutritionItems.map((item, index) => (
                                        <li key={index} className="flex items-center">
                                          <i className={`fa-solid ${item.icon} text-green-500 mr-2`}></i> {decodeHTMLEntities(item.text)}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                              </div>
                          </div>
                        )}

                        {/* Section 2: How to Prepare by Age - DİNAMİK */}
                        {ingredient.prep_by_age && ingredient.prep_by_age.length > 0 && (
                          <div>
                              <h2 className="font-display font-bold text-2xl text-slate-800 mb-4 flex items-center font-sans">
                                  <i className="fa-solid fa-spoon text-orange-500 mr-3 text-xl"></i> Nasıl Hazırlanır?
                              </h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {ingredient.prep_by_age.map((prep: PrepByAge, index: number) => {
                                    // Yaş grubuna göre renk belirle
                                    const isBlw = prep.age.toLowerCase().includes('blw') || prep.age.includes('9+');
                                    const bgColor = isBlw ? 'bg-blue-50' : 'bg-orange-50';
                                    const borderColor = isBlw ? 'border-blue-100' : 'border-orange-100';
                                    const textColor = isBlw ? 'text-blue-500' : 'text-orange-500';
                                    
                                    return (
                                      <div key={index} className={`${bgColor} p-6 rounded-3xl border ${borderColor}`}>
                                        <div className={`font-bold ${textColor} mb-2 text-lg`}>
                                          {prep.age}
                                          {prep.method && <span className="text-sm font-normal ml-2">({prep.method})</span>}
                                        </div>
                                        <p className="text-sm text-gray-600">{prep.text}</p>
                                      </div>
                                    );
                                  })}
                              </div>
                          </div>
                        )}

                        {/* Section 3: Selection & Storage Tips - DİNAMİK */}
                        {(ingredient.selection_tips || ingredient.storage_tips || ingredient.pro_tips) && (
                          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-start">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-2xl text-slate-500">
                                  <i className="fa-solid fa-cart-shopping"></i>
                              </div>
                              <div>
                                  <h3 className="font-bold text-slate-800 text-lg mb-2">Nasıl Seçilir ve Saklanır?</h3>
                                  
                                  {ingredient.selection_tips && (
                                    <p className="text-gray-600 text-sm mb-2">{ingredient.selection_tips}</p>
                                  )}
                                  
                                  {ingredient.storage_tips && (
                                    <p className="text-gray-600 text-sm mb-2">
                                      <span className="font-bold text-slate-800">Saklama:</span> {ingredient.storage_tips}
                                    </p>
                                  )}
                                  
                                  {ingredient.pro_tips && (
                                    <p className="text-gray-600 text-sm">
                                      <span className="font-bold text-slate-800">💡 Püf Noktası:</span> {ingredient.pro_tips}
                                    </p>
                                  )}
                              </div>
                          </div>
                        )}

                        {/* Section 4: FAQ - DİNAMİK */}
                        {ingredient.faq && ingredient.faq.length > 0 && (
                          <div>
                              <h2 className="font-display font-bold text-2xl text-slate-800 mb-4 flex items-center font-sans">
                                  <i className="fa-solid fa-circle-question text-purple-500 mr-3 text-xl"></i> Sıkça Sorulan Sorular
                              </h2>
                              <div className="space-y-3">
                                  {ingredient.faq.map((item, index) => (
                                    <details key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                                      <summary className="p-4 cursor-pointer font-medium text-slate-800 hover:bg-gray-50 flex items-center justify-between">
                                        {item.question}
                                        <i className="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
                                      </summary>
                                      <div className="px-4 pb-4 text-gray-600 text-sm">
                                        {item.answer}
                                      </div>
                                    </details>
                                  ))}
                              </div>
                          </div>
                        )}

                    </div>

                    {/* RELATED RECIPES GRID */}
                    <div id="recipes" className="mt-8 pt-10 border-t border-gray-100">
                        <h2 className="font-display font-bold text-3xl text-slate-800 mb-8 font-sans">{ingredient.name} ile Tarifler</h2>
                        
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
                          <div className="text-center py-8 text-gray-500">
                            <i className="fa-solid fa-utensils text-4xl mb-4 text-gray-300"></i>
                            <p>Henüz bu malzeme ile tarif eklenmemiş.</p>
                            <Link href="/tarifler" className="text-green-500 hover:underline mt-2 inline-block">
                              Tüm tariflere göz atın →
                            </Link>
                          </div>
                        )}
                        
                        {ingredient.related_recipes && ingredient.related_recipes.length > 0 && (
                          <div className="mt-8 text-center">
                            <Link href={`/tarifler?malzeme=${ingredient.slug}`} className="text-green-600 font-bold hover:underline flex items-center justify-center w-full sm:w-auto mx-auto gap-2">
                              Tüm {ingredient.name} Tarifleri <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                          </div>
                        )}
                    </div>

                </div>

                {/* RIGHT COLUMN (Sticky Sidebar) */}
                <div className="lg:col-span-1 hidden lg:block">
                    <div className="sticky top-24 space-y-6">
                        
                        {/* IMAGE CARD - Desktop only */}
                        <div className="rounded-3xl overflow-hidden shadow-lg">
                            <img 
                              src={ingredient.image || `https://placehold.co/400x400/AED581/ffffff?text=${encodeURIComponent(ingredient.name)}`} 
                              alt={ingredient.name}
                              className="w-full h-auto object-cover"
                            />
                        </div>
                        
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
                                
                                {/* Besin Değerleri (100g başına) */}
                                {(ingredient.nutrition?.calories || ingredient.nutrition?.protein || ingredient.nutrition?.carbs || ingredient.nutrition?.fat || ingredient.nutrition?.fiber) && (
                                  <div className="pt-3 border-t border-gray-100">
                                    <h4 className="font-bold text-slate-800 text-sm mb-3">Besin Değerleri (100g)</h4>
                                    <div className="space-y-2 text-sm">
                                      {ingredient.nutrition?.calories && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Kalori</span>
                                          <span className="font-bold text-slate-800">{ingredient.nutrition.calories}</span>
                                        </div>
                                      )}
                                      {ingredient.nutrition?.protein && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Protein</span>
                                          <span className="font-bold text-slate-800">{ingredient.nutrition.protein}</span>
                                        </div>
                                      )}
                                      {ingredient.nutrition?.carbs && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Karbonhidrat</span>
                                          <span className="font-bold text-slate-800">{ingredient.nutrition.carbs}</span>
                                        </div>
                                      )}
                                      {ingredient.nutrition?.fat && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Yağ</span>
                                          <span className="font-bold text-slate-800">{ingredient.nutrition.fat}</span>
                                        </div>
                                      )}
                                      {ingredient.nutrition?.fiber && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Lif</span>
                                          <span className="font-bold text-slate-800">{ingredient.nutrition.fiber}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                        </div>

                        {/* PAIRINGS CARD - DİNAMİK */}
                        {ingredient.pairings && ingredient.pairings.length > 0 && (
                          <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                              <i className="fa-solid fa-link text-orange-500 mr-2"></i> Uyumlu İkililer
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">{ingredient.name} ile harika giden diğer lezzetler:</p>
                            <div className="flex flex-wrap gap-2">
                              {ingredient.pairings.map((pairing: IngredientPairing, index: number) => (
                                <span key={index} className="bg-white px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 shadow-sm border border-gray-100 flex items-center gap-1">
                                  <span>{pairing.emoji}</span> {pairing.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                    </div>
                </div>

                {/* Mobile Sidebar Content */}
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
                    
                    {/* Mobile Pairings */}
                    {ingredient.pairings && ingredient.pairings.length > 0 && (
                      <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                        <h3 className="font-bold text-slate-800 mb-3 text-sm">🔗 Uyumlu İkililer</h3>
                        <div className="flex flex-wrap gap-2">
                          {ingredient.pairings.map((pairing: IngredientPairing, index: number) => (
                            <span key={index} className="bg-white px-2 py-1 rounded-lg text-xs font-medium text-gray-600">
                              {pairing.emoji} {pairing.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

            </div>
        </div>

    </div>
  );
}