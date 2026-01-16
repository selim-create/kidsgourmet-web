"use client";

import React from 'react';
import { VaccineRecord } from '@/lib/types';
import VaccineCard from './VaccineCard';

interface VaccineTimelineProps {
  vaccines: VaccineRecord[];
  onMarkDone: (record: VaccineRecord) => void;
  onReportSideEffect: (record: VaccineRecord) => void;
}

export default function VaccineTimeline({ 
  vaccines, 
  onMarkDone, 
  onReportSideEffect 
}: VaccineTimelineProps) {
  // Group vaccines by age period
  const groupVaccinesByPeriod = (vaccines: VaccineRecord[]) => {
    const groups: { [key: string]: VaccineRecord[] } = {};
    
    vaccines.forEach(record => {
      const timing = record.vaccine.timing_rule;
      let period = 'Diğer';
      
      if (timing.type === 'birth') {
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
      }
      
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(record);
    });
    
    return groups;
  };

  const groupedVaccines = groupVaccinesByPeriod(vaccines);
  
  // Sort periods chronologically
  const sortedPeriods = Object.keys(groupedVaccines).sort((a, b) => {
    const extractMonth = (period: string): number => {
      if (period.includes('Yenidoğan')) return 0;
      if (period.includes('1. Ay')) return 1;
      if (period.includes('2. Ay')) return 2;
      if (period.includes('4. Ay')) return 4;
      if (period.includes('6. Ay')) return 6;
      if (period.includes('12. Ay')) return 12;
      if (period.includes('18. Ay')) return 18;
      if (period.includes('2-4 Yaş')) return 24;
      if (period.includes('4-6 Yaş')) return 48;
      if (period.includes('6+ Yaş')) return 72;
      
      const match = period.match(/(\d+)\. Ay/);
      if (match) return parseInt(match[1]);
      
      const weekMatch = period.match(/(\d+)\. Hafta/);
      if (weekMatch) return parseInt(weekMatch[1]) / 4;
      
      return 999;
    };
    
    return extractMonth(a) - extractMonth(b);
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
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
