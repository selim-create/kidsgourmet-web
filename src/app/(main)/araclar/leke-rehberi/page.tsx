"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { sponsoredToolService } from '@/services/sponsored-tool-service';
import { toast } from 'sonner';
import SponsorCTA from '@/components/tools/SponsorCTA';
import type { StainGuide } from '@/lib/types';

export default function StainEncyclopediaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<StainGuide[]>([]);
  const [selectedStain, setSelectedStain] = useState<StainGuide | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await sponsoredToolService.searchStains(query.trim());
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching stains:', error);
      toast.error('Arama sırasında bir hata oluştu');
    } finally {
      setIsSearching(false);
    }
  };

  const handleStainClick = async (slug: string) => {
    setIsLoadingDetail(true);
    try {
      const detail = await sponsoredToolService.getStainBySlug(slug);
      setSelectedStain(detail);
    } catch (error) {
      console.error('Error fetching stain detail:', error);
      toast.error('Leke detayları yüklenirken bir hata oluştu');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Kolay';
      case 'medium':
        return 'Orta';
      case 'hard':
        return 'Zor';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        {selectedStain ? (
          <>
            <button onClick={() => setSelectedStain(null)} className="text-gray-600">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <span className="font-display font-bold text-lg text-slate-800">Leke Detayı</span>
            <div className="w-6"></div>
          </>
        ) : (
          <>
            <Link href="/araclar" className="text-gray-600">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <span className="font-display font-bold text-lg text-slate-800">Leke Ansiklopedisi</span>
            <div className="w-6"></div>
          </>
        )}
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {!selectedStain ? (
          <>
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-br from-violet-500 to-purple-500 text-white p-8 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  <i className="fa-solid fa-shirt"></i>
                </div>
                <h1 className="font-display font-bold text-3xl mb-2">Leke Ansiklopedisi</h1>
                <p className="text-violet-50">
                  Bebek kıyafetlerindeki lekeler için çözüm rehberi
                </p>
              </div>

              {/* Search Bar */}
              <div className="p-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Leke türü ara... (örn: domates, çikolata, çim)"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  {isSearching && (
                    <i className="fa-solid fa-spinner fa-spin absolute right-4 top-1/2 transform -translate-y-1/2 text-violet-500"></i>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results */}
            {searchQuery.length >= 2 && (
              <div>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((stain) => (
                      <button
                        key={stain.id}
                        onClick={() => handleStainClick(stain.slug)}
                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-left border border-gray-100 hover:border-violet-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-3xl">{stain.emoji}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(stain.difficulty)}`}>
                            {getDifficultyLabel(stain.difficulty)}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">{stain.name}</h3>
                        <p className="text-xs text-gray-500 mb-3">{stain.category}</p>
                        <div className="flex items-center text-violet-500 text-sm font-semibold">
                          <span>Çözümü Gör</span>
                          <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-gray-500">
                      &quot;{searchQuery}&quot; için sonuç bulunamadı
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Initial State */}
            {searchQuery.length < 2 && (
              <div className="bg-white rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">👕</div>
                  <h2 className="font-bold text-xl text-slate-800 mb-2">Popüler Lekeler</h2>
                  <p className="text-gray-600">En çok aranan leke çözümleri</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['domates', 'çikolata', 'muz', 'havuç', 'çim', 'kaka', 'kusmuk', 'anne sütü'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch(term);
                      }}
                      className="px-4 py-3 bg-violet-50 text-violet-600 rounded-xl hover:bg-violet-100 transition-colors font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Detail View */
          <div className="space-y-6">
            {isLoadingDetail ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-violet-500 mb-4"></i>
                <p className="text-gray-600">Yükleniyor...</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-violet-500 to-purple-500 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{selectedStain.emoji}</div>
                        <div>
                          <h1 className="font-display font-bold text-3xl mb-1">{selectedStain.name}</h1>
                          <p className="text-violet-50">{selectedStain.category}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedStain.difficulty)}`}>
                        {getDifficultyLabel(selectedStain.difficulty)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-list-ol text-violet-500"></i>
                    Temizlik Adımları
                  </h3>
                  <div className="space-y-4">
                    {selectedStain.steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 mb-1">{step.instruction}</p>
                          {step.tip && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2">
                              <p className="text-sm text-yellow-800">
                                <i className="fa-solid fa-lightbulb mr-1"></i>
                                <strong>İpucu:</strong> {step.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings */}
                {selectedStain.warnings?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <h3 className="font-bold text-lg text-amber-900 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      Dikkat Edilmesi Gerekenler
                    </h3>
                    <ul className="space-y-2">
                      {selectedStain.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 text-amber-900">
                          <i className="fa-solid fa-exclamation-circle mt-1 flex-shrink-0"></i>
                          <span className="text-sm">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Ingredients */}
                {selectedStain.related_ingredients?.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-flask text-violet-500"></i>
                      Kullanılacak Malzemeler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStain.related_ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-sm"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sponsor CTA */}
                {selectedStain.sponsor && <SponsorCTA sponsor={selectedStain.sponsor} />}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedStain(null)}
                    className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Geri
                  </button>
                  <Link
                    href="/araclar"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold text-center hover:from-violet-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Diğer Araçlar
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Banner */}
        {!selectedStain && (
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Pratik Bilgiler</h4>
              <p className="text-sm text-gray-600">
                Leke temizliğinde her zaman önce küçük bir alanda test edin. 
                Hassas kumaşlar için profesyonel temizleme önerilir.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
