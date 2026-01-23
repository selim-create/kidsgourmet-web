'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean; // Her zaman true
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: string;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  functional: false,
  marketing: false,
  timestamp: '',
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem('cookie_consent');
      return !saved;
    } catch {
      return true; // Show banner if localStorage fails
    }
  });
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const saved = localStorage.getItem('cookie_consent');
      if (saved) {
        return JSON.parse(saved) as CookiePreferences;
      }
    } catch {
      // Invalid JSON, ignore and return defaults
    }
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    // Dispatch event for other components to react on mount if consent exists
    try {
      const saved = localStorage.getItem('cookie_consent');
      if (saved) {
        const parsed = JSON.parse(saved) as CookiePreferences;
        window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { detail: parsed }));
      }
    } catch {
      // Invalid JSON, ignore
    }

    // Listen for reset event from footer link
    const handleReset = () => {
      setShowBanner(true);
      setShowDetails(false);
      setPreferences(DEFAULT_PREFERENCES);
    };

    window.addEventListener('cookieConsentReset', handleReset);
    return () => window.removeEventListener('cookieConsentReset', handleReset);
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const withTimestamp = { ...prefs, timestamp: new Date().toISOString() };
    localStorage.setItem('cookie_consent', JSON.stringify(withTimestamp));
    setPreferences(withTimestamp);
    setShowBanner(false);
    setShowDetails(false);
    
    // Dispatch event for analytics to load
    window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { detail: withTimestamp }));
    
    // Update Google Consent Mode
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': prefs.analytics ? 'granted' : 'denied',
        'ad_storage': prefs.marketing ? 'granted' : 'denied',
        'ad_user_data': prefs.marketing ? 'granted' : 'denied',
        'ad_personalization': prefs.marketing ? 'granted' : 'denied',
        'functionality_storage': prefs.functional ? 'granted' : 'denied',
        'personalization_storage': prefs.functional ? 'granted' : 'denied',
      });
    }
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      functional: true,
      marketing: false, // Meta Pixel kullanılmıyor
      timestamp: '',
    });
  };

  const acceptNecessaryOnly = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
      timestamp: '',
    });
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg md:p-6">
      <div className="max-w-6xl mx-auto">
        {!showDetails ? (
          // Simple Banner
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">🍪 Çerez Kullanımı</h3>
              <p className="text-sm text-gray-600">
                Size daha iyi bir deneyim sunmak için çerezleri kullanıyoruz.{' '}
                <Link href="/cerez-politikasi" className="text-orange-500 hover:underline">
                  Çerez Politikası
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tercihleri Yönet
              </button>
              <button
                onClick={acceptNecessaryOnly}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sadece Zorunlu
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        ) : (
          // Detailed Preferences
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Çerez Tercihleri</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Zorunlu Çerezler */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Zorunlu Çerezler</span>
                  <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">Her Zaman Aktif</span>
                </div>
                <p className="text-sm text-gray-600">
                  Web sitesinin çalışması için gerekli temel çerezler. Devre dışı bırakılamaz.
                </p>
              </div>
              
              {/* Analitik Çerezler */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Analitik Çerezler</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Site kullanımını analiz etmemize ve deneyiminizi iyileştirmemize yardımcı olur. (Google Analytics)
                </p>
              </div>
              
              {/* Fonksiyonel Çerezler */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Fonksiyonel Çerezler</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Tercihlerinizi hatırlamamıza ve kişiselleştirilmiş özellikler sunmamıza olanak tanır.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-4 border-t border-gray-200">
              <button
                onClick={acceptNecessaryOnly}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tümünü Reddet
              </button>
              <button
                onClick={saveCustomPreferences}
                className="px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Tercihlerimi Kaydet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for other components to check consent status
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('cookie_consent');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null; // Invalid JSON, return null
    }
  });

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<CookiePreferences>) => {
      setConsent(e.detail);
    };

    window.addEventListener('cookieConsentUpdate', handleUpdate as EventListener);
    return () => window.removeEventListener('cookieConsentUpdate', handleUpdate as EventListener);
  }, []);

  return consent;
}

// Re-open cookie preferences (for footer link)
export function openCookiePreferences() {
  localStorage.removeItem('cookie_consent');
  // Dispatch event to trigger banner re-display
  window.dispatchEvent(new CustomEvent('cookieConsentReset'));
  // Fallback: reload if event doesn't work
  setTimeout(() => window.location.reload(), 100);
}
