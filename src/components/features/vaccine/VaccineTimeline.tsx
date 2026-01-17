"use client";

import React from 'react';
import { VaccineRecord } from '@/lib/types';
import VaccineCard from './VaccineCard';

interface VaccineTimelineProps {
  vaccines: VaccineRecord[];
  onMarkDone: (record: VaccineRecord) => void;
  onReportSideEffect: (record: VaccineRecord) => void;
  onViewDetails: (record: VaccineRecord) => void;
}

export default function VaccineTimeline({ 
  vaccines, 
  onMarkDone, 
  onReportSideEffect,
  onViewDetails
}: VaccineTimelineProps) {
  // Group vaccines by age period
  const groupVaccinesByPeriod = (vaccines: VaccineRecord[]) => {
    const groups: { [key: string]: VaccineRecord[] } = {};
    
    vaccines.forEach(record => {
      const timing = record.vaccine?.timing_rule;
      let period = 'Diğer';
      
      // Null/undefined check ekle
      if (!timing) {
        period = '📋 Özel Aşılar';
      } else if (timing.type === 'birth') {
        period = '🍼 Yenidoğan (0-1 ay)';
      } else if (timing.type === 'month' && timing.value !== undefined) {
        const month = timing.value;
        if (month === 1) period = '👶 1. Ay';
        else if (month === 2) period = '🌟 2. Ay';
        else if (month === 4) period = '🎈 4. Ay';
        else if (month === 6) period = '🎯 6. Ay';
        else if (month === 12) period = '🎂 12. Ay (1 Yaş)';
        else if (month === 18) period = '🚀 18. Ay';
        else if (month >= 24 && month < 48) period = '🌈 2-4 Yaş';
        else if (month >= 48 && month < 72) period = '🎓 4-6 Yaş';
        else if (month >= 72) period = '📚 6+ Yaş';
        else period = `📅 ${month}. Ay`;
      } else if (timing.type === 'week' && timing.value !== undefined) {
        period = `📆 ${timing.value}. Hafta`;
      } else if (timing.type === 'custom') {
        period = '📋 Özel Aşılar';
      }
      
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(record);
    });
    
    return groups;
  };

  const groupedVaccines = groupVaccinesByPeriod(vaccines);
  
  // Define fixed period order
  const periodOrder = [
    '🍼 Yenidoğan (0-1 ay)',
    '👶 1. Ay',
    '🌟 2. Ay',
    '🎈 4. Ay',
    '🎯 6. Ay',
    '🎂 12. Ay (1 Yaş)',
    '🚀 18. Ay',
    '🌈 2-4 Yaş',
    '🎓 4-6 Yaş',
    '📚 6+ Yaş',
    '📋 Özel Aşılar',
  ];
  
  // Sort periods chronologically using the predefined order
  const sortedPeriods = Object.keys(groupedVaccines).sort((a, b) => {
    const indexA = periodOrder.indexOf(a);
    const indexB = periodOrder.indexOf(b);
    // Handle custom periods not in the list
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (vaccines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-syringe text-gray-400 text-3xl"></i>
        </div>
        <h3 className="font-bold text-slate-800 mb-2">Aşı Kaydı Bulunamadı</h3>
        <p className="text-gray-600 text-sm">
          Çocuk için henüz aşı takvimi oluşturulmamış.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedPeriods.map((period) => (
        <div key={period} className="relative">
          {/* Period Header */}
          <div className="sticky top-20 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 pb-3 mb-6">
            <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
              {period}
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {groupedVaccines[period].length} aşı
              </span>
            </h3>
          </div>

          {/* Vaccines in this period */}
          <div className="space-y-4 pl-6 border-l-2 border-gray-200 relative">
            {/* Timeline dot */}
            <div className="absolute left-[-9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
            
            {groupedVaccines[period].map((record) => (
              <div key={record.id} className="relative">
                <VaccineCard
                  record={record}
                  onMarkDone={onMarkDone}
                  onReportSideEffect={onReportSideEffect}
                  onViewDetails={onViewDetails}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
