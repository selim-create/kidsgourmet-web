'use client';

import { useIngredientSafety } from '@/hooks/useSafetyCheck';

interface IngredientSafetyBadgeProps {
  ingredientId: number;
  childId?: string;
}

export default function IngredientSafetyBadge({ ingredientId, childId }: IngredientSafetyBadgeProps) {
  const { safetyResult, isChecking } = useIngredientSafety(ingredientId, childId);
  
  // Don't show if no child profile
  if (!childId) return null;
  
  // Show loading state
  if (isChecking) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
        <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></div>
        Kontrol ediliyor...
      </span>
    );
  }
  
  // Don't show if no result yet
  if (!safetyResult) return null;
  
  // Safe - show green badge
  if (safetyResult.is_safe) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
        <i className="fa-solid fa-check-circle mr-1"></i>
        Güvenli
      </span>
    );
  }
  
  // Has alerts - determine severity
  const hasCritical = safetyResult.alerts.some(a => a.severity === 'critical');
  const hasWarning = safetyResult.alerts.some(a => a.severity === 'warning');
  
  if (hasCritical) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
        <i className="fa-solid fa-exclamation-circle mr-1"></i>
        Uygun Değil
      </span>
    );
  }
  
  if (hasWarning) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
        <i className="fa-solid fa-triangle-exclamation mr-1"></i>
        Dikkat
      </span>
    );
  }
  
  // Info only
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
      <i className="fa-solid fa-info-circle mr-1"></i>
      Bilgi
    </span>
  );
}
