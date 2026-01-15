"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ingredientService } from '@/services/ingredient-service';
import { toast } from 'sonner';
import type { Ingredient } from '@/lib/types';

export default function BuGidaVerilirMiPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [babyAgeMonths, setBabyAgeMonths] = useState<number>(6);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const searchIngredients = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await ingredientService.search(searchQuery);
        setSuggestions(results.slice(0, 5));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchIngredients, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setSearchQuery(ingredient.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const checkSuitability = () => {
    if (!selectedIngredient) {
      toast.error('Lütfen bir gıda seçin');
      return null;
    }

    const startAgeStr = selectedIngredient.start_age || '+6 Ay';
    const startAgeMatch = startAgeStr.match(/\d+/);
    const startAgeMonths = startAgeMatch ? parseInt(startAgeMatch[0]) : 6;

    if (babyAgeMonths >= startAgeMonths) {
      return {
        status: 'suitable',
        icon: '✅',
        title: 'Uygun',
        color: 'green',
        message: `${selectedIngredient.name} bebeğiniz için uygundur.`
      };
    } else if (babyAgeMonths >= startAgeMonths - 1) {
      return {
        status: 'careful',
        icon: '⚠️',
        title: 'Dikkatli Ver',
        color: 'yellow',
        message: `${selectedIngredient.name} için önerilen minimum yaş ${startAgeStr}. Bebeğiniz neredeyse bu yaşta.`
      };
    } else {
      return {
        status: 'wait',
        icon: '❌',
        title: 'Henüz Değil',
        color: 'red',
        message: `${selectedIngredient.name} için önerilen minimum yaş ${startAgeStr}. Bebeğinizin daha büyümesini bekleyin.`
      };
    }
  };

  const result = selectedIngredient ? checkSuitability() : null;

  const getAllergyColor = (risk: string) => {
    switch (risk) {
      case 'Yüksek': return 'text-red-600 bg-red-50 border-red-200';
      case 'Orta': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        <button onClick={() => router.push('/araclar')} className="text-gray-500">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="font-display font-bold text-lg text-slate-800">Bu Gıda Verilir mi?</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-[2rem] p-8 md:p-12 text-white text-center mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <h1 className="font-display font-bold text-3xl mb-3">Bu Gıda Verilir mi?</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Bebeğinize hangi gıdayı ne zaman verebileceğinizi öğrenin
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-8 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ingredient Search */}
            <div className="relative">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Gıda Adı <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                    setSelectedIngredient(null);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Örn: Elma, Havuç, Yumurta..."
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  {isSearching ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fa-solid fa-search"></i>
                  )}
                </div>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((ingredient) => (
                    <button
                      key={ingredient.id}
                      onClick={() => handleSelectIngredient(ingredient)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                    >
                      <img 
                        src={ingredient.image} 
                        alt={ingredient.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-slate-800">{ingredient.name}</div>
                        <div className="text-xs text-gray-500">{ingredient.start_age}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Baby Age */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Bebeğinizin Yaşı (ay) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="36"
                value={babyAgeMonths}
                onChange={(e) => setBabyAgeMonths(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                0-36 ay arası bir değer girin
              </p>
            </div>
          </div>
        </div>

        {/* Result Card */}
        {result && selectedIngredient && (
          <div className="animate-fade-in">
            {/* Status Banner */}
            <div className={`rounded-2xl p-6 mb-6 ${
              result.color === 'green' ? 'bg-green-50 border-2 border-green-200' :
              result.color === 'yellow' ? 'bg-amber-50 border-2 border-amber-200' :
              'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">{result.icon}</div>
                <div className="flex-1">
                  <h3 className={`font-bold text-2xl mb-1 ${
                    result.color === 'green' ? 'text-green-800' :
                    result.color === 'yellow' ? 'text-amber-800' :
                    'text-red-800'
                  }`}>
                    {result.title}
                  </h3>
                  <p className={`${
                    result.color === 'green' ? 'text-green-700' :
                    result.color === 'yellow' ? 'text-amber-700' :
                    'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Ingredient Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden mb-6">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100">
                <img 
                  src={selectedIngredient.image}
                  alt={selectedIngredient.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-display font-bold text-2xl text-slate-800">
                    {selectedIngredient.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {selectedIngredient.start_age}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded-full font-medium border ${getAllergyColor(selectedIngredient.allergy_risk)}`}>
                      {selectedIngredient.allergy_risk} Alerji Riski
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Preparation Methods */}
                {selectedIngredient.prep_by_age && selectedIngredient.prep_by_age.length > 0 && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-utensils text-orange-500"></i>
                      Hazırlama Yöntemleri
                    </h3>
                    <div className="space-y-3">
                      {selectedIngredient.prep_by_age.map((prep, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-slate-800">{prep.age}</span>
                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                              {prep.method}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{prep.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {selectedIngredient.benefits && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-heart text-red-500"></i>
                      Faydaları
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedIngredient.benefits}
                    </p>
                  </div>
                )}

                {/* Pro Tips */}
                {selectedIngredient.pro_tips && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-lightbulb"></i>
                      Püf Noktaları
                    </h3>
                    <p className="text-sm text-blue-700">
                      {selectedIngredient.pro_tips}
                    </p>
                  </div>
                )}

                {/* Storage Tips */}
                {selectedIngredient.storage_tips && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-box text-purple-500"></i>
                      Saklama İpuçları
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedIngredient.storage_tips}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push(`/malzeme-rehberi/${selectedIngredient.slug}`)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                <i className="fa-solid fa-info-circle mr-2"></i>
                Detaylı Bilgi
              </button>
              <button
                onClick={() => {
                  setSelectedIngredient(null);
                  setSearchQuery('');
                  setBabyAgeMonths(6);
                }}
                className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                <i className="fa-solid fa-rotate-right mr-2"></i>
                Yeni Arama
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedIngredient && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-gray-400">
              <i className="fa-solid fa-apple-whole"></i>
            </div>
            <h3 className="font-bold text-slate-800 text-xl mb-2">Gıda Arayın</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Yukarıdaki arama kutusundan bir gıda arayın ve bebeğinize uygun olup olmadığını öğrenin
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <i className="fa-solid fa-info-circle text-amber-600 text-xl mt-1"></i>
            <div>
              <h4 className="font-bold text-amber-900 mb-2">Önemli Not</h4>
              <p className="text-amber-800 text-sm leading-relaxed">
                Bu araç sadece genel bilgilendirme amaçlıdır. Her bebeğin gelişimi farklıdır. 
                Bebeğinize yeni bir gıda vermeden önce mutlaka pediatristinize danışın. 
                Özellikle alerji riski yüksek gıdalarda dikkatli olun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
