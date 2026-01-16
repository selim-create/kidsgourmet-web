"use client";

import React from 'react';
import { VaccineRecord, VaccineStatus } from '@/lib/types';

interface VaccineCardProps {
  record: VaccineRecord;
  onMarkDone: (record: VaccineRecord) => void;
  onReportSideEffect: (record: VaccineRecord) => void;
}

export default function VaccineCard({ record, onMarkDone, onReportSideEffect }: VaccineCardProps) {
  const { vaccine, status, scheduled_date, actual_date } = record;

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

  // Get status styling
  const getStatusStyle = (status: VaccineStatus) => {
    switch (status) {
      case 'done':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          badge: 'bg-green-500 text-white',
          badgeText: 'Yapıldı ✓',
          icon: 'fa-circle-check text-green-500',
        };
      case 'overdue':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          badge: 'bg-red-500 text-white',
          badgeText: 'Gecikmiş!',
          icon: 'fa-circle-exclamation text-red-500',
        };
      case 'upcoming':
        // Check if it's within 7 days
        const daysUntil = Math.ceil((new Date(scheduled_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 7 && daysUntil >= 0) {
          return {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            badge: 'bg-yellow-500 text-white',
            badgeText: 'Yaklaşıyor',
            icon: 'fa-clock text-yellow-500',
          };
        }
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          badge: 'bg-gray-100 text-gray-600',
          badgeText: 'Gelecek',
          icon: 'fa-circle text-gray-400',
        };
      case 'skipped':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          badge: 'bg-gray-400 text-white',
          badgeText: 'Atlandı',
          icon: 'fa-circle-minus text-gray-400',
        };
      case 'delayed':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          badge: 'bg-orange-500 text-white',
          badgeText: 'Ertelendi',
          icon: 'fa-calendar-xmark text-orange-500',
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          badge: 'bg-gray-100 text-gray-600',
          badgeText: 'Bilinmiyor',
          icon: 'fa-circle text-gray-400',
        };
    }
  };

  const statusStyle = getStatusStyle(status);
  const displayDate = actual_date || scheduled_date;

  return (
    <div className={`${statusStyle.bg} border ${statusStyle.border} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all`}>
      {/* Header with Date and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <i className="fa-solid fa-calendar"></i>
          <span className="font-medium">{formatDate(displayDate)}</span>
        </div>
        <div className={`${statusStyle.badge} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
          {statusStyle.badgeText}
        </div>
      </div>

      {/* Vaccine Info */}
      <div className="mb-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-syringe text-blue-500"></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800">{vaccine.name_short || vaccine.name}</h3>
              {vaccine.is_mandatory ? (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Zorunlu
                </span>
              ) : (
                <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Özel
                </span>
              )}
            </div>
            {vaccine.description && (
              <p className="text-xs text-gray-600 line-clamp-2">{vaccine.description}</p>
            )}
          </div>
        </div>

        {/* Timing info */}
        {vaccine.timing_rule && (
          <p className="text-xs text-gray-500 ml-13">
            {vaccine.timing_rule.type === 'month' && `${vaccine.timing_rule.value}. ayda yapılır`}
            {vaccine.timing_rule.type === 'birth' && 'Doğumda yapılır'}
            {vaccine.timing_rule.type === 'week' && `${vaccine.timing_rule.value}. haftada yapılır`}
          </p>
        )}

        {/* Notes if done */}
        {status === 'done' && record.notes && (
          <div className="mt-2 p-2 bg-white rounded-lg border border-gray-100">
            <p className="text-xs text-gray-600">
              <i className="fa-solid fa-note-sticky text-gray-400 mr-1"></i>
              {record.notes}
            </p>
          </div>
        )}

        {/* Side effects if reported */}
        {status === 'done' && record.side_effects && (
          <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs font-bold text-amber-800 mb-1">Bildirilen Yan Etkiler:</p>
            <div className="flex flex-wrap gap-1">
              {record.side_effects.fever && (
                <span className="bg-white text-amber-700 text-[10px] px-2 py-0.5 rounded border border-amber-200">
                  Ateş
                </span>
              )}
              {record.side_effects.irritability && (
                <span className="bg-white text-amber-700 text-[10px] px-2 py-0.5 rounded border border-amber-200">
                  Huzursuzluk
                </span>
              )}
              {record.side_effects.swelling && (
                <span className="bg-white text-amber-700 text-[10px] px-2 py-0.5 rounded border border-amber-200">
                  Şişlik
                </span>
              )}
              {record.side_effects.rash && (
                <span className="bg-white text-amber-700 text-[10px] px-2 py-0.5 rounded border border-amber-200">
                  Döküntü
                </span>
              )}
              {record.side_effects.loss_of_appetite && (
                <span className="bg-white text-amber-700 text-[10px] px-2 py-0.5 rounded border border-amber-200">
                  İştahsızlık
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        {status === 'upcoming' || status === 'overdue' || status === 'delayed' ? (
          <>
            <button
              onClick={() => onMarkDone(record)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
            >
              <i className="fa-solid fa-check mr-1"></i>
              Yapıldı İşaretle
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold py-2 px-3 rounded-lg transition-colors">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
          </>
        ) : status === 'done' ? (
          <>
            <button
              onClick={() => onReportSideEffect(record)}
              className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold py-2 px-3 rounded-lg transition-colors"
            >
              <i className="fa-solid fa-notes-medical mr-1"></i>
              Yan Etki Bildir
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold py-2 px-3 rounded-lg transition-colors">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
          </>
        ) : (
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold py-2 px-3 rounded-lg transition-colors">
            <i className="fa-solid fa-info-circle mr-1"></i>
            Detay
          </button>
        )}
      </div>
    </div>
  );
}
