import React from 'react';

type ColorType = 'green' | 'red' | 'yellow' | 'orange' | 'blue';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: ColorType;
}

const colorClasses: Record<ColorType, string> = {
  green: 'bg-green-50 text-green-600 border-green-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className={`p-3 rounded-xl border ${colorClasses[color]} flex items-center gap-3`}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase opacity-70 mb-0.5">{label}</p>
        <p className="text-sm font-black">{value}</p>
      </div>
    </div>
  );
}
