'use client';

import { useSafetyCheck } from '@/hooks/useSafetyCheck';
import { SafetyAlert } from '@/services/safety-service';
import AlternativeRecipeList from './AlternativeRecipeList';

interface SafetyAlertBannerProps {
  recipeId: number;
  childId?: string;
}

const getSeverityStyles = (severity: 'critical' | 'warning' | 'info') => {
  switch (severity) {
    case 'critical':
      return 'bg-red-50 border-l-4 border-red-500';
    case 'warning':
      return 'bg-orange-50 border-l-4 border-orange-500';
    case 'info':
      return 'bg-blue-50 border-l-4 border-blue-500';
    default:
      return 'bg-gray-50 border-l-4 border-gray-500';
  }
};

const getSeverityIcon = (severity: 'critical' | 'warning' | 'info') => {
  switch (severity) {
    case 'critical':
      return '🛑';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '📌';
  }
};

const getSeverityTextColor = (severity: 'critical' | 'warning' | 'info') => {
  switch (severity) {
    case 'critical':
      return 'text-red-800';
    case 'warning':
      return 'text-orange-800';
    case 'info':
      return 'text-blue-800';
    default:
      return 'text-gray-800';
  }
};

function AlertItem({ alert }: { alert: SafetyAlert }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className={`text-sm font-semibold ${getSeverityTextColor(alert.severity)} mb-1`}>
        {getSeverityIcon(alert.severity)} {alert.message}
      </p>
      {alert.ingredient && (
        <p className="text-xs text-gray-700 ml-5">
          <strong>Malzeme:</strong> {alert.ingredient}
        </p>
      )}
      {alert.alternative && (
        <p className="text-xs text-gray-700 ml-5">
          <strong>Alternatif:</strong> {alert.alternative}
        </p>
      )}
    </div>
  );
}

export default function SafetyAlertBanner({ recipeId, childId }: SafetyAlertBannerProps) {
  const { safetyResult, isChecking, error } = useSafetyCheck(recipeId, childId);
  
  // Don't show if no child profile
  if (!childId) return null;
  
  // Show loading state
  if (isChecking) {
    return (
      <div className="bg-gray-50 border-l-4 border-gray-300 p-4 mb-6 rounded-lg">
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-3"></div>
          <p className="text-sm text-gray-600">Güvenlik kontrolleri yapılıyor...</p>
        </div>
      </div>
    );
  }
  
  // Don't show banner if recipe is safe, no result yet, or error occurred
  if (error || !safetyResult || safetyResult.is_safe) return null;
  
  // Alerts kontrolü - undefined olabilir
  const alerts = safetyResult.alerts || [];
  if (alerts.length === 0) return null;
  
  const highestSeverity = alerts.reduce((max, alert) => {
    if (alert.severity === 'critical') return 'critical';
    if (alert.severity === 'warning' && max !== 'critical') return 'warning';
    return max;
  }, 'info' as 'critical' | 'warning' | 'info');
  
  return (
    <div className={`p-4 rounded-lg mb-6 ${getSeverityStyles(highestSeverity)}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className={`text-sm font-bold ${getSeverityTextColor(highestSeverity)} mb-3`}>
            Güvenlik Uyarıları
          </h3>
          
          {alerts.map((alert, i) => (
            <AlertItem key={i} alert={alert} />
          ))}
          
          {safetyResult.alternatives && safetyResult.alternatives.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className={`font-bold text-sm ${getSeverityTextColor(highestSeverity)} mb-3`}>
                Güvenli Alternatifler:
              </p>
              <AlternativeRecipeList recipes={safetyResult.alternatives} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
