"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useUser } from '@/hooks/use-user';
import { useActiveChild } from '@/contexts/ActiveChildContext';
import { useMealPlan } from '@/hooks/useMealPlan';
import { useFavorites } from '@/hooks/use-favorites';
import { MealSlot, MealSlotType, Recipe } from '@/lib/types';
import { mealPlanService } from '@/services/meal-plan-service';
import { recipeService } from '@/services/recipe-service';
import { toast } from 'sonner';

// Constants
const SEARCH_DEBOUNCE_MS = 300;
const PLACEHOLDER_RECIPE_IMAGE = 'https://placehold.co/60x60/FFF3E0/FF8A65?text=T';

// Age group mapping
const AGE_GROUP_SLUGS: Record<string, string> = {
  '0-6': '0-6-ay-sadece-sut',
  '6-8': '6-8-ay-baslangic',
  '9-11': '9-11-ay-kesif',
  '12-24': '12-24-ay-gecis',
  '24+': '2-yas-ve-uzeri',
};

// Helper function for age group calculation
const getAgeGroupSlug = (ageInMonths: number): string => {
  if (ageInMonths < 6) return AGE_GROUP_SLUGS['0-6'];
  if (ageInMonths <= 8) return AGE_GROUP_SLUGS['6-8'];
  if (ageInMonths <= 11) return AGE_GROUP_SLUGS['9-11'];
  if (ageInMonths <= 24) return AGE_GROUP_SLUGS['12-24'];
  return AGE_GROUP_SLUGS['24+'];
};

// Helper function for age calculation
const calculateAgeInMonths = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + 
         (now.getMonth() - birth.getMonth());
};

// Lightweight recipe type for sidebar cards
interface RecipeCardLite {
  id: number;
  title: string;
  image?: string;
  prep_time?: string;
}

// Slot renkleri
const SLOT_COLORS: Record<MealSlotType, { bg: string; text: string; label: string }> = {
  breakfast: { bg: 'bg-yellow-50', text: 'text-yellow-600', label: 'bg-yellow-100' },
  lunch: { bg: 'bg-green-50', text: 'text-green-600', label: 'bg-green-100' },
  dinner: { bg: 'bg-orange-50', text: 'text-orange-600', label: 'bg-orange-100' },
  snack_morning: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'bg-purple-100' },
  snack_afternoon: { bg: 'bg-pink-50', text: 'text-pink-600', label: 'bg-pink-100' },
};

export default function WeeklyPlanPage() {
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const { activeChild, children: userChildren, setActiveChild } = useActiveChild();
  const { 
    plan, 
    isLoading, 
    isGenerating, 
    weekRange, 
    isCurrentWeek,
    stats,
    generatePlan, 
    refreshSlot, 
    skipSlot,
    goToNextWeek,
    goToPreviousWeek,
    reload: reloadPlan
  } = useMealPlan();
  const { favorites, isLoading: favoritesLoading } = useFavorites();

  const [isCreatingShoppingList, setIsCreatingShoppingList] = useState(false);
  
  // Yeni state'ler
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  // Alışveriş listesi oluştur
  const handleCreateShoppingList = async () => {
    if (!plan?.id) {
      toast.error('Önce bir plan oluşturmanız gerekiyor');
      return;
    }

    setIsCreatingShoppingList(true);
    try {
      const response = await mealPlanService.generateShoppingList(plan.id);
      if (response.success) {
        toast.success(`${response.total_count} ürün eklendi! 🛒`);
        // Yönlendirme yapabiliriz
        window.location.href = '/alisveris-listesi';
      }
    } catch {
      toast.error('Liste oluşturulamadı');
    } finally {
      setIsCreatingShoppingList(false);
    }
  };

  // Yaşa uygun önerileri yükle
  useEffect(() => {
    const loadSuggestions = async () => {
      if (!activeChild?.birth_date) {
        setSuggestedRecipes([]);
        return;
      }
      
      setIsSuggestionsLoading(true);
      try {
        const ageInMonths = calculateAgeInMonths(activeChild.birth_date);
        const ageGroup = getAgeGroupSlug(ageInMonths);
        
        console.log('Loading suggestions for age group:', ageGroup);
        
        // Tarifler API'sini kullan
        const recipes = await recipeService.getByFilters({
          age_group: ageGroup,
          per_page: 10,
        });
        
        console.log('Loaded suggestions:', recipes.length);
        setSuggestedRecipes(recipes);
      } catch (error) {
        console.error('Öneriler yüklenemedi:', error);
        setSuggestedRecipes([]);
      } finally {
        setIsSuggestionsLoading(false);
      }
    };
    
    loadSuggestions();
  }, [activeChild?.birth_date]);

  // Tarif arama
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await recipeService.search(query, { per_page: 10 });
      setSearchResults(results);
    } catch (error) {
      console.error('Arama hatası:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, SEARCH_DEBOUNCE_MS);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Slot'a tarif ekle
  const handleAddRecipeToSlot = async (slotId: string, recipeId: number) => {
    if (!plan?.id) return;
    
    try {
      // API çağrısı ile slot'u güncelle
      await mealPlanService.assignRecipeToSlot(plan.id, slotId, recipeId);
      await reloadPlan();
      setSelectedSlotId(null);
      toast.success('Tarif eklendi!');
    } catch (error) {
      console.error('Tarif eklenemedi:', error);
      toast.error('Tarif eklenirken hata oluştu');
    }
  };

  // Slot kartı bileşeni
  const SlotCard = ({ slot }: { slot: MealSlot }) => {
    const colors = SLOT_COLORS[slot.slot_type] || SLOT_COLORS.breakfast;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (slot.status === 'skipped') {
      return (
        <div className={`${colors.bg} p-3 rounded-xl border border-gray-200 opacity-60`}>
          <div className="flex items-start justify-between mb-2">
            <span className={`text-[10px] font-bold ${colors.text} ${colors.label} px-2 py-0.5 rounded`}>
              {slot.slot_label}
            </span>
            <button 
              onClick={() => skipSlot(slot.id, 'other')}
              className="text-gray-400 hover:text-orange-500 text-xs"
            >
              <i className="fa-solid fa-rotate-left"></i>
            </button>
          </div>
          <p className="text-xs text-gray-500 italic">
            {slot.skip_reason === 'eating_out' ? 'Dışarıda yiyoruz' : 
             slot.skip_reason === 'ready_meal' ? 'Hazır mama' : 
             slot.skip_reason === 'family_meal' ? 'Aile yemeği' : 'Atlandı'}
          </p>
        </div>
      );
    }

    if (slot.status === 'empty' || !slot.recipe) {
      return (
        <button 
          onClick={() => setSelectedSlotId(slot.id)}
          className={`border-2 border-dashed rounded-xl p-3 flex items-center justify-center transition-all h-20 w-full ${
            selectedSlotId === slot.id 
              ? 'border-orange-500 bg-orange-50 text-orange-500' 
              : 'border-gray-200 text-gray-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50'
          }`}
        >
          <i className="fa-solid fa-plus mr-1"></i>
          <span className="text-xs font-bold">{slot.slot_label}</span>
        </button>
      );
    }

    return (
      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-2">
          <span className={`text-[10px] font-bold ${colors.text} ${colors.label} px-2 py-0.5 rounded`}>
            {slot.slot_label}
          </span>
          
          {/* Menü Butonu - Her zaman görünür */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="text-gray-400 hover:text-orange-500 p-1 -mr-1"
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
          
          {/* Dropdown Menü */}
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-100 p-1 z-50 min-w-[160px]">
                <button
                  onClick={() => {
                    refreshSlot(slot.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  <i className="fa-solid fa-rotate text-blue-500"></i> Değiştir
                </button>
                <button
                  onClick={() => {
                    skipSlot(slot.id, 'eating_out');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  <i className="fa-solid fa-utensils text-orange-500"></i> Dışarıdayız
                </button>
                <button
                  onClick={() => {
                    skipSlot(slot.id, 'ready_meal');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  <i className="fa-solid fa-jar text-purple-500"></i> Hazır Mama
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Tarif Bilgisi */}
        <Link href={`/tarifler/${slot.recipe.slug}`}>
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={slot.recipe.image || 'https://placehold.co/100x100/FFF3E0/FF8A65?text=Tarif'} 
              className="w-12 h-12 rounded-lg object-cover" 
              alt={slot.recipe.title} 
            />
            <p className="text-xs font-bold text-slate-700 line-clamp-2 flex-1">{slot.recipe.title}</p>
          </div>
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <i className="fa-regular fa-clock"></i> {slot.recipe.prep_time}
          </p>
        </Link>
      </div>
    );
  };

  // RecipePoolCard bileşeni (Sidebar için mini kart)
  interface RecipePoolCardProps {
    recipe: Recipe | RecipeCardLite;
    onSelect: () => void;
    isSelectable: boolean;
  }

  const RecipePoolCard = ({ recipe, onSelect, isSelectable }: RecipePoolCardProps) => {
    // Type guard to check if it's a full Recipe
    const isFullRecipe = (r: RecipePoolCardProps['recipe']): r is Recipe => {
      return 'slug' in r && 'content' in r;
    };
    
    const image = isFullRecipe(recipe) ? recipe.image : (recipe.image || PLACEHOLDER_RECIPE_IMAGE);
    const prepTime = isFullRecipe(recipe) ? recipe.prep_time : recipe.prep_time;

    return (
      <div 
        onClick={isSelectable ? onSelect : undefined}
        className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
          isSelectable 
            ? 'border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 hover:border-orange-300' 
            : 'border-gray-100 bg-gray-50 opacity-60'
        }`}
      >
        <img 
          src={image} 
          alt={recipe.title}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-700 line-clamp-2">{recipe.title}</p>
          {prepTime && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              <i className="fa-regular fa-clock mr-1"></i>
              {prepTime}
            </p>
          )}
        </div>
        {isSelectable && (
          <i className="fa-solid fa-plus text-orange-500 text-sm flex-shrink-0"></i>
        )}
      </div>
    );
  };

  // Auth check
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fa-solid fa-lock text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-gray-600 mb-4">Haftalık planınızı görüntülemek için giriş yapın</p>
          <Link href="/giris" className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fa-solid fa-baby text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Çocuk Profili Bulunamadı</h2>
          <p className="text-gray-600 mb-4">Haftalık plan oluşturmak için önce bir çocuk profili ekleyin</p>
          <Link href="/profil" className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold">
            Profil Ekle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-20 h-[calc(100vh-5rem)] z-10 overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-house"></i> Genel Bakış
                </Link>
                <Link href="/dashboard/haftalik-plan" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
                    <i className="fa-solid fa-calendar-days"></i> Haftalık Plan
                </Link>
                <Link href="/favoriler" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-heart"></i> Favorilerim
                </Link>
                <Link href="/alisveris-listesi" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-basket-shopping"></i> Alışveriş Listesi
                </Link>
                
                <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Araçlar</p>
                </div>
                <Link href="/araclar" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-chart-line"></i> Gelişim Takibi
                </Link>
                <Link href="/araclar" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-check-double"></i> BLW Testi
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-50 mt-auto">
                <Link href="/profil" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <img src={user?.avatar_url || 'https://placehold.co/100x100/FFCC80/ffffff?text=U'} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.display_name}</p>
                        <p className="text-xs text-gray-400 truncate">Hesabım</p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                </Link>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100 flex-shrink-0">
                <span className="font-display font-bold text-lg text-slate-800">Haftalık Plan</span>
                <div className="flex gap-2">
                    <button className="text-gray-500 text-xl"><i className="fa-solid fa-print"></i></button>
                    <button className="text-orange-500 text-xl"><i className="fa-solid fa-share-nodes"></i></button>
                </div>
            </div>

            {/* PLAN HEADER & CONTROLS */}
            <div className="bg-white border-b border-gray-100 p-4 md:p-6 z-20 shadow-sm md:shadow-none flex-shrink-0">
                <div className="max-w-6xl mx-auto">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        
                        {/* Child Switcher & Date Nav */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            {/* Child Dropdown */}
                            {userChildren.length > 0 && (
                              <div className="relative group cursor-pointer bg-orange-50 px-4 py-2 rounded-full flex items-center gap-2 border border-orange-100 hover:bg-orange-100 transition-colors">
                                  <span className="text-sm font-bold text-slate-800">{activeChild.name}</span>
                                  <i className="fa-solid fa-chevron-down text-xs text-orange-500"></i>
                                  
                                  {userChildren.length > 1 && (
                                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:block p-1">
                                        {userChildren.map(child => (
                                            <div 
                                              key={child.id} 
                                              onClick={() => setActiveChild(child)} 
                                              className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
                                            >
                                                <span className="text-sm font-medium text-slate-700">{child.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                  )}
                              </div>
                            )}

                            {/* Date Nav - Geliştirilmiş */}
                            <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-200">
                                <button 
                                  onClick={goToPreviousWeek}
                                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                                  title="Önceki hafta"
                                >
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <div className="px-4 text-center">
                                  <span className="text-sm font-bold text-slate-700 block">{weekRange}</span>
                                  {isCurrentWeek && (
                                    <span className="text-[10px] text-orange-500 font-medium">Bu Hafta</span>
                                  )}
                                </div>
                                <button 
                                  onClick={goToNextWeek}
                                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                                  title="Sonraki hafta"
                                >
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full md:w-auto">
                            <button 
                              onClick={handleCreateShoppingList}
                              disabled={!plan || isCreatingShoppingList}
                              className="flex-1 md:flex-none bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreatingShoppingList ? (
                                  <><i className="fa-solid fa-spinner fa-spin"></i> Oluşturuluyor...</>
                                ) : (
                                  <><i className="fa-solid fa-basket-shopping"></i> Liste Oluştur</>
                                )}
                            </button>
                            <button className="hidden md:flex bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors gap-2 items-center">
                                <i className="fa-solid fa-print"></i> Yazdır
                            </button>
                        </div>
                    </div>

                    {/* Weekly Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <i className="fa-solid fa-leaf"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-green-600 uppercase">Sebze</p>
                                <p className="text-sm font-bold text-slate-800">{stats.vegetables_servings} Porsiyon</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <i className="fa-solid fa-egg"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-600 uppercase">Protein</p>
                                <p className="text-sm font-bold text-slate-800">{stats.protein_servings} Porsiyon</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                <i className="fa-solid fa-wheat-awn"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-yellow-600 uppercase">Tahıl</p>
                                <p className="text-sm font-bold text-slate-800">{stats.grains_servings} Porsiyon</p>
                            </div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-red-600 uppercase">Alerjen</p>
                                <p className="text-sm font-bold text-slate-800">{stats.new_allergens_introduced.length} Yeni</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* MAIN GRID - Updated flex structure */}
            <div className="flex flex-1 overflow-hidden">
              {/* WEEK GRID */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                <div className="max-w-6xl mx-auto pb-24">
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <i className="fa-solid fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
                          <p className="text-gray-600">Plan yükleniyor...</p>
                        </div>
                      </div>
                    ) : !plan ? (
                      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-sm">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-500 shadow-sm text-3xl">
                              <i className="fa-solid fa-wand-magic-sparkles"></i>
                          </div>
                          <div className="text-center">
                              <h3 className="font-bold text-slate-800 text-xl mb-2">Henüz bir plan yok</h3>
                              <p className="text-gray-600">Hip AI, {activeChild.name} için bu haftaya özel beslenme planı oluştursun mu?</p>
                          </div>
                          <button 
                            onClick={generatePlan}
                            disabled={isGenerating}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-colors disabled:opacity-50"
                          >
                              {isGenerating ? (
                                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Oluşturuluyor...</>
                              ) : (
                                <><i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Otomatik Plan Oluştur</>
                              )}
                          </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-[600px]">
                          {plan.days.map((day) => (
                            <div key={day.date} className="flex flex-col gap-3">
                                <div className="text-center p-2 bg-white rounded-xl shadow-sm border-b-2 border-orange-500">
                                    <span className="text-xs text-gray-400 font-bold uppercase">{day.day_name}</span>
                                    <div className="text-lg font-bold text-slate-800">
                                      {new Date(day.date).getDate()}
                                    </div>
                                </div>
                                
                                {day.slots.map((slot) => (
                                  <SlotCard key={slot.id} slot={slot} />
                                ))}
                            </div>
                          ))}
                      </div>
                    )}
                    
                </div>
              </div>
              
              {/* RECIPE POOL SIDEBAR - Desktop Only */}
              <aside className="hidden xl:flex w-80 bg-white border-l border-gray-100 flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <i className="fa-solid fa-bookmark text-orange-500"></i> Tarif Havuzu
                  </h3>
                  {selectedSlotId ? (
                    <p className="text-xs text-orange-500 mt-1 font-medium">
                      <i className="fa-solid fa-arrow-left mr-1"></i>
                      Eklemek için tarife tıklayın
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Önce bir slot seçin</p>
                  )}
                </div>
                
                {/* Arama */}
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tarif ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    {isSearching && (
                      <i className="fa-solid fa-spinner fa-spin absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 text-sm"></i>
                    )}
                  </div>
                </div>
                
                {/* İçerik */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  
                  {/* Arama Sonuçları */}
                  {searchQuery && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-search"></i> Arama Sonuçları
                      </h4>
                      {isSearching ? (
                        <div className="text-center py-4">
                          <i className="fa-solid fa-spinner fa-spin text-orange-500"></i>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map(recipe => (
                            <RecipePoolCard 
                              key={recipe.id} 
                              recipe={recipe} 
                              onSelect={() => selectedSlotId && handleAddRecipeToSlot(selectedSlotId, recipe.id)}
                              isSelectable={!!selectedSlotId}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 text-center py-4">Sonuç bulunamadı</p>
                      )}
                    </div>
                  )}
                  
                  {/* Favorilerim */}
                  {!searchQuery && (
                    <>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                          <i className="fa-solid fa-heart text-red-400"></i> Favorilerim
                        </h4>
                        {favoritesLoading ? (
                          <div className="text-center py-4">
                            <i className="fa-solid fa-spinner fa-spin text-orange-500"></i>
                          </div>
                        ) : favorites?.recipes && favorites.recipes.length > 0 ? (
                          <div className="space-y-2">
                            {favorites.recipes.slice(0, 5).map(recipe => (
                              <RecipePoolCard 
                                key={recipe.id} 
                                recipe={recipe} 
                                onSelect={() => selectedSlotId && handleAddRecipeToSlot(selectedSlotId, recipe.id)}
                                isSelectable={!!selectedSlotId}
                              />
                            ))}
                            {favorites.recipes.length > 5 && (
                              <Link 
                                href="/favoriler" 
                                className="block text-center text-xs text-orange-500 hover:underline py-2"
                              >
                                Tümünü gör ({favorites.recipes.length})
                              </Link>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-400">
                            <i className="fa-regular fa-heart text-2xl mb-2 block"></i>
                            <p className="text-xs">Henüz favori tarifiniz yok</p>
                            <Link href="/tarifler" className="text-xs text-orange-500 hover:underline mt-1 inline-block">
                              Tariflere göz at
                            </Link>
                          </div>
                        )}
                      </div>
                      
                      {/* Yaşa Uygun Öneriler */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                          <i className="fa-solid fa-wand-magic-sparkles text-purple-400"></i> 
                          {activeChild?.name} İçin Öneriler
                        </h4>
                        {isSuggestionsLoading ? (
                          <div className="text-center py-4">
                            <i className="fa-solid fa-spinner fa-spin text-orange-500"></i>
                          </div>
                        ) : suggestedRecipes.length > 0 ? (
                          <div className="space-y-2">
                            {suggestedRecipes.map(recipe => (
                              <RecipePoolCard 
                                key={recipe.id} 
                                recipe={recipe} 
                                onSelect={() => selectedSlotId && handleAddRecipeToSlot(selectedSlotId, recipe.id)}
                                isSelectable={!!selectedSlotId}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-400">
                            <i className="fa-solid fa-carrot text-2xl mb-2 block"></i>
                            <p className="text-xs">Öneri bulunamadı</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                </div>
              </aside>
            </div>

        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link href="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-house text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Panelim</span>
            </Link>
            <Link href="/dashboard/haftalik-plan" className="flex flex-col items-center text-orange-500">
                <i className="fa-solid fa-calendar-days text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Plan</span>
            </Link>
            <div className="relative -top-8">
                <Link href="/alisveris-listesi" className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
                    <i className="fa-solid fa-basket-shopping text-xl"></i>
                </Link>
            </div>
            <Link href="/favoriler" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-heart text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Favoriler</span>
            </Link>
            <Link href="/profil" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-user text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Profil</span>
            </Link>
        </div>

    </div>
  );
}
