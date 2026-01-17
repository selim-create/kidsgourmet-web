"use client";

import React, { useState } from 'react';
import { VaccineRecord, VaccineSideEffects } from '@/lib/types';
import VaccineContentLink from './VaccineContentLink';

interface SideEffectModalProps {
  isOpen: boolean;
  record: VaccineRecord | null;
  onClose: () => void;
  onSubmit: (sideEffects: VaccineSideEffects, severity: 'none' | 'mild' | 'moderate' | 'severe', notes: string, feverTemp?: number) => void;
}

export default function SideEffectModal({ 
  isOpen, 
  record, 
  onClose, 
  onSubmit 
}: SideEffectModalProps) {
  const [sideEffects, setSideEffects] = useState<VaccineSideEffects>({
    fever: false,
    irritability: false,
    swelling: false,
    rash: false,
    loss_of_appetite: false,
    other: null,
  });
  const [severity, setSeverity] = useState<'none' | 'mild' | 'moderate' | 'severe'>('mild');
  const [notes, setNotes] = useState('');
  const [otherText, setOtherText] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [feverTemp, setFeverTemp] = useState<number | undefined>(undefined);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen && record) {
      setSideEffects({
        fever: false,
        irritability: false,
        swelling: false,
        rash: false,
        loss_of_appetite: false,
        other: null,
      });
      setSeverity('mild');
      setNotes('');
      setOtherText('');
      setConsentGiven(false);
      setFeverTemp(undefined);
    }
  }, [isOpen, record]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) return;
    
    const finalSideEffects = {
      ...sideEffects,
      other: otherText.trim() || null,
    };
    
    onSubmit(finalSideEffects, severity, notes, feverTemp);
  };

  const toggleSideEffect = (key: keyof Omit<VaccineSideEffects, 'other'>) => {
    setSideEffects(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasAnySideEffect = Object.entries(sideEffects).some(([key, value]) => {
    if (key === 'other') return false;
    return value === true;
  }) || otherText.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="font-bold text-lg text-slate-800">Yan Etki Bildirimi</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Vaccine Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-syringe text-blue-500 text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{record.vaccine.name_short || record.vaccine.name}</h4>
                <p className="text-xs text-gray-600">
                  {record.actual_date 
                    ? new Date(record.actual_date).toLocaleDateString('tr-TR')
                    : 'Tarih bilinmiyor'}
                </p>
              </div>
            </div>
          </div>

          {/* Side Effects Checkboxes */}
          <div className="mb-6">
            <p className="text-sm font-bold text-slate-800 mb-3">
              Aşağıdakilerden hangilerini gözlemlediniz?
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                <input
                  type="checkbox"
                  checked={sideEffects.fever}
                  onChange={() => toggleSideEffect('fever')}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">🌡️ Ateş</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                <input
                  type="checkbox"
                  checked={sideEffects.irritability}
                  onChange={() => toggleSideEffect('irritability')}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">😢 Huzursuzluk</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                <input
                  type="checkbox"
                  checked={sideEffects.swelling}
                  onChange={() => toggleSideEffect('swelling')}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">💉 Şişlik</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                <input
                  type="checkbox"
                  checked={sideEffects.rash}
                  onChange={() => toggleSideEffect('rash')}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">🔴 Döküntü</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors col-span-2">
                <input
                  type="checkbox"
                  checked={sideEffects.loss_of_appetite}
                  onChange={() => toggleSideEffect('loss_of_appetite')}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">🍽️ İştahsızlık</span>
              </label>
            </div>

            {/* Other */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Diğer (Belirtiniz):
              </label>
              <input
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Örn: Uyku düzensizliği"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Fever Temperature Tracking */}
          {sideEffects.fever && (
            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                <i className="fa-solid fa-temperature-half text-orange-500 mr-1"></i>
                Ateş Ölçümü (°C)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="36"
                  max="42"
                  value={feverTemp || ''}
                  onChange={(e) => setFeverTemp(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="37.5"
                  className="flex-1 px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <span className="text-sm font-medium text-slate-700">°C</span>
              </div>
              {feverTemp && feverTemp > 38.5 && (
                <p className="text-xs text-orange-700 mt-2">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  Yüksek ateş. Doktorunuzla iletişime geçmeniz önerilir.
                </p>
              )}
            </div>
          )}

          {/* Severity */}
          <div className="mb-6">
            <p className="text-sm font-bold text-slate-800 mb-3">Şiddet:</p>
            <div className="flex gap-2">
              {[
                { value: 'mild', label: 'Hafif', color: 'bg-green-100 text-green-700 border-green-300' },
                { value: 'moderate', label: 'Orta', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
                { value: 'severe', label: 'Şiddetli', color: 'bg-red-100 text-red-700 border-red-300' },
              ].map(({ value, label, color }) => (
                <label
                  key={value}
                  className={`flex-1 cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${
                    severity === value
                      ? color
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={value}
                    checked={severity === value}
                    onChange={(e) => setSeverity(e.target.value as typeof severity)}
                    className="sr-only"
                  />
                  <span className="text-sm font-bold">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Ek Notlar (Opsiyonel):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Yan etkiler 2 gün sürdü, sonra geçti"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* KVKK Consent */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer p-3 bg-blue-50 rounded-xl border border-blue-200">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <div className="flex-1">
                <span className="text-xs text-blue-900">
                  Bu bilgilerin anonim olarak istatistiksel amaçlarla kullanılabileceğini kabul ediyorum.
                  Kişisel bilgilerim paylaşılmayacaktır.
                </span>
              </div>
            </label>
          </div>

          {/* Warning if severe */}
          {severity === 'severe' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800 font-bold mb-1">
                <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                Dikkat!
              </p>
              <p className="text-xs text-red-700">
                Şiddetli yan etkiler gözlemliyorsanız lütfen derhal çocuk hekiminizle iletişime geçin.
              </p>
            </div>
          )}

          {/* Helpful Content Links */}
          <div className="mb-6 space-y-2">
            {sideEffects.fever && (
              <VaccineContentLink type="fever_guide" />
            )}
            <VaccineContentLink type="side_effects" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!consentGiven || (!hasAnySideEffect && severity === 'none')}
              className="flex-1 px-4 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-paper-plane mr-2"></i>
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
