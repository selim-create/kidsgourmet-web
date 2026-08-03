export const APP_STORE_URL =
  'https://apps.apple.com/app/kidsgourmet-ebeveyn-rehberi/id6784156670';

export const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.kidsgourmet.mobile&hl=tr';

export const APP_DOWNLOAD_PATH = '/indir';
export const APP_DOWNLOAD_URL = `https://www.kidsgourmet.com.tr${APP_DOWNLOAD_PATH}`;

export type MobilePlatform = 'ios' | 'android' | 'other';

export function detectMobilePlatform(userAgent: string): MobilePlatform {
  const normalized = userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(normalized)) return 'ios';
  if (/android/.test(normalized)) return 'android';

  return 'other';
}

export function getStoreUrl(platform: MobilePlatform): string | null {
  if (platform === 'ios') return APP_STORE_URL;
  if (platform === 'android') return GOOGLE_PLAY_URL;
  return null;
}
