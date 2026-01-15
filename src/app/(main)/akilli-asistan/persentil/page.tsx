"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { toolService } from '@/services/tool-service';
import { setToken } from '@/lib/api';
import { toast } from 'sonner';
import PercentileCard from '@/components/tools/PercentileCard';
import type { 
  PercentileResult,
  PercentileMeasurement,
  PercentileRedFlag,
  Child
} from '@/lib/types';

type Stage = 'intro' | 'input' | 'result';

export default function PercentileCalculatorPage() {
  const router = useRouter();
  const { isAuthenticated, children, refreshUser } = useUser();
  
  const [stage, setStage] = useState<Stage>('intro');
  const [isLoading, setIsLoading] = useState(false);
  
  // Input form state
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  
  // Result state
  const [result, setResult] = useState<PercentileResult | null>(null);
  
  // Modals
  const [showRegistration, setShowRegistration] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  
  // Registration form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regChildName, setRegChildName] = useState('');
  const [regChildBirthDate, setRegChildBirthDate] = useState('');

  // Eğer kayıtlı kullanıcı ve aktif çocuk varsa bilgileri otomatik doldur
  useEffect(() => {
    if (isAuthenticated && children.length > 0) {
      const child = children[0];
      if (child.birth_date) {
        setBirthDate(child.birth_date);
      }
      if (child.gender && child.gender !== 'unspecified') {
        setGender(child.gender as 'male' | 'female');
      }
    }
  }, [isAuthenticated, children]);

  const calculateAgeInDays = (birthDateStr: string, measureDateStr: string): number => {
    const birth = new Date(birthDateStr);
    const measure = new Date(measureDateStr);
    return Math.floor((measure.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleCalculate = async () => {
    // Validation
    if (!birthDate) {
      toast.error('Doğum tarihi gereklidir');
      return;
    }
    if (!weight && !height) {
      toast.error('En az kilo veya boy girmelisiniz');
      return;
    }

    const ageInDays = calculateAgeInDays(birthDate, measurementDate);
    if (ageInDays < 0) {
      toast.error('Ölçüm tarihi doğum tarihinden önce olamaz');
      return;
    }
    if (ageInDays > 1826) { // 5 yaş = ~1826 gün
      toast.error('WHO büyüme standartları 0-5 yaş için geçerlidir');
      return;
    }

    setIsLoading(true);
    try {
      const measurement: PercentileMeasurement = {
        gender,
        birth_date: birthDate,
        measurement_date: measurementDate,
        weight_kg: weight ? parseFloat(weight) : undefined,
        height_cm: height ? parseFloat(height) : undefined,
        head_circumference_cm: headCircumference ? parseFloat(headCircumference) : undefined,
      };

      const calculatedResult = await toolService.calculatePercentile(measurement);
      setResult(calculatedResult);
      setStage('result');
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Hesaplama sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResult = async () => {
    if (!result) return;

    if (isAuthenticated) {
      if (children.length > 0) {
        setShowChildSelector(true);
      } else {
        // Çocuk yok, direkt kaydet (child_id olmadan)
        try {
          await toolService.savePercentileResult(result);
          toast.success('Sonuç kaydedildi');
        } catch (error) {
          toast.error('Kayıt sırasında hata oluştu');
        }
      }
    } else {
      setShowRegistration(true);
    }
  };

  const handleSaveToChild = async (childId: string) => {
    if (!result) return;
    
    try {
      await toolService.savePercentileResult(result, childId);
      toast.success('Sonuç çocuğun profiline kaydedildi');
      setShowChildSelector(false);
    } catch (error) {
      toast.error('Kayıt sırasında hata oluştu');
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!result) return;
    
    if (!regEmail || !regPassword || !regName) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const response = await toolService.savePercentileWithRegistration(result, {
        email: regEmail,
        password: regPassword,
        name: regName,
        child_name: regChildName,
        child_birth_date: regChildBirthDate,
      });

      // Set token and refresh user
      setToken(response.token);
      await refreshUser();
      
      toast.success('Hesabınız oluşturuldu ve sonuç kaydedildi!');
      setShowRegistration(false);
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Kayıt sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCalculation = () => {
    setStage('input');
    setResult(null);
    setWeight('');
    setHeight('');
    setHeadCircumference('');
    setMeasurementDate(new Date().toISOString().split('T')[0]);
  };

  // Intro Stage
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-chart-line text-white text-3xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Persentil Hesaplayıcı
            </h1>
            <p className="text-xl text-slate-600">
              WHO büyüme standartlarına göre bebeğinizin gelişimini takip edin
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-weight-scale text-green-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Kilo Takibi</h3>
              <p className="text-slate-600 text-sm">
                Bebeğinizin kilosunun yaşına göre persentil değerini öğrenin
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-ruler-vertical text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Boy Takibi</h3>
              <p className="text-slate-600 text-sm">
                Bebeğinizin boyunun yaşına göre persentil değerini kontrol edin
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-brain text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Baş Çevresi</h3>
              <p className="text-slate-600 text-sm">
                Bebeğinizin baş çevresinin gelişimini izleyin
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-chart-area text-orange-600 text-xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Büyüme Grafiği</h3>
              <p className="text-slate-600 text-sm">
                WHO standartlarına göre detaylı değerlendirme
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => setStage('input')}
              className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg"
            >
              Hesaplamaya Başla
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <i className="fa-solid fa-info-circle text-amber-600 text-xl mt-1"></i>
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Önemli Uyarı</h4>
                <p className="text-amber-800 text-sm">
                  Bu hesaplama araç sadece bilgilendirme amaçlıdır ve tıbbi tanı yerine geçmez. 
                  Bebeğinizin büyümesi hakkında endişeleriniz varsa, mutlaka pediatristinize danışın.
                </p>
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setStage('intro')}
              className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Geri
            </button>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Ölçüm Bilgileri</h2>
            <p className="text-slate-600">Bebeğinizin ölçümlerini girin</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="space-y-6">
              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3">
                  Cinsiyet
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setGender('male')}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
                      gender === 'male'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fa-solid fa-mars mr-2"></i>
                    Erkek
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
                      gender === 'female'
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fa-solid fa-venus mr-2"></i>
                    Kız
                  </button>
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-bold text-slate-800 mb-2">
                  Doğum Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Measurement Date */}
              <div>
                <label htmlFor="measurementDate" className="block text-sm font-bold text-slate-800 mb-2">
                  Ölçüm Tarihi
                </label>
                <input
                  id="measurementDate"
                  type="date"
                  value={measurementDate}
                  onChange={(e) => setMeasurementDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-bold text-slate-800 mb-2">
                  Kilo (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Örn: 7.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Height */}
              <div>
                <label htmlFor="height" className="block text-sm font-bold text-slate-800 mb-2">
                  Boy (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Örn: 65.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Head Circumference */}
              <div>
                <label htmlFor="headCircumference" className="block text-sm font-bold text-slate-800 mb-2">
                  Baş Çevresi (cm) <span className="text-gray-400 text-xs">- Opsiyonel</span>
                </label>
                <input
                  id="headCircumference"
                  type="number"
                  step="0.1"
                  value={headCircumference}
                  onChange={(e) => setHeadCircumference(e.target.value)}
                  placeholder="Örn: 42.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
    const hasRedFlags = result.red_flags && result.red_flags.length > 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-chart-line text-white text-3xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Persentil Sonuçları</h2>
            <p className="text-slate-600">
              {result.age_in_months} aylık - {result.measurement.gender === 'male' ? 'Erkek' : 'Kız'}
            </p>
          </div>

          {/* Red Flags */}
          {hasRedFlags && (
            <div className="mb-8">
              {result.red_flags.map((flag: PercentileRedFlag, idx: number) => (
                <div
                  key={idx}
                  className={`${
                    flag.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                  } border-2 rounded-2xl p-6 mb-4`}
                >
                  <div className="flex items-start gap-4">
                    <i
                      className={`fa-solid fa-triangle-exclamation ${
                        flag.severity === 'critical' ? 'text-red-500' : 'text-amber-500'
                      } text-2xl mt-1`}
                    ></i>
                    <div>
                      <h4
                        className={`font-bold ${
                          flag.severity === 'critical' ? 'text-red-900' : 'text-amber-900'
                        } mb-2`}
                      >
                        Dikkat
                      </h4>
                      <p
                        className={`${
                          flag.severity === 'critical' ? 'text-red-800' : 'text-amber-800'
                        }`}
                      >
                        {flag.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Percentile Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {result.percentiles.map((p, idx) => {
              const titles: Record<string, string> = {
                weight_for_age: 'Kilo-Yaş Persentili',
                height_for_age: 'Boy-Yaş Persentili',
                head_for_age: 'Baş Çevresi Persentili',
                weight_for_height: 'Kilo-Boy Persentili',
                bmi_for_age: 'BMI-Yaş Persentili',
              };

              const units: Record<string, string> = {
                weight_for_age: 'kg',
                height_for_age: 'cm',
                head_for_age: 'cm',
                weight_for_height: 'kg',
                bmi_for_age: 'kg/m²',
              };

              return (
                <PercentileCard
                  key={idx}
                  title={titles[p.measurement_type] || p.measurement_type}
                  value={p.value}
                  unit={units[p.measurement_type] || ''}
                  percentile={p.percentile}
                  category={p.category}
                  interpretation={p.interpretation}
                  zScore={p.z_score}
                />
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSaveResult}
              className="bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors"
            >
              <i className="fa-solid fa-save mr-2"></i>
              Sonucu Kaydet
            </button>
            <button
              onClick={handleNewCalculation}
              className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-600 transition-colors"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Yeni Hesaplama
            </button>
          </div>

          {/* Related Links */}
          <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-slate-800 mb-4">İlgili Kaynaklar</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/tarifler"
                className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <i className="fa-solid fa-utensils text-orange-500 text-xl"></i>
                <span className="font-medium text-slate-800">Sağlıklı Tarifler</span>
              </Link>
              <Link
                href="/rehber"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <i className="fa-solid fa-book text-blue-500 text-xl"></i>
                <span className="font-medium text-slate-800">Beslenme Rehberi</span>
              </Link>
              <Link
                href="/araclar/blw-testi"
                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <i className="fa-solid fa-clipboard-check text-green-500 text-xl"></i>
                <span className="font-medium text-slate-800">BLW Hazırlık Testi</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        {showRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Hesap Oluştur</h3>
              <p className="text-slate-600 mb-6">
                Sonuçlarınızı kaydetmek ve takip etmek için hesap oluşturun
              </p>
              
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                <div>
                  <label htmlFor="regName" className="block text-sm font-bold text-slate-800 mb-2">
                    İsim <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="regName"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="regEmail" className="block text-sm font-bold text-slate-800 mb-2">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="regEmail"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="regPassword" className="block text-sm font-bold text-slate-800 mb-2">
                    Şifre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="regPassword"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-slate-600 mb-4">Çocuk Bilgileri (Opsiyonel)</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="regChildName" className="block text-sm font-bold text-slate-800 mb-2">
                        Çocuğun Adı
                      </label>
                      <input
                        id="regChildName"
                        type="text"
                        value={regChildName}
                        onChange={(e) => setRegChildName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="regChildBirthDate" className="block text-sm font-bold text-slate-800 mb-2">
                        Doğum Tarihi
                      </label>
                      <input
                        id="regChildBirthDate"
                        type="date"
                        value={regChildBirthDate}
                        onChange={(e) => setRegChildBirthDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistration(false)}
                    className="flex-1 bg-gray-200 text-slate-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                  >
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Child Selector Modal */}
        {showChildSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Çocuk Seç</h3>
              <p className="text-slate-600 mb-6">
                Sonucu hangi çocuğun profiline kaydetmek istersiniz?
              </p>
              
              <div className="space-y-3 mb-6">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleSaveToChild(child.id)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="font-bold text-slate-800">{child.name}</div>
                    <div className="text-sm text-slate-600">
                      {child.birth_date && new Date(child.birth_date).toLocaleDateString('tr-TR')}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowChildSelector(false)}
                className="w-full bg-gray-200 text-slate-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
