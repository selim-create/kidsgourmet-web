"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { sponsoredToolService } from '@/services/sponsored-tool-service';
import { toast } from 'sonner';
import SponsorCTA from '@/components/tools/SponsorCTA';
import type { AirQualityResult } from '@/lib/types';

type Stage = 'intro' | 'input' | 'result';

export default function AirQualityPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [homeType, setHomeType] = useState('apartment');
  const [hasPets, setHasPets] = useState(false);
  const [hasSmoker, setHasSmoker] = useState(false);
  const [heatingType, setHeatingType] = useState('central');
  const [season, setSeason] = useState('winter');
  const [childAgeMonths, setChildAgeMonths] = useState<string>('');
  const [hasRespiratoryIssues, setHasRespiratoryIssues] = useState(false);
  const [ventilationFrequency, setVentilationFrequency] = useState('daily');
  const [cookingFrequency, setCookingFrequency] = useState('medium');

  // Result state
  const [result, setResult] = useState<AirQualityResult | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const analysisResult = await sponsoredToolService.analyzeAirQuality({
        home_type: homeType,
        has_pets: hasPets,
        has_smoker: hasSmoker,
        heating_type: heatingType,
        season: season,
        child_age_months: childAgeMonths ? parseInt(childAgeMonths) : undefined,
        respiratory_issues: hasRespiratoryIssues,
        ventilation_frequency: ventilationFrequency,
        cooking_frequency: cookingFrequency,
      });
      setResult(analysisResult);
      setStage('result');
    } catch (error) {
      console.error('Error analyzing air quality:', error);
      toast.error('Analiz sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStage('intro');
    setResult(null);
    setHomeType('apartment');
    setHasPets(false);
    setHasSmoker(false);
    setHeatingType('central');
    setSeason('winter');
    setChildAgeMonths('');
    setHasRespiratoryIssues(false);
    setVentilationFrequency('daily');
    setCookingFrequency('medium');
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
        <span className="font-display font-bold text-lg text-slate-800">Hava Kalitesi Rehberi</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        {/* Intro Stage */}
        {stage === 'intro' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-sky-500 to-blue-500 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                <i className="fa-solid fa-wind"></i>
              </div>
              <h1 className="font-display font-bold text-3xl mb-2">Hava Kalitesi Rehberi</h1>
              <p className="text-sky-50">
                Evinizin hava kalitesini değerlendirin ve öneriler alın
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-baby text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Bebek/Çocuk Odaklı Analiz</h3>
                    <p className="text-gray-600 text-sm">Çocuğunuzun yaşına göre özelleştirilmiş değerlendirme</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-home text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Ev Ortamı Değerlendirmesi</h3>
                    <p className="text-gray-600 text-sm">Isıtma, havalandırma ve yaşam koşulları analizi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-lightbulb text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Akıllı Öneriler</h3>
                    <p className="text-gray-600 text-sm">Durumunuza özel pratik çözümler ve uyarılar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-calendar text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Mevsimsel Uyarılar</h3>
                    <p className="text-gray-600 text-sm">Mevsimlere göre özel dikkat edilmesi gerekenler</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStage('input')}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-4 rounded-xl font-bold hover:from-sky-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
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
            <div className="bg-gradient-to-br from-sky-500 to-blue-500 text-white p-6">
              <h2 className="font-display font-bold text-2xl">Bilgilerinizi Girin</h2>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Home Type */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Ev Tipi <span className="text-red-500">*</span>
                </label>
                <select
                  value={homeType}
                  onChange={(e) => setHomeType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="apartment">Apartman Dairesi</option>
                  <option value="house">Müstakil Ev</option>
                  <option value="villa">Villa</option>
                  <option value="ground_floor">Zemin Kat</option>
                </select>
              </div>

              {/* Heating Type */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Isınma Sistemi <span className="text-red-500">*</span>
                </label>
                <select
                  value={heatingType}
                  onChange={(e) => setHeatingType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="central">Merkezi Isıtma</option>
                  <option value="natural_gas">Doğalgaz Kombi</option>
                  <option value="electric">Elektrikli Sistem</option>
                  <option value="stove">Soba</option>
                  <option value="air_conditioner">Klima</option>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="spring">İlkbahar</option>
                  <option value="summer">Yaz</option>
                  <option value="autumn">Sonbahar</option>
                  <option value="winter">Kış</option>
                </select>
              </div>

              {/* Has Pets */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasPets"
                  checked={hasPets}
                  onChange={(e) => setHasPets(e.target.checked)}
                  className="w-5 h-5 text-sky-500 rounded focus:ring-2 focus:ring-sky-500"
                />
                <label htmlFor="hasPets" className="text-sm font-medium text-slate-800">
                  Evde evcil hayvan var
                </label>
              </div>

              {/* Has Smoker */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasSmoker"
                  checked={hasSmoker}
                  onChange={(e) => setHasSmoker(e.target.checked)}
                  className="w-5 h-5 text-sky-500 rounded focus:ring-2 focus:ring-sky-500"
                />
                <label htmlFor="hasSmoker" className="text-sm font-medium text-slate-800">
                  Evde sigara içen var
                </label>
              </div>

              {/* Child Age */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Çocuğunuzun Yaşı (Ay) <span className="text-gray-400 text-xs font-normal">(Opsiyonel)</span>
                </label>
                <select
                  value={childAgeMonths}
                  onChange={(e) => setChildAgeMonths(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  <option value="0">0-3 Ay (Yenidoğan)</option>
                  <option value="3">3-6 Ay</option>
                  <option value="6">6-12 Ay</option>
                  <option value="12">12-24 Ay</option>
                  <option value="24">24-36 Ay</option>
                  <option value="36">36+ Ay</option>
                </select>
              </div>

              {/* Respiratory Issues */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasRespiratoryIssues"
                  checked={hasRespiratoryIssues}
                  onChange={(e) => setHasRespiratoryIssues(e.target.checked)}
                  className="w-5 h-5 text-sky-500 rounded focus:ring-2 focus:ring-sky-500"
                />
                <label htmlFor="hasRespiratoryIssues" className="text-sm font-medium text-slate-800">
                  Çocuğumda solunum sistemi hassasiyeti/alerjisi var
                </label>
              </div>

              {/* Ventilation Frequency */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Havalandırma Sıklığı
                </label>
                <select
                  value={ventilationFrequency}
                  onChange={(e) => setVentilationFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="rarely">Nadiren (Haftada 1-2 kez)</option>
                  <option value="daily">Günlük (Günde 1-2 kez)</option>
                  <option value="multiple_daily">Sık (Günde 3+ kez)</option>
                </select>
              </div>

              {/* Cooking Frequency */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Mutfak Aktivitesi
                </label>
                <select
                  value={cookingFrequency}
                  onChange={(e) => setCookingFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="low">Düşük (Günde 1 öğün veya daha az)</option>
                  <option value="medium">Orta (Günde 2-3 öğün)</option>
                  <option value="high">Yüksek (Sürekli pişirme, fırın kullanımı)</option>
                </select>
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
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 text-white py-3 rounded-xl font-bold hover:from-sky-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? 'Analiz Ediliyor...' : 'Analiz Et'}
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
              <div className="bg-gradient-to-br from-sky-500 to-blue-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-2xl mb-1">Hava Kalitesi Analizi</h2>
                  </div>
                  <div className="text-4xl">
                    <i className="fa-solid fa-wind"></i>
                  </div>
                </div>
              </div>

              {/* Risk Level */}
              <div className="p-6">
                {/* Risk Score Gauge */}
                <div className="relative mb-6">
                  {/* Gauge Background */}
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${
                        result.risk_level === 'low' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        result.risk_level === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                      style={{ width: `${result.risk_score}%` }}
                    />
                  </div>
                  
                  {/* Score Labels */}
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
                
                {/* Risk Level Display */}
                <div className={`rounded-xl p-6 text-center ${getRiskColor(result.risk_level)}`}>
                  <div className="text-5xl mb-2">
                    {result.risk_level === 'low' && <i className="fa-solid fa-face-smile text-green-500"></i>}
                    {result.risk_level === 'medium' && <i className="fa-solid fa-face-meh text-yellow-500"></i>}
                    {result.risk_level === 'high' && <i className="fa-solid fa-face-frown text-red-500"></i>}
                  </div>
                  <div className="text-3xl font-bold mb-1">{getRiskLabel(result.risk_level)}</div>
                  <div className="text-lg opacity-75">Risk Skoru: {result.risk_score}/100</div>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            {result.risk_factors?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                  Risk Faktörleri
                </h3>
                <div className="space-y-3">
                  {result.risk_factors.map((item, index) => (
                    <div key={index} className={`rounded-xl p-4 border-l-4 ${
                      item.severity === 'high' ? 'bg-red-50 border-red-500' :
                      item.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-gray-50 border-gray-300'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {/* Category Icon */}
                          {item.category === 'heating' && <i className="fa-solid fa-fire text-orange-500"></i>}
                          {item.category === 'environment' && <i className="fa-solid fa-house text-blue-500"></i>}
                          {item.category === 'lifestyle' && <i className="fa-solid fa-person text-purple-500"></i>}
                          {item.category === 'external' && <i className="fa-solid fa-cloud text-gray-500"></i>}
                          <span className="font-semibold text-slate-800">{item.factor}</span>
                        </div>
                        {/* Severity Badge */}
                        {item.severity && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            item.severity === 'high' ? 'bg-red-100 text-red-700' :
                            item.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.severity === 'high' ? 'Yüksek' : item.severity === 'medium' ? 'Orta' : 'Düşük'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">{item.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {/* Indoor Tips */}
            {result.indoor_tips && result.indoor_tips.length > 0 && (
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-sky-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-house-chimney text-sky-500"></i>
                  İç Mekan Hava Kalitesi İpuçları
                </h3>
                <ul className="space-y-2">
                  {result.indoor_tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sky-900">
                      <i className="fa-solid fa-leaf text-sky-500 mt-1 flex-shrink-0"></i>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Seasonal Alerts */}
            {result.seasonal_alerts?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-amber-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-calendar-day"></i>
                  Mevsimsel Uyarılar
                </h3>
                <ul className="space-y-2">
                  {result.seasonal_alerts.map((alert, index) => (
                    <li key={index} className="flex items-start gap-2 text-amber-900">
                      <i className="fa-solid fa-exclamation-circle mt-1 flex-shrink-0"></i>
                      <span className="text-sm">{alert}</span>
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
                Yeni Analiz
              </button>
              <Link
                href="/akilli-asistan"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-bold text-center hover:from-sky-600 hover:to-blue-600 transition-all duration-300"
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
              Bu araç pediatri uzmanları ve çevre sağlığı uzmanları tarafından kontrol edilmiştir.
              Ancak bu araç tıbbi tanı yerine geçmez, kesin bilgi için doktorunuza danışın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
