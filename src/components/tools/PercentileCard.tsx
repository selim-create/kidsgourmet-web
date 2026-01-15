import React from 'react';

interface PercentileCardProps {
  title: string;
  value: number;
  unit: string;
  percentile: number;
  category: 'very_low' | 'low' | 'normal' | 'high' | 'very_high';
  interpretation: string;
  zScore?: number;
}

export default function PercentileCard({
  title,
  value,
  unit,
  percentile,
  category,
  interpretation,
  zScore,
}: PercentileCardProps) {
  const getCategoryStyles = (cat: PercentileCardProps['category']) => {
    switch (cat) {
      case 'very_low':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
          badge: 'bg-red-100 text-red-700',
          icon: '⚠️',
        };
      case 'low':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-700',
          icon: '⚡',
        };
      case 'normal':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-600',
          badge: 'bg-green-100 text-green-700',
          icon: '✅',
        };
      case 'high':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-700',
          icon: '⚡',
        };
      case 'very_high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
          badge: 'bg-red-100 text-red-700',
          icon: '⚠️',
        };
    }
  };

  const styles = getCategoryStyles(category);

  return (
    <div className={`${styles.bg} ${styles.border} border-2 rounded-2xl p-6 transition-all hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <span className="text-2xl">{styles.icon}</span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-slate-800">{value}</span>
          <span className="text-xl text-slate-600">{unit}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className={`inline-block px-4 py-2 rounded-full ${styles.badge} font-bold text-sm`}>
          {percentile}. persentil
        </div>
        
        {zScore !== undefined && (
          <div className="text-sm text-slate-600">
            Z-skoru: <span className="font-semibold">{zScore.toFixed(2)}</span>
          </div>
        )}
        
        <p className={`text-sm ${styles.text} font-medium`}>
          {interpretation}
        </p>
      </div>
    </div>
  );
}
