"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { toolService } from '@/services/tool-service';
import { toast } from 'sonner';
import type { WaterNeedResult } from '@/lib/types';

type Stage = 'intro' | 'input' | 'result';

export default function WaterCalculatorPage() {
  const router = useRouter();
  const { isAuthenticated, children } = useUser();
  
  const [stage, setStage] = useState<Stage>('intro');
  const [weight, setWeight] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [result, setResult] = useState<WaterNeedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill from active child if available
  useEffect(() => {
    if (isAuthenticated && children.length > 0) {
      const child = children[0];
      if (child.age_months) {
        setAgeMonths(child.age_months.toString());
      }
    }
  }, [isAuthenticated, children]);

  const handleCalculate = async () => {
    const weightNum = parseFloat(weight);
    const ageNum = parseInt(ageMonths);

    if (!weightNum || weightNum <= 0) {
      toast.error('Lütfen geçerli bir kilo girin');
      return;
    }

    if (!ageNum || ageNum < 0) {
      toast.error('Lütfen geçerli bir yaş girin');
      return;
    }

    setIsLoading(true);
    try {
      const calculated = await toolService.calculateWaterNeed(weightNum, ageNum);
      setResult(calculated);
      setStage('result');
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Hesaplama sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCalculation = () => {
    setStage('input');
    setResult(null);
    setWeight('');
    setAgeMonths('');
  };

  // Intro Stage
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-glass-water text-white text-3xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Su İhtiyacı Hesaplayıcı
            </h1>
            <p className="text-xl text-slate-600">
              Bebeğinizin kilosuna ve yaşına göre günlük sıvı ihtiyacını hesaplayın
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-baby text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">6+ Ay</h3>
              <p className="text-slate-600 text-sm">
                Ek gıdaya başlayan bebekler için su ihtiyacı hesaplaması
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-calculator text-cyan-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">WHO Önerileri</h3>
              <p className="text-slate-600 text-sm">
                Dünya Sağlık Örgütü standartlarına göre hesaplama
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-droplet text-green-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Günlük Takip</h3>
              <p className="text-slate-600 text-sm">
                Bebeğinizin günlük sıvı alımını takip etmenize yardımcı olun
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => setStage('input')}
              className="bg-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-cyan-600 transition-colors shadow-lg"
            >
              Hesaplamaya Başla
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>

          {/* WHO Info */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <i className="fa-solid fa-info-circle text-blue-600 text-xl mt-1"></i>
              <div>
                <h4 className="font-bold text-blue-900 mb-2">WHO Önerileri</h4>
                <p className="text-blue-800 text-sm mb-2">
                  Dünya Sağlık Örgütü'ne göre:
                </p>
                <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                  <li>6 aydan küçük bebekler için ek su önerilmez</li>
                  <li>Anne sütü veya formula yeterli sıvı sağlar</li>
                  <li>6 ay sonrası ek gıda ile birlikte su verilebilir</li>
                  <li>Sıcak havalarda ve ishal durumunda ihtiyaç artar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Input Stage
  if (stage === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setStage('intro')}
              className="text-cyan-600 hover:text-cyan-700 font-medium mb-4 flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Geri
            </button>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Bilgileri Girin</h2>
            <p className="text-slate-600">Bebeğinizin kilosunu ve yaşını girin</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="space-y-6">
              {/* Age */}
              <div>
                <label htmlFor="ageMonths" className="block text-sm font-bold text-slate-800 mb-2">
                  Yaş (ay) <span className="text-red-500">*</span>
                </label>
                <input
                  id="ageMonths"
                  type="number"
                  min="0"
                  max="60"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                  placeholder="Örn: 8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">6 aydan küçük bebekler için su önerilmez</p>
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-bold text-slate-800 mb-2">
                  Kilo (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Örn: 8.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={isLoading}
                className="w-full bg-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-cyan-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Hesaplanıyor...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-calculator mr-2"></i>
                    Hesapla
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Stage
  if (stage === 'result' && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-glass-water text-white text-3xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Günlük Su İhtiyacı</h2>
            <p className="text-slate-600">
              {result.age_months} aylık - {result.weight_kg} kg
            </p>
          </div>

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="mb-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <i className="fa-solid fa-triangle-exclamation text-amber-600 text-2xl mt-1"></i>
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Önemli Uyarı</h4>
                  {result.warnings.map((warning, idx) => (
                    <p key={idx} className="text-amber-800">
                      {warning}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Result Card */}
          <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-3xl p-8 text-white text-center mb-8">
            <div className="text-6xl mb-4">💧</div>
            <h3 className="text-2xl font-bold mb-4">Günlük Su İhtiyacı</h3>
            <div className="text-6xl font-bold mb-2">{result.daily_water_ml}</div>
            <div className="text-2xl opacity-90">ml</div>
            <div className="mt-6 bg-white/20 rounded-xl p-4 inline-block">
              <p className="text-sm opacity-80 mb-1">Hesaplama Formülü</p>
              <p className="font-bold">{result.formula}</p>
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-cyan-500 text-xl"></i>
                Öneriler
              </h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-cyan-500 mt-1">•</span>
                    <span className="text-slate-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-circle-info"></i>
              Önemli Bilgiler
            </h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">→</span>
                <span>Bu hesaplama ortalama koşullar içindir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">→</span>
                <span>Sıcak havalarda, fiziksel aktivite sonrası veya ishal durumunda ihtiyaç artar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">→</span>
                <span>Anne sütü veya formula da sıvı ihtiyacının bir kısmını karşılar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">→</span>
                <span>Sebze ve meyve suyu yerine temiz içme suyu tercih edin</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleNewCalculation}
              className="bg-cyan-500 text-white px-8 py-4 rounded-full font-bold hover:bg-cyan-600 transition-colors"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Yeni Hesaplama
            </button>
            <button
              onClick={() => router.push('/araclar')}
              className="bg-white border-2 border-gray-200 text-slate-700 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors"
            >
              <i className="fa-solid fa-grid mr-2"></i>
              Diğer Araçlar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
