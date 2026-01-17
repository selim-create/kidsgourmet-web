"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { useActiveChild } from '@/contexts/ActiveChildContext';
import { vaccineService } from '@/services/vaccine-service';
import { VaccineSchedule, VaccineRecord, VaccineSideEffects, AddPrivateVaccineRequest } from '@/lib/types';
import VaccineTimeline from '@/components/features/vaccine/VaccineTimeline';
import VaccineMarkDoneModal from '@/components/features/vaccine/VaccineMarkDoneModal';
import SideEffectModal from '@/components/features/vaccine/SideEffectModal';
import PrematureWarning from '@/components/features/vaccine/PrematureWarning';
import PrivateVaccineWizard from '@/components/features/vaccine/PrivateVaccineWizard';
import OverdueVaccineBanner from '@/components/features/vaccine/OverdueVaccineBanner';
import { toast } from 'sonner';

export default function VaccinePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const { activeChild, children } = useActiveChild();
  const [schedule, setSchedule] = useState<VaccineSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [markDoneModal, setMarkDoneModal] = useState<{
    isOpen: boolean;
    record: VaccineRecord | null;
  }>({ isOpen: false, record: null });
  
  const [sideEffectModal, setSideEffectModal] = useState<{
    isOpen: boolean;
    record: VaccineRecord | null;
    fromMarkDone: boolean;
  }>({ isOpen: false, record: null, fromMarkDone: false });

  const [privateVaccineWizard, setPrivateVaccineWizard] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard/saglik/asilar');
    }
  }, [userLoading, isAuthenticated, router]);

  // Fetch vaccine schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!activeChild) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await vaccineService.getVaccineSchedule(activeChild.id);
        setSchedule(data);
      } catch (err) {
        console.error('Failed to fetch vaccine schedule:', err);
        setError('Aşı takvimi yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [activeChild]);

  // Handle mark as done
  const handleMarkDone = (record: VaccineRecord) => {
    setMarkDoneModal({ isOpen: true, record });
  };

  const handleMarkDoneSubmit = async (date: string, notes: string, askSideEffects: boolean) => {
    if (!activeChild || !markDoneModal.record) return;

    try {
      const updatedSchedule = await vaccineService.markVaccineDone({
        child_id: activeChild.id,
        vaccine_code: markDoneModal.record.vaccine.code,
        actual_date: date,
        notes: notes || undefined,
      });

      setSchedule(updatedSchedule);
      setMarkDoneModal({ isOpen: false, record: null });
      
      toast.success('Aşı başarıyla kaydedildi!');

      // Open side effect modal if requested
      if (askSideEffects) {
        // Find the updated record
        const updatedRecord = updatedSchedule.vaccines.find(
          v => v.vaccine.code === markDoneModal.record!.vaccine.code
        );
        if (updatedRecord) {
          setSideEffectModal({
            isOpen: true,
            record: updatedRecord,
            fromMarkDone: true,
          });
        }
      }
    } catch (err) {
      console.error('Failed to mark vaccine as done:', err);
      toast.error('Aşı kaydedilemedi. Lütfen tekrar deneyin.');
    }
  };

  // Handle side effect reporting
  const handleReportSideEffect = (record: VaccineRecord) => {
    setSideEffectModal({ isOpen: true, record, fromMarkDone: false });
  };

  const handleSideEffectSubmit = async (
    sideEffects: VaccineSideEffects,
    severity: 'none' | 'mild' | 'moderate' | 'severe',
    notes: string,
    feverTemp?: number
  ) => {
    if (!sideEffectModal.record) return;

    try {
      await vaccineService.reportSideEffect({
        record_id: sideEffectModal.record.id,
        side_effects: sideEffects,
        severity,
        notes: notes || undefined,
      });

      // Refresh schedule
      if (activeChild) {
        const updatedSchedule = await vaccineService.getVaccineSchedule(activeChild.id);
        setSchedule(updatedSchedule);
      }

      setSideEffectModal({ isOpen: false, record: null, fromMarkDone: false });
      toast.success('Yan etki bildirimi kaydedildi. Teşekkür ederiz!');
    } catch (err) {
      console.error('Failed to report side effect:', err);
      toast.error('Yan etki bildirimi kaydedilemedi. Lütfen tekrar deneyin.');
    }
  };

  // Handle private vaccine wizard
  const handlePrivateVaccineSubmit = async (request: AddPrivateVaccineRequest) => {
    if (!activeChild) return;

    try {
      const updatedSchedule = await vaccineService.addPrivateVaccine(request);
      setSchedule(updatedSchedule);
      setPrivateVaccineWizard(false);
      toast.success('Özel aşı takvime eklendi!');
    } catch (err) {
      console.error('Failed to add private vaccine:', err);
      toast.error('Özel aşı eklenemedi. Lütfen tekrar deneyin.');
    }
  };

  // Loading state
  if (userLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Aşı takvimi yükleniyor...</p>
        </div>
      </div>
    );
  }

  // No child selected
  if (!activeChild) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-baby text-green-500 text-3xl"></i>
          </div>
          <h2 className="font-bold text-xl text-slate-800 mb-2">Çocuk Seçilmedi</h2>
          <p className="text-gray-600 mb-6">
            Aşı takvimini görüntülemek için lütfen bir çocuk seçin veya ekleyin.
          </p>
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
          >
            <i className="fa-solid fa-plus"></i>
            Çocuk Ekle
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-exclamation-triangle text-red-500 text-3xl"></i>
          </div>
          <h2 className="font-bold text-xl text-slate-800 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span className="text-sm font-medium">Dashboard'a Dön</span>
          </Link>
          
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display font-bold text-3xl text-slate-800 flex items-center gap-3">
              <i className="fa-solid fa-syringe text-green-500"></i>
              Aşı Takvimi
            </h1>
            <button
              onClick={() => setPrivateVaccineWizard(true)}
              className="hidden md:flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-600 transition-colors"
            >
              <i className="fa-solid fa-plus"></i>
              Özel Aşı Ekle
            </button>
          </div>
          
          {schedule && (
            <p className="text-gray-600">
              {activeChild.name} için {schedule.schedule_version} aşı takvimi
            </p>
          )}
        </div>

        {/* Stats Cards */}
        {schedule && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Toplam</p>
              <p className="text-2xl font-bold text-slate-800">{schedule.stats?.total ?? 0}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 shadow-sm">
              <p className="text-xs text-green-600 mb-1">Yapılan</p>
              <p className="text-2xl font-bold text-green-700">{schedule.stats?.done ?? 0}</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 shadow-sm">
              <p className="text-xs text-blue-600 mb-1">Bekleyen</p>
              <p className="text-2xl font-bold text-blue-700">{schedule.stats?.upcoming ?? 0}</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100 shadow-sm">
              <p className="text-xs text-red-600 mb-1">Geciken</p>
              <p className="text-2xl font-bold text-red-700">{schedule.stats?.overdue ?? 0}</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 shadow-sm">
              <p className="text-xs text-purple-600 mb-1">Tamamlanma</p>
              <p className="text-2xl font-bold text-purple-700">
                {Math.round(schedule.stats?.completion_percentage ?? 0)}%
              </p>
            </div>
          </div>
        )}

        {/* Premature Warning */}
        {schedule && <PrematureWarning isPremature={schedule.is_premature} />}

        {/* Overdue Vaccine Banner */}
        {schedule && (schedule.stats?.overdue ?? 0) > 0 && (
          <div className="mb-6">
            <OverdueVaccineBanner 
              childId={activeChild.id} 
              childName={activeChild.name}
            />
          </div>
        )}

        {/* Timeline */}
        {schedule && (
          <VaccineTimeline
            vaccines={schedule.vaccines}
            onMarkDone={handleMarkDone}
            onReportSideEffect={handleReportSideEffect}
          />
        )}

        {/* Mobile: Özel Aşı Ekle Button */}
        <div className="md:hidden fixed bottom-20 right-4 z-30">
          <button
            onClick={() => setPrivateVaccineWizard(true)}
            className="flex items-center justify-center w-14 h-14 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-all hover:scale-105"
          >
            <i className="fa-solid fa-plus text-xl"></i>
          </button>
        </div>
      </div>

      {/* Modals */}
      <VaccineMarkDoneModal
        isOpen={markDoneModal.isOpen}
        record={markDoneModal.record}
        onClose={() => setMarkDoneModal({ isOpen: false, record: null })}
        onSubmit={handleMarkDoneSubmit}
      />

      <SideEffectModal
        isOpen={sideEffectModal.isOpen}
        record={sideEffectModal.record}
        onClose={() => setSideEffectModal({ isOpen: false, record: null, fromMarkDone: false })}
        onSubmit={handleSideEffectSubmit}
      />

      <PrivateVaccineWizard
        isOpen={privateVaccineWizard}
        childId={activeChild?.id || ''}
        onClose={() => setPrivateVaccineWizard(false)}
        onSubmit={handlePrivateVaccineSubmit}
      />
    </div>
  );
}
