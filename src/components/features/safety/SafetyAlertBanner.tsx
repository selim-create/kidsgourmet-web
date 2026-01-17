'use client';

import { useSafetyCheck } from '@/hooks/useSafetyCheck';
import { SafetyAlert } from '@/services/safety-service';
import { getAlertUIConfig } from '@/utils/safetyMapping';
import { decodeEntities } from '@/utils/textHelpers';
import AlternativeRecipeList from './AlternativeRecipeList';

interface SafetyAlertBannerProps {
  recipeId: number;
  childId?: string;
}

function AlertItem({ alert }: { alert: SafetyAlert }) {
  const uiConfig = getAlertUIConfig(alert.severity);
  const decodedMessage = decodeEntities(alert.message);
  const decodedIngredient = decodeEntities(alert.ingredient);
  const decodedAlternative = decodeEntities(alert.alternative);
  
  return (
    <div className="mb-3 last:mb-0">
      <p className={`text-sm font-semibold ${uiConfig.textColor} mb-1`}>
        {uiConfig.icon} {decodedMessage}
      </p>
      {decodedIngredient && (
        <p className="text-xs text-gray-700 ml-5">
          <strong>Malzeme:</strong> {decodedIngredient}
        </p>
      )}
      {decodedAlternative && (
        <p className="text-xs text-gray-700 ml-5">
          <strong>Alternatif:</strong> {decodedAlternative}
        </p>
      )}
    </div>
  );
}

export default function SafetyAlertBanner({ recipeId, childId }: SafetyAlertBannerProps) {
  const { safetyResult, isChecking, error, errorInfo, isApiError, recheckSafety, canRetry } = useSafetyCheck(recipeId, childId);
  
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
    const errorMessage = error || 'Bu tarifin çocuğunuz için uygunluğunu şu an kontrol edemiyoruz.';
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-info-circle text-blue-500 text-xl mt-0.5"></i>
          <div className="flex-1">
            <p className="font-medium text-blue-800">Güvenlik Kontrolü Yapılamadı</p>
            <p className="text-sm text-blue-600 mt-1">
              {decodeEntities(errorMessage)}
            </p>
            {errorInfo?.type && (
              <p className="text-xs text-blue-500 mt-1">
                {errorInfo.type === 'network' && '🌐 İnternet bağlantısı sorunu'}
                {errorInfo.type === 'timeout' && '⏱️ Zaman aşımı'}
                {errorInfo.type === 'cors' && '🔒 Güvenlik hatası'}
                {errorInfo.type === 'server' && '🖥️ Sunucu hatası'}
              </p>
            )}
            {canRetry && (
              <button
                onClick={recheckSafety}
                className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                <i className="fa-solid fa-rotate-right mr-2"></i>
                Tekrar Dene
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Check for age warnings first (even if is_safe is true)
  const ageWarnings = safetyResult?.alerts?.filter(a => a.type === 'age') || [];
  
  if (ageWarnings.length > 0) {
    const highestSeverity = ageWarnings.reduce((max, alert) => {
      if (alert.severity === 'critical') return 'critical';
      if (alert.severity === 'warning' && max !== 'critical') return 'warning';
      return max;
    }, 'info' as 'critical' | 'warning' | 'info');
    
    const uiConfig = getAlertUIConfig(highestSeverity);
    
    return (
      <div className={`${uiConfig.bgColor} border ${uiConfig.borderColor.replace('border-', 'border-')} rounded-xl p-4 mb-6`}>
        <div className="flex items-start gap-3">
          <i className={`fa-solid fa-clock ${uiConfig.iconColor} text-xl mt-0.5`}></i>
          <div>
            <p className={`font-medium ${uiConfig.textColor}`}>Yaş Grubu Uyarısı</p>
            {ageWarnings.map((alert, idx) => (
              <p key={`${alert.type}-${idx}`} className={`text-sm ${uiConfig.textColor} mt-1`}>
                {decodeEntities(alert.message)}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Show green success message if recipe is safe
  if (!safetyResult || safetyResult.is_safe) {
    const successConfig = getAlertUIConfig('success');
    
    return (
      <div className={`${successConfig.bgColor} border ${successConfig.borderColor.replace('border-', 'border-')} rounded-xl p-4 mb-6 animate-fade-in`}>
        <div className="flex items-center gap-3">
          <i className={`fa-solid fa-shield-check ${successConfig.iconColor} text-xl`}></i>
          <div>
            <p className={`font-medium ${successConfig.textColor}`}>Güvenlik Kontrolü Tamamlandı</p>
            <p className={`text-sm ${successConfig.textColor}`}>Bu tarif çocuğunuz için güvenli görünüyor.</p>
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
  
  const uiConfig = getAlertUIConfig(highestSeverity);
  
  return (
    <div className={`p-4 rounded-lg mb-6 ${uiConfig.bgColor} border-l-4 ${uiConfig.borderColor}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className={`text-sm font-bold ${uiConfig.textColor} mb-3`}>
            Güvenlik Uyarıları
          </h3>
          
          {alerts.map((alert, i) => (
            <AlertItem key={i} alert={alert} />
          ))}
          
          {safetyResult.alternatives && safetyResult.alternatives.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className={`font-bold text-sm ${uiConfig.textColor} mb-3`}>
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
