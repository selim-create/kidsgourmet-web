"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { sponsoredToolService } from '@/services/sponsored-tool-service';
import { toast } from 'sonner';
import SponsorBadge from '@/components/tools/SponsorBadge';
import SponsorCTA from '@/components/tools/SponsorCTA';
import type { BathPlannerConfig, BathPlannerResult } from '@/lib/types';

type Stage = 'intro' | 'input' | 'result';

export default function BathPlannerPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<BathPlannerConfig | null>(null);

  // Form state
  const [babyAgeMonths, setBabyAgeMonths] = useState('6');
  const [skinType, setSkinType] = useState('');
  const [season, setSeason] = useState('');
  const [hasEczema, setHasEczema] = useState(false);

  // Result state
  const [result, setResult] = useState<BathPlannerResult | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await sponsoredToolService.getBathPlannerConfig();
        setConfig(data);
        // Set defaults
        if (data.skin_types.length > 0) setSkinType(data.skin_types[0].id);
        if (data.seasons.length > 0) setSeason(data.seasons[0].id);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  const handleGenerate = async () => {
    if (!skinType || !season) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const planResult = await sponsoredToolService.generateBathPlan({
        baby_age_months: parseInt(babyAgeMonths),
        skin_type: skinType,
        season: season,
        has_eczema: hasEczema,
      });
      setResult(planResult);
      setStage('result');
    } catch (error) {
      console.error('Error generating bath plan:', error);
      toast.error('Plan oluşturulurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStage('intro');
    setResult(null);
    setBabyAgeMonths('6');
    if (config) {
      if (config.skin_types.length > 0) setSkinType(config.skin_types[0].id);
      if (config.seasons.length > 0) setSeason(config.seasons[0].id);
    }
    setHasEczema(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        <Link href="/araclar" className="text-gray-600">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <span className="font-display font-bold text-lg text-slate-800">Banyo Rutini Planlayıcı</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        {/* Intro Stage */}
        {stage === 'intro' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                <i className="fa-solid fa-bath"></i>
              </div>
              <h1 className="font-display font-bold text-3xl mb-2">Banyo Rutini Planlayıcı</h1>
              <p className="text-blue-50">
                Bebeğiniz için mevsime ve cilt tipine uygun banyo rutini oluşturun
              </p>
              {config?.sponsor && (
                <div className="mt-4 flex justify-center">
                  <SponsorBadge sponsor={config.sponsor} variant="header" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Kişiselleştirilmiş Plan</h3>
                    <p className="text-gray-600 text-sm">Bebeğinizin yaşı, cilt tipi ve mevsime göre özel öneriler</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Haftalık Takvim</h3>
                    <p className="text-gray-600 text-sm">Hangi günler banyo yapılacağını gösteren düzenli program</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Uzman Önerileri</h3>
                    <p className="text-gray-600 text-sm">Pediatri uzmanlarından cilt bakımı ipuçları</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStage('input')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
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
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6">
              <h2 className="font-display font-bold text-2xl">Bilgilerinizi Girin</h2>
              {config?.sponsor && (
                <div className="mt-2">
                  <SponsorBadge sponsor={config.sponsor} variant="header" />
                </div>
              )}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Örn: 6"
                />
              </div>

              {/* Skin Type */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Cilt Tipi <span className="text-red-500">*</span>
                </label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {config?.skin_types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Mevsim <span className="text-red-500">*</span>
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {config?.seasons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Eczema */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasEczema"
                  checked={hasEczema}
                  onChange={(e) => setHasEczema(e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="hasEczema" className="text-sm font-medium text-slate-800">
                  Bebeğimde egzama var
                </label>
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
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'Oluşturuluyor...' : 'Plan Oluştur'}
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
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-2xl mb-1">Banyo Planınız Hazır!</h2>
                    <p className="text-blue-50">
                      Önerilen Sıklık: <strong>{result.recommended_frequency}</strong>
                    </p>
                  </div>
                  <div className="text-4xl">
                    <i className="fa-solid fa-calendar-check"></i>
                  </div>
                </div>
                {result.sponsor && (
                  <div className="mt-4">
                    <SponsorBadge sponsor={result.sponsor} variant="header" />
                  </div>
                )}
              </div>

              {/* Weekly Schedule */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Haftalık Takvim</h3>
                <div className="grid grid-cols-7 gap-2">
                  {result.weekly_schedule.map((day, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl text-center ${
                        day.bath
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        {day.day.slice(0, 3)}
                      </div>
                      <div className="text-xl">
                        {day.bath ? '🛁' : '—'}
                      </div>
                      {day.note && (
                        <div className="text-xs text-gray-500 mt-1">{day.note}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-lightbulb text-yellow-500"></i>
                  Banyo İpuçları
                </h3>
                <ul className="space-y-2">
                  {result.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <i className="fa-solid fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-amber-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  Dikkat Edilmesi Gerekenler
                </h3>
                <ul className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 text-amber-900">
                      <i className="fa-solid fa-exclamation-circle mt-1 flex-shrink-0"></i>
                      <span className="text-sm">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Recommendations */}
            {result.product_recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-shopping-bag text-blue-500"></i>
                  Ürün Önerileri
                </h3>
                <ul className="space-y-2">
                  {result.product_recommendations.map((product, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <i className="fa-solid fa-arrow-right text-blue-500 mt-1 flex-shrink-0"></i>
                      <span className="text-sm">{product}</span>
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
                Yeni Plan Oluştur
              </button>
              <Link
                href="/araclar"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-center hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
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
            <h4 className="font-bold text-slate-800 mb-1">Uzman Onaylı İçerik</h4>
            <p className="text-sm text-gray-600">
              Bu araç pediatri uzmanları ve dermatolojistler tarafından kontrol edilmiştir. 
              Ancak bu araç tıbbi tanı yerine geçmez, kesin bilgi için doktorunuza danışın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
