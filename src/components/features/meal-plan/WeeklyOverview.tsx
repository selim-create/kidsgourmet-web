'use client';

import React from 'react';
import Link from 'next/link';
import { useMealPlan } from '@/hooks/useMealPlan';

interface WeeklyOverviewProps {
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

export default function WeeklyOverview({ onDateSelect, selectedDate }: WeeklyOverviewProps) {
  const { plan, isLoading } = useMealPlan();

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-xl text-stone-900">📅 Haftalık Bakış</h2>
        </div>
        <div className="animate-pulse grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-24 bg-stone-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!plan?.days || plan.days.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-xl text-stone-900">📅 Haftalık Bakış</h2>
          <Link href="/dashboard/haftalik-plan" className="text-sm font-bold text-orange-500 hover:underline">
            Plan Oluştur
          </Link>
        </div>
        <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-orange-100">
            <i className="fa-solid fa-calendar-xmark text-orange-500 text-2xl"></i>
          </div>
          <p className="text-stone-600 mb-4 text-sm">Bu hafta için plan oluşturulmamış</p>
          <Link 
            href="/dashboard/haftalik-plan"
            className="inline-flex items-center bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Plan Oluştur
          </Link>
        </div>
      </div>
    );
  }

  // Get today's date for comparison
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-xl text-stone-900">📅 Haftalık Bakış</h2>
        <Link href="/dashboard/haftalik-plan" className="text-sm font-bold text-orange-500 hover:underline">
          Detaylı Plan
        </Link>
      </div>

      {/* Days Grid - All clickable */}
      <div className="grid grid-cols-7 gap-2">
        {plan.days.map((day) => {
          const isToday = day.date === today;
          const isSelected = day.date === selectedDate;
          
          // Calculate filled/empty slots
          const filledSlots = day.slots.filter(slot => slot.status === 'filled').length;
          const totalSlots = day.slots.length;
          const emptySlots = totalSlots - filledSlots;
          
          return (
            <button
              key={day.date}
              onClick={() => onDateSelect(day.date)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all border-2 ${
                isSelected
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105'
                  : isToday
                  ? 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-300'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-orange-200 hover:bg-orange-50'
              }`}
            >
              <span className={`text-[10px] font-black uppercase mb-1 ${
                isSelected ? 'text-white/80' : isToday ? 'text-orange-500' : 'text-stone-400'
              }`}>
                {day.day_name.substring(0, 3)}
              </span>
              <span className="text-lg font-bold mb-1">
                {new Date(day.date).getDate()}
              </span>
              
              {/* Fill status indicator */}
              <div className="flex items-center gap-0.5 mt-1">
                {filledSlots > 0 && (
                  <div className={`text-[8px] font-bold ${
                    isSelected ? 'text-white' : 'text-green-600'
                  }`}>
                    {filledSlots}
                  </div>
                )}
                {emptySlots > 0 && (
                  <div className={`text-[8px] font-bold ${
                    isSelected ? 'text-white/60' : 'text-stone-400'
                  }`}>
                    {emptySlots > 0 && filledSlots > 0 ? `/${emptySlots}` : emptySlots}
                  </div>
                )}
              </div>
              
              {isToday && !isSelected && (
                <span className="text-[8px] mt-0.5 text-orange-500">●</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
