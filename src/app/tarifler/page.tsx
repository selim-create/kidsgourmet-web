"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { recipeService } from '@/services/recipe-service';
import { RecipeCard } from '@/lib/types';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtre State'leri (İleride API'ye bağlanabilir)
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        const data = await recipeService.getAll();
        // API response kontrolü - array olduğundan emin ol
        if (Array.isArray(data)) {
          setRecipes(data);
        } else if (data && Array.isArray((data as any).data)) {
          // Eğer response {data: [...]} şeklindeyse
          setRecipes((data as any).data);
        } else if (data && Array.isArray((data as any).recipes)) {
          // Eğer response {recipes: [...]} şeklindeyse
          setRecipes((data as any).recipes);
        } else {
          console.error("Beklenmeyen API response formatı:", data);
          setRecipes([]);
        }
      } catch (error) {
        console.error("Tarifler yüklenirken hata oluştu:", error);
        setRecipes([]); // Hata durumunda boş array
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  // Yardımcı Fonksiyon: Görsel URL'ini güvenli şekilde al
  const getImageUrl = (recipe: RecipeCard) => {
    return recipe.image || 'https://placehold.co/600x400/FFF8E1/FF8A65?text=Tarif';
  };

  // Yardımcı Fonksiyon: Kategori/Yaş bilgisini al
  const getAgeGroup = (recipe: RecipeCard) => {
    return recipe.age_group || '+6 Ay'; // Varsayılan
  };

  // Yardımcı Fonksiyon: Hazırlama Süresi (ACF veya Meta'dan)
  const getPrepTime = (recipe: RecipeCard) => {
    return recipe.prep_time || '15 dk'; // Varsayılan
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* PAGE HEADER */}
      <div className="bg-orange-50 relative overflow-hidden">
          {/* Blobs */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200/20 rounded-full blur-2xl"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-2 font-sans">Sağlıklı Tarifler</h1>
              <p className="text-gray-600">Minik gurmeniz için uzman onaylı, yaşa uygun lezzetler.</p>
          </div>
      </div>

      {/* MAIN CONTENT LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          
          <div className="flex flex-col lg:flex-row gap-8">
              
              {/* SIDEBAR FILTERS (Desktop) */}
              <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                  {/* Filter Group: Age */}
                  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center font-sans">
                          <i className="fa-solid fa-baby text-orange-500 mr-2"></i> Yaş Grubu
                      </h3>
                      <div className="space-y-2">
                          {['6-8 Ay (Başlangıç)', '8-10 Ay', '10-12 Ay', '12+ Ay (Sofra)'].map((age, index) => (
                              <label key={index} className="flex items-center space-x-3 cursor-pointer group">
                                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500" />
                                  <span className="text-gray-600 group-hover:text-orange-500 transition-colors text-sm">{age}</span>
                              </label>
                          ))}
                      </div>
                  </div>

                  {/* Filter Group: Category */}
                  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center font-sans">
                          <i className="fa-solid fa-utensils text-green-500 mr-2"></i> Kategori
                      </h3>
                      <div className="space-y-2">
                          {['Çorbalar', 'Püreler', 'BLW (Parmak Gıda)', 'Kahvaltı', 'Atıştırmalık'].map((cat, index) => (
                              <label key={index} className="flex items-center space-x-3 cursor-pointer group">
                                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 accent-green-500" />
                                  <span className="text-gray-600 group-hover:text-green-500 transition-colors text-sm">{cat}</span>
                              </label>
                          ))}
                      </div>
                  </div>

                  {/* Filter Group: Special Needs */}
                  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center font-sans">
                          <i className="fa-solid fa-heart-pulse text-red-400 mr-2"></i> Özel Durum
                      </h3>
                      <div className="space-y-2">
                          {['Kabızlık Giderici', 'Bağışıklık Dostu', 'Diş Çıkarma', 'Alerjik Bebek'].map((spec, index) => (
                              <label key={index} className="flex items-center space-x-3 cursor-pointer group">
                                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500 accent-red-500" />
                                  <span className="text-gray-600 group-hover:text-red-500 transition-colors text-sm">{spec}</span>
                              </label>
                          ))}
                      </div>
                  </div>
              </aside>

              {/* CONTENT GRID */}
              <div className="flex-grow">
                  
                  {/* Mobile Quick Filters (Horizontal Scroll) */}
                  <div className="lg:hidden mb-6">
                      <div className="flex gap-3 overflow-x-auto pb-2 hide-scroll scrollbar-hide">
                          <button className="flex-shrink-0 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">
                              <i className="fa-solid fa-sliders mr-2"></i> Filtrele
                          </button>
                          <button className="flex-shrink-0 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:border-orange-500 hover:text-orange-500 transition-colors whitespace-nowrap">
                              +6 Ay
                          </button>
                          <button className="flex-shrink-0 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:border-orange-500 hover:text-orange-500 transition-colors whitespace-nowrap">
                              BLW
                          </button>
                          <button className="flex-shrink-0 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:border-orange-500 hover:text-orange-500 transition-colors whitespace-nowrap">
                              Kabızlık
                          </button>
                      </div>
                  </div>

                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <h2 className="font-bold text-gray-800 font-sans">
                          <span className="text-orange-500">{recipes.length}</span> tarif listeleniyor
                      </h2>
                      
                      <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Sırala:</span>
                          <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none focus:border-orange-500 cursor-pointer">
                              <option>En Yeniler</option>
                              <option>Popüler</option>
                              <option>Hazırlama Süresi</option>
                          </select>
                      </div>
                  </div>

                  {/* Recipe Grid */}
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(recipes) && recipes.length > 0 && recipes.map((recipe) => (
                            <div key={recipe.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                                {/* Image Container */}
                                <div className="h-56 relative overflow-hidden bg-gray-100">
                                    <img 
                                        src={getImageUrl(recipe)} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        alt={recipe.title} 
                                    />
                                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                        <i className="fa-regular fa-heart"></i>
                                    </button>
                                    <div className="absolute bottom-3 left-3">
                                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                            {getAgeGroup(recipe)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-grow flex flex-col">
                                    <h3 className="font-sans font-bold text-lg text-slate-800 mb-1 leading-tight group-hover:text-orange-500 transition-colors">
                                        {recipe.title}
                                    </h3>
                                    
                                    <div className="flex items-center text-xs text-gray-400 mb-4 space-x-3 mt-1">
                                        <span><i className="fa-regular fa-clock mr-1"></i> {getPrepTime(recipe)}</span>
                                        {/* Eğer vegan gibi özel meta data varsa buraya eklenebilir */}
                                        {/* <span><i className="fa-solid fa-leaf mr-1"></i> Vegan</span> */}
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <i className="fa-solid fa-user-doctor text-green-600 mr-1.5 text-xs"></i>
                                            <span className="text-xs text-gray-500 font-medium">Uzman Onaylı</span>
                                        </div>
                                        {/* Localde Link kullanın */}
                                        <Link href={`/tarifler/${recipe.slug}`} className="text-xs font-bold text-orange-500 hover:underline">
                                            Tarife Git
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {!loading && recipes.length === 0 && (
                      <div className="text-center py-12">
                          <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                              <i className="fa-solid fa-utensils"></i>
                          </div>
                          <h3 className="font-bold text-slate-800 text-lg mb-2">Henüz tarif bulunamadı.</h3>
                          <p className="text-gray-500 text-sm">Farklı filtreler deneyebilir veya daha sonra tekrar kontrol edebilirsiniz.</p>
                      </div>
                  )}

                  {/* Load More Button */}
                  {!loading && recipes.length > 0 && (
                    <div className="mt-12 text-center">
                        <button className="bg-white border-2 border-gray-100 text-gray-600 hover:border-orange-500 hover:text-orange-500 font-bold py-3 px-8 rounded-full transition-all shadow-sm">
                            Daha Fazla Göster
                        </button>
                    </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}