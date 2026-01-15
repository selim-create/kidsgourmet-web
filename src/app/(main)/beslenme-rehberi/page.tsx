"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { ingredientService } from '@/services/ingredient-service';
import { Ingredient } from '@/lib/types';

// Türkçe ay isimleri
const turkishMonths = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                       'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

// Ay -> Mevsim mapping
const monthToSeason: Record<number, string[]> = {
  0: ['Kış'],        // Ocak
  1: ['Kış'],        // Şubat
  2: ['İlkbahar'],   // Mart
  3: ['İlkbahar'],   // Nisan
  4: ['İlkbahar'],   // Mayıs
  5: ['Yaz'],        // Haziran
  6: ['Yaz'],        // Temmuz
  7: ['Yaz'],        // Ağustos
  8: ['Sonbahar'],   // Eylül
  9: ['Sonbahar'],   // Ekim
  10: ['Sonbahar'],  // Kasım
  11: ['Kış'],       // Aralık
};

export default function IngredientsGuidePage() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tümü"]);
  const [loading, setLoading] = useState(true);
  
  // Arama state'leri
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Mevsimlik malzemeler
  const [seasonalIngredients, setSeasonalIngredients] = useState<Ingredient[]>([]);

  // Kategorileri ve malzemeleri yükle
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Kategorileri çek
        const cats = await ingredientService.getCategories();
        setCategories(["Tümü", ...cats]);
        
        // Tüm malzemeleri çek
        const data = await ingredientService.getAll();
        setIngredients(data || []);
        
        // Mevsimlik malzemeleri filtrele
        const currentMonth = new Date().getMonth();
        const currentSeasons = monthToSeason[currentMonth];
        const seasonal = (data || []).filter(ing => 
          ing.season && currentSeasons.some(season => ing.season?.includes(season))
        ).slice(0, 6);
        setSeasonalIngredients(seasonal);
        
      } catch (error) {
        console.error("Veri yüklenirken hata:", error);
        setIngredients([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await ingredientService.search(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Arama hatası:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtreleme logic
  const displayedIngredients = searchQuery.trim().length >= 2 
    ? searchResults
    : activeCategory === "Tümü" 
      ? ingredients 
      : ingredients.filter(ing => ing.category === activeCategory);

  // Şu anki ay
  const currentMonth = turkishMonths[new Date().getMonth()];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO & SEARCH */}
      {/* DÜZELTME: -mt-8 kaldırıldı, tam genişlik için -mx sınıfları eklendi */}
      <div className="bg-green-50/50 relative overflow-hidden pb-16 pt-12 -mx-4 sm:-mx-6 lg:-mx-8">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100/50 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-800 mb-4 font-sans">Malzeme Rehberi</h1>
              <p className="text-gray-600 text-lg mb-8">
                  "Bebeğim neyi, ne zaman yiyebilir?" sorusunun cevabını uzman onaylı sözlüğümüzde arayın.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                  <input 
                    type="text" 
                    placeholder="Merak ettiğiniz besini yazın (Örn: Yumurta, Çilek...)" 
                    className="w-full py-4 pl-14 pr-6 rounded-full shadow-lg border-2 border-white focus:border-green-400 outline-none text-gray-700 font-medium transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                      {isSearching ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                      ) : (
                        <i className="fa-solid fa-magnifying-glass"></i>
                      )}
                  </div>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-2 bottom-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full font-bold transition-colors"
                    >
                      Temizle
                    </button>
                  )}
              </div>
          </div>
      </div>

      {/* SEASONAL SPOTLIGHT (Overlap Effect) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-12">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-xl md:text-2xl text-slate-800 flex items-center font-sans">
                      <i className="fa-solid fa-calendar-day text-orange-500 mr-3"></i> Bu Ayın Yıldızları ({currentMonth})
                  </h2>
                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Mevsiminde Güzel</span>
              </div>

              {/* Horizontal Scroll Grid */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {seasonalIngredients.length > 0 ? (
                    seasonalIngredients.map((ingredient) => (
                      <Link key={ingredient.id} href={`/beslenme-rehberi/${ingredient.slug}`} className="group text-center">
                          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-orange-100 mb-2 overflow-hidden border-2 border-transparent group-hover:border-orange-500 transition-all">
                              <img src={ingredient.image || `https://placehold.co/150x150/FF8A65/ffffff?text=${encodeURIComponent(ingredient.name)}`} className="w-full h-full object-cover" alt={ingredient.name} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-orange-500 transition-colors">{ingredient.name}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-3 md:col-span-6 text-center text-gray-500 py-4">
                      <p className="text-sm">Bu ay için mevsimlik malzeme bulunamadı.</p>
                    </div>
                  )}
              </div>
          </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {categories.map((cat) => (
                  <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2.5 rounded-full font-bold shadow-sm transition-all flex items-center gap-2 ${
                          activeCategory === cat 
                          ? "bg-slate-800 text-white shadow-md transform scale-105" 
                          : "bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                      }`}
                  >
                      {cat === "Sebzeler" && <i className="fa-solid fa-carrot"></i>}
                      {cat === "Meyveler" && <i className="fa-solid fa-apple-whole"></i>}
                      {cat === "Tahıllar" && <i className="fa-solid fa-wheat-awn"></i>}
                      {cat === "Protein" && <i className="fa-solid fa-drumstick-bite"></i>}
                      {cat}
                  </button>
              ))}
          </div>

          {/* Ingredient Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {loading ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              ) : displayedIngredients.length > 0 ? (
                displayedIngredients.map((ingredient) => (
                  <Link key={ingredient.id} href={`/beslenme-rehberi/${ingredient.slug}`} className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                      <div className="w-full h-40 bg-green-50 rounded-2xl mb-4 overflow-hidden relative">
                          <img src={ingredient.image || `https://placehold.co/400x300/AED581/ffffff?text=${encodeURIComponent(ingredient.name)}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={ingredient.name} />
                          
                          {/* Başlangıç Yaşı Badge */}
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                              <i className="fa-solid fa-baby text-green-500 mr-1"></i> 
                              {ingredient.start_age?.toString().includes('ay') ? ingredient.start_age : `${ingredient.start_age} ay`}
                          </div>
                          
                          {/* Mevsim Badge (sağ üst) */}
                          {ingredient.season && ingredient.season !== 'Tüm Yıl' && (
                            <div className="absolute top-2 right-2 bg-yellow-100/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-yellow-700 shadow-sm">
                              <i className="fa-solid fa-sun mr-1"></i> {ingredient.season}
                            </div>
                          )}
                      </div>
                      
                      {/* Kategori */}
                      {ingredient.category && (
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1 block">
                          {ingredient.category}
                        </span>
                      )}
                      
                      <h3 className="font-display font-bold text-xl text-slate-800 mb-1 font-sans">{ingredient.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ingredient.description}</p>
                      
                      {/* Alt badges */}
                      <div className="mt-auto flex items-center gap-2 flex-wrap">
                        {/* Alerji Risk Badge */}
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                          ingredient.allergy_risk === 'Düşük' ? 'bg-green-100 text-green-700 border-green-200' :
                          ingredient.allergy_risk === 'Orta' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {ingredient.allergy_risk === 'Yüksek' && <i className="fa-solid fa-triangle-exclamation mr-1"></i>}
                          {ingredient.allergy_risk || 'Düşük'} Alerjen
                        </span>
                      </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <i className="fa-solid fa-search text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">
                    {searchQuery ? 'Arama sonucu bulunamadı.' : 'Bu kategoride malzeme bulunamadı.'}
                  </p>
                </div>
              )}

          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
              <button className="bg-white border-2 border-gray-100 text-gray-600 hover:border-green-500 hover:text-green-500 font-bold py-3 px-8 rounded-full transition-all shadow-sm">
                  Daha Fazla Göster
              </button>
          </div>

      </div>
    </div>
  );
}