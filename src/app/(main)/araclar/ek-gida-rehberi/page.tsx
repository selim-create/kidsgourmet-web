"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { ingredientService } from '@/services/ingredient-service';
import type { Ingredient } from '@/lib/types';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function EkGidaRehberiPage() {
  const router = useRouter();
  const { isAuthenticated, children } = useUser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Auto-fill age from active child
  useEffect(() => {
    if (isAuthenticated && children.length > 0) {
      const child = children[0];
      if (child.age_months) {
        setSelectedAge(child.age_months);
      }
    }
  }, [isAuthenticated, children]);

  // Load all ingredients on mount
  useEffect(() => {
    const loadIngredients = async () => {
      setIsLoading(true);
      try {
        const data = await ingredientService.getAll({ perPage: 100 });
        setIngredients(data);
        setFilteredIngredients(data);
      } catch (error) {
        console.error('Error loading ingredients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadIngredients();
  }, []);

  // Filter ingredients based on search and age
  useEffect(() => {
    if (!debouncedSearch && !selectedAge) {
      setFilteredIngredients(ingredients);
      return;
    }

    setIsSearching(true);
    
    let filtered = ingredients;

    // Filter by search query
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(ing => 
        ing.name.toLowerCase().includes(query) ||
        ing.description.toLowerCase().includes(query) ||
        ing.category?.toLowerCase().includes(query)
      );
    }

    // Filter by age if selected
    if (selectedAge !== null) {
      filtered = filtered.filter(ing => {
        const startAge = ing.start_age;
        if (!startAge) return true;
        
        // Parse start age (e.g., "+6 Ay", "6+ Ay", "9-12 Ay")
        const match = startAge.match(/(\d+)/);
        if (match) {
          const minAge = parseInt(match[1]);
          return selectedAge >= minAge;
        }
        return true;
      });
    }

    setFilteredIngredients(filtered);
    setIsSearching(false);
  }, [debouncedSearch, selectedAge, ingredients]);

  const parseAgeMonths = (startAge: string): number => {
    const match = startAge.match(/(\d+)/);
    return match ? parseInt(match[1]) : 6;
  };

  const getAllergyRiskColor = (risk: string) => {
    switch (risk) {
      case 'Düşük': return 'text-green-600 bg-green-50';
      case 'Orta': return 'text-amber-600 bg-amber-50';
      case 'Yüksek': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAllergyRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Düşük': return '✅';
      case 'Orta': return '⚠️';
      case 'Yüksek': return '🚫';
      default: return 'ℹ️';
    }
  };

  const getAgeDisplay = (ageMonths: number): string => {
    const years = Math.floor(ageMonths / 12);
    const months = ageMonths % 12;
    if (years > 0) {
      return months > 0 ? `${years} yıl ${months} ay` : `${years} yıl`;
    }
    return `${ageMonths} aylık`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        <button onClick={() => router.push('/araclar')} className="text-gray-500">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="font-display font-bold text-lg text-slate-800">Ek Gıda Rehberi</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fa-solid fa-carrot text-white"></i>
          </div>
          <h1 className="font-display font-bold text-3xl text-slate-800 mb-2">Ek Gıda Rehberi</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            "Bu besin bebeğime uygun mu?" sorusuna hızlı yanıt. Malzemeleri arayın, yaşa göre filtreleyin.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-bold text-slate-800 mb-2">
                <i className="fa-solid fa-search mr-2 text-gray-400"></i>
                Malzeme Ara
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: havuç, muz, yumurta..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Age Filter */}
            <div>
              <label htmlFor="age" className="block text-sm font-bold text-slate-800 mb-2">
                <i className="fa-solid fa-baby mr-2 text-gray-400"></i>
                Bebek Yaşı (Opsiyonel)
              </label>
              <div className="flex gap-2">
                <input
                  id="age"
                  type="number"
                  min="0"
                  max="60"
                  value={selectedAge || ''}
                  onChange={(e) => setSelectedAge(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Ay cinsinden"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {selectedAge !== null && (
                  <button
                    onClick={() => setSelectedAge(null)}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                    title="Temizle"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                )}
              </div>
              {selectedAge !== null && (
                <p className="text-xs text-gray-500 mt-1">
                  {getAgeDisplay(selectedAge)} için uygun besinler gösteriliyor
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {(searchQuery || selectedAge !== null) && (
          <div className="mb-4 text-center text-sm text-gray-600">
            {isSearching ? (
              <span><i className="fa-solid fa-spinner fa-spin mr-2"></i>Aranıyor...</span>
            ) : (
              <span>{filteredIngredients.length} besin bulundu</span>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Ingredients Grid */}
        {!isLoading && filteredIngredients.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIngredients.map((ingredient) => {
              const minAge = parseAgeMonths(ingredient.start_age);
              const isAppropriate = selectedAge === null || selectedAge >= minAge;
              
              return (
                <Link
                  key={ingredient.id}
                  href={`/malzeme-rehberi/${ingredient.slug}`}
                  className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    !isAppropriate ? 'opacity-60' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={ingredient.image || 'https://placehold.co/400x400/AED581/ffffff?text=Malzeme'}
                      alt={ingredient.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    {!isAppropriate && selectedAge !== null && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {minAge - selectedAge} ay sonra
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg text-slate-800 mb-2 group-hover:text-orange-500 transition-colors">
                      {ingredient.name}
                    </h3>
                    
                    {/* Age and Allergy Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">
                        {ingredient.start_age}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${getAllergyRiskColor(ingredient.allergy_risk)}`}>
                        {getAllergyRiskIcon(ingredient.allergy_risk)} {ingredient.allergy_risk}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {ingredient.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center text-orange-500 text-sm font-bold">
                      <span>Detayları Gör</span>
                      <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredIngredients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🔍
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-gray-500 mb-6">
              Arama kriterlerinize uygun besin bulunamadı. Farklı kelimeler deneyin.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAge(null);
              }}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-circle-info"></i>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Önemli Bilgi</h4>
            <p className="text-sm text-gray-600">
              Bu rehber genel bilgilendirme amaçlıdır. Bebeğinizin özel durumu için mutlaka pediatristinize danışın.
              Alerji riski yüksek besinleri verirken dikkatli olun ve ilk defa verdiğinizde 3-5 gün bekleyin.
            </p>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-orange-500"></i>
            İlgili Rehberler
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/araclar/bu-gida-verilir-mi" className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-orange-700 transition-colors">
              <i className="fa-solid fa-check-circle mr-1"></i> Bu Gıda Verilir mi?
            </Link>
            <Link href="/araclar/alerjen-planlayici" className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-red-700 transition-colors">
              <i className="fa-solid fa-shield mr-1"></i> Alerjen Planlayıcı
            </Link>
            <Link href="/tarifler" className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-green-700 transition-colors">
              <i className="fa-solid fa-utensils mr-1"></i> Tarifler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
