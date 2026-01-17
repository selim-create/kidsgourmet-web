'use client';

import { useNutritionSummary } from '@/hooks/useNutritionSummary';
import Link from 'next/link';

interface NutritionSummaryCardProps {
  childId: string;
}

export default function NutritionSummaryCard({ childId }: NutritionSummaryCardProps) {
  const { summary, isLoading, error } = useNutritionSummary(childId);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return null; // Silently fail
  }

  // Check if data is empty/all zeros
  const hasData = summary && (
    (summary.protein_servings ?? 0) > 0 || 
    (summary.vegetable_servings ?? 0) > 0 || 
    (summary.fruit_servings ?? 0) > 0 ||
    (summary.grains_servings ?? 0) > 0 ||
    (summary.dairy_servings ?? 0) > 0 ||
    (summary.iron_rich_count ?? 0) > 0
  );

  // Show empty state if no data
  if (!hasData) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <i className="fa-solid fa-chart-pie text-orange-500"></i>
          Haftalık Beslenme Özeti
        </h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-utensils text-orange-500 text-2xl"></i>
          </div>
          <p className="text-gray-600 mb-4">
            Henüz yeterli veri yok. Haftalık plan oluşturarak beslenme takibi yapabilirsiniz.
          </p>
          <Link 
            href="/dashboard/haftalik-plan"
            className="inline-flex items-center bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Plan Oluştur
          </Link>
        </div>
      </div>
    );
  }

  // Bugünün tarihini hesapla
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // Pazartesi
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };
  
  const nutrients = [
    { 
      label: 'Protein', 
      value: summary?.protein_servings ?? 0, 
      icon: '🥩',
      color: 'bg-red-100 text-red-800'
    },
    { 
      label: 'Sebze', 
      value: summary?.vegetable_servings ?? 0, 
      icon: '🥦',
      color: 'bg-green-100 text-green-800'
    },
    { 
      label: 'Meyve', 
      value: summary?.fruit_servings ?? 0, 
      icon: '🍎',
      color: 'bg-orange-100 text-orange-800'
    },
    { 
      label: 'Tahıl', 
      value: summary?.grains_servings ?? 0, 
      icon: '🌾',
      color: 'bg-yellow-100 text-yellow-800'
    },
    { 
      label: 'Süt Ürünü', 
      value: summary?.dairy_servings ?? 0, 
      icon: '🥛',
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      label: 'Demir', 
      value: summary?.iron_rich_count ?? 0, 
      icon: '⚙️',
      color: 'bg-purple-100 text-purple-800'
    }
  ];
  
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-chart-pie text-orange-500"></i>
          Haftalık Beslenme Özeti
        </h2>
        <div className="text-xs text-gray-500">
          {formatDate(weekStart)} - {formatDate(weekEnd)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {nutrients.map((nutrient) => (
          <div key={nutrient.label} className={`p-3 rounded-xl ${nutrient.color}`}>
            <div className="text-xl mb-1">{nutrient.icon}</div>
            <div className="text-2xl font-bold mb-1">{nutrient.value}</div>
            <div className="text-xs font-medium">{nutrient.label}</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
            {(summary?.variety_score ?? 0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Çeşitlilik Skoru</div>
            <div className="text-xs text-gray-600">100 üzerinden</div>
          </div>
        </div>
        <div className="text-right text-xs text-gray-500">
          {(summary?.variety_score ?? 0) >= 70 && (
            <p>Harika gidiyorsunuz! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}
