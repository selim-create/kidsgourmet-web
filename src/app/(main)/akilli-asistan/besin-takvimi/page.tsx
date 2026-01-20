"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { toolService } from '@/services/tool-service';
import { ingredientService } from '@/services/ingredient-service';
import { toast } from 'sonner';
import type { FoodTrial, FoodTrialInput, Ingredient } from '@/lib/types';

export default function BesinTakvimiPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, activeChild } = useUser();
  const [trials, setTrials] = useState<FoodTrial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [newTrialDate, setNewTrialDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTrialForm, setNewTrialForm] = useState<'puree' | 'finger_food' | 'mixed'>('puree');
  const [newTrialReaction, setNewTrialReaction] = useState<'none' | 'mild' | 'moderate' | 'severe'>('none');
  const [newTrialNotes, setNewTrialNotes] = useState('');
  const [newTrialRating, setNewTrialRating] = useState<number>(0);
  
  // Ingredient autocomplete state
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [ingredientSuggestions, setIngredientSuggestions] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Detail modal state
  const [selectedTrial, setSelectedTrial] = useState<FoodTrial | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(d.setDate(diff));
  }

  function getWeekDates(weekStart: Date): Date[] {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  const loadTrials = useCallback(async () => {
    if (!activeChild) return;

    setIsLoading(true);
    setError(null);
    try {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const data = await toolService.getFoodTrials(
        activeChild.id,
        currentWeekStart.toISOString().split('T')[0],
        weekEnd.toISOString().split('T')[0]
      );
      setTrials(data);
    } catch (error) {
      console.error('Load trials error:', error);
      setError('Besin denemeleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setIsLoading(false);
    }
  }, [activeChild, currentWeekStart]);

  useEffect(() => {
    if (authLoading) return; // Wait for auth check to complete
    
    if (!isAuthenticated) {
      router.push('/login?redirect=/araclar/besin-takvimi');
      return;
    }

    if (activeChild) {
      loadTrials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, activeChild, currentWeekStart, loadTrials]);

  // Ingredient search effect
  useEffect(() => {
    const searchIngredients = async () => {
      if (ingredientSearch.length < 2) {
        setIngredientSuggestions([]);
        return;
      }
      try {
        const results = await ingredientService.search(ingredientSearch);
        setIngredientSuggestions(results.slice(0, 5));
      } catch (error) {
        console.error('Search error:', error);
      }
    };
    const debounce = setTimeout(searchIngredients, 300);
    return () => clearTimeout(debounce);
  }, [ingredientSearch]);

  const handleAddTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChild) return;

    const finalName = selectedIngredient ? selectedIngredient.name : ingredientSearch;
    
    if (!finalName.trim()) {
      toast.error('Lütfen besin adı girin');
      return;
    }

    const trialInput: FoodTrialInput = {
      child_id: activeChild.id,
      ingredient_id: selectedIngredient?.id,
      ingredient_name: finalName,
      trial_date: newTrialDate,
      form: newTrialForm,
      reaction: newTrialReaction,
      reaction_notes: newTrialNotes || undefined,
      rating: newTrialRating || undefined,
    };

    try {
      await toolService.addFoodTrial(trialInput);
      toast.success('Besin denemesi eklendi!');
      setShowAddModal(false);
      resetForm();
      loadTrials();
    } catch (error) {
      console.error('Add trial error:', error);
      toast.error('Besin denemesi eklenemedi');
    }
  };

  const resetForm = () => {
    setNewTrialDate(new Date().toISOString().split('T')[0]);
    setNewTrialForm('puree');
    setNewTrialReaction('none');
    setNewTrialNotes('');
    setNewTrialRating(0);
    setIngredientSearch('');
    setSelectedIngredient(null);
    setIngredientSuggestions([]);
    setShowSuggestions(false);
  };

  const handleDeleteTrial = async (trialId: string) => {
    if (!confirm('Bu denemeyi silmek istediğinizden emin misiniz?')) return;
    
    try {
      await toolService.deleteFoodTrial(trialId);
      toast.success('Deneme silindi');
      setShowDetailModal(false);
      setSelectedTrial(null);
      loadTrials();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Deneme silinemedi');
    }
  };

  const getTrialsForDate = (date: Date): FoodTrial[] => {
    const dateStr = date.toISOString().split('T')[0];
    return trials.filter(trial => trial.trial_date === dateStr);
  };

  const getReactionBadge = (reaction?: string) => {
    switch (reaction) {
      case 'none': return { color: 'bg-green-100 text-green-700', text: '✓ İyi' };
      case 'mild': return { color: 'bg-yellow-100 text-yellow-700', text: '⚠ Hafif' };
      case 'moderate': return { color: 'bg-orange-100 text-orange-700', text: '⚠️ Orta' };
      case 'severe': return { color: 'bg-red-100 text-red-700', text: '🚨 Şiddetli' };
      default: return { color: 'bg-gray-100 text-gray-700', text: '?' };
    }
  };

  const getFormEmoji = (form: string) => {
    switch (form) {
      case 'puree': return '🥄';
      case 'finger_food': return '✋';
      case 'mixed': return '🍽️';
      default: return '🍴';
    }
  };

  const weekDates = getWeekDates(currentWeekStart);
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const stats = {
    total: trials.length,
    newThisWeek: trials.filter(t => t.is_new).length,
    reactions: trials.filter(t => t.reaction && t.reaction !== 'none').length,
  };

  // Show loading state while checking auth
  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-gray-400 mb-4"></i>
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!activeChild) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-orange-500">
            <i className="fa-solid fa-baby"></i>
          </div>
          <h2 className="font-bold text-xl text-slate-800 mb-2">Çocuk Profili Gerekli</h2>
          <p className="text-gray-600 mb-6">
            Besin takvimi kullanmak için önce bir çocuk profili oluşturmalısınız.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Dashboard&apos;a Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30 pt-[25px]">
        <button onClick={() => router.push('/araclar')} className="text-gray-500">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="font-display font-bold text-lg text-slate-800">Besin Takvimi</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-[2rem] p-8 md:p-12 text-white mb-6 shadow-lg shadow-orange-200/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h1 className="font-display font-bold text-3xl">Besin Deneme Takvimi</h1>
                <p className="opacity-90">{activeChild.name} için</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-bold transition-colors"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Yeni Ekle
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-800 mb-1">Bir Hata Oluştu</h4>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button 
              onClick={() => { setError(null); loadTrials(); }}
              className="text-red-500 hover:text-red-700"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-utensils text-green-500 text-xl"></i>
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-sm text-gray-500 mt-1">Bu Hafta</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-sparkles text-blue-500 text-xl"></i>
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.newThisWeek}</div>
            <div className="text-sm text-gray-500 mt-1">Yeni Gıda</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-exclamation-triangle text-amber-500 text-xl"></i>
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.reactions}</div>
            <div className="text-sm text-gray-500 mt-1">Reaksiyon</div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              const prevWeek = new Date(currentWeekStart);
              prevWeek.setDate(prevWeek.getDate() - 7);
              setCurrentWeekStart(prevWeek);
            }}
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="font-bold text-slate-800">
            {currentWeekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' - '}
            {weekDates[6].toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={() => {
              const nextWeek = new Date(currentWeekStart);
              nextWeek.setDate(nextWeek.getDate() + 7);
              setCurrentWeekStart(nextWeek);
            }}
            className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-px bg-gray-200">
              {/* Header skeleton */}
              {dayNames.map((day, idx) => (
                <div key={idx} className="bg-gray-50 p-3 text-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div>
                </div>
              ))}
              {/* Date cells skeleton */}
              {Array(7).fill(0).map((_, idx) => (
                <div key={idx} className="bg-white p-2 sm:p-4 min-h-[100px] sm:min-h-[140px]">
                  <div className="h-4 w-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !error && trials.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-seedling text-orange-500 text-3xl"></i>
            </div>
            <h3 className="font-display font-bold text-xl text-slate-800 mb-2">
              Henüz Besin Denemesi Yok
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Bu hafta için henüz besin denemesi eklenmemiş. Yeni bir deneme ekleyerek başlayın!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200/50"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              İlk Denemeyi Ekle
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-px bg-gray-200">
              {/* Header Row */}
              {dayNames.map((day, idx) => (
                <div key={idx} className="bg-gray-50 p-3 text-center font-bold text-sm text-gray-700">
                  {day}
                </div>
              ))}

              {/* Date Cells */}
              {weekDates.map((date, idx) => {
                const dayTrials = getTrialsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={idx}
                    className={`bg-white p-2 sm:p-4 min-h-[100px] sm:min-h-[140px] hover:bg-gray-50 transition-colors cursor-pointer group ${
                      isToday ? 'ring-2 ring-orange-400 ring-inset' : ''
                    }`}
                    onClick={() => {
                      setNewTrialDate(date.toISOString().split('T')[0]);
                      setShowAddModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-bold ${isToday ? 'text-orange-500' : 'text-gray-700'}`}>
                        {date.getDate()}
                      </span>
                      <button 
                        className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-100 hover:text-orange-500 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewTrialDate(date.toISOString().split('T')[0]);
                          setShowAddModal(true);
                        }}
                      >
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {dayTrials.map((trial) => {
                        const reactionBadge = getReactionBadge(trial.reaction);
                        return (
                          <div
                            key={trial.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTrial(trial);
                              setShowDetailModal(true);
                            }}
                            className={`text-xs p-2.5 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${
                              trial.is_new 
                                ? 'bg-blue-50 border-blue-200 hover:border-blue-300' 
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-base">{getFormEmoji(trial.form)}</span>
                              <span className="font-semibold text-slate-700 truncate flex-1">{trial.ingredient_name}</span>
                              {trial.is_new && (
                                <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded-full font-bold">YENİ</span>
                              )}
                            </div>
                            {trial.reaction && trial.reaction !== 'none' && (
                              <div className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full ${reactionBadge.color}`}>
                                {reactionBadge.text}
                              </div>
                            )}
                            {trial.rating && (
                              <div className="flex gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span key={star} className={`text-[10px] ${star <= (trial.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Trial Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-plus text-orange-500"></i>
                </div>
                <h3 className="font-display font-bold text-xl text-slate-800">Yeni Besin Denemesi</h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-times text-gray-500"></i>
              </button>
            </div>

            <form onSubmit={handleAddTrial} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Besin Adı <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedIngredient ? selectedIngredient.name : ingredientSearch}
                    onChange={(e) => {
                      setIngredientSearch(e.target.value);
                      setSelectedIngredient(null);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Örn: Elma, Havuç... (aramaya başlayın)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showSuggestions && ingredientSuggestions.length > 0 && !selectedIngredient && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {ingredientSuggestions.map((ingredient) => (
                        <button
                          key={ingredient.id}
                          type="button"
                          onClick={() => {
                            setSelectedIngredient(ingredient);
                            setIngredientSearch('');
                            setShowSuggestions(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                        >
                          <img 
                            src={ingredient.image || 'https://placehold.co/400x400/AED581/ffffff?text=Malzeme'} 
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
                  
                  {/* Selected Ingredient Display */}
                  {selectedIngredient && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedIngredient.image || 'https://placehold.co/400x400/AED581/ffffff?text=Malzeme'} 
                          alt={selectedIngredient.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-slate-800">{selectedIngredient.name}</div>
                          <div className="text-xs text-gray-600">{selectedIngredient.start_age}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIngredient(null);
                          setIngredientSearch('');
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Rehberdeki malzemelerden seçebilir veya kendiniz yazabilirsiniz
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={newTrialDate}
                  onChange={(e) => setNewTrialDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Form
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'puree' as const, label: '🥄 Püre' },
                    { value: 'finger_food' as const, label: '✋ Parmak' },
                    { value: 'mixed' as const, label: '🍽️ Karma' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewTrialForm(option.value)}
                      className={`py-2 px-3 rounded-lg border-2 transition-all ${
                        newTrialForm === option.value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Reaksiyon
                </label>
                <select
                  value={newTrialReaction}
                  onChange={(e) => setNewTrialReaction(e.target.value as 'none' | 'mild' | 'moderate' | 'severe')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="none">✓ Yok / İyi</option>
                  <option value="mild">⚠ Hafif</option>
                  <option value="moderate">⚠️ Orta</option>
                  <option value="severe">🚨 Şiddetli</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Notlar (Opsiyonel)
                </label>
                <textarea
                  value={newTrialNotes}
                  onChange={(e) => setNewTrialNotes(e.target.value)}
                  rows={3}
                  placeholder="Reaksiyon detayları, beğenme durumu..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Beğeni (Opsiyonel)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewTrialRating(star)}
                      className={`text-2xl ${
                        star <= newTrialRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-100 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-200/50"
                >
                  <i className="fa-solid fa-check mr-2"></i>
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTrial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl text-slate-800">Deneme Detayı</h3>
              <button
                onClick={() => { setShowDetailModal(false); setSelectedTrial(null); }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-times text-gray-500"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <span className="text-3xl">{getFormEmoji(selectedTrial.form)}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-800">{selectedTrial.ingredient_name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedTrial.trial_date).toLocaleDateString('tr-TR', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </p>
                </div>
                {selectedTrial.is_new && (
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-bold">YENİ</span>
                )}
              </div>
              
              {/* Reaksiyon */}
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                <span className="text-sm text-gray-600">Reaksiyon</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getReactionBadge(selectedTrial.reaction).color}`}>
                  {getReactionBadge(selectedTrial.reaction).text}
                </span>
              </div>
              
              {/* Form */}
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                <span className="text-sm text-gray-600">Sunum Şekli</span>
                <span className="text-sm font-medium text-slate-700">
                  {selectedTrial.form === 'puree' && '🥄 Püre'}
                  {selectedTrial.form === 'finger_food' && '✋ Parmak Yiyecek'}
                  {selectedTrial.form === 'mixed' && '🍽️ Karma'}
                </span>
              </div>
              
              {/* Rating */}
              {selectedTrial.rating && (
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                  <span className="text-sm text-gray-600">Beğeni</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-lg ${star <= (selectedTrial.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notlar */}
              {selectedTrial.reaction_notes && (
                <div className="p-3 border border-gray-100 rounded-xl">
                  <span className="text-sm text-gray-600 block mb-2">Notlar</span>
                  <p className="text-sm text-slate-700">{selectedTrial.reaction_notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDeleteTrial(selectedTrial.id)}
                className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
              >
                <i className="fa-solid fa-trash mr-2"></i>
                Sil
              </button>
              <button
                onClick={() => { setShowDetailModal(false); setSelectedTrial(null); }}
                className="flex-1 bg-gray-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
