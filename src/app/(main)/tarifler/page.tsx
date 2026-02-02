"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { recipeService } from '@/services/recipe-service';
import { RecipeCard as RecipeCardType } from '@/lib/types';
import { useChildProfile } from '@/contexts/ChildProfileContext';
import { useAgeGroups } from '@/hooks/useAgeGroups';
import { useMealTypes } from '@/hooks/useMealTypes';
import { useDietTypes } from '@/hooks/useDietTypes';
import { useFavorites } from '@/hooks/use-favorites';
import { decodeEntities } from '@/utils/textHelpers';
import ClientHead from '@/components/seo/ClientHead';
import { useActiveChild } from '@/contexts/ActiveChildContext';
import RecipeCard from '@/components/ui/RecipeCard';
import { InContentAd, InFeedAdWrapper, FooterBannerAd, AdZone } from '@/components/ads';

// Yaş Grubu Sıralaması
const AGE_GROUPS_ORDER = [
  { slug: '0-6-ay-sadece-sut', label: '0-6 Ay (Hazırlık Evresi)' },
  { slug: '6-8-ay-baslangic', label: '6-8 Ay (Başlangıç & Tadım)' },
  { slug: '9-11-ay-kesif', label: '9-11 Ay (Keşif & Pütürlüye Geçiş)' },
  { slug: '12-24-ay-gecis', label: '12-24 Ay (Aile Sofrasına Geçiş)' },
  { slug: '2-yas-ve-uzeri', label: '2+ Yaş (Çocuk Gurme)' },
];

// Özel Durumlar
const SPECIAL_CONDITIONS = [
  { id: 'kabizlik-giderici', label: 'Kabızlık Giderici' },
  { id: 'bagisiklik-dostu', label: 'Bağışıklık Dostu' },
  { id: 'dis-cikarma', label: 'Diş Çıkarma Dönemi' },
  { id: 'alerjik-bebek', label: 'Alerjik Bebek' },
];

// Filtre State Interface
interface FilterState {
  ageGroups: string[];
  mealTypes: string[];
  dietTypes: string[];
  specialConditions: string[];
  ingredientSearch: string;
  expertApproved: boolean;
}

// Age Group with Display Label
interface AgeGroupWithLabel {
  id: number;
  name: string;
  slug: string;
  description: string;
  age_group_meta: {
    min_month: number;
    max_month: number;
    daily_meal_count: number;
    max_salt_limit: string;
    texture_guide: string;
    forbidden_list: string[];
    color_code: string;
    warning_message: string;
  };
  displayLabel: string;
}

function RecipesPageContent() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<RecipeCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [sortBy, setSortBy] = useState<'date' | 'popular' | 'prep_time'>('date');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const RECIPES_PER_PAGE = 12;
  
  const { profile } = useChildProfile();
  const { ageGroups } = useAgeGroups();
  const { mealTypes } = useMealTypes();
  const { dietTypes } = useDietTypes();
  const { activeChild } = useActiveChild();
  
  // Filtre state
  const [filters, setFilters] = useState<FilterState>({
    ageGroups: [],
    mealTypes: [],
    dietTypes: [],
    specialConditions: [],
    ingredientSearch: '',
    expertApproved: false,
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const category = searchParams.get('category');
    const dietType = searchParams.get('diet-type');
    const mealType = searchParams.get('meal-type');
    const ageGroup = searchParams.get('age-group');
    const ingredient = searchParams.get('ingredient');

    const newFilters: FilterState = {
      ageGroups: ageGroup ? [ageGroup] : [],
      mealTypes: mealType ? [mealType] : [],
      dietTypes: dietType ? [dietType] : [],
      specialConditions: category ? [category] : [],
      ingredientSearch: ingredient || '',
      expertApproved: false,
    };

    // URL parametreleri varsa filtreleri güncelle ve fetch tetikle
    if (category || dietType || mealType || ageGroup || ingredient) {
      setFilters(newFilters);
      setCurrentPage(1); // Sayfa 1'e reset et
    }
  }, [searchParams]);
  
  // Tarifleri getir
  const fetchRecipes = useCallback(async (page: number, currentFilters: FilterState, orderBy: string) => {
    try {
      setLoading(true);
      
      // prep_time için özel order değeri
      const orderValue = orderBy === 'prep_time' ? 'asc' : 'desc';
      
      const data = await recipeService.getAll({
        page,
        perPage: RECIPES_PER_PAGE,
        ageGroup: currentFilters.ageGroups.join(','),
        mealType: currentFilters.mealTypes.join(','),
        dietType: currentFilters.dietTypes.join(','),
        specialCondition: currentFilters.specialConditions.join(','),
        ingredient: currentFilters.ingredientSearch,
        orderBy: orderBy as 'date' | 'popular' | 'prep_time',
        order: orderValue,
        expertApproved: currentFilters.expertApproved,
      });
      
      // Response kontrolü
      if (data && data.recipes) {
        setRecipes(data.recipes);
        setTotalRecipes(data.total || 0);
        // API total_pages düzgün dönmezse hesapla
        const calculatedTotalPages = data.total_pages > 1 
          ? data.total_pages 
          : Math.ceil((data.total || data.recipes.length) / RECIPES_PER_PAGE);
        setTotalPages(calculatedTotalPages);
      } else {
        setRecipes([]);
        setTotalRecipes(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Tarifler yüklenirken hata oluştu:", error);
      setRecipes([]);
      setTotalRecipes(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  // İlk yükleme ve filtre/sıralama değişimlerinde fetch
  useEffect(() => {
    fetchRecipes(currentPage, filters, sortBy);
  }, [currentPage, filters, sortBy, fetchRecipes]);

  // Filtre değiştir
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      if (Array.isArray(currentValues)) {
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [filterType]: newValues };
      }
      return prev;
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Malzeme arama
  const handleIngredientSearch = (value: string) => {
    setFilters(prev => ({ ...prev, ingredientSearch: value }));
    setCurrentPage(1);
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setFilters({
      ageGroups: [],
      mealTypes: [],
      dietTypes: [],
      specialConditions: [],
      ingredientSearch: '',
      expertApproved: false,
    });
    setCurrentPage(1);
  };

  // Filtreleri uygula (mobile)
  const applyFilters = () => {
    setIsFilterDrawerOpen(false);
  };

  // Check if a recipe is suitable for the child's age
  const isRecipeSuitableForAge = useCallback((recipe: RecipeCardType): boolean => {
    if (!profile.currentAgeGroup) return true;
    return recipe.age_group === profile.currentAgeGroup.name;
  }, [profile.currentAgeGroup]);

  // Separate recipes into suitable and unsuitable
  const { suitableRecipes, otherRecipes } = useMemo(() => {
    if (!profile.birthDate) {
      return { suitableRecipes: recipes, otherRecipes: [] };
    }

    const suitable = recipes.filter(isRecipeSuitableForAge);
    const other = recipes.filter(r => !isRecipeSuitableForAge(r));

    return { suitableRecipes: suitable, otherRecipes: other };
  }, [recipes, profile.birthDate, isRecipeSuitableForAge]);

  // Yaş gruplarını sırala
  const sortedAgeGroups = useMemo(() => {
    return AGE_GROUPS_ORDER.map(orderItem => {
      const ageGroup = ageGroups.find(ag => ag.slug === orderItem.slug);
      return ageGroup ? { ...ageGroup, displayLabel: orderItem.label } : null;
    }).filter((item): item is AgeGroupWithLabel => item !== null);
  }, [ageGroups]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* SEO */}
      <ClientHead
        title="Bebek ve Çocuk Tarifleri | KidsGourmet"
        description="Uzman onaylı, yaşa uygun bebek ve çocuk tarifleri. 6 aydan 2+ yaşa kadar sağlıklı ve lezzetli tarifler keşfedin."
        keywords={['bebek tarifleri', 'ek gıda tarifleri', 'çocuk yemekleri', 'BLW tarifleri', 'bebek yemekleri']}
        url="https://kidsgourmet.com/tarifler"
        ogImage="https://kidsgourmet.com/images/og-recipes.jpg"
      />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'name': 'Bebek ve Çocuk Tarifleri',
            'description': 'Uzman onaylı, yaşa uygun bebek ve çocuk tarifleri koleksiyonu',
            'url': 'https://kidsgourmet.com/tarifler',
            'numberOfItems': totalRecipes,
            'itemListElement': recipes.slice(0, 10).map((recipe, index) => ({
              '@type': 'ListItem',
              'position': index + 1,
              'item': {
                '@type': 'Recipe',
                'name': recipe.title,
                'url': `https://kidsgourmet.com/tarifler/${recipe.slug}`,
                'image': recipe.image,
                'prepTime': recipe.prep_time,
                ...(recipe.meal_type && { 'recipeCategory': recipe.meal_type }),
                ...(recipe.diet_types && recipe.diet_types.length > 0 && { 'suitableForDiet': recipe.diet_types }),
              }
            }))
          })
        }}
      />
      
      {/* PAGE HEADER */}
      <div className="bg-orange-50 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200/20 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-2 font-sans">Sağlıklı Tarifler</h1>
          <p className="text-gray-600">Minik gurmeniz için sağlıklı, lezzetli, yaşa uygun lezzetler.</p>
        </div>
      </div>

      {/* MAIN CONTENT LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden lg:block w-64 min-w-[281px] flex-shrink-0 space-y-6">
            {/* Filter Group: Age */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center font-sans">
                <i className="fa-solid fa-baby text-orange-500 mr-2"></i> Yaş Grubu
              </h3>
              <div className="space-y-2">
                {sortedAgeGroups.map((ageGroup) => (
                  <label key={ageGroup.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
                      checked={filters.ageGroups.includes(ageGroup.slug)}
                      onChange={() => handleFilterChange('ageGroups', ageGroup.slug)}
                    />
                    <span className="text-gray-600 group-hover:text-orange-500 transition-colors text-sm">
                      {decodeEntities(ageGroup.displayLabel || ageGroup.name)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Meal Type (Kategori) */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center font-sans">
                <i className="fa-solid fa-utensils text-green-500 mr-2"></i> Kategori (Öğün Tipi)
              </h3>
              <div className="space-y-2">
                {mealTypes.map((mealType) => (
                  <label key={mealType.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 accent-green-500"
                      checked={filters.mealTypes.includes(mealType.slug)}
                      onChange={() => handleFilterChange('mealTypes', mealType.slug)}
                    />
                    <span className="text-gray-600 group-hover:text-green-500 transition-colors text-sm">
                      {decodeEntities(mealType.name)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Diet Type */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center font-sans">
                <i className="fa-solid fa-leaf text-emerald-500 mr-2"></i> Diyet Tipi
              </h3>
              <div className="space-y-2">
                {dietTypes.map((dietType) => (
                  <label key={dietType.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
                      checked={filters.dietTypes.includes(dietType.slug)}
                      onChange={() => handleFilterChange('dietTypes', dietType.slug)}
                    />
                    <span className="text-gray-600 group-hover:text-emerald-500 transition-colors text-sm">
                      {decodeEntities(dietType.name)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Special Conditions */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center font-sans">
                <i className="fa-solid fa-heart-pulse text-red-400 mr-2"></i> Özel Durum
              </h3>
              <div className="space-y-2">
                {SPECIAL_CONDITIONS.map((condition) => (
                  <label key={condition.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500 accent-red-500"
                      checked={filters.specialConditions.includes(condition.id)}
                      onChange={() => handleFilterChange('specialConditions', condition.id)}
                    />
                    <span className="text-gray-600 group-hover:text-red-500 transition-colors text-sm">
                      {condition.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Expert Approved */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center font-sans">
                <i className="fa-solid fa-user-doctor text-green-500 mr-2"></i> Uzman Onayı
              </h3>
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 accent-green-500"
                  checked={filters.expertApproved}
                  onChange={() => setFilters(prev => ({ ...prev, expertApproved: !prev.expertApproved }))}
                />
                <span className="text-gray-600 group-hover:text-green-500 transition-colors text-sm">
                  Sadece Uzman Onaylı Tarifler
                </span>
              </label>
            </div>

            {/* Filter Group: Ingredient Search */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center font-sans">
                <i className="fa-solid fa-magnifying-glass text-blue-500 mr-2"></i> Malzemeye Göre
              </h3>
              <input
                type="text"
                placeholder="Malzeme ara..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                value={filters.ingredientSearch}
                onChange={(e) => handleIngredientSearch(e.target.value)}
              />
            </div>

            {/* Clear Filters Button */}
            {(filters.ageGroups.length > 0 || filters.mealTypes.length > 0 || filters.dietTypes.length > 0 || filters.specialConditions.length > 0 || filters.ingredientSearch) && (
              <button 
                onClick={clearFilters}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                <i className="fa-solid fa-xmark mr-2"></i> Filtreleri Temizle
              </button>
            )}
          </aside>

          {/* CONTENT GRID */}
          <div className="flex-grow">
            
            {/* Mobile Quick Filters */}
            <div className="lg:hidden mb-6">
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scroll scrollbar-hide">
                <button 
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="flex-shrink-0 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm whitespace-nowrap"
                >
                  <i className="fa-solid fa-sliders mr-2"></i> Filtrele
                </button>
              </div>
            </div>

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="font-bold text-gray-800 font-sans">
                <span className="text-orange-500">{totalRecipes}</span> Tarif Listeleniyor
              </h2>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sırala:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="date">En Yeniler</option>
                  <option value="popular">Popüler</option>
                  <option value="prep_time">Hızlı Hazırla</option>
                </select>
              </div>
            </div>

            {/* Recipe Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                {/* Suitable Recipes Section */}
                {profile.birthDate && suitableRecipes.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-green-500">✓</span> Çocuğunuz için Önerilen Tarifler
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {suitableRecipes.map((recipe, index) => (
                        <React.Fragment key={recipe.id}>
                          <RecipeCard 
                            recipe={recipe}
                          />
                          {/* Insert ad after every 6 recipes */}
                          {(index + 1) % 6 === 0 && index < suitableRecipes.length - 1 && (
                            <div className="col-span-full">
                              <InContentAd />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </section>
                )}

                {/* Other Recipes Section */}
                {profile.birthDate && otherRecipes.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Diğer Tarifler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherRecipes.map((recipe, index) => (
                        <React.Fragment key={recipe.id}>
                          <RecipeCard 
                            recipe={recipe}
                          />
                          {/* Insert ad after every 6 recipes */}
                          {(index + 1) % 6 === 0 && index < otherRecipes.length - 1 && (
                            <div className="col-span-full">
                              <InContentAd />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </section>
                )}

                {/* All Recipes (when no profile) */}
                {!profile.birthDate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InFeedAdWrapper 
                      adPositions={[2, 10]} // 3rd and 11th items in grid (0-indexed positions 2 and 10)
                      totalItems={12} // Show total 12 items (10 recipes + 2 ads)
                    >
                      {recipes.map((recipe) => (
                        <RecipeCard 
                          key={recipe.id}
                          recipe={recipe}
                        />
                      ))}
                    </InFeedAdWrapper>
                  </div>
                )}
              </>
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

            {/* Pagination */}
            {!loading && recipes.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500 transition-colors"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                
                {/* Sayfa numaraları */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages || pageNum < 1) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === pageNum 
                          ? 'bg-orange-500 text-white' 
                          : 'border border-gray-200 hover:border-orange-500 hover:text-orange-500'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500 transition-colors"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Banner - Desktop only, below pagination */}
      <FooterBannerAd />
      
      {/* Content Bottom Ad - Mobile only */}
      <div className="lg:hidden w-full flex justify-center py-4 bg-gray-50/50">
        <AdZone placement="content-bottom" />
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Filtreler</h3>
              <button onClick={() => setIsFilterDrawerOpen(false)}>
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            {/* Mobile Filters Content */}
            <div className="space-y-6">
              {/* Age Groups */}
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center">
                  <i className="fa-solid fa-baby text-orange-500 mr-2"></i> Yaş Grubu
                </h4>
                <div className="space-y-2">
                  {sortedAgeGroups.map((ageGroup) => (
                    <label key={ageGroup.id} className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
                        checked={filters.ageGroups.includes(ageGroup.slug)}
                        onChange={() => handleFilterChange('ageGroups', ageGroup.slug)}
                      />
                      <span className="text-gray-600 text-sm">
                        {decodeEntities(ageGroup.displayLabel || ageGroup.name)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Meal Types */}
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center">
                  <i className="fa-solid fa-utensils text-green-500 mr-2"></i> Kategori
                </h4>
                <div className="space-y-2">
                  {mealTypes.map((mealType) => (
                    <label key={mealType.id} className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 accent-green-500"
                        checked={filters.mealTypes.includes(mealType.slug)}
                        onChange={() => handleFilterChange('mealTypes', mealType.slug)}
                      />
                      <span className="text-gray-600 text-sm">
                        {decodeEntities(mealType.name)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Diet Types */}
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center">
                  <i className="fa-solid fa-leaf text-emerald-500 mr-2"></i> Diyet Tipi
                </h4>
                <div className="space-y-2">
                  {dietTypes.map((dietType) => (
                    <label key={dietType.id} className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
                        checked={filters.dietTypes.includes(dietType.slug)}
                        onChange={() => handleFilterChange('dietTypes', dietType.slug)}
                      />
                      <span className="text-gray-600 text-sm">{decodeEntities(dietType.name)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Conditions */}
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center">
                  <i className="fa-solid fa-heart-pulse text-red-400 mr-2"></i> Özel Durum
                </h4>
                <div className="space-y-2">
                  {SPECIAL_CONDITIONS.map((condition) => (
                    <label key={condition.id} className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500 accent-red-500"
                        checked={filters.specialConditions.includes(condition.id)}
                        onChange={() => handleFilterChange('specialConditions', condition.id)}
                      />
                      <span className="text-gray-600 text-sm">{condition.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Expert Approved */}
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center">
                  <i className="fa-solid fa-user-doctor text-green-500 mr-2"></i> Uzman Onayı
                </h4>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 accent-green-500"
                    checked={filters.expertApproved}
                    onChange={() => setFilters(prev => ({ ...prev, expertApproved: !prev.expertApproved }))}
                  />
                  <span className="text-gray-600 text-sm">Sadece Uzman Onaylı Tarifler</span>
                </label>
              </div>

              {/* Ingredient Search */}
              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center">
                  <i className="fa-solid fa-magnifying-glass text-blue-500 mr-2"></i> Malzemeye Göre
                </h4>
                <input
                  type="text"
                  placeholder="Malzeme ara..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                  value={filters.ingredientSearch}
                  onChange={(e) => handleIngredientSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={clearFilters} 
                className="flex-1 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Temizle
              </button>
              <button 
                onClick={applyFilters} 
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <RecipesPageContent />
    </Suspense>
  );
}
