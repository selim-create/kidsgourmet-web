"use client";

import React, { useState } from 'react';
import { AddPrivateVaccineRequest } from '@/lib/types';

interface PrivateVaccineWizardProps {
  isOpen: boolean;
  childId: string;
  onClose: () => void;
  onSubmit: (request: AddPrivateVaccineRequest) => void;
}

type VaccineType = 'rotavirus' | 'meningococcal_acwy' | 'meningococcal_b' | 'varicella' | 'influenza';

interface VaccineOption {
  id: VaccineType;
  name: string;
  description: string;
  icon: string;
}

const vaccineOptions: VaccineOption[] = [
  {
    id: 'rotavirus',
    name: 'Rotavirüs',
    description: 'Bebeklerde ciddi ishal ve kusma yapan virüse karşı koruma',
    icon: '🦠',
  },
  {
    id: 'meningococcal_acwy',
    name: 'Menenjit (ACWY)',
    description: 'Beyin zarı iltihabına karşı koruma',
    icon: '🧠',
  },
  {
    id: 'meningococcal_b',
    name: 'Menenjit B',
    description: 'Menenjit B tipine karşı koruma',
    icon: '🧠',
  },
  {
    id: 'varicella',
    name: 'Su Çiçeği',
    description: 'Su çiçeği hastalığına karşı koruma',
    icon: '💧',
  },
  {
    id: 'influenza',
    name: 'Grip',
    description: 'Mevsimsel gripe karşı koruma',
    icon: '🤧',
  },
];

interface BrandOption {
  id: string;
  name: string;
  doses: number;
  description?: string;
  hasSchedules?: boolean;
  schedules?: ScheduleOption[];
}

interface ScheduleOption {
  key: string;
  name: string;
  description: string;
}

const brandOptions: Record<string, BrandOption[]> = {
  rotavirus: [
    { id: 'rotarix', name: 'Rotarix', doses: 2, description: '2 doz (2 ve 4. ayda)' },
    { id: 'rotateq', name: 'RotaTeq', doses: 3, description: '3 doz (2, 4 ve 6. ayda)' },
  ],
  meningococcal_acwy: [
    { id: 'nimenrix', name: 'Nimenrix', doses: 1, description: 'Tek doz, 5 yıl sonra rapel' },
    { id: 'menveo', name: 'Menveo', doses: 1, description: '2 aydan itibaren yapılabilir' },
  ],
  meningococcal_b: [
    { 
      id: 'bexsero', 
      name: 'Bexsero', 
      doses: 2, 
      hasSchedules: true,
      schedules: [
        { key: 'infant', name: 'Bebek Şeması (2-5 ay)', description: '3 doz' },
        { key: 'older_infant', name: 'Büyük Bebek Şeması (6-11 ay)', description: '3 doz' },
        { key: 'toddler', name: 'Çocuk Şeması (12-23 ay)', description: '3 doz' },
        { key: 'child', name: 'Büyük Çocuk Şeması (2+ yaş)', description: '2 doz' },
      ]
    },
  ],
  varicella: [
    { id: 'varivax', name: 'Varivax', doses: 2, description: '1. doz 12 ay, 2. doz 4-6 yaş' },
  ],
  influenza: [
    { id: 'generic', name: 'Mevsimsel Grip Aşısı', doses: 1, description: 'Her yıl önerilir' },
  ],
};

export default function PrivateVaccineWizard({ 
  isOpen, 
  childId,
  onClose, 
  onSubmit 
}: PrivateVaccineWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineType | null>(null);
  const [doctorRecommended, setDoctorRecommended] = useState<boolean | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [firstDoseDate, setFirstDoseDate] = useState('');

  const handleReset = () => {
    setStep(1);
    setSelectedVaccine(null);
    setDoctorRecommended(null);
    setSelectedBrand(null);
    setSelectedSchedule(null);
    setFirstDoseDate('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleVaccineSelect = (vaccineId: VaccineType) => {
    setSelectedVaccine(vaccineId);
    setStep(2);
  };

  const handleDoctorRecommendation = (recommended: boolean) => {
    setDoctorRecommended(recommended);
    if (!recommended) {
      // If doctor didn't recommend, show info and close
      setStep(5);
    } else {
      // Check if this vaccine has brand options
      if (selectedVaccine && brandOptions[selectedVaccine]) {
        setStep(3);
      } else {
        setStep(4);
      }
    }
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    
    // Check if this brand has schedules
    const currentBrand = selectedVaccine && brandOptions[selectedVaccine]
      ? brandOptions[selectedVaccine].find(b => b.id === brand)
      : null;
    
    if (currentBrand?.hasSchedules && currentBrand.schedules && currentBrand.schedules.length > 0) {
      // Go to schedule selection step (3.5)
      setStep(3.5);
    } else {
      // Go directly to date selection step
      setStep(4);
    }
  };

  const handleScheduleSelect = (scheduleKey: string) => {
    setSelectedSchedule(scheduleKey);
    setStep(4);
  };

  // Default brand mapping for when no brand is specified
  const getDefaultBrand = (vaccineType: VaccineType): string => {
    const defaults: Record<VaccineType, string> = {
      rotavirus: 'rotarix',
      meningococcal_acwy: 'nimenrix',
      meningococcal_b: 'bexsero',
      varicella: 'varivax',
      influenza: 'generic',
    };
    return defaults[vaccineType];
  };

  const handleSubmit = () => {
    if (!selectedVaccine) return;

    // Use selected brand or fallback to default
    const brandCode = selectedBrand || getDefaultBrand(selectedVaccine);

    const request: AddPrivateVaccineRequest = {
      child_id: childId,
      type: selectedVaccine,
      brand_code: brandCode,
      schedule_key: selectedSchedule || undefined,
    };

    onSubmit(request);
    handleClose();
  };

  if (!isOpen) return null;

  const currentVaccineOption = selectedVaccine 
    ? vaccineOptions.find(v => v.id === selectedVaccine)
    : null;

  const currentBrandOptions = selectedVaccine 
    ? brandOptions[selectedVaccine] || []
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="font-bold text-lg text-slate-800">
            {step === 1 && 'Özel Aşı Ekle'}
            {step === 2 && 'Doktor Önerisi'}
            {step === 3 && 'Marka Seçimi'}
            {step === 3.5 && 'Şema Seçimi'}
            {step === 4 && 'İlk Doz Tarihi'}
            {step === 5 && 'Bilgilendirme'}
          </h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Vaccine Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Çocuğunuza uygulanmasını planladığınız özel aşıyı seçin:
              </p>
              
              <div className="space-y-3">
                {vaccineOptions.map((vaccine) => (
                  <button
                    key={vaccine.id}
                    onClick={() => handleVaccineSelect(vaccine.id)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{vaccine.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 mb-1">{vaccine.name}</h4>
                        <p className="text-xs text-gray-600">{vaccine.description}</p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-gray-300"></i>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Doctor Recommendation */}
          {step === 2 && currentVaccineOption && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentVaccineOption.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-800">{currentVaccineOption.name}</h4>
                    <p className="text-xs text-gray-600">{currentVaccineOption.description}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-800 mb-3">
                Doktorunuz {currentVaccineOption.name} aşısı önerdi mi?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleDoctorRecommendation(true)}
                  className="w-full p-4 border-2 border-green-200 bg-green-50 rounded-xl hover:border-green-300 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">Evet, doktor önerdi</p>
                      <p className="text-xs text-gray-600">Takvime eklemeye devam et</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleDoctorRecommendation(false)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">Hayır, henüz önerilmedi</p>
                      <p className="text-xs text-gray-600">Daha fazla bilgi al</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Brand Selection */}
          {step === 3 && currentVaccineOption && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentVaccineOption.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-800">{currentVaccineOption.name}</h4>
                  </div>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-800 mb-3">
                Hangi markayı tercih ettiniz?
              </p>

              <div className="space-y-3">
                {currentBrandOptions.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand.id)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{brand.name}</p>
                        {brand.description && (
                          <p className="text-xs text-gray-600 mt-1">{brand.description}</p>
                        )}
                      </div>
                      <i className="fa-solid fa-chevron-right text-gray-300"></i>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3.5: Schedule Selection (for Bexsero) */}
          {step === 3.5 && currentVaccineOption && selectedBrand && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentVaccineOption.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{currentVaccineOption.name}</h4>
                    <p className="text-xs text-gray-600">
                      {currentBrandOptions.find(b => b.id === selectedBrand)?.name}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-800 mb-3">
                Çocuğunuzun yaşına uygun şemayı seçin:
              </p>

              <div className="space-y-3">
                {currentBrandOptions
                  .find(b => b.id === selectedBrand)
                  ?.schedules?.map((schedule) => (
                    <button
                      key={schedule.key}
                      onClick={() => handleScheduleSelect(schedule.key)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{schedule.name}</p>
                          <p className="text-xs text-gray-600 mt-1">{schedule.description}</p>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-300"></i>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Step 4: First Dose Date */}
          {step === 4 && currentVaccineOption && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentVaccineOption.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{currentVaccineOption.name}</h4>
                    {selectedBrand && (
                      <p className="text-xs text-gray-600">
                        {currentBrandOptions.find(b => b.id === selectedBrand)?.name}
                        {selectedSchedule && currentBrandOptions.find(b => b.id === selectedBrand)?.schedules && (
                          <span> - {currentBrandOptions.find(b => b.id === selectedBrand)?.schedules?.find(s => s.key === selectedSchedule)?.name}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  <i className="fa-solid fa-calendar text-blue-500 mr-1"></i>
                  İlk dozun yapılacağı tarih (Opsiyonel)
                </label>
                <input
                  type="date"
                  value={firstDoseDate}
                  onChange={(e) => setFirstDoseDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tarih belirtmezseniz, sistem otomatik olarak uygun tarihi hesaplayacaktır.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <p className="text-xs text-amber-800">
                  <i className="fa-solid fa-info-circle text-amber-600 mr-1"></i>
                  Bu aşı takvime eklenecek ve hatırlatmalar alacaksınız.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    // Navigate back to schedule selection if we came from there, otherwise to brand selection
                    if (selectedSchedule) {
                      setStep(3.5);
                    } else if (selectedBrand) {
                      setStep(3);
                    } else {
                      setStep(2);
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                >
                  <i className="fa-solid fa-chevron-left mr-2"></i>
                  Geri
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                >
                  <i className="fa-solid fa-check mr-2"></i>
                  Takvime Ekle
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Information (Doctor didn't recommend) */}
          {step === 5 && currentVaccineOption && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentVaccineOption.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-800">{currentVaccineOption.name}</h4>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-900 mb-3">
                  <i className="fa-solid fa-lightbulb text-amber-600 mr-2"></i>
                  <strong>Önemli Bilgi</strong>
                </p>
                <p className="text-xs text-amber-800 mb-2">
                  {currentVaccineOption.name} aşısı hakkında doktorunuzla konuşmanızı öneririz. 
                  Çocuğunuzun yaşına, sağlık durumuna ve risk faktörlerine göre aşının gerekli olup olmadığını değerlendirebilirler.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleClose}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Anladım
                </button>
                <button
                  onClick={() => {
                    setDoctorRecommended(true);
                    if (currentBrandOptions.length > 0) {
                      setStep(3);
                    } else {
                      setStep(4);
                    }
                  }}
                  className="w-full px-4 py-3 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Yine de takvime ekle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
