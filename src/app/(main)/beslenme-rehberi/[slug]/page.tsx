"use client";

import React, { useState, useEffect, use } from 'react';
import Link from "next/link";
import { notFound, useRouter } from 'next/navigation';
import { ingredientService } from '@/services/ingredient-service';
import { Ingredient, PrepByAge, IngredientPairing } from '@/lib/types';
import { sanitizeHTML, decodeHTMLEntities } from '@/utils/helpers';
import ClientHead from '@/components/seo/ClientHead';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';
import { EditButton } from '@/components/ui/EditButton';

export default function IngredientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useUser();
  const router = useRouter();

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

  // Format start age helper
  const formatStartAge = (age: string) => {
    if (!age) return '';
    // Eğer sadece sayı ise "Ay" ekle
    if (/^\d+$/.test(age.trim())) {
      return `${age} Ay`;
    }
    // Eğer "+" ile başlıyorsa ve sayı varsa
    if (/^\+?\d+$/.test(age.trim())) {
      return `${age.replace('+', '')}+ Ay`;
    }
    return age;
  };

  // Favorilere kaydetme
  const handleSaveToFavorites = () => {
    if (!isAuthenticated) {
      toast.error('Bu özelliği kullanmak için giriş yapmalısınız', {
        action: {
          label: 'Giriş Yap',
          onClick: () => router.push('/giris?redirect=' + encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : ''))
        }
      });
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi!');
  };

  // Paylaşım fonksiyonları
  const shareWhatsApp = () => {
    const text = `${ingredient.name} - Bebek beslenmesi için ${ingredient.category || 'malzeme'} rehberi`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + window.location.href)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `${ingredient.name} - Bebek beslenmesi için ${ingredient.category || 'malzeme'} rehberi`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link kopyalandı!');
  };

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
          title={ingredient.seo?.title || `${decodeHTMLEntities(ingredient.name)} - Malzeme Rehberi - KidsGourmet`}
          description={ingredient.seo?.description || decodeHTMLEntities(ingredient.description).replace(/<[^>]*>/g, '').substring(0, 160)}
          keywords={ingredient.seo?.focus_keywords || [ingredient.name, ingredient.category || '', 'bebek beslenmesi', 'ek gıda']}
          ogImage={ingredient.seo?.og_image || ingredient.image}
          url={typeof window !== 'undefined' ? window.location.href : ''}
        />

        {/* BREADCRUMB - pt-20 eklendi (header yüksekliği için) */}
        <div className="bg-white border-b border-gray-100 pt-20">
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
                            <div className="flex items-start justify-between gap-3 mb-4 group">
                              <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-800 font-sans">{decodeHTMLEntities(ingredient.name)}</h1>
                              <EditButton 
                                contentType="ingredient" 
                                contentId={ingredient.id}
                                variant="icon"
                              />
                            </div>
                            <div 
                              className="text-slate-600 text-lg leading-relaxed mb-6"
                              dangerouslySetInnerHTML={{ __html: sanitizeHTML(ingredient.description) }}
                            />
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                {/* Tariflere Git */}
                                <Link href="#recipes" className="bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-green-600 transition-colors inline-flex items-center justify-center">
                                    <i className="fa-solid fa-utensils mr-2"></i> Tarifler
                                </Link>
                                
                                {/* Favorilere Ekle */}
                                <button 
                                  onClick={handleSaveToFavorites}
                                  className={`font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center ${
                                    isFavorite 
                                      ? 'bg-red-500 text-white hover:bg-red-600' 
                                      : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'
                                  }`}
                                >
                                  <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart mr-2`}></i>
                                  {isFavorite ? 'Kaydedildi' : 'Kaydet'}
                                </button>
                                
                                {/* Paylaşım Butonları */}
                                <div className="flex gap-2">
                                  <button 
                                    onClick={shareWhatsApp}
                                    className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                                    title="WhatsApp'ta Paylaş"
                                  >
                                    <i className="fa-brands fa-whatsapp text-xl"></i>
                                  </button>
                                  <button 
                                    onClick={shareFacebook}
                                    className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                                    title="Facebook'ta Paylaş"
                                  >
                                    <i className="fa-brands fa-facebook-f text-xl"></i>
                                  </button>
                                  <button 
                                    onClick={shareTwitter}
                                    className="bg-sky-500 hover:bg-sky-600 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                                    title="Twitter'da Paylaş"
                                  >
                                    <i className="fa-brands fa-twitter text-xl"></i>
                                  </button>
                                  <button 
                                    onClick={copyLink}
                                    className="bg-gray-500 hover:bg-gray-600 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                                    title="Link Kopyala"
                                  >
                                    <i className="fa-solid fa-link text-lg"></i>
                                  </button>
                                </div>
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

                        {/* Section 3: Selection & Storage Tips - DİNAMİK - Koşullu Gösterim */}
                        {(ingredient.selection_tips || ingredient.storage_tips || ingredient.pro_tips) && (
                          <div>
                              {ingredient.selection_tips && (
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-4">
                                  <h3 className="font-bold text-slate-800 text-lg mb-2">
                                    <i className="fa-solid fa-cart-shopping text-green-500 mr-2"></i>
                                    Nasıl Seçilir?
                                  </h3>
                                  <p className="text-gray-600 text-sm">{ingredient.selection_tips}</p>
                                </div>
                              )}
                              
                              {ingredient.storage_tips && (
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-4">
                                  <h3 className="font-bold text-slate-800 text-lg mb-2">
                                    <i className="fa-solid fa-box-archive text-blue-500 mr-2"></i>
                                    Saklama İpuçları
                                  </h3>
                                  <p className="text-gray-600 text-sm">{ingredient.storage_tips}</p>
                                </div>
                              )}
                              
                              {ingredient.pro_tips && (
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                  <h3 className="font-bold text-slate-800 text-lg mb-2">
                                    <i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>
                                    Püf Noktaları
                                  </h3>
                                  <p className="text-gray-600 text-sm">{ingredient.pro_tips}</p>
                                </div>
                              )}
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

                        {/* Section 5: Alerjen Detayları - Sadece veri varsa göster */}
                        {ingredient.allergen_info && (
                          ingredient.allergen_info.is_allergen ||
                          ingredient.allergen_info.cross_contamination_risk ||
                          ingredient.allergen_info.allergy_symptoms ||
                          ingredient.allergen_info.alternative_ingredients
                        ) && (
                          <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
                            <h3 className="font-bold text-red-700 mb-4 flex items-center">
                              <i className="fa-solid fa-triangle-exclamation mr-2"></i> Alerjen Bilgileri
                            </h3>
                            
                            {ingredient.allergen_info.is_allergen && (
                              <div className="mb-3">
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                  Bu malzeme alerjen içerir
                                </span>
                              </div>
                            )}
                            
                            {ingredient.allergen_info.cross_contamination_risk && (
                              <p className="text-sm text-gray-700 mb-2">
                                <strong>Çapraz Bulaşma Riski:</strong> {ingredient.allergen_info.cross_contamination_risk}
                              </p>
                            )}
                            
                            {ingredient.allergen_info.allergy_symptoms && (
                              <p className="text-sm text-gray-700 mb-2">
                                <strong>Olası Semptomlar:</strong> {ingredient.allergen_info.allergy_symptoms}
                              </p>
                            )}
                            
                            {ingredient.allergen_info.alternative_ingredients && (
                              <p className="text-sm text-gray-700">
                                <strong>Alternatif Malzemeler:</strong> {ingredient.allergen_info.alternative_ingredients}
                              </p>
                            )}
                          </div>
                        )}

                    </div>

                    {/* RELATED RECIPES GRID - 6 Tarif */}
                    <div id="recipes" className="mt-8 pt-10 border-t border-gray-100">
                        <h2 className="font-display font-bold text-3xl text-slate-800 mb-8 font-sans">
                          {decodeHTMLEntities(ingredient.name)} ile Tarifler
                        </h2>
                        
                        {ingredient.related_recipes && ingredient.related_recipes.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {ingredient.related_recipes.slice(0, 6).map((recipe) => (
                                <Link 
                                  key={recipe.id} 
                                  href={`/tarifler/${recipe.slug}`} 
                                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden"
                                >
                                    <div className="aspect-[4/3] overflow-hidden relative">
                                        <img 
                                          src={recipe.image || 'https://placehold.co/400x300/FFF3E0/FF8A65?text=Tarif'} 
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                          alt={recipe.title}
                                        />
                                        {/* Age Group Badge */}
                                        <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                          {decodeHTMLEntities(recipe.age_group)}
                                        </span>
                                        {/* Prep Time Badge */}
                                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                                          <i className="fa-regular fa-clock mr-1"></i> {recipe.prep_time}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 group-hover:text-green-500 transition-colors mb-2">
                                          {decodeHTMLEntities(recipe.title)}
                                        </h3>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Meal Type */}
                                            {recipe.meal_type && (
                                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                                                <i className="fa-solid fa-utensils mr-1"></i>
                                                {decodeHTMLEntities(recipe.meal_type)}
                                              </span>
                                            )}
                                            {/* Diet Types */}
                                            {recipe.diet_types && recipe.diet_types.length > 0 && (
                                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">
                                                {decodeHTMLEntities(recipe.diet_types[0])}
                                              </span>
                                            )}
                                        </div>
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
                              Tüm {decodeHTMLEntities(ingredient.name)} Tarifleri <i className="fa-solid fa-arrow-right"></i>
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
                            {ingredient.image_credit && (
                              <p className="text-xs text-gray-400 text-center mt-2">
                                📷 {ingredient.image_source === 'dall-e-3' ? 'AI Generated' : ingredient.image_credit}
                              </p>
                            )}
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
                                    <span className="font-bold text-slate-800">{formatStartAge(ingredient.start_age)}</span>
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
                                
                                {/* Besin Değerleri (100g başına) - Her iki formatı destekle */}
                                {(() => {
                                  const nutritionData = ingredient.nutrition_per_100g || ingredient.nutrition;
                                  const hasNutrition = nutritionData && (
                                    nutritionData.calories || nutritionData.protein || 
                                    nutritionData.carbs || nutritionData.fat || 
                                    nutritionData.fiber || nutritionData.sugar || nutritionData.minerals
                                  );
                                  
                                  return hasNutrition ? (
                                    <div className="pt-3 border-t border-gray-100">
                                      <h4 className="font-bold text-slate-800 text-sm mb-3">Besin Değerleri (100g)</h4>
                                      <div className="space-y-2 text-sm">
                                        {nutritionData.calories && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Kalori</span>
                                            <span className="font-bold text-slate-800">{nutritionData.calories}</span>
                                          </div>
                                        )}
                                        {nutritionData.protein && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Protein</span>
                                            <span className="font-bold text-slate-800">{nutritionData.protein}</span>
                                          </div>
                                        )}
                                        {nutritionData.carbs && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Karbonhidrat</span>
                                            <span className="font-bold text-slate-800">{nutritionData.carbs}</span>
                                          </div>
                                        )}
                                        {nutritionData.fat && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Yağ</span>
                                            <span className="font-bold text-slate-800">{nutritionData.fat}</span>
                                          </div>
                                        )}
                                        {nutritionData.fiber && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Lif</span>
                                            <span className="font-bold text-slate-800">{nutritionData.fiber}</span>
                                          </div>
                                        )}
                                        {nutritionData.sugar && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Şeker</span>
                                            <span className="font-bold text-slate-800">{nutritionData.sugar}</span>
                                          </div>
                                        )}
                                        {nutritionData.minerals && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Mineraller</span>
                                            <span className="font-bold text-slate-800">{nutritionData.minerals}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : null;
                                })()}
                                
                                {/* İçerdiği Alerjenler (Taxonomy) - YENİ */}
                                {ingredient.allergens && ingredient.allergens.length > 0 && (
                                  <div className="pt-3 border-t border-gray-100">
                                    <h4 className="font-bold text-red-600 text-sm mb-2">⚠️ İçerdiği Alerjenler</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {ingredient.allergens.map((allergen, idx) => (
                                        <span key={idx} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                                          {allergen}
                                        </span>
                                      ))}
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

                        {/* SIDEBAR ARAÇLAR - Rastgele Faydalı Araçlar */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                            <i className="fa-solid fa-wand-magic-sparkles text-green-500 mr-2"></i> 
                            Faydalı Araçlar
                          </h3>
                          <div className="space-y-2">
                            {[
                              { name: 'BLW Hazırlık Testi', slug: 'blw-testi', icon: 'fa-baby', color: 'text-pink-500', bg: 'bg-pink-50' },
                              { name: 'Persentil Hesaplayıcı', slug: 'persentil', icon: 'fa-chart-line', color: 'text-blue-500', bg: 'bg-blue-50' },
                              { name: 'Su İhtiyacı Hesaplayıcı', slug: 'su-ihtiyaci', icon: 'fa-droplet', color: 'text-cyan-500', bg: 'bg-cyan-50' },
                              { name: 'Alerjen Planlayıcı', slug: 'alerjen-planlayici', icon: 'fa-shield-halved', color: 'text-red-500', bg: 'bg-red-50' },
                              { name: 'Ek Gıda Rehberi', slug: 'ek-gida-rehberi', icon: 'fa-book-open', color: 'text-green-500', bg: 'bg-green-50' },
                              { name: 'Bu Gıda Verilir mi?', slug: 'bu-gida-verilir-mi', icon: 'fa-circle-question', color: 'text-amber-500', bg: 'bg-amber-50' },
                            ].sort(() => Math.random() - 0.5).slice(0, 4).map((tool) => (
                              <Link
                                key={tool.slug}
                                href={`/akilli-asistan/${tool.slug}`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                              >
                                <div className={`w-10 h-10 ${tool.bg} rounded-xl flex items-center justify-center`}>
                                  <i className={`fa-solid ${tool.icon} ${tool.color}`}></i>
                                </div>
                                <span className="font-medium text-slate-700 group-hover:text-green-500 transition-colors text-sm">
                                  {tool.name}
                                </span>
                                <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs"></i>
                              </Link>
                            ))}
                          </div>
                        </div>

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
                                <div className="font-bold text-slate-800">{formatStartAge(ingredient.start_age)}</div>
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