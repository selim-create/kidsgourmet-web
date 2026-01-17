"use client";

import React from 'react';
import { VaccineRecord } from '@/lib/types';

interface VaccineDetailModalProps {
  isOpen: boolean;
  record: VaccineRecord | null;
  onClose: () => void;
}

export default function VaccineDetailModal({ isOpen, record, onClose }: VaccineDetailModalProps) {
  if (!isOpen || !record) return null;

  const { vaccine, scheduled_date, actual_date, notes, side_effects, is_mandatory } = record;

  // Format date
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Tarih bilinmiyor';
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return 'Tarih bilinmiyor';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-syringe text-2xl"></i>
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl">{vaccine.name}</h2>
                {vaccine.name_short && vaccine.name_short !== vaccine.name && (
                  <p className="text-blue-100 text-sm">({vaccine.name_short})</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-2">
            {is_mandatory ? (
              <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                Zorunlu Aşı
              </span>
            ) : (
              <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Özel Aşı
              </span>
            )}
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {vaccine.code}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {vaccine.description && (
            <div>
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-info-circle text-blue-500"></i>
                Açıklama
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{vaccine.description}</p>
            </div>
          )}

          {/* Timing Information */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-calendar text-blue-500"></i>
              Zamanlama Bilgisi
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Planlanan Tarih:</span>
                <span className="font-medium text-slate-800">{formatDate(scheduled_date)}</span>
              </div>
              {actual_date && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Yapıldığı Tarih:</span>
                  <span className="font-medium text-green-700">{formatDate(actual_date)}</span>
                </div>
              )}
              {vaccine.timing_rule && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Zamanlama Kuralı:</span>
                  <span className="font-medium text-slate-800">
                    {vaccine.timing_rule.type === 'month' && `${vaccine.timing_rule.value}. ayda`}
                    {vaccine.timing_rule.type === 'birth' && 'Doğumda'}
                    {vaccine.timing_rule.type === 'week' && `${vaccine.timing_rule.value}. haftada`}
                  </span>
                </div>
              )}
              {vaccine.min_age_days && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Minimum Yaş:</span>
                  <span className="font-medium text-slate-800">
                    {Math.floor(vaccine.min_age_days / 30)} ay
                  </span>
                </div>
              )}
              {vaccine.max_age_days && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Maksimum Yaş:</span>
                  <span className="font-medium text-slate-800">
                    {Math.floor(vaccine.max_age_days / 30)} ay
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Brand Options */}
          {vaccine.brand_options && (
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-box text-purple-500"></i>
                Marka Seçenekleri
              </h3>
              <div className="space-y-2 text-sm">
                {vaccine.brand_options.brand && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Marka:</span>
                    <span className="font-medium text-slate-800">{vaccine.brand_options.brand}</span>
                  </div>
                )}
                {vaccine.brand_options.total_doses && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Toplam Doz:</span>
                    <span className="font-medium text-slate-800">{vaccine.brand_options.total_doses}</span>
                  </div>
                )}
                {vaccine.brand_options.dose_number && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Doz Numarası:</span>
                    <span className="font-medium text-slate-800">{vaccine.brand_options.dose_number}</span>
                  </div>
                )}
                {vaccine.brand_options.types && vaccine.brand_options.types.length > 0 && (
                  <div>
                    <span className="text-gray-600 block mb-1">Tipler:</span>
                    <div className="flex flex-wrap gap-1">
                      {vaccine.brand_options.types.map((type, idx) => (
                        <span key={idx} className="bg-white text-purple-700 text-xs px-2 py-1 rounded border border-purple-200">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {notes && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-note-sticky text-amber-500"></i>
                Notlar
              </h3>
              <p className="text-gray-700 text-sm">{notes}</p>
            </div>
          )}

          {/* Side Effects */}
          {side_effects && (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-notes-medical text-red-500"></i>
                Bildirilen Yan Etkiler
              </h3>
              <div className="flex flex-wrap gap-2">
                {side_effects.fever && (
                  <span className="bg-white text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                    Ateş
                  </span>
                )}
                {side_effects.irritability && (
                  <span className="bg-white text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                    Huzursuzluk
                  </span>
                )}
                {side_effects.swelling && (
                  <span className="bg-white text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                    Şişlik
                  </span>
                )}
                {side_effects.rash && (
                  <span className="bg-white text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                    Döküntü
                  </span>
                )}
                {side_effects.loss_of_appetite && (
                  <span className="bg-white text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                    İştahsızlık
                  </span>
                )}
                {side_effects.other && (
                  <span className="bg-white text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                    Diğer: {side_effects.other}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Source Link */}
          {vaccine.source_url && (
            <div className="pt-4 border-t border-gray-100">
              <a
                href={vaccine.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                <i className="fa-solid fa-external-link-alt"></i>
                Resmi Kaynak Bilgisi
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-3xl border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
