"use client";

import React from 'react';
import Link from 'next/link';
import { PercentileResult } from '@/lib/types';
import { formatDate } from '@/utils/helpers';

interface GrowthTrackingWidgetProps {
  results: PercentileResult[];
  childId: string;
  childName: string;
}

export default function GrowthTrackingWidget({ results, childId, childName }: GrowthTrackingWidgetProps) {
  // Filter results for active child only
  const childResults = results.filter(r => r.child_id === childId);
  
  if (childResults.length === 0) {
    return null;
  }

  // Get the most recent result
  const latestResult = childResults[0];

  // Interpret percentile with category
  const interpretPercentile = (percentile: number, category: string): string => {
    if (category === 'very_low') return '<%3';
    if (category === 'low') return '%3-15';
    if (category === 'normal') return '%15-85';
    if (category === 'high') return '%85-97';
    if (category === 'very_high') return '>%97';
    return `%${Math.round(percentile)}`;
  };

  // Get color for category
  const getCategoryColor = (category: string): { bg: string; text: string; icon: string } => {
    if (category === 'very_low' || category === 'very_high') {
      return { bg: 'bg-red-100', text: 'text-red-700', icon: '🔴' };
    }
    if (category === 'low' || category === 'high') {
      return { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🟡' };
    }
    return { bg: 'bg-green-100', text: 'text-green-700', icon: '🟢' };
  };

  // Get measurement by type
  const getMeasurement = (type: string) => {
    return latestResult.percentiles.find(p => p.measurement_type === type);
  };

  const weightMeasurement = getMeasurement('weight_for_age');
  const heightMeasurement = getMeasurement('height_for_age');
  const headMeasurement = getMeasurement('head_for_age');

  // Count critical red flags
  const criticalFlags = latestResult.red_flags.filter(f => f.severity === 'critical');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-chart-line text-blue-500"></i>
          </div>
          <h3 className="font-bold text-stone-800">📈 Büyüme Takibi</h3>
        </div>
        <Link href="/akilli-asistan/persentil" className="text-sm text-blue-600 hover:underline font-medium">
          Yeni Ölçüm
        </Link>
      </div>

      {/* Child Info */}
      <div className="mb-4">
        <p className="text-sm font-bold text-stone-800">👶 {childName} için son ölçüm</p>
        <p className="text-xs text-stone-500">📅 {formatDate(latestResult.created_at)}</p>
      </div>

      {/* Measurements Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Weight */}
        {weightMeasurement && latestResult.measurement.weight_kg !== undefined && (
          <div className={`p-3 rounded-xl ${getCategoryColor(weightMeasurement.category).bg}`}>
            <div className="text-center">
              <div className="text-lg mb-1">⚖️</div>
              <div className="text-xs font-bold text-stone-600 mb-1">Kilo</div>
              <div className="text-sm font-bold text-stone-800">
                {latestResult.measurement.weight_kg} kg
              </div>
              <div className={`text-xs font-bold mt-1 ${getCategoryColor(weightMeasurement.category).text}`}>
                {interpretPercentile(weightMeasurement.percentile, weightMeasurement.category)}
              </div>
              <div className="text-base mt-1">
                {getCategoryColor(weightMeasurement.category).icon}
              </div>
            </div>
          </div>
        )}

        {/* Height */}
        {heightMeasurement && latestResult.measurement.height_cm !== undefined && (
          <div className={`p-3 rounded-xl ${getCategoryColor(heightMeasurement.category).bg}`}>
            <div className="text-center">
              <div className="text-lg mb-1">📏</div>
              <div className="text-xs font-bold text-stone-600 mb-1">Boy</div>
              <div className="text-sm font-bold text-stone-800">
                {latestResult.measurement.height_cm} cm
              </div>
              <div className={`text-xs font-bold mt-1 ${getCategoryColor(heightMeasurement.category).text}`}>
                {interpretPercentile(heightMeasurement.percentile, heightMeasurement.category)}
              </div>
              <div className="text-base mt-1">
                {getCategoryColor(heightMeasurement.category).icon}
              </div>
            </div>
          </div>
        )}

        {/* Head Circumference */}
        {headMeasurement && latestResult.measurement.head_circumference_cm !== undefined && (
          <div className={`p-3 rounded-xl ${getCategoryColor(headMeasurement.category).bg}`}>
            <div className="text-center">
              <div className="text-lg mb-1">🧠</div>
              <div className="text-xs font-bold text-stone-600 mb-1">Baş Çev.</div>
              <div className="text-sm font-bold text-stone-800">
                {latestResult.measurement.head_circumference_cm} cm
              </div>
              <div className={`text-xs font-bold mt-1 ${getCategoryColor(headMeasurement.category).text}`}>
                {interpretPercentile(headMeasurement.percentile, headMeasurement.category)}
              </div>
              <div className="text-base mt-1">
                {getCategoryColor(headMeasurement.category).icon}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Critical Red Flags Warning */}
      {criticalFlags.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-triangle-exclamation text-red-500 mt-0.5"></i>
            <div className="flex-1">
              <p className="text-xs font-bold text-red-700 mb-1">
                ⚠️ DİKKAT: {criticalFlags.length} kritik uyarı var
              </p>
              <ul className="text-xs text-red-600 space-y-1">
                {criticalFlags.slice(0, 2).map((flag, idx) => (
                  <li key={idx}>• {flag.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <Link 
        href="/akilli-asistan/persentil"
        className="block w-full bg-blue-500 text-white text-center py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm"
      >
        <i className="fa-solid fa-chart-line mr-2"></i>
        Detaylı Raporu Gör
      </Link>
    </div>
  );
}
