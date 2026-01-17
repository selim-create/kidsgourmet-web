"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { ingredientService, IngredientsResponse } from '@/services/ingredient-service';
import { Ingredient } from '@/lib/types';

// Kategori icon mapping'i genişlet
const categoryIcons: Record<string, string> = {
  'Sebzeler': 'fa-carrot',
  'Meyveler': 'fa-apple-whole',
  'Tahıllar': 'fa-wheat-awn',
  'Proteinler': 'fa-drumstick-bite',
  'Süt Ürünleri': 'fa-cheese',
  'Baklagiller': 'fa-seedling',
  'Yağlar': 'fa-droplet',
  'Sıvılar': 'fa-glass-water',
  'Baharatlar': 'fa-pepper-hot',
  'Özel Ürünler': 'fa-star',
};

// Yaş grubu renkleri (Tarifler sayfasındaki gibi)
const AGE_GROUP_COLORS: { [key: string]: { bg: string; text: string } } = {
  '6': { bg: 'bg-[#FFCCBC]', text: 'text-[#BF360C]' },   // 6 ay - Şeftali
  '8': { bg: 'bg-[#C8E6C9]', text: 'text-[#2E7D32]' },   // 8 ay - Nane Yeşili
  '9': { bg: 'bg-[#B3E5FC]', text: 'text-[#0277BD]' },   // 9 ay - Gökyüzü Mavisi
  '12': { bg: 'bg-[#FFF9C4]', text: 'text-[#F57F17]' },  // 12 ay - Limon Sarısı
  '24': { bg: 'bg-[#E1BEE7]', text: 'text-[#7B1FA2]' },  // 24 ay - Lila
};

// Mevsim ikonları ve renkleri
const SEASON_CONFIG: { [key: string]: { icon: string; bg: string; text: string } } = {
  'Kış': { icon: 'fa-snowflake', bg: 'bg-blue-100/90', text: 'text-blue-600' },
  'İlkbahar': { icon: 'fa-seedling', bg: 'bg-green-100/90', text: 'text-green-600' },
  'Yaz': { icon: 'fa-sun', bg: 'bg-yellow-100/90', text: 'text-yellow-600' },
  'Sonbahar': { icon: 'fa-leaf', bg: 'bg-orange-100/90', text: 'text-orange-600' },
  'Tüm Yıl': { icon: 'fa-calendar-check', bg: 'bg-purple-100/90', text: 'text-purple-600' },
};

const ITEMS_PER_PAGE = 12;

export default function IngredientsGuidePage() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [activeSeason, setActiveSeason] = useState("Tümü");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tümü"]);
  const [loading, setLoading] = useState(true);
  
  // Arama state'leri
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Favori state
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Pagination state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIngredients, setTotalIngredients] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // LocalStorage'dan favorileri yükle
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('ingredient-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Favori yükleme hatası:', error);
      // Hatalı veriyi temizle
      localStorage.removeItem('ingredient-favorites');
    }
  }, []);

  // Kategorileri ve malzemeleri yükle
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Kategorileri çek
        const cats = await ingredientService.getCategories();
        setCategories(["Tümü", ...cats]);
        
        // İlk sayfa malzemeleri çek (pagination ile)
        const response = await ingredientService.getAll({ page: 1, perPage: ITEMS_PER_PAGE });
        
        // Response'u parse et
        let ingredientList: Ingredient[] = [];
        if (Array.isArray(response)) {
          ingredientList = response;
        } else {
          // IngredientsResponse format
          const paginatedResponse = response as IngredientsResponse;
          ingredientList = paginatedResponse.ingredients || [];
          setTotalPages(paginatedResponse.pages || 1);
          setTotalIngredients(paginatedResponse.total || ingredientList.length);
        }
        
        setIngredients(ingredientList);
        
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

  // Daha fazla malzeme yükle
  const loadMoreIngredients = async () => {
    if (isLoadingMore || currentPage >= totalPages) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await ingredientService.getAll({ page: nextPage, perPage: ITEMS_PER_PAGE });
      
      let newIngredients: Ingredient[] = [];
      if (Array.isArray(response)) {
        newIngredients = response;
      } else {
        // IngredientsResponse format
        const paginatedResponse = response as IngredientsResponse;
        newIngredients = paginatedResponse.ingredients || [];
      }
      
      setIngredients(prev => [...prev, ...newIngredients]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Daha fazla malzeme yüklenirken hata:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Toggle favori fonksiyonu
  const toggleFavorite = (e: React.MouseEvent, ingredientId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorites(prev => {
      const newFavorites = prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId];
      
      // localStorage kontrolü
      try {
        localStorage.setItem('ingredient-favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Favori kaydetme hatası:', error);
      }
      return newFavorites;
    });
  };

  // Yaş grubuna göre renk belirle
  const getAgeGroupColor = (startAge: string | undefined) => {
    if (!startAge) return AGE_GROUP_COLORS['6']; // Default
    const ageNum = startAge.toString().match(/\d+/)?.[0];
    if (!ageNum) return AGE_GROUP_COLORS['6'];
    
    const age = parseInt(ageNum);
    const ageGroupKeys = Object.keys(AGE_GROUP_COLORS).map(Number).sort((a, b) => b - a);
    
    // En yakın yaş grubunu bul (büyükten küçüğe sıralı)
    for (const threshold of ageGroupKeys) {
      if (age >= threshold) {
        return AGE_GROUP_COLORS[threshold.toString()];
      }
    }
    
    // Hiçbiri uymazsa en düşük yaş grubunu döndür
    return AGE_GROUP_COLORS['6'];
  };

  // Mevsim badge bilgisi
  const getSeasonBadge = (season: string | string[] | undefined) => {
    if (!season) return null;
    
    // Eğer season bir array ise, ilk elemanı al
    let seasonStr = '';
    if (Array.isArray(season)) {
      seasonStr = season[0] || '';
    } else if (typeof season === 'string') {
      // Birden fazla mevsim varsa ilkini al
      seasonStr = season.split(',')[0].trim();
    } else {
      return null;
    }
    
    return SEASON_CONFIG[seasonStr] || SEASON_CONFIG['Tüm Yıl'];
  };

  // Filtreleme logic
  const displayedIngredients = searchQuery.trim().length >= 2 
    ? searchResults
    : ingredients.filter(ing => {
        const categoryMatch = activeCategory === "Tümü" || ing.category === activeCategory;
        const seasonMatch = activeSeason === "Tümü" || ing.season?.includes(activeSeason);
        return categoryMatch && seasonMatch;
      });

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO & SEARCH */}
      {/* DÜZELTME: -mx kaldırıldı, layout zaten full-width */}
      <div className="bg-green-50/50 relative overflow-hidden pb-16 pt-12">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100/50 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-800 mb-4 font-sans">Beslenme Rehberi</h1>
              <p className="text-gray-600 text-lg mb-8">
                  "Bebeğim neyi, ne zaman yiyebilir?" sorusunun cevabını uzman onaylı sözlüğümüzde arayın.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                  <input 
                    type="text" 
                    placeholder="Merak ettiğiniz besini yazın..." 
                    className="w-full py-3 md:py-4 pl-12 md:pl-14 pr-4 md:pr-6 rounded-full shadow-lg border-2 border-white focus:border-green-400 outline-none text-gray-700 font-medium transition-colors text-sm md:text-base"
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

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* Category and Season Tabs */}
          <div className="mb-8 space-y-4">
              {/* Category Filters */}
              <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 justify-start md:justify-center min-w-max md:min-w-0 md:flex-wrap">
                      {categories.map((cat) => (
                          <button 
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={`px-3 py-1.5 rounded-full font-bold shadow-sm transition-all flex items-center gap-2 whitespace-nowrap text-sm ${
                                  activeCategory === cat 
                                  ? "bg-slate-800 text-white shadow-md transform scale-105" 
                                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                              }`}
                          >
                              {categoryIcons[cat] && <i className={`fa-solid ${categoryIcons[cat]}`}></i>}
                              {cat}
                          </button>
                      ))}
                  </div>
              </div>
              
              {/* Season Filter */}
              <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 justify-start md:justify-center min-w-max md:min-w-0 md:flex-wrap">
                      {["Tümü", "Kış", "İlkbahar", "Yaz", "Sonbahar", "Tüm Yıl"].map((season) => (
                          <button 
                              key={season}
                              onClick={() => setActiveSeason(season)}
                              className={`px-3 py-1.5 rounded-full font-bold shadow-sm transition-all whitespace-nowrap text-sm ${
                                  activeSeason === season 
                                  ? "bg-green-500 text-white shadow-md transform scale-105" 
                                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                              }`}
                          >
                              {season}
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* Ingredient Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">

              {loading ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              ) : displayedIngredients.length > 0 ? (
                displayedIngredients.map((ingredient) => {
                  const ageGroupColor = getAgeGroupColor(ingredient.start_age);
                  const seasonBadge = getSeasonBadge(ingredient.season);
                  
                  return (
                    <Link key={ingredient.id} href={`/beslenme-rehberi/${ingredient.slug}`} className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                        <div className="w-full h-40 bg-green-50 rounded-2xl mb-4 overflow-hidden relative">
                            <img src={ingredient.image || `https://placehold.co/400x300/AED581/ffffff?text=${encodeURIComponent(ingredient.name)}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={ingredient.name} />
                            
                            {/* Başlangıç Yaşı Badge - Sol Üst (Renkli) */}
                            <div className={`absolute top-2 left-2 ${ageGroupColor.bg} backdrop-blur px-2 py-1 rounded-lg text-xs font-bold ${ageGroupColor.text} shadow-sm`}>
                                {ingredient.start_age?.toString().includes('ay') ? ingredient.start_age : ingredient.start_age ? `${ingredient.start_age} ay` : '6 ay'}
                            </div>
                            
                            {/* Mevsim Badge - Sağ Alt (İkonlu) */}
                            {seasonBadge && (
                              <div className={`absolute bottom-2 right-2 ${seasonBadge.bg} backdrop-blur px-2 py-1 rounded-lg text-xs font-bold ${seasonBadge.text} shadow-sm flex items-center gap-1`}>
                                <i className={`fa-solid ${seasonBadge.icon}`}></i>
                                {(() => {
                                  const displaySeason = Array.isArray(ingredient.season) 
                                    ? ingredient.season[0] 
                                    : typeof ingredient.season === 'string' 
                                      ? ingredient.season.split(',')[0].trim() 
                                      : '';
                                  return displaySeason;
                                })()}
                              </div>
                            )}
                            
                            {/* Favori Butonu - Sağ Üst (Konum sabit) */}
                            <button 
                              onClick={(e) => toggleFavorite(e, ingredient.id)}
                              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10"
                              aria-label={favorites.includes(ingredient.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                            >
                              <i className={`fa-${favorites.includes(ingredient.id) ? 'solid' : 'regular'} fa-heart ${favorites.includes(ingredient.id) ? 'text-red-500' : 'text-gray-400'}`}></i>
                            </button>
                        </div>
                        
                        {/* Kategori - Card altına taşındı */}
                        {ingredient.category && (
                          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1 block">
                            {ingredient.category}
                          </span>
                        )}
                        
                        <h3 className="font-display font-bold text-xl text-slate-800 mb-1 font-sans">{ingredient.name}</h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ingredient.description}</p>
                        
                        {/* Alt badge - Sadece Alerjen */}
                        <div className="mt-auto">
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
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <i className="fa-solid fa-search text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">
                    {searchQuery ? 'Arama sonucu bulunamadı.' : 'Bu kategoride malzeme bulunamadı.'}
                  </p>
                </div>
              )}

          </div>

          {/* Load More - Pagination */}
          {!searchQuery && activeCategory === "Tümü" && currentPage < totalPages && (
            <div className="mt-12 text-center">
              <button 
                onClick={loadMoreIngredients}
                disabled={isLoadingMore}
                className="bg-white border-2 border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-500 font-bold py-3 px-8 rounded-full transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Yükleniyor...
                  </span>
                ) : (
                  <span>
                    Daha Fazla Göster ({ingredients.length} / {totalIngredients})
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Tümü yüklendi mesajı */}
          {!searchQuery && activeCategory === "Tümü" && currentPage >= totalPages && ingredients.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
                Tüm malzemeler gösteriliyor ({totalIngredients} adet)
              </p>
            </div>
          )}

      </div>
    </div>
  );
}