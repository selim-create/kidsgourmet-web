"use client";

import React, { useState, Suspense, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { searchService, SearchResponse } from '@/services/search-service';
import { useAgeGroups } from '@/hooks/useAgeGroups';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || "";
  const ageParam = searchParams.get('age') || "";
  
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(query);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  
  const { ageGroups } = useAgeGroups();

  // Initialize age groups from URL parameter
  useEffect(() => {
    if (ageParam) {
      setSelectedAgeGroups([ageParam]);
    }
  }, [ageParam]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string, ageGroup?: string) => {
    if (!searchQuery.trim()) {
      setSearchData(null);
      return;
    }
    
    setLoading(true);
    try {
      const result = await searchService.search({
        q: searchQuery,
        type: 'all',
        age_group: ageGroup,
        per_page: 50,
      });
      setSearchData(result);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to perform search when URL or age groups change
  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      performSearch(query, selectedAgeGroups.length > 0 ? selectedAgeGroups.join(',') : undefined);
    }
  }, [query, selectedAgeGroups, performSearch]);

  // Debounced search handler
  useEffect(() => {
    if (!searchTerm) return;
    
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set('q', searchTerm);
      router.push(`/arama?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, router]);

  // Dynamic tabs based on counts
  const tabs = searchData ? [
    { key: "all", label: `Tümü (${searchData.counts.total})` },
    { key: "recipes", label: `Tarifler (${searchData.counts.recipes})` },
    { key: "ingredients", label: `Malzemeler (${searchData.counts.ingredients})` },
    { key: "posts", label: `Blog & Rehber (${searchData.counts.posts})` },
    { key: "discussions", label: `Topluluk (${searchData.counts.discussions})` },
  ] : [
    { key: "all", label: "Tümü" },
    { key: "recipes", label: "Tarifler" },
    { key: "ingredients", label: "Malzemeler" },
    { key: "posts", label: "Blog & Rehber" },
    { key: "discussions", label: "Topluluk" },
  ];

  // Handle mobile search input
  const handleMobileSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    if (search) {
      router.push(`/arama?q=${encodeURIComponent(search)}`);
    }
  };

  // Show initial state (no search yet)
  if (!query) {
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="lg:hidden bg-white px-4 py-3 border-b border-gray-100 sticky top-20 z-30">
          <form onSubmit={handleMobileSearch} className="relative">
            <input 
              type="text" 
              name="search"
              placeholder="Ne arıyorsunuz?"
              className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-orange-500 outline-none" 
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400"></i>
          </form>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <i className="fa-solid fa-magnifying-glass text-6xl text-gray-300 mb-6"></i>
          <h1 className="font-display font-bold text-2xl text-slate-800 mb-4">Ne aramak istersiniz?</h1>
          <p className="text-gray-500 mb-8">Tarif, malzeme veya blog yazısı arayabilirsiniz</p>
          
          <div className="max-w-2xl mx-auto">
            <h3 className="font-bold text-sm text-gray-600 mb-4">Popüler Aramalar:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Avokado', 'BLW tarifleri', 'Kahvaltı', 'Çorba', '+6 ay', 'Parmak yiyecekler'].map((term) => (
                <Link 
                  key={term}
                  href={`/arama?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-orange-500 hover:text-orange-500 text-sm font-medium transition-all"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* MOBILE SEARCH HEADER (Sticky) */}
        <div className="lg:hidden bg-white px-4 py-3 border-b border-gray-100 sticky top-20 z-30">
          <form onSubmit={handleMobileSearch} className="relative">
            <input 
              type="text" 
              name="search"
              defaultValue={query} 
              className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-orange-500 outline-none" 
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400"></i>
          </form>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* SEARCH META */}
            <div className="mb-8">
                <h1 className="font-display font-bold text-2xl text-slate-800">
                    "<span className="text-orange-500">{query}</span>" için sonuçlar
                </h1>
                {loading ? (
                  <p className="text-sm text-gray-500">Aranıyor...</p>
                ) : searchData ? (
                  <p className="text-sm text-gray-500">Toplam {searchData.counts.total} sonuç bulundu</p>
                ) : (
                  <p className="text-sm text-gray-500">Sonuç yükleniyor...</p>
                )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <i className="fa-solid fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
                  <p className="text-gray-600">Aranıyor...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && searchData && searchData.counts.total === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <i className="fa-solid fa-search text-6xl text-gray-300 mb-4"></i>
                  <h2 className="font-bold text-xl text-slate-800 mb-2">Sonuç bulunamadı</h2>
                  <p className="text-gray-500 mb-6">"{query}" için sonuç bulunamadı. Başka bir terim deneyin.</p>
                  <Link 
                    href="/tarifler"
                    className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-colors"
                  >
                    Tüm Tariflere Göz At
                  </Link>
                </div>
              </div>
            )}

            {/* TABS (Filters) */}
            {!loading && searchData && searchData.counts.total > 0 && (
              <>
                <div className="flex gap-2 overflow-x-auto hide-scroll mb-8 pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button 
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2 rounded-full font-bold text-sm shadow-md whitespace-nowrap transition-all ${
                                activeTab === tab.key 
                                ? "bg-slate-800 text-white" 
                                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* MAIN CONTENT */}
                <div className="lg:col-span-3 space-y-10">

                    {/* 1. INGREDIENT HIGHLIGHT (If exact match) */}
                    {(activeTab === "all" || activeTab === "ingredients") && searchData.categorized.ingredients.length > 0 && (
                        <section>
                            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-book-open text-green-500"></i> Malzeme Rehberi
                            </h2>
                            {searchData.categorized.ingredients.map((ingredient) => (
                                <Link 
                                    key={ingredient.id}
                                    href={`/beslenme-rehberi/${ingredient.slug}`} 
                                    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow group mb-4"
                                >
                                    <div className="w-full sm:w-32 h-32 rounded-2xl bg-green-50 flex-shrink-0 overflow-hidden relative">
                                        <img 
                                            src={ingredient.image || 'https://placehold.co/200x200/AED581/ffffff?text=Malzeme'} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            alt={ingredient.title} 
                                        />
                                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm text-slate-800">
                                            {ingredient.age_group}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-display font-bold text-2xl text-slate-800 mb-2 group-hover:text-green-500 transition-colors">
                                            {ingredient.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {ingredient.excerpt}
                                        </p>
                                        {ingredient.allergen_level && (
                                            <div className="flex gap-2">
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                                    {ingredient.allergen_level}
                                                </span>
                                                {ingredient.season && (
                                                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">
                                                        {ingredient.season}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex items-center justify-center">
                                        <i className="fa-solid fa-chevron-right text-gray-300 text-xl group-hover:text-green-500 transition-colors"></i>
                                    </div>
                                </Link>
                            ))}
                        </section>
                    )}

                    {/* 2. RECIPES GRID */}
                    {(activeTab === "all" || activeTab === "recipes") && searchData.categorized.recipes.length > 0 && (
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <i className="fa-solid fa-utensils text-orange-500"></i> Tarifler
                                </h2>
                                {searchData.counts.recipes > 3 && (
                                    <span className="text-xs font-bold text-orange-500">
                                        {searchData.counts.recipes} tarif
                                    </span>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchData.categorized.recipes.map((recipe) => (
                                    <Link
                                        key={recipe.id}
                                        href={`/tarifler/${recipe.slug}`}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                                    >
                                        <div className="relative h-40 overflow-hidden">
                                            <img 
                                                src={recipe.image || 'https://placehold.co/400x300/FFF3E0/FF8A65?text=Tarif'} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                                alt={recipe.title} 
                                            />
                                            <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-800">
                                                {recipe.age_group}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-orange-500 line-clamp-2">
                                                {recipe.title}
                                            </h3>
                                            <p className="text-xs text-gray-400">{recipe.prep_time}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. BLOG & COMMUNITY (List) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Blog Results */}
                        {(activeTab === "all" || activeTab === "posts") && searchData.categorized.posts.length > 0 && (
                            <section>
                                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-newspaper text-blue-400"></i> Blog Yazıları
                                </h2>
                                <div className="space-y-4">
                                    {searchData.categorized.posts.map((post) => (
                                        <Link 
                                            key={post.id}
                                            href={`/kesfet/${post.slug}`} 
                                            className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                                        >
                                            <img 
                                                src={post.image || 'https://placehold.co/100x100/E1F5FE/0288D1?text=Blog'} 
                                                className="w-16 h-16 rounded-xl object-cover" 
                                                alt={post.title} 
                                            />
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-500 line-clamp-2">
                                                    {post.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Community Results */}
                        {(activeTab === "all" || activeTab === "discussions") && searchData.categorized.discussions.length > 0 && (
                            <section>
                                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-comments text-purple-400"></i> Topluluk
                                </h2>
                                <div className="space-y-4">
                                    {searchData.categorized.discussions.map((discussion) => (
                                        <Link 
                                            key={discussion.id}
                                            href={`/topluluk/${discussion.slug}`} 
                                            className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                                        >
                                            <h4 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-purple-500 line-clamp-2">
                                                {discussion.title}
                                            </h4>
                                            <div className="flex justify-between items-center text-xs text-gray-400">
                                                <span>{discussion.author} • {discussion.date}</span>
                                                <span>
                                                    <i className="fa-regular fa-comment mr-1"></i> 
                                                    {discussion.comment_count} Cevap
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                </div>

                {/* RIGHT SIDEBAR (Filters & Suggestions) */}
                <aside className="hidden lg:block lg:col-span-1 space-y-6">
                    
                    {/* Filters Widget */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm">Filtrele</h3>
                        
                        <div className="mb-4">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Yaş Grubu</p>
                            <div className="space-y-2">
                                {ageGroups.map((ageGroup) => (
                                    <label 
                                        key={ageGroup.id}
                                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                                    >
                                        <input 
                                            type="checkbox" 
                                            className="rounded text-orange-500 focus:ring-orange-500 accent-orange-500"
                                            checked={selectedAgeGroups.includes(ageGroup.slug)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedAgeGroups([...selectedAgeGroups, ageGroup.slug]);
                                                } else {
                                                    setSelectedAgeGroups(selectedAgeGroups.filter(s => s !== ageGroup.slug));
                                                }
                                            }}
                                        />
                                        {ageGroup.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {selectedAgeGroups.length > 0 && (
                            <button
                                onClick={() => {
                                    setSelectedAgeGroups([]);
                                    if (query) {
                                        performSearch(query);
                                    }
                                }}
                                className="text-xs text-orange-500 hover:text-orange-600 font-bold"
                            >
                                Filtreleri Temizle
                            </button>
                        )}
                    </div>

                    {/* Ad / Promo */}
                    <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
                        <h3 className="font-bold text-slate-800 mb-2">Haftalık Menü</h3>
                        <p className="text-xs text-gray-600 mb-4">Bebeğinize özel beslenme planı oluşturun.</p>
                        <Link 
                            href="/dashboard/haftalik-plan"
                            className="inline-block bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                        >
                            Planla
                        </Link>
                    </div>

                    {/* Faydalı Araçlar (Random Tool Cards) */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 px-1">Faydalı Araçlar</h3>
                        {(() => {
                          // Smart Assistant Tools list
                          const SMART_TOOLS = [
                            { name: 'Sunum Önerileri', path: '/beslenme-rehberi/sunum-onerileri', icon: 'fa-plate-utensils', color: 'from-purple-500 to-pink-500' },
                            { name: 'Ek Gıda Rehberi', path: '/akilli-asistan/ek-gida-rehberi', icon: 'fa-book-sparkles', color: 'from-blue-500 to-indigo-500' },
                            { name: 'Bu Gıda Verilir mi?', path: '/akilli-asistan/bu-gida-verilir-mi', icon: 'fa-circle-question', color: 'from-green-500 to-teal-500' },
                            { name: 'BLW Hazırlık Testi', path: '/akilli-asistan/blw-testi', icon: 'fa-clipboard-check', color: 'from-orange-500 to-red-500' },
                            { name: 'Persentil Hesaplayıcı', path: '/akilli-asistan/persentil', icon: 'fa-chart-line', color: 'from-indigo-500 to-purple-500' },
                            { name: 'Su İhtiyacı', path: '/akilli-asistan/su-ihtiyaci', icon: 'fa-droplet', color: 'from-cyan-500 to-blue-500' },
                            { name: 'Alerjen Planlayıcı', path: '/akilli-asistan/alerjen-planlayici', icon: 'fa-shield-virus', color: 'from-red-500 to-pink-500' },
                            { name: 'Bez Hesaplayıcı', path: '/akilli-asistan/bez-hesaplayici', icon: 'fa-baby', color: 'from-pink-500 to-rose-500' },
                          ];
                          
                          // Shuffle and pick 3 random tools
                          const shuffled = [...SMART_TOOLS].sort(() => Math.random() - 0.5);
                          const randomTools = shuffled.slice(0, 3);
                          
                          return randomTools.map((tool, index) => (
                            <Link 
                              key={index}
                              href={tool.path}
                              className={`block bg-gradient-to-br ${tool.color} p-4 rounded-2xl text-white hover:shadow-lg transition-all group`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                                  <i className={`fa-solid ${tool.icon} text-lg`}></i>
                                </div>
                                <h4 className="font-bold text-sm">{tool.name}</h4>
                              </div>
                              <p className="text-xs text-white/80 mb-2">Yapay zeka destekli araç</p>
                              <div className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                Hemen Dene <i className="fa-solid fa-arrow-right"></i>
                              </div>
                            </Link>
                          ));
                        })()}
                    </div>

                </aside>

            </div>
            </>
            )}

        </div>
    </div>

  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <SearchContent />
    </Suspense>
  );
}