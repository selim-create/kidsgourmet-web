"use client";

import React from 'react';
import Link from 'next/link';
import { BLWTestResult } from '@/lib/types';
import { formatDate } from '@/utils/helpers';

interface BLWReadinessWidgetProps {
  results: BLWTestResult[];
  childId: string;
  childName: string;
}

export default function BLWReadinessWidget({ results, childId, childName }: BLWReadinessWidgetProps) {
  // Filter results for active child only
  const childResults = results.filter(r => r.child_id === childId);
  
  if (childResults.length === 0) {
    return null;
  }

  // Get the most recent result
  const latestResult = childResults[0];

  // Get result category info based on score
  const getResultCategoryInfo = (score: number): { 
    text: string; 
    description: string;
    emoji: string; 
    bg: string;
    textColor: string;
  } => {
    if (score >= 80) {
      return { 
        text: 'HAZIR', 
        description: 'Ek gıdaya başlayabilir! 🎉',
        emoji: '🟢', 
        bg: 'bg-green-500',
        textColor: 'text-green-700'
      };
    }
    if (score >= 55) {
      return { 
        text: 'NEREDEYSE HAZIR', 
        description: 'Neredeyse hazır, birkaç hafta bekleyin',
        emoji: '🟡', 
        bg: 'bg-amber-500',
        textColor: 'text-amber-700'
      };
    }
    return { 
      text: 'HENÜZ DEĞİL', 
      description: 'Henüz hazır değil, bekleyin',
      emoji: '🔴', 
      bg: 'bg-red-500',
      textColor: 'text-red-700'
    };
  };

  const categoryInfo = getResultCategoryInfo(latestResult.score);
  const criticalFlags = latestResult.red_flags.filter(f => f.severity === 'critical');
  const warningFlags = latestResult.red_flags.filter(f => f.severity === 'warning');

  // Get ready criteria based on common BLW readiness signs
  const getReadinessCriteria = (score: number) => {
    if (score >= 80) {
      return [
        { text: 'Desteksiz oturabiliyor', icon: '✅' },
        { text: 'Baş kontrolü tam', icon: '✅' },
        { text: 'Yiyeceklere ilgi gösteriyor', icon: '✅' }
      ];
    } else if (score >= 55) {
      return [
        { text: 'Desteksiz oturma gelişiyor', icon: '⏳' },
        { text: 'Baş kontrolü iyi', icon: '✅' },
        { text: 'Yiyeceklere ilgi başlıyor', icon: '⏳' }
      ];
    }
    return [
      { text: 'Desteksiz oturma henüz yok', icon: '⏰' },
      { text: 'Baş kontrolü gelişiyor', icon: '⏳' },
      { text: 'Yiyeceklere ilgi az', icon: '⏰' }
    ];
  };

  const readinessCriteria = getReadinessCriteria(latestResult.score);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-baby text-green-500"></i>
          </div>
          <h3 className="font-bold text-stone-800">👶 BLW Hazırlık</h3>
        </div>
        <Link href="/akilli-asistan/blw-testi" className="text-sm text-green-600 hover:underline font-medium">
          Test Et
        </Link>
      </div>

      {/* Child Info */}
      <div className="mb-4">
        <p className="text-sm font-bold text-stone-800">{childName} için son test</p>
        <p className="text-xs text-stone-500">📅 {formatDate(latestResult.created_at)}</p>
      </div>

      {/* Score Display */}
      <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
        <div className="text-center">
          <div className="text-4xl font-bold text-stone-800 mb-2">
            {Math.round(latestResult.score)}
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${categoryInfo.bg} text-white font-bold text-sm mb-2`}>
            <span>{categoryInfo.emoji}</span>
            <span>{categoryInfo.text}</span>
          </div>
          <p className={`text-sm font-medium ${categoryInfo.textColor} mt-2`}>
            {categoryInfo.description}
          </p>
        </div>
      </div>

      {/* Readiness Criteria */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm space-y-2">
        {readinessCriteria.map((criterion, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="text-base">{criterion.icon}</span>
            <span className="text-stone-700">{criterion.text}</span>
          </div>
        ))}
      </div>

      {/* Red Flags Warning */}
      {(criticalFlags.length > 0 || warningFlags.length > 0) && (
        <div className={`${criticalFlags.length > 0 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded-xl p-3 mb-4`}>
          <div className="flex items-start gap-2">
            <i className={`fa-solid fa-triangle-exclamation ${criticalFlags.length > 0 ? 'text-red-500' : 'text-amber-500'} mt-0.5`}></i>
            <div className="flex-1">
              <p className={`text-xs font-bold ${criticalFlags.length > 0 ? 'text-red-700' : 'text-amber-700'} mb-1`}>
                ⚠️ DİKKAT
              </p>
              <ul className={`text-xs ${criticalFlags.length > 0 ? 'text-red-600' : 'text-amber-600'} space-y-1`}>
                {[...criticalFlags, ...warningFlags].slice(0, 2).map((flag, idx) => (
                  <li key={idx}>• {flag.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <Link 
        href="/akilli-asistan/blw-testi"
        className="block w-full bg-green-500 text-white text-center py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors shadow-sm"
      >
        <i className="fa-solid fa-baby mr-2"></i>
        Detaylı Sonucu Gör
      </Link>
    </div>
  );
}
