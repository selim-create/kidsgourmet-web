'use client';

import { useNutritionSummary } from '@/hooks/useNutritionSummary';

interface NutritionSummaryCardProps {
  childId: string;
}

export default function NutritionSummaryCard({ childId }: NutritionSummaryCardProps) {
  const { summary, isLoading, error } = useNutritionSummary(childId);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return null; // Silently fail
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          <i className="fa-solid fa-chart-pie text-orange-500 mr-2"></i>
          Haftalık Beslenme Özeti
        </h2>
        <div className="text-xs text-gray-500">
          {formatDate(weekStart)} - {formatDate(weekEnd)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {nutrients.map((nutrient) => (
          <div key={nutrient.label} className={`p-4 rounded-lg ${nutrient.color}`}>
            <div className="text-2xl mb-2">{nutrient.icon}</div>
            <div className="text-2xl font-bold mb-1">{nutrient.value}</div>
            <div className="text-xs font-medium">{nutrient.label}</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
            {Math.round((summary?.variety_score ?? 0) / 10)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Çeşitlilik Skoru</div>
            <div className="text-xs text-gray-600">10 üzerinden</div>
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
