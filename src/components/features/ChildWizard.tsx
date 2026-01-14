'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Child } from '@/lib/types';

interface ChildWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: Omit<Child, 'id'> | Child) => Promise<void>;
  child?: Child | null;
}

const POPULAR_ALLERGENS = [
  'İnek Sütü',
  'Yumurta',
  'Fıstık',
  'Gluten',
  'Soya',
  'Balık',
  'Kabuklu Deniz Ürünleri',
  'Fındık',
  'Ceviz',
  'Badem',
];

type WizardStep = 1 | 2 | 3;

export default function ChildWizard({ isOpen, onClose, onSave, child }: ChildWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified'>('unspecified');
  const [birthDate, setBirthDate] = useState('');
  const [feedingStyle, setFeedingStyle] = useState<'blw' | 'puree' | 'mixed'>('mixed');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');
  const [kvkkConsent, setKvkkConsent] = useState(false);

  // Initialize form with child data if editing
  useEffect(() => {
    if (child) {
      setName(child.name);
      setGender(child.gender || 'unspecified');
      setBirthDate(child.birth_date);
      setFeedingStyle(child.feeding_style || 'mixed');
      setAllergies(child.allergies || child.allergens || []);
    } else {
      resetForm();
    }
  }, [child, isOpen]);

  const resetForm = () => {
    setCurrentStep(1);
    setName('');
    setGender('unspecified');
    setBirthDate('');
    setFeedingStyle('mixed');
    setAllergies([]);
    setCustomAllergy('');
    setKvkkConsent(false);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  const toggleAllergy = (allergen: string) => {
    setAllergies((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies([...allergies, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const handleSubmit = async () => {
    if (!kvkkConsent && !child) {
      alert('KVKK onayı vermeden çocuk ekleyemezsiniz.');
      return;
    }

    setIsLoading(true);
    try {
      const childData: Omit<Child, 'id'> | Child = child?.id
        ? {
            id: child.id,
            name,
            birth_date: birthDate,
            gender,
            allergies,
            feeding_style: feedingStyle,
          }
        : {
            name,
            birth_date: birthDate,
            gender,
            allergies,
            feeding_style: feedingStyle,
            kvkk_consent: true,
          };

      await onSave(childData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving child:', error);
      alert('Çocuk kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = name.trim() !== '' && birthDate !== '';
  const isStep2Valid = true; // feedingStyle always has a value
  const isStep3Valid = child ? true : kvkkConsent; // Skip KVKK for edit mode

  // Get max date (today) for birth date input
  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl text-slate-800">
              {child ? 'Çocuğu Düzenle' : 'Yeni Çocuk Ekle'}
            </h2>
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`flex-1 h-2 rounded-full transition-colors ${
                      currentStep >= step ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  ></div>
                  {step < 3 && <div className="w-2"></div>}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Adım {currentStep}/3:{' '}
              {currentStep === 1 && 'Temel Bilgiler'}
              {currentStep === 2 && 'Beslenme Tercihi'}
              {currentStep === 3 && 'Alerji Bilgisi'}
            </p>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="childName" className="block text-sm font-bold text-gray-700 mb-2">
                  İsim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="childName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Örn: Deniz"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Cinsiyet <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                      gender === 'male'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    <i className="fa-solid fa-mars mr-2"></i>
                    Erkek
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                      gender === 'female'
                        ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    <i className="fa-solid fa-venus mr-2"></i>
                    Kız
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('unspecified')}
                    className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                      gender === 'unspecified'
                        ? 'bg-gray-200 text-gray-700 border-2 border-gray-400'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    <i className="fa-solid fa-genderless mr-2"></i>
                    Diğer
                  </button>
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-bold text-gray-700 mb-2">
                  Doğum Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={getMaxDate()}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Step 2: Feeding Style */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Beslenme Tercihi
                </label>
                <div className="space-y-3">
                  {/* BLW */}
                  <button
                    type="button"
                    onClick={() => setFeedingStyle('blw')}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                      feedingStyle === 'blw'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        feedingStyle === 'blw'
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {feedingStyle === 'blw' && (
                        <i className="fa-solid fa-check text-white text-xs"></i>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">BLW (Baby Led Weaning)</div>
                      <p className="text-sm text-gray-600 mt-1">
                        Bebeğin kendi kendine parmak yiyeceklerle beslenmesi
                      </p>
                    </div>
                  </button>

                  {/* Puree */}
                  <button
                    type="button"
                    onClick={() => setFeedingStyle('puree')}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                      feedingStyle === 'puree'
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-gray-50 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        feedingStyle === 'puree'
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {feedingStyle === 'puree' && (
                        <i className="fa-solid fa-check text-white text-xs"></i>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">Püre</div>
                      <p className="text-sm text-gray-600 mt-1">
                        Geleneksel kaşıkla beslenme yöntemi
                      </p>
                    </div>
                  </button>

                  {/* Mixed */}
                  <button
                    type="button"
                    onClick={() => setFeedingStyle('mixed')}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                      feedingStyle === 'mixed'
                        ? 'bg-purple-50 border-purple-300'
                        : 'bg-gray-50 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        feedingStyle === 'mixed'
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {feedingStyle === 'mixed' && (
                        <i className="fa-solid fa-check text-white text-xs"></i>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">Karma</div>
                      <p className="text-sm text-gray-600 mt-1">
                        Hem püre hem parmak yiyecek kombinasyonu
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Allergies & KVKK */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Allergies */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Alerjenler (Varsa)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {POPULAR_ALLERGENS.map((allergen) => (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => toggleAllergy(allergen)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        allergies.includes(allergen)
                          ? 'bg-red-100 text-red-700 border-2 border-red-300'
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      {allergies.includes(allergen) && (
                        <i className="fa-solid fa-check mr-1"></i>
                      )}
                      {allergen}
                    </button>
                  ))}
                </div>

                {/* Custom Allergy Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomAllergy();
                      }
                    }}
                    placeholder="Diğer alerjen ekle..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addCustomAllergy}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
                  >
                    Ekle
                  </button>
                </div>

                {/* Selected Custom Allergies */}
                {allergies.filter((a) => !POPULAR_ALLERGENS.includes(a)).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allergies
                      .filter((a) => !POPULAR_ALLERGENS.includes(a))
                      .map((allergen) => (
                        <span
                          key={allergen}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                        >
                          {allergen}
                          <button
                            type="button"
                            onClick={() => toggleAllergy(allergen)}
                            className="hover:text-red-900"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* KVKK Consent (only for new children) */}
              {!child && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kvkkConsent}
                      onChange={(e) => setKvkkConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      Çocuğuma ait verilerin işlenmesine{' '}
                      <Link
                        href="/kvkk"
                        target="_blank"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        KVKK kapsamında
                      </Link>{' '}
                      rıza gösteriyorum. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Geri
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid)
                }
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İleri
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !isStep3Valid}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Kaydediliyor...
                  </>
                ) : child ? (
                  <>
                    <i className="fa-solid fa-check mr-2"></i>
                    Güncelle
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check mr-2"></i>
                    Kaydet
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
