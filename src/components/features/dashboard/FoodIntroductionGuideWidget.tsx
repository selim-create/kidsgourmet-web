"use client";

import React from 'react';
import Link from 'next/link';

interface FoodIntroductionGuideWidgetProps {
  childAgeMonths: number;
  childName: string;
}

export default function FoodIntroductionGuideWidget({ childAgeMonths, childName }: FoodIntroductionGuideWidgetProps) {
  // Define allowed color keys as a type
  type ColorKey = 'blue' | 'green' | 'orange' | 'teal' | 'purple';
  
  // Determine age stage and content
  const getAgeStageInfo = (ageMonths: number): {
    stage: string;
    ageRange: string;
    tips: string[];
    warnings: string[];
    icon: string;
    color: ColorKey;
  } => {
    if (ageMonths < 6) {
      return {
        stage: 'Henüz Erken',
        ageRange: '0-6 Ay',
        tips: [
          'Anne sütü veya formula yeterlidir',
          '6. aya kadar ek gıda önerilmez',
          'Bebeğinizin hazırlık belirtilerini gözlemleyin'
        ],
        warnings: [
          'Ek gıdaya erken başlamak alerjik reaksiyon riskini artırabilir',
          'Bebeğinizin sindirim sistemi henüz hazır olmayabilir'
        ],
        icon: '🍼',
        color: 'blue'
      };
    } else if (ageMonths >= 6 && ageMonths < 8) {
      return {
        stage: 'İlk Tatlar (Başlangıç)',
        ageRange: '6-8 Ay',
        tips: [
          'Tek malzemeli yiyeceklerle başlayın',
          'Her yeni gıdayı 3 gün ara ile deneyin',
          'Püreler veya BLW yöntemiyle başlayabilirsiniz',
          'Demir açısından zengin besinlere öncelik verin'
        ],
        warnings: [
          'Bal kullanmayın (botulizm riski)',
          'Tuz ve şeker eklemeyin',
          'Boğulma riski olan besinlerden kaçının',
          'Alerjenlere dikkat edin'
        ],
        icon: '🥄',
        color: 'green'
      };
    } else if (ageMonths >= 8 && ageMonths < 10) {
      return {
        stage: 'Keşif Dönemi',
        ageRange: '8-10 Ay',
        tips: [
          'Doku çeşitliliğini artırın',
          'Parmak yiyecekleri tanıtın',
          'Bebeğin kendi yeme girişimlerini destekleyin',
          'Aile yemeklerine uygun versiyonlar hazırlayın'
        ],
        warnings: [
          'Sert besinleri yumuşatın veya ezin',
          'Yuvarlak besinleri (üzüm gibi) ikiye bölün',
          'Fındık ve sert kuruyemişlerden kaçının',
          'Çiğ bal, yumurta ve et vermeyin'
        ],
        icon: '🍎',
        color: 'orange'
      };
    } else if (ageMonths >= 10 && ageMonths < 12) {
      return {
        stage: 'Gelişim Aşaması',
        ageRange: '10-12 Ay',
        tips: [
          'Aile yemeklerine yaklaşın',
          'Kaşık kullanımını teşvik edin',
          'Çeşitli tatları ve dokuları tanıtın',
          'Düzenli öğün saatlerine geçiş yapın'
        ],
        warnings: [
          'Tuz ve şekeri minimal tutun',
          'İşlenmiş gıdalardan kaçının',
          'Boğulma riskini göz önünde bulundurun',
          'Su tüketimini unutmayın'
        ],
        icon: '🥗',
        color: 'teal'
      };
    } else {
      return {
        stage: 'Aile Sofrasına Geçiş',
        ageRange: '12-24 Ay',
        tips: [
          'Aile yemeklerine geçiş yapın',
          'Kendi başına yeme becerilerini geliştirin',
          'Çeşitli besin gruplarını dengeli sunun',
          'Sosyal yeme deneyimlerini artırın'
        ],
        warnings: [
          'Boğulma riski olan besinlere dikkat',
          'Tuz ve şeker kullanımını sınırlayın',
          'İşlenmiş ve paketli gıdalardan kaçının',
          'Alerjenleri dikkatli tanıtın'
        ],
        icon: '🍽️',
        color: 'purple'
      };
    }
  };

  const stageInfo = getAgeStageInfo(childAgeMonths);

  // Color mapping
  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-100',
      iconBg: 'bg-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600',
      text: 'text-blue-600'
    },
    green: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-100',
      iconBg: 'bg-green-500',
      button: 'bg-green-500 hover:bg-green-600',
      text: 'text-green-600'
    },
    orange: {
      bg: 'from-orange-50 to-amber-50',
      border: 'border-orange-100',
      iconBg: 'bg-orange-500',
      button: 'bg-orange-500 hover:bg-orange-600',
      text: 'text-orange-600'
    },
    teal: {
      bg: 'from-teal-50 to-cyan-50',
      border: 'border-teal-100',
      iconBg: 'bg-teal-500',
      button: 'bg-teal-500 hover:bg-teal-600',
      text: 'text-teal-600'
    },
    purple: {
      bg: 'from-purple-50 to-pink-50',
      border: 'border-purple-100',
      iconBg: 'bg-purple-500',
      button: 'bg-purple-500 hover:bg-purple-600',
      text: 'text-purple-600'
    }
  };

  const colors = colorClasses[stageInfo.color];

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-3xl border ${colors.border} p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${colors.iconBg} rounded-full flex items-center justify-center shadow-sm text-white text-xl`}>
            {stageInfo.icon}
          </div>
          <h3 className="font-bold text-stone-800">🥄 Ek Gıda Rehberi</h3>
        </div>
        <Link href="/tarifler" className={`text-sm ${colors.text} hover:underline font-medium`}>
          Detay
        </Link>
      </div>

      {/* Child Info */}
      <div className="mb-4">
        <p className="text-sm font-bold text-stone-800">{childName} ({childAgeMonths} aylık)</p>
      </div>

      {/* Current Stage */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{stageInfo.icon}</span>
          <div>
            <p className="text-xs text-stone-500 font-bold uppercase">Mevcut Aşama:</p>
            <p className="text-sm font-bold text-stone-800">{stageInfo.stage} ({stageInfo.ageRange})</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1">
          <span>🍎</span> Bu Dönemde:
        </p>
        <ul className="space-y-1.5">
          {stageInfo.tips.slice(0, 3).map((tip, idx) => (
            <li key={idx} className="text-xs text-stone-600 flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warnings */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
          <i className="fa-solid fa-triangle-exclamation"></i>
          Dikkat Edilmesi Gerekenler:
        </p>
        <ul className="space-y-1.5">
          {stageInfo.warnings.slice(0, 3).map((warning, idx) => (
            <li key={idx} className="text-xs text-amber-600 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>{warning}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <Link 
        href="/tarifler"
        className={`block w-full ${colors.button} text-white text-center py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm`}
      >
        <i className="fa-solid fa-utensils mr-2"></i>
        Yaşa Uygun Tarifleri Gör
      </Link>
    </div>
  );
}
