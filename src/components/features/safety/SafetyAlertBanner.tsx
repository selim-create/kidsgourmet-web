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
  const { safetyResult, isChecking, error, isApiError } = useSafetyCheck(recipeId, childId);
  
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

  // API hatası durumunda bilgilendirme göster (güvenli varsaymak yerine)
  if (error || isApiError) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-info-circle text-blue-500 text-xl mt-0.5"></i>
          <div>
            <p className="font-medium text-blue-800">Güvenlik Kontrolü Yapılamadı</p>
            <p className="text-sm text-blue-600 mt-1">
              Bu tarifin çocuğunuz için uygunluğunu şu an kontrol edemiyoruz. 
              Lütfen malzemeleri kendiniz kontrol edin.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Check for age warnings first (even if is_safe is true)
  const ageWarnings = safetyResult?.alerts?.filter(a => a.type === 'age') || [];
  
  if (ageWarnings.length > 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-clock text-amber-500 text-xl mt-0.5"></i>
          <div>
            <p className="font-medium text-amber-800">Yaş Grubu Uyarısı</p>
            {ageWarnings.map((alert, i) => (
              <p key={i} className="text-sm text-amber-600 mt-1">{alert.message}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Show green success message if recipe is safe
  if (!safetyResult || safetyResult.is_safe) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-shield-check text-green-500 text-xl"></i>
          <div>
            <p className="font-medium text-green-800">Güvenlik Kontrolü Tamamlandı</p>
            <p className="text-sm text-green-600">Bu tarif çocuğunuz için güvenli görünüyor.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Alerts check - can be undefined
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
