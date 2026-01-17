"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { UpcomingVaccine } from '@/lib/types';
import { vaccineService } from '@/services/vaccine-service';

interface DashboardVaccineWidgetProps {
  childId: string | null;
  childName?: string;
}

export default function DashboardVaccineWidget({ childId, childName }: DashboardVaccineWidgetProps) {
  const [upcomingVaccines, setUpcomingVaccines] = useState<UpcomingVaccine[]>([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingVaccines = useCallback(async () => {
    if (!childId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const vaccines = await vaccineService.getUpcomingVaccines(childId);
      
      // Defense in depth: ensure array even though service guarantees it
      const vaccineArray = Array.isArray(vaccines) ? vaccines : [];
      setUpcomingVaccines(vaccineArray.slice(0, 3)); // Show max 3
      
      // Safe filter operation
      const overdue = vaccineArray.filter(v => v?.is_overdue).length;
      setOverdueCount(overdue);
    } catch (err) {
      console.error('Failed to fetch upcoming vaccines:', err);
      setError('Aşı bilgileri yüklenemedi');
      setUpcomingVaccines([]);
      setOverdueCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchUpcomingVaccines();
  }, [fetchUpcomingVaccines]);

  if (!childId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <i className="fa-solid fa-syringe text-green-500"></i>
          <h3 className="font-bold text-slate-800">Sıradaki Aşı</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <i className="fa-solid fa-syringe text-green-500"></i>
          <h3 className="font-bold text-slate-800">Aşı Takvimi</h3>
        </div>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-exclamation-triangle text-red-500 text-lg"></i>
          </div>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUpcomingVaccines}
            className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
          >
            <i className="fa-solid fa-rotate-right mr-2"></i>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (upcomingVaccines.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <i className="fa-solid fa-syringe text-green-500"></i>
          <h3 className="font-bold text-slate-800">Aşı Takvimi</h3>
        </div>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-check-circle text-green-500 text-lg"></i>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {childName || 'Çocuk'} için yakında planlanmış aşı bulunmuyor.
          </p>
          <Link
            href="/dashboard/saglik/asilar"
            className="block w-full bg-green-500 text-white text-center py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
          >
            Aşı Takvimini Gör
          </Link>
        </div>
      </div>
    );
  }

  const nextVaccine = upcomingVaccines[0];
  const daysUntil = nextVaccine.days_until;
  const isOverdue = nextVaccine.is_overdue;

  const formatDaysUntil = (days: number): string => {
    if (days === 0) return 'Bugün';
    if (days === 1) return 'Yarın';
    if (days < 0) return `${Math.abs(days)} gün gecikmiş`;
    return `${days} gün kaldı`;
  };

  const getDaysColor = (days: number, overdue: boolean): string => {
    if (overdue) return 'text-red-600';
    if (days <= 3) return 'text-orange-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-3xl border border-green-100 shadow-sm relative overflow-hidden">
      {/* Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <i className="fa-solid fa-syringe text-green-500"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Sıradaki Aşı</h3>
              {overdueCount > 0 && (
                <p className="text-xs text-red-600 font-bold">
                  {overdueCount} gecikmiş!
                </p>
              )}
            </div>
          </div>
          <Link
            href="/dashboard/saglik/asilar"
            className="text-green-600 hover:text-green-700 transition-colors"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>

        {/* Next Vaccine */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">
                {childName && `${childName} • `}
                {nextVaccine.vaccine.name_short || nextVaccine.vaccine.name}
              </p>
              <h4 className="font-bold text-slate-800 mb-2">
                {nextVaccine.vaccine.name}
              </h4>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-calendar text-gray-400 text-sm"></i>
                <span className="text-sm text-gray-600">
                  {new Date(nextVaccine.record.scheduled_date).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className={`mt-2 flex items-center gap-2 ${getDaysColor(daysUntil, isOverdue)}`}>
                <i className="fa-solid fa-clock text-sm"></i>
                <span className="text-sm font-bold">
                  {formatDaysUntil(daysUntil)}
                </span>
              </div>
            </div>
            {isOverdue && (
              <div className="flex-shrink-0">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Gecikmiş!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Other upcoming vaccines count */}
        {upcomingVaccines.length > 1 && (
          <p className="text-xs text-gray-600 mb-4">
            + {upcomingVaccines.length - 1} aşı daha yaklaşıyor
          </p>
        )}

        {/* Action Button */}
        <Link
          href="/dashboard/saglik/asilar"
          className="block w-full bg-green-500 text-white text-center py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors shadow-sm"
        >
          <i className="fa-solid fa-calendar-check mr-2"></i>
          Takvime Git
        </Link>
      </div>
    </div>
  );
}
