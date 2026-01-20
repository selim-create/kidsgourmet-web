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

  const calculatePackages = (monthlyWipes: number) => {
    const wipesPerPack = 56; // Ortalama paket boyutu
    const packsNeeded = Math.ceil(monthlyWipes / wipesPerPack);
    return packsNeeded;
  };

  const shareResult = () => {
    if (!result) return;
    
    const text = `Bebeğimin aylık mendil ihtiyacı: ${result.monthly_wipes_needed} adet! 🧴👶 @KidsGourmet ile hesapladım.`;
    const url = 'https://kidsgourmet.com/akilli-asistan/hijyen-hesaplayici';
    
    if (navigator.share) {
      navigator.share({
        title: 'Günlük Hijyen Hesaplayıcı Sonucu',
        text: text,
        url: url,
      }).then(() => {
        // Başarılı paylaşım - toast gösterme
      }).catch((error) => {
        // Kullanıcı iptal ettiyse veya hata olduysa
        if (error.name !== 'AbortError') {
          navigator.clipboard.writeText(`${text}\n${url}`);
          toast.success('Sonuç panoya kopyalandı!');
        }
        // AbortError durumunda (kullanıcı iptal etti) hiçbir şey yapma
      });
    } else {
      // Share API desteklenmiyorsa clipboard'a kopyala
      navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success('Sonuç panoya kopyalandı!');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 pt-[25px] flex items-center justify-between shadow-sm sticky top-0 z-30">
        <Link href="/akilli-asistan" className="text-gray-600">
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
                Günlük mendil ve hijyen ürünü ihtiyacınızı hesaplayın.
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
                    <p className="text-gray-600 text-sm">Dışarı çıkarken bebek çantanızı hazırlayın.</p>
                  </div>
                </div>
              </div>

              {/* Example Calculation Teaser */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-slate-800 mb-3 text-center">Örnek Hesaplama</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-teal-600">~24</div>
                    <div className="text-xs text-gray-600 mt-1">Günlük</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-600">~168</div>
                    <div className="text-xs text-gray-600 mt-1">Haftalık</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">~720</div>
                    <div className="text-xs text-gray-600 mt-1">Aylık</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  6 aylık bebek, günde 6 bez değişimi örneği
                </p>
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
                <p className="mt-1 text-xs text-gray-500">
                  <i className="fa-solid fa-circle-info mr-1"></i>
                  0-36 ay arası bebekler için uygundur
                </p>
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
                <p className="mt-1 text-xs text-gray-500">
                  <i className="fa-solid fa-lightbulb mr-1"></i>
                  Önerilen: 0-3 ay → 8-10, 3-6 ay → 6-8, 6+ ay → 5-6 kez
                </p>
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
                <p className="mt-1 text-xs text-gray-500">
                  <i className="fa-solid fa-circle-info mr-1"></i>
                  Park, alışveriş, ziyaret gibi dışarı çıktığınız ortalama süre
                </p>
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
                <p className="mt-1 text-xs text-gray-500">
                  <i className="fa-solid fa-lightbulb mr-1"></i>
                  Ara öğünler dahil tüm beslenme sayısı
                </p>
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

              {/* Package Calculation */}
              <div className="px-6 pb-6">
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    ~{calculatePackages(result.monthly_wipes_needed)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Paket/Ay (56&apos;lık)</div>
                  <p className="text-xs text-gray-500 mt-2">
                    Ortalama paket boyutuna göre aylık ihtiyacınız
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Progress Bars */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-simple text-teal-500"></i>
                İhtiyaç Dağılımı
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Günlük</span>
                    <span className="font-bold text-teal-600">{result.daily_wipes_needed} adet</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((result.daily_wipes_needed / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Haftalık</span>
                    <span className="font-bold text-cyan-600">{result.weekly_wipes_needed} adet</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((result.weekly_wipes_needed / 350) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Aylık</span>
                    <span className="font-bold text-blue-600">{result.monthly_wipes_needed} adet</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((result.monthly_wipes_needed / 1500) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
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
            {result.carry_bag_essentials?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-bag-shopping text-teal-500"></i>
                  Bebek Çantası Kontrol Listesi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.carry_bag_essentials.map((item, index) => (
                    <label 
                      key={index} 
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-teal-500 rounded focus:ring-teal-500" 
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  <i className="fa-solid fa-circle-info mr-1"></i>
                  Hazırladığınız öğeleri işaretleyebilirsiniz
                </p>
              </div>
            )}

            {/* Sponsor CTA */}
            {result.sponsor && <SponsorCTA sponsor={result.sponsor} />}

            {/* Enhanced Sponsor Product Recommendation (if sponsor exists) */}
            {result.sponsor && result.sponsor.is_sponsored && (
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Sponsor Önerisi
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {result.sponsor.sponsor_logo && (
                    <img 
                      src={result.sponsor.sponsor_logo} 
                      alt={result.sponsor.sponsor_name} 
                      className="h-12 object-contain"
                    />
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-sm text-gray-700">{result.sponsor.sponsor_tagline}</p>
                  </div>
                  <a 
                    href={result.sponsor.sponsor_cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-600 transition-colors"
                  >
                    {result.sponsor.sponsor_cta_text || 'İncele'}
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={shareResult}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-bold"
              >
                <i className="fa-solid fa-share-nodes"></i>
                Paylaş
              </button>
              <button
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Yeni Hesaplama
              </button>
              <Link
                href="/akilli-asistan"
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
