"use client";

import React, { useState } from 'react';
import { VaccineRecord } from '@/lib/types';

interface VaccineMarkDoneModalProps {
  isOpen: boolean;
  record: VaccineRecord | null;
  onClose: () => void;
  onSubmit: (date: string, notes: string, askSideEffects: boolean) => void;
}

export default function VaccineMarkDoneModal({ 
  isOpen, 
  record, 
  onClose, 
  onSubmit 
}: VaccineMarkDoneModalProps) {
  const [actualDate, setActualDate] = useState('');
  const [notes, setNotes] = useState('');
  const [askSideEffects, setAskSideEffects] = useState(true);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen && record) {
      // Set today as default date
      const today = new Date().toISOString().split('T')[0];
      setActualDate(today);
      setNotes('');
      setAskSideEffects(true);
    }
  }, [isOpen, record]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualDate) return;
    onSubmit(actualDate, notes, askSideEffects);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="font-bold text-lg text-slate-800">Aşı Yapıldı İşaretle</h3>
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
                  Planlanan: {new Date(record.scheduled_date).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          </div>

          {/* Date Input */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              <i className="fa-solid fa-calendar text-blue-500 mr-1"></i>
              Aşının Yapıldığı Tarih *
            </label>
            <input
              type="date"
              value={actualDate}
              onChange={(e) => setActualDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              <i className="fa-solid fa-note-sticky text-gray-400 mr-1"></i>
              Notlar (Opsiyonel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Dr. Ayşe Yılmaz tarafından uygulandı"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Ask Side Effects Checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={askSideEffects}
                onChange={(e) => setAskSideEffects(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-slate-800">Yan etki bildirmek istiyorum</span>
                <p className="text-xs text-gray-500 mt-1">
                  Kaydettikten sonra yan etki bildirim formu açılacak
                </p>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
            <p className="text-xs text-amber-800">
              <i className="fa-solid fa-info-circle text-amber-600 mr-1"></i>
              Bu aşıyı yapıldı olarak işaretlemek üzeresiniz. Bu işlem geri alınabilir.
            </p>
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
              disabled={!actualDate}
              className="flex-1 px-4 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-check mr-2"></i>
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
