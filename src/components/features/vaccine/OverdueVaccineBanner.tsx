"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UpcomingVaccine } from '@/lib/types';
import { vaccineService } from '@/services/vaccine-service';

interface OverdueVaccineBannerProps {
  childId: string;
  childName?: string;
}

export default function OverdueVaccineBanner({ childId, childName }: OverdueVaccineBannerProps) {
  const [overdueVaccines, setOverdueVaccines] = useState<UpcomingVaccine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchOverdueVaccines = async () => {
      try {
        setIsLoading(true);
        const vaccines = await vaccineService.getOverdueVaccines(childId);
        // Defense in depth: ensure array even though service guarantees it
        setOverdueVaccines(Array.isArray(vaccines) ? vaccines : []);
      } catch (err) {
        console.error('Failed to fetch overdue vaccines:', err);
        setOverdueVaccines([]); // Empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverdueVaccines();
  }, [childId]);

  if (isLoading || overdueVaccines.length === 0 || isDismissed) {
    return null;
  }

  const overdueCount = overdueVaccines.length;
  const mostOverdue = overdueVaccines[0];
  const daysOverdue = Math.abs(mostOverdue.days_until);

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="relative z-10">
        {/* Close button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-0 right-0 w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          aria-label="Kapat"
        >
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md">
            <i className="fa-solid fa-triangle-exclamation text-xl"></i>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Aşı Gecikmiş Görünüyor
            </h3>
            <p className="text-sm text-slate-700 mb-3">
              {childName ? `${childName} için ` : ''}
              <strong className="text-red-600">{overdueCount}</strong> aşı{' '}
              {overdueCount > 1 ? 'gecikmiş' : 'gecikmiş'}. 
              {mostOverdue && (
                <>
                  {' '}En geç olan <strong>{mostOverdue.vaccine.name_short || mostOverdue.vaccine.name}</strong> aşısı{' '}
                  <strong className="text-red-600">{daysOverdue} gün</strong> gecikmiş.
                </>
              )}
            </p>

            {/* Recommendations */}
            <div className="bg-white/70 rounded-xl p-4 mb-4 border border-red-100">
              <p className="text-sm font-bold text-slate-800 mb-2">
                <i className="fa-solid fa-lightbulb text-amber-500 mr-1"></i>
                Öneriler:
              </p>
              <ul className="space-y-1 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>En kısa sürede Aile Sağlığı Merkezi (ASM) ile iletişime geçin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Gecikmiş aşılar için yeni randevu planlayın</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Aşı takvimini güncel tutmak çocuğunuzun sağlığı için önemlidir</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/saglik/asilar"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-sm"
              >
                <i className="fa-solid fa-calendar-check"></i>
                Aşı Takvimini Gör
              </Link>
              <a
                href="tel:182"
                className="inline-flex items-center gap-2 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors"
              >
                <i className="fa-solid fa-phone"></i>
                ALO 182 SABİM'i Ara
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
