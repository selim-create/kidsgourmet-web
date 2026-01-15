"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { sponsoredToolService } from '@/services/sponsored-tool-service';
import { toast } from 'sonner';
import SponsorCTA from '@/components/tools/SponsorCTA';
import type { HygieneCalculatorResult } from '@/lib/types';

type Stage = 'intro' | 'input' | 'result';

export default function HygieneCalculatorPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [babyAgeMonths, setBabyAgeMonths] = useState('6');
  const [dailyDiaperChanges, setDailyDiaperChanges] = useState('6');
  const [outdoorHours, setOutdoorHours] = useState('2');
  const [mealCount, setMealCount] = useState('3');

  // Result state
  const [result, setResult] = useState<HygieneCalculatorResult | null>(null);

  const handleCalculate = async () => {
    if (!babyAgeMonths || !dailyDiaperChanges || !outdoorHours || !mealCount) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const calculatedResult = await sponsoredToolService.calculateHygieneNeeds({
        baby_age_months: parseInt(babyAgeMonths),
        daily_diaper_changes: parseInt(dailyDiaperChanges),
        outdoor_hours: parseFloat(outdoorHours),
        meal_count: parseInt(mealCount),
      });
      setResult(calculatedResult);
      setStage('result');
    } catch (error) {
      console.error('Error calculating hygiene needs:', error);
      toast.error('Hesaplama sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStage('intro');
    setResult(null);
    setBabyAgeMonths('6');
    setDailyDiaperChanges('6');
    setOutdoorHours('2');
    setMealCount('3');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        <Link href="/araclar" className="text-gray-600">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <span className="font-display font-bold text-lg text-slate-800">Hijyen Hesaplayıcı</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        {/* Intro Stage */}
        {stage === 'intro' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                <i className="fa-solid fa-hand-sparkles"></i>
              </div>
              <h1 className="font-display font-bold text-3xl mb-2">Günlük Hijyen Hesaplayıcı</h1>
              <p className="text-teal-50">
                Günlük mendil ve hijyen ürünü ihtiyacınızı hesaplayın
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Günlük İhtiyaç</h3>
                    <p className="text-gray-600 text-sm">Bebeğinizin günlük mendil kullanımını öğrenin</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Aylık Planlama</h3>
                    <p className="text-gray-600 text-sm">Haftalık ve aylık ihtiyaçlarınızı planlayın</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Çanta Önerileri</h3>
                    <p className="text-gray-600 text-sm">Dışarı çıkarken yanınızda bulundurmanız gerekenler</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStage('input')}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Hemen Başla
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* Input Stage */}
        {stage === 'input' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-6">
              <h2 className="font-display font-bold text-2xl">Bilgilerinizi Girin</h2>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Baby Age */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Bebeğinizin Yaşı (Ay) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="36"
                  value={babyAgeMonths}
                  onChange={(e) => setBabyAgeMonths(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Örn: 6"
                />
              </div>

              {/* Daily Diaper Changes */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Günlük Bez Değişimi <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={dailyDiaperChanges}
                  onChange={(e) => setDailyDiaperChanges(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Örn: 6"
                />
              </div>

              {/* Outdoor Hours */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Günlük Dış Mekan Süresi (Saat) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  step="0.5"
                  value={outdoorHours}
                  onChange={(e) => setOutdoorHours(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Örn: 2"
                />
              </div>

              {/* Meal Count */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Günlük Öğün Sayısı <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={mealCount}
                  onChange={(e) => setMealCount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Örn: 3"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStage('intro')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handleCalculate}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'Hesaplanıyor...' : 'Hesapla'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Stage */}
        {stage === 'result' && result && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-2xl mb-1">İhtiyaçlarınız Hesaplandı!</h2>
                  </div>
                  <div className="text-4xl">
                    <i className="fa-solid fa-calculator"></i>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-teal-600">{result.daily_wipes_needed}</div>
                  <div className="text-sm text-gray-600 mt-1">Günlük Mendil</div>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-600">{result.weekly_wipes_needed}</div>
                  <div className="text-sm text-gray-600 mt-1">Haftalık Mendil</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{result.monthly_wipes_needed}</div>
                  <div className="text-sm text-gray-600 mt-1">Aylık Mendil</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-lightbulb text-yellow-500"></i>
                  Öneriler
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <i className="fa-solid fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Carry Bag Essentials */}
            {result.carry_bag_essentials.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-bag-shopping text-teal-500"></i>
                  Çantanda Bulundur
                </h3>
                <ul className="space-y-2">
                  {result.carry_bag_essentials.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <i className="fa-solid fa-arrow-right text-teal-500 mt-1 flex-shrink-0"></i>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sponsor CTA */}
            {result.sponsor && <SponsorCTA sponsor={result.sponsor} />}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Yeni Hesaplama
              </button>
              <Link
                href="/araclar"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold text-center hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
              >
                Diğer Araçlar
              </Link>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-circle-info"></i>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Tahmin Niteliğinde</h4>
            <p className="text-sm text-gray-600">
              Bu hesaplama ortalama değerlere dayalıdır. Gerçek ihtiyaçlarınız bebeğinizin özel durumuna göre değişiklik gösterebilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
