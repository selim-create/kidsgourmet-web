"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { sponsoredToolService } from '@/services/sponsored-tool-service';
import { toast } from 'sonner';
import SponsorCTA from '@/components/tools/SponsorCTA';
import type { DiaperCalculatorResult, RashRiskResult } from '@/lib/types';

type Stage = 'intro' | 'input' | 'result';
type Tab = 'diaper' | 'rash';

export default function DiaperCalculatorClient() {
  const [stage, setStage] = useState<Stage>('intro');
  const [activeTab, setActiveTab] = useState<Tab>('diaper');
  const [isLoading, setIsLoading] = useState(false);

  // Diaper Calculator Form state
  const [babyWeightKg, setBabyWeightKg] = useState('');
  const [babyAgeMonths, setBabyAgeMonths] = useState('6');
  const [dailyChanges, setDailyChanges] = useState('6');

  // Rash Risk Form state
  const [changeFrequency, setChangeFrequency] = useState('3');
  const [nightDiaperHours, setNightDiaperHours] = useState('10');
  const [humidityLevel, setHumidityLevel] = useState('normal');
  const [hasDiarrhea, setHasDiarrhea] = useState(false);

  // Result state
  const [diaperResult, setDiaperResult] = useState<DiaperCalculatorResult | null>(null);
  const [rashResult, setRashResult] = useState<RashRiskResult | null>(null);

  const handleCalculateDiaper = async () => {
    if (!babyWeightKg || !babyAgeMonths || !dailyChanges) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sponsoredToolService.calculateDiaperNeeds({
        baby_weight_kg: parseFloat(babyWeightKg),
        baby_age_months: parseInt(babyAgeMonths),
        daily_changes: parseInt(dailyChanges),
      });
      setDiaperResult(result);
      setStage('result');
      setActiveTab('diaper');
    } catch (error) {
      console.error('Error calculating diaper needs:', error);
      toast.error('Hesaplama sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeRash = async () => {
    if (!changeFrequency || !nightDiaperHours || !humidityLevel) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sponsoredToolService.analyzeRashRisk({
        change_frequency: parseFloat(changeFrequency),
        night_diaper_hours: parseFloat(nightDiaperHours),
        humidity_level: humidityLevel,
        has_diarrhea: hasDiarrhea,
      });
      setRashResult(result);
      setStage('result');
      setActiveTab('rash');
    } catch (error) {
      console.error('Error analyzing rash risk:', error);
      toast.error('Analiz sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStage('intro');
    setDiaperResult(null);
    setRashResult(null);
    setBabyWeightKg('');
    setBabyAgeMonths('6');
    setDailyChanges('6');
    setChangeFrequency('3');
    setNightDiaperHours('10');
    setHumidityLevel('normal');
    setHasDiarrhea(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low':
        return 'Düşük Risk';
      case 'medium':
        return 'Orta Risk';
      case 'high':
        return 'Yüksek Risk';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        <Link href="/akilli-asistan" className="text-gray-600">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <span className="font-display font-bold text-lg text-slate-800">Bez Hesaplayıcı</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        {/* Intro Stage */}
        {stage === 'intro' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                <i className="fa-solid fa-baby-carriage"></i>
              </div>
              <h1 className="font-display font-bold text-3xl mb-2">Akıllı Bez Hesaplayıcı</h1>
              <p className="text-pink-50">
                Doğru bez numarası ve aylık ihtiyacınızı öğrenin
              </p>
            </div>

            {/* Tab Selection */}
            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('diaper')}
                  className={`p-4 rounded-xl font-bold transition-all ${
                    activeTab === 'diaper'
                      ? 'bg-pink-100 text-pink-600 border-2 border-pink-500'
                      : 'bg-gray-50 text-gray-600 border-2 border-gray-200'
                  }`}
                >
                  <i className="fa-solid fa-calculator mr-2"></i>
                  Bez İhtiyacı
                </button>
                <button
                  onClick={() => setActiveTab('rash')}
                  className={`p-4 rounded-xl font-bold transition-all ${
                    activeTab === 'rash'
                      ? 'bg-pink-100 text-pink-600 border-2 border-pink-500'
                      : 'bg-gray-50 text-gray-600 border-2 border-gray-200'
                  }`}
                >
                  <i className="fa-solid fa-shield-heart mr-2"></i>
                  Pişik Riski
                </button>
              </div>
            </div>

            {/* Content based on tab */}
            <div className="p-8">
              {activeTab === 'diaper' ? (
                <>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-check text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 mb-1">Doğru Numara</h3>
                        <p className="text-gray-600 text-sm">Bebeğinizin kilosuna göre önerilen bez numarası</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-check text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 mb-1">Aylık İhtiyaç</h3>
                        <p className="text-gray-600 text-sm">Günlük ve aylık bez ihtiyacınızı hesaplayın</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-check text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 mb-1">Pratik Öneriler</h3>
                        <p className="text-gray-600 text-sm">Bez seçimi ve kullanımı hakkında ipuçları</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStage('input')}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Hesapla
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-check text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 mb-1">Risk Analizi</h3>
                        <p className="text-gray-600 text-sm">Pişik oluşma riskini değerlendirin</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-check text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 mb-1">Önleme İpuçları</h3>
                        <p className="text-gray-600 text-sm">Pişik oluşumunu engellemek için öneriler</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-check text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 mb-1">Kişiselleştirilmiş</h3>
                        <p className="text-gray-600 text-sm">Bebeğinizin özel durumuna göre değerlendirme</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStage('input')}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Analiz Et
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Input Stage */}
        {stage === 'input' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6">
              <h2 className="font-display font-bold text-2xl">
                {activeTab === 'diaper' ? 'Bez İhtiyacı Hesapla' : 'Pişik Riski Analizi'}
              </h2>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {activeTab === 'diaper' ? (
                <>
                  {/* Baby Weight */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Bebeğinizin Kilosu (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="20"
                      step="0.1"
                      value={babyWeightKg}
                      onChange={(e) => setBabyWeightKg(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Örn: 8.5"
                    />
                  </div>

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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Örn: 6"
                    />
                  </div>

                  {/* Daily Changes */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Günlük Bez Değişimi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={dailyChanges}
                      onChange={(e) => setDailyChanges(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Örn: 6"
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
                      onClick={handleCalculateDiaper}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isLoading ? 'Hesaplanıyor...' : 'Hesapla'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Change Frequency */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Bez Değişim Sıklığı (Saat) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      step="0.5"
                      value={changeFrequency}
                      onChange={(e) => setChangeFrequency(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Örn: 3"
                    />
                    <p className="text-xs text-gray-500 mt-1">Kaç saatte bir bez değiştiriyorsunuz?</p>
                  </div>

                  {/* Night Diaper Hours */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Gece Bezi Kullanım Süresi (Saat) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="14"
                      step="0.5"
                      value={nightDiaperHours}
                      onChange={(e) => setNightDiaperHours(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Örn: 10"
                    />
                  </div>

                  {/* Humidity Level */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Ortam Nem Seviyesi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={humidityLevel}
                      onChange={(e) => setHumidityLevel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="low">Düşük</option>
                      <option value="normal">Normal</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </div>

                  {/* Diarrhea */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasDiarrhea"
                      checked={hasDiarrhea}
                      onChange={(e) => setHasDiarrhea(e.target.checked)}
                      className="w-5 h-5 text-pink-500 rounded focus:ring-2 focus:ring-pink-500"
                    />
                    <label htmlFor="hasDiarrhea" className="text-sm font-medium text-slate-800">
                      Bebeğimde ishal var
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
                      onClick={handleAnalyzeRash}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isLoading ? 'Analiz Ediliyor...' : 'Analiz Et'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Result Stage - Diaper */}
        {stage === 'result' && activeTab === 'diaper' && diaperResult && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-2xl mb-1">Bez İhtiyacınız Hesaplandı!</h2>
                    <p className="text-pink-50">
                      Önerilen Numara: <strong>{diaperResult.recommended_size}</strong>
                    </p>
                  </div>
                  <div className="text-4xl">
                    <i className="fa-solid fa-baby-carriage"></i>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">{diaperResult.recommended_size}</div>
                    <div className="text-xs text-gray-600 mt-1">Numara</div>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-rose-600">{diaperResult.daily_count}</div>
                    <div className="text-xs text-gray-600 mt-1">Günlük</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{diaperResult.monthly_count}</div>
                    <div className="text-xs text-gray-600 mt-1">Aylık</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Kilo Aralığı:</strong> {diaperResult.size_range}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Önerilen Paket:</strong> {diaperResult.pack_type} ({diaperResult.monthly_packs} paket/ay)
                  </p>
                  {diaperResult.size_change_alert && (
                    <div className="mt-3 flex items-start gap-2 text-amber-700">
                      <i className="fa-solid fa-exclamation-triangle mt-0.5"></i>
                      <span className="text-sm">{diaperResult.size_change_alert}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            {diaperResult.tips?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-lightbulb text-yellow-500"></i>
                  Bez Seçimi İpuçları
                </h3>
                <ul className="space-y-2">
                  {diaperResult.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <i className="fa-solid fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sponsor CTA */}
            {diaperResult.sponsor && <SponsorCTA sponsor={diaperResult.sponsor} />}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Yeni Hesaplama
              </button>
              <Link
                href="/akilli-asistan"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-center hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
              >
                Diğer Araçlar
              </Link>
            </div>
          </div>
        )}

        {/* Result Stage - Rash Risk */}
        {stage === 'result' && activeTab === 'rash' && rashResult && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-2xl mb-1">Pişik Risk Analizi</h2>
                  </div>
                  <div className="text-4xl">
                    <i className="fa-solid fa-shield-heart"></i>
                  </div>
                </div>
              </div>

              {/* Risk Level */}
              <div className="p-6">
                <div className={`rounded-xl p-6 text-center ${getRiskColor(rashResult.risk_level)}`}>
                  <div className="text-4xl font-bold mb-2">{getRiskLabel(rashResult.risk_level)}</div>
                  <div className="text-sm opacity-75">Risk Skoru: {rashResult.risk_score}/100</div>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            {rashResult.risk_factors?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-exclamation-triangle text-amber-500"></i>
                  Risk Faktörleri
                </h3>
                <ul className="space-y-2">
                  {rashResult.risk_factors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <i className="fa-solid fa-circle text-amber-500 text-xs mt-1.5 flex-shrink-0"></i>
                      <span className="text-sm">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prevention Tips */}
            {rashResult.prevention_tips?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-shield-heart text-green-500"></i>
                  Önleme İpuçları
                </h3>
                <ul className="space-y-2">
                  {rashResult.prevention_tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <i className="fa-solid fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sponsor CTA */}
            {rashResult.sponsor && <SponsorCTA sponsor={rashResult.sponsor} />}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Yeni Analiz
              </button>
              <Link
                href="/akilli-asistan"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-center hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
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
              Bu araç pediatri uzmanları tarafından kontrol edilmiştir. 
              Ancak bu araç tıbbi tanı yerine geçmez, kesin bilgi için doktorunuza danışın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
