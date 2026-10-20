import { detectMobilePlatform, type MobilePlatform } from '@/lib/app-links';

export const BANNER_DISMISS_KEY = 'kg_app_banner_dismissed_at';
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000;
const MOBILE_QUERY = '(max-width: 767px)';
const STANDALONE_QUERY = '(display-mode: standalone)';

// Stable server value prevents hydration differences from client-only signals.
export const getServerMobilePlatform = (): MobilePlatform => 'other';

export function getBrowserMobilePlatform(): MobilePlatform {
  return typeof window === 'undefined'
    ? 'other'
    : detectMobilePlatform(window.navigator.userAgent);
}

export function getBannerPlatform(): MobilePlatform {
  if (typeof window === 'undefined') return 'other';

  if (!window.matchMedia(MOBILE_QUERY).matches) return 'other';
  if (window.matchMedia(STANDALONE_QUERY).matches) return 'other';

  const platform = getBrowserMobilePlatform();
  if (platform === 'other') return 'other';

  const dismissedAt = Number(window.localStorage.getItem(BANNER_DISMISS_KEY) || 0);
  if (dismissedAt && Date.now() - dismissedAt < DISMISS_DURATION_MS) {
    return 'other';
  }

  return platform;
}

export function subscribeToBannerEligibility(onChange: () => void): () => void {
  const mobile = window.matchMedia(MOBILE_QUERY);
  const standalone = window.matchMedia(STANDALONE_QUERY);

  mobile.addEventListener('change', onChange);
  standalone.addEventListener('change', onChange);
  window.addEventListener('storage', onChange);

  return () => {
    mobile.removeEventListener('change', onChange);
    standalone.removeEventListener('change', onChange);
    window.removeEventListener('storage', onChange);
  };
}

// The browser user agent cannot change during one page visit.
export const subscribeToStaticPlatform = () => () => {};
