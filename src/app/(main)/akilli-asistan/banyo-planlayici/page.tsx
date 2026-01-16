"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { sponsoredToolService } from '@/services/sponsored-tool-service';
import { toast } from 'sonner';
import SponsorBadge from '@/components/tools/SponsorBadge';
import SponsorCTA from '@/components/tools/SponsorCTA';
import type { BathPlannerConfig, BathPlannerResult } from '@/lib/types';

type Stage = 'intro' | 'input' | 'result';

// Fallback config data - API başarısız olursa kullan
const FALLBACK_CONFIG: BathPlannerConfig = {
  skin_types: [
    { id: 'normal', label: 'Normal Cilt' },
    { id: 'dry', label: 'Kuru Cilt' },
    { id: 'sensitive', label: 'Hassas Cilt' },
    { id: 'oily', label: 'Yağlı Cilt' },
  ],
  seasons: [
    { id: 'spring', label: 'İlkbahar' },
    { id: 'summer', label: 'Yaz' },
    { id: 'autumn', label: 'Sonbahar' },
    { id: 'winter', label: 'Kış' },
  ],
  frequency_options: [
    { id: '2-3', label: 'Haftada 2-3 kez', description: 'Yenidoğanlar için önerilen' },
    { id: '3-4', label: 'Haftada 3-4 kez', description: '3-6 aylık bebekler için' },
    { id: '4-5', label: 'Haftada 4-5 kez', description: '6-12 aylık bebekler için' },
    { id: 'daily', label: 'Her gün', description: '12 ay üzeri için' },
  ],
};

// Mevcut mevsimi otomatik olarak seç
const getCurrentSeason = (): string => {
  const month = new Date().getMonth(); // 0-11 (0=January, 11=December)
  if (month >= 2 && month <= 4) return 'spring';   // Mar-May
  if (month >= 5 && month <= 7) return 'summer';   // Jun-Aug
  if (month >= 8 && month <= 10) return 'autumn';  // Sep-Nov
  return 'winter'; // Dec-Feb
};

export default function BathPlannerPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<BathPlannerConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  // Form state
  const [babyAgeMonths, setBabyAgeMonths] = useState('6');
  const [skinType, setSkinType] = useState('');
  const [season, setSeason] = useState('');
  const [hasEczema, setHasEczema] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Result state
  const [result, setResult] = useState<BathPlannerResult | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      setConfigLoading(true);
      setConfigError(null);
      try {
        const data = await sponsoredToolService.getBathPlannerConfig();
        setConfig(data);
        // Set defaults
        if (data.skin_types?.length > 0) setSkinType(data.skin_types[0].id);
        if (data.seasons?.length > 0) {
          const currentSeason = getCurrentSeason();
          const hasCurrentSeason = data.seasons.some(s => s.id === currentSeason);
          setSeason(hasCurrentSeason ? currentSeason : data.seasons[0].id);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
        setConfigError('Yapılandırma yüklenirken bir hata oluştu');
        // Fallback kullan
        setConfig(FALLBACK_CONFIG);
        setSkinType(FALLBACK_CONFIG.skin_types[0].id);
        const currentSeason = getCurrentSeason();
        const hasCurrentSeason = FALLBACK_CONFIG.seasons.some(s => s.id === currentSeason);
        setSeason(hasCurrentSeason ? currentSeason : FALLBACK_CONFIG.seasons[0].id);
        toast.warning('Konfigürasyon yüklenemedi, varsayılan ayarlar kullanılıyor');
      } finally {
        setConfigLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const ageNum = parseInt(babyAgeMonths, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 36) {
      newErrors.age = 'Geçerli bir yaş değeri girin (0-36 ay)';
    }
    
    if (!skinType) {
      newErrors.skinType = 'Lütfen cilt tipi seçin';
    }
    
    if (!season) {
      newErrors.season = 'Lütfen mevsim seçin';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const planResult = await sponsoredToolService.generateBathPlan({
        baby_age_months: parseInt(babyAgeMonths, 10),
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
    setErrors({});
    if (config) {
      if (config.skin_types?.length > 0) setSkinType(config.skin_types[0].id);
      if (config.seasons?.length > 0) {
        const currentSeason = getCurrentSeason();
        const hasCurrentSeason = config.seasons.some(s => s.id === currentSeason);
        setSeason(hasCurrentSeason ? currentSeason : config.seasons[0].id);
      }
    }
    setHasEczema(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        <Link href="/akilli-asistan" className="text-gray-600">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <span className="font-display font-bold text-lg text-slate-800">Banyo Rutini Planlayıcı</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        {/* Loading skeleton */}
        {configLoading && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 h-48"></div>
            <div className="p-8 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        )}

        {/* Intro Stage */}
        {!configLoading && stage === 'intro' && (
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
                aria-label="Banyo planı oluşturmaya başla"
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
                <label htmlFor="babyAge" className="block text-sm font-bold text-slate-800 mb-2">
                  Bebeğinizin Yaşı (Ay) <span className="text-red-500">*</span>
                </label>
                <input
                  id="babyAge"
                  type="number"
                  min="0"
                  max="36"
                  value={babyAgeMonths}
                  onChange={(e) => setBabyAgeMonths(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Örn: 6"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>

              {/* Skin Type */}
              <div>
                <label htmlFor="skinType" className="block text-sm font-bold text-slate-800 mb-2">
                  Cilt Tipi <span className="text-red-500">*</span>
                </label>
                <select
                  id="skinType"
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
                {errors.skinType && (
                  <p className="text-red-500 text-sm mt-1">{errors.skinType}</p>
                )}
              </div>

              {/* Season */}
              <div>
                <label htmlFor="season" className="block text-sm font-bold text-slate-800 mb-2">
                  Mevsim <span className="text-red-500">*</span>
                </label>
                <select
                  id="season"
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
                {errors.season && (
                  <p className="text-red-500 text-sm mt-1">{errors.season}</p>
                )}
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
            {result.tips?.length > 0 && (
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
            {result.warnings?.length > 0 && (
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

            {/* Routine Steps */}
            {result.routine && result.routine.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-list-ol text-blue-500"></i>
                  Banyo Adımları
                </h3>
                <ol className="space-y-4">
                  {result.routine.map((step) => (
                    <li key={step.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Products */}
            {result.products && result.products.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-bottle-droplet text-purple-500"></i>
                  Önerilen Ürün Tipleri
                </h3>
                <div className="grid gap-3">
                  {result.products.map((product, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                      <i className="fa-solid fa-check-circle text-purple-500 mt-1"></i>
                      <div>
                        <span className="font-semibold text-slate-800">{product.type}:</span>
                        <span className="text-gray-600 ml-1">{product.recommendation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Recommendations */}
            {result.product_recommendations?.length > 0 && (
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
                href="/akilli-asistan"
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
