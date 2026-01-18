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
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-stone-100">
        <h2 className="font-display font-black text-xl text-stone-900 flex items-center gap-2 mb-4">
          📊 Haftalık Beslenme Özeti
        </h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-orange-100">
            <i className="fa-solid fa-utensils text-orange-500 text-2xl"></i>
          </div>
          <p className="text-stone-600 mb-4 text-sm">
            Henüz yeterli veri yok. Haftalık plan oluşturarak beslenme takibi yapabilirsiniz.
          </p>
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
    <div className="bg-white rounded-3xl shadow-sm p-6 border border-stone-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-xl text-stone-900 flex items-center gap-2">
          📊 Haftalık Beslenme Özeti
        </h2>
        <div className="text-xs text-stone-500 font-medium">
          {formatDate(weekStart)} - {formatDate(weekEnd)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {nutrients.map((nutrient) => (
          <div key={nutrient.label} className="bg-stone-50 p-4 rounded-xl border border-stone-100">
            <div className="text-2xl mb-2">{nutrient.icon}</div>
            <div className="text-2xl font-black text-stone-900 mb-1">{nutrient.value}</div>
            <div className="text-xs font-bold text-stone-600">{nutrient.label}</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-black text-xl shadow-sm">
          {(summary?.variety_score ?? 0)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-stone-900">Çeşitlilik Skoru</div>
          <div className="text-xs text-stone-500 mt-0.5">
            {(summary?.variety_score ?? 0) >= 70 ? 'Harika gidiyorsunuz! 🎉' : '100 üzerinden'}
          </div>
        </div>
      </div>
    </div>
  );
}
