"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import { ingredientService, IngredientsResponse } from '@/services/ingredient-service';
import { Ingredient } from '@/lib/types';
import { AdZone } from '@/components/ads';
import { useAds } from '@/contexts/AdContext';

// --- SABİTLER VE KONFİGÜRASYON ---

const CATEGORY_ICONS: Record<string, string> = {
  'Sebzeler': 'fa-carrot',
  'Meyveler': 'fa-apple-whole',
  'Tahıllar': 'fa-wheat-awn',
  'Proteinler': 'fa-drumstick-bite',
  'Süt Ürünleri': 'fa-cow',
  'Baklagiller': 'fa-seedling',
  'Yağlar': 'fa-droplet',
  'Sıvılar': 'fa-glass-water',
  'Baharatlar': 'fa-pepper-hot',
  'Kuruyemişler': 'fa-bowl-rice',
  'Özel Ürünler': 'fa-star',
};

const AGE_GROUP_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  '6': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  '8': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  '9': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  '12': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  '24': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

const SEASON_CONFIG: { [key: string]: { icon: string; color: string } } = {
  'Kış': { icon: 'fa-snowflake', color: 'text-blue-500' },
  'İlkbahar': { icon: 'fa-seedling', color: 'text-green-500' },
  'Yaz': { icon: 'fa-sun', color: 'text-yellow-500' },
  'Sonbahar': { icon: 'fa-leaf', color: 'text-orange-500' },
  'Tüm Yıl': { icon: 'fa-calendar-check', color: 'text-purple-500' },
};

const ITEMS_PER_PAGE = 12;

// --- YARDIMCI KOMPONENTLER ---

// Yükleniyor iskeleti (Skeleton)
const IngredientSkeleton = () => (
  <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm animate-pulse">
    <div className="w-full h-40 bg-gray-200 rounded-2xl mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
  </div>
);
// Reklam gösterilecek pozisyonları hesapla
// İlk reklam: 4. pozisyon (index 3'ten sonra)
// Sonraki reklamlar: her 8 kartta bir (index 11, 19, 27, ...)
const shouldShowAd = (index: number, hasAd: boolean): boolean => {
  if (!hasAd) return false;
  // İlk reklam index 3'ten sonra (4. kart)
  if (index === 3) return true;
  // Sonraki reklamlar: 4 + 8n pozisyonlarında (index 11, 19, 27...)
  if (index > 3 && (index - 3) % 8 === 0) return true;
  return false;
};
export default function IngredientsGuidePage() {
  // --- STATE YÖNETİMİ ---
  
  // Filtreler
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [activeSeasons, setActiveSeasons] = useState<string[]>([]); // Boş array = hepsi
  const [searchQuery, setSearchQuery] = useState("");
  
  // Veri
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tümü"]);
  
  // UI Durumları
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Favoriler
  const [favorites, setFavorites] = useState<number[]>([]);

  // --- EFFECT: Initial Load ---
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await ingredientService.getCategories();
        setCategories(["Tümü", ...cats]);
      } catch (err) {
        console.error("Kategoriler yüklenemedi", err);
      }
    }
    
    // Favorileri LocalStorage'dan çek
    const savedFavs = localStorage.getItem('ingredient-favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    loadCategories();
    setInitialLoaded(true);
  }, []);

  // --- CORE DATA FETCHING FUNCTION ---
  const fetchIngredients = useCallback(async (reset = false) => {
    if (!initialLoaded) return;

    try {
      const currentPage = reset ? 1 : page;
      if (reset) {
        setLoading(true);
        setIngredients([]);
      } else {
        setLoadingMore(true);
      }

      // API Parametrelerini Hazırla
      const params: any = {
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
      };

      // Arama varsa
      if (searchQuery.length >= 2) {
        const searchResults = await ingredientService.search(searchQuery);
        setIngredients(searchResults);
        setHasMore(false);
        setTotalItems(searchResults.length);
      } else {
        // Normal Filtreleme
        if (activeCategory !== "Tümü") {
          params.category = activeCategory;
        }
        
        const response = await ingredientService.getAll(params);
        
        let newItems: Ingredient[] = [];
        let total = 0;

        if (Array.isArray(response)) {
          newItems = response;
          total = response.length;
        } else {
          const paginated = response as IngredientsResponse;
          newItems = paginated.ingredients || [];
          total = paginated.total || 0;
        }

        // Mevsim Filtrelemesi (Client-side)
        if (activeSeasons.length > 0) {
           newItems = newItems.filter(ing => 
             activeSeasons.some(s => ing.season?.includes(s) || ing.season?.includes("Tümü"))
           );
        }

        if (reset) {
          setIngredients(newItems);
        } else {
          setIngredients(prev => [...prev, ...newItems]);
        }

        // Pagination Kontrolü
        setHasMore(newItems.length >= ITEMS_PER_PAGE); 
        setTotalItems(total);
        if (!reset) setPage(prev => prev + 1);
        else setPage(2);
      }

    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, activeSeasons, searchQuery, page, initialLoaded]);

  // --- EVENT HANDLERS ---

  // Filtre değiştiğinde (Kategori veya Mevsim)
  useEffect(() => {
    fetchIngredients(true);
  }, [activeCategory, activeSeasons]); 

  // Arama için Debounce (Harici kütüphane olmadan)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Sadece arama metni değiştiğinde çalışır
      if (initialLoaded && (searchQuery.length >= 2 || searchQuery === "")) {
        fetchIngredients(true);
      }
    }, 500); // 500ms bekleme süresi
    
    return () => clearTimeout(timer);
  }, [searchQuery, initialLoaded]); // fetchIngredients dependency'sini kaldırdık ki sonsuz döngü olmasın

  const handleSeasonToggle = (season: string) => {
    setActiveSeasons(prev => {
      if (season === "Tümü") return [];
      if (prev.includes(season)) return prev.filter(s => s !== season);
      return [...prev, season];
    });
  };

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newList = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('ingredient-favorites', JSON.stringify(newList));
      return newList;
    });
  };

  // Helper: Renk ve ikon getir
  const getAgeColor = (ageText?: string) => {
    if (!ageText) return AGE_GROUP_COLORS['6'];
    const num = ageText.match(/\d+/)?.[0];
    if (!num) return AGE_GROUP_COLORS['6'];
    
    if (parseInt(num) >= 24) return AGE_GROUP_COLORS['24'];
    if (parseInt(num) >= 12) return AGE_GROUP_COLORS['12'];
    if (parseInt(num) >= 9) return AGE_GROUP_COLORS['9'];
    if (parseInt(num) >= 8) return AGE_GROUP_COLORS['8'];
    return AGE_GROUP_COLORS['6'];
  };

  const getSeasonInfo = (seasonData?: string | string[]) => {
    if (!seasonData) return null;
    const seasonStr = Array.isArray(seasonData) ? seasonData[0] : seasonData.split(',')[0].trim();
    return SEASON_CONFIG[seasonStr] || SEASON_CONFIG['Tüm Yıl'];
  };

  const { hasSlotForPlacement } = useAds();
  const hasInFeedAd = hasSlotForPlacement('content-in-feed');

  // Reklam pozisyonlarını hesapla - her 8 kartta bir, 4. karttan başlayarak
  // Pozisyonlar: 4, 12, 20, 28, ... (index: 3, 11, 19, 27, ...)
  const getAdPositions = (totalItems: number): number[] => {
    if (!hasInFeedAd) return [];
    const positions: number[] = [];
    let pos = 3; // İlk reklam index 3'te (4. kart sonrası)
    while (pos < totalItems) {
      positions.push(pos);
      pos += 8; // Her 8 kartta bir
    }
    return positions;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* HERO SECTION */}
      <div className="bg-white border-b border-gray-100 pt-8 pb-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-4 uppercase tracking-wider">
            Gıdalar</span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-800 mb-4 font-sans">
            Beslenme Rehberi
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
           "Bebeğim neyi, ne zaman yiyebilir?" sorusunun cevabını uzman görüşleri eşliğinde sözlüğümüzde arayın. Bebeğinizin ayına uygun besinleri, alerjen risklerini ve mevsimsel önerileri rehberimizde keşfedin.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-0 bg-green-200 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-100 p-2">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 ml-1">
                <i className="fa-solid fa-search"></i>
              </div>
              <input 
                type="text" 
                placeholder="Örn: Avokado, Yumurta, Brokoli..." 
                className="flex-1 bg-transparent border-none outline-none px-4 text-gray-700 placeholder-gray-400 font-medium h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 mr-1"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

{/* FILTERS SECTION (Sticky) */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md border-b border-gray-200 py-4 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                {CATEGORY_ICONS[cat] && <i className={`fa-solid ${CATEGORY_ICONS[cat]}`}></i>}
                {cat}
              </button>
            ))}
          </div>

          {/* Season Filter - DÜZELTİLDİ: "Tüm Yıl" eklendi */}
          <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
            {["Tüm Yıl", "Kış", "İlkbahar", "Yaz", "Sonbahar"].map((season) => {
              const isActive = activeSeasons.includes(season);
              const config = SEASON_CONFIG[season];
              return (
                <button
                  key={season}
                  onClick={() => handleSeasonToggle(season)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-white border-green-500 text-green-600 shadow-sm ring-1 ring-green-500'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <i className={`fa-solid ${config?.icon || 'fa-circle'} ${isActive ? 'text-green-500' : 'text-gray-300'}`}></i>
                  {season}
                </button>
              );
            })}
            {activeSeasons.length > 0 && (
              <button 
                onClick={() => setActiveSeasons([])}
                className="text-xs text-red-500 hover:underline font-medium ml-auto sm:ml-2"
              >
                Temizle
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading && ingredients.length === 0 ? (
          // Loading State
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <IngredientSkeleton key={i} />)}
          </div>
        ) : ingredients.length > 0 ? (() => {
          // Reklam pozisyonlarını hesapla
          const adPositions = getAdPositions(ingredients.length);
          let adCounter = 0; // Her reklam için benzersiz sayaç
          
          return (
            // Results
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ingredients.map((ingredient, index) => {
                const ageStyle = getAgeColor(ingredient.start_age);
                const seasonInfo = getSeasonInfo(ingredient.season);
                const showAd = adPositions.includes(index);
                const currentAdIndex = showAd ? adCounter++ : -1;
                
                return (
                  <React.Fragment key={ingredient.id}>
                    {/* Ingredient Card */}
                    <Link 
                      href={`/beslenme-rehberi/${ingredient.slug}`}
                      className="group bg-white rounded-[20px] p-4 border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
                    >
                      {/* Image Container */}
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                        <img 
                          src={ingredient.image || `https://placehold.co/400x300/F1F8E9/558B2F?text=${encodeURIComponent(ingredient.name.substring(0,2))}`} 
                          alt={ingredient.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Age Badge */}
                        <div className={`absolute top-2 left-2 ${ageStyle.bg} ${ageStyle.text} ${ageStyle.border} border px-2.5 py-1 rounded-lg text-xs font-extrabold shadow-sm backdrop-blur-sm`}>
                          {ingredient.start_age}
                        </div>

                        {/* Favorite Button */}
                        <button 
                          onClick={(e) => toggleFavorite(e, ingredient.id)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur text-gray-400 hover:text-red-500 hover:bg-white flex items-center justify-center transition-all shadow-sm"
                        >
                          <i className={`fa-${favorites.includes(ingredient.id) ? 'solid' : 'regular'} fa-heart`}></i>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {ingredient.category}
                          </span>
                          {seasonInfo && (
                            <div className={`flex items-center gap-1 text-[10px] font-bold ${seasonInfo.color} bg-gray-50 px-2 py-0.5 rounded-full`}>
                              <i className={`fa-solid ${seasonInfo.icon}`}></i>
                              <span>{typeof ingredient.season === 'string' ? ingredient.season.split(',')[0] : ingredient.season?.[0]}</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-1">
                          {ingredient.name}
                        </h3>
                        
                        <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                          {ingredient.description}
                        </p>

                        {/* Footer Badge */}
                        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                          <div className={`text-xs font-bold px-2 py-1 rounded-md border ${
                            ingredient.allergy_risk === 'Düşük' ? 'bg-green-50 text-green-700 border-green-100' :
                            ingredient.allergy_risk === 'Orta' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                            'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {ingredient.allergy_risk || 'Belirsiz'} Risk
                          </div>
                          <span className="text-gray-300 group-hover:text-green-500 transition-colors">
                            <i className="fa-solid fa-arrow-right"></i>
                          </span>
                        </div>
                      </div>
                    </Link>

                  {/* Ad Card - Malzeme kartı tarzında */}
                  {showAd && (
                    <div 
                      key={`ad-${currentAdIndex}`}
                      className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="relative bg-gradient-to-br from-slate-50 to-gray-100 p-4 flex items-center justify-center min-h-[200px]">
                        <span className="absolute top-3 left-3 px-2 py-1 bg-gray-200/80 text-gray-500 text-xs font-medium rounded-full backdrop-blur-sm">
                          <i className="fa-solid fa-bullhorn mr-1"></i>Reklam
                        </span>
                        {/* instanceId ile benzersiz reklam alanı */}
                        <AdZone 
                          placement="content-in-feed" 
                          instanceId={currentAdIndex}
                        />
                      </div>
                    </div>
                  )}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })() : (
          // Empty State
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-basket-shopping text-3xl text-gray-300"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Aradığınız kriterlere uygun besin bulunamadı. Filtreleri değiştirmeyi veya aramayı temizlemeyi deneyin.
            </p>
            <button 
              onClick={() => {
                setActiveCategory("Tümü");
                setSearchQuery("");
                setActiveSeasons([]);
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-green-200"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && ingredients.length > 0 && searchQuery.length < 2 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => fetchIngredients(false)}
              disabled={loadingMore}
              className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-slate-800 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {loadingMore ? (
                <>
                  <div className="w-5 h-5 mr-3 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Yükleniyor...
                </>
              ) : (
                <>
                  Daha Fazla Göster
                  <i className="fa-solid fa-chevron-down ml-2 group-hover:translate-y-1 transition-transform"></i>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}