import DOMPurify from 'isomorphic-dompurify';

/**
 * Decode HTML entities like &amp; to &
 * Works on both client and server side
 */
export function decodeHTMLEntities(text: string): string {
  if (typeof window === 'undefined') {
    // Server-side: use simple regex replacement for common entities
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ');
  } else {
    // Client-side: use textarea element
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }
}

/**
 * Sanitize HTML to prevent XSS attacks
 * Safe for both client and server side
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
  });
}

/**
 * Calculate portion multiplier for ingredients
 * Tadım: 0.5x, 1 Öğün: 1x, 2 Günlük: 3x
 */
export const portionMultipliers: Record<string, number> = {
  'Tadım': 0.5,
  '1 Öğün': 1,
  '2 Günlük': 3
};

/**
 * Calculate ingredient amount based on portion selection
 */
export function calculatePortion(originalAmount: string, multiplier: number): string {
  // Try to extract numeric part from the amount string
  const numericMatch = originalAmount.match(/^(\d+(?:[.,]\d+)?)/);
  
  if (!numericMatch) {
    // No numeric part found, return original
    return originalAmount;
  }
  
  const numericPart = parseFloat(numericMatch[1].replace(',', '.'));
  if (isNaN(numericPart)) {
    return originalAmount;
  }
  
  // Calculate new amount
  const newAmount = numericPart * multiplier;
  
  // Format: remove trailing zeros after decimal point
  const formatted = newAmount % 1 === 0 
    ? newAmount.toString() 
    : newAmount.toFixed(1);
  
  // Replace the numeric part in the original string
  return originalAmount.replace(numericMatch[1], formatted);
}

/**
 * Check if toast has been shown in current session
 */
export function hasShownBirthDateToast(): boolean {
  if (typeof window === 'undefined') return true;
  return sessionStorage.getItem('birthdate_toast_shown') === 'true';
}

/**
 * Mark that toast has been shown in this session
 */
export function markBirthDateToastShown(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('birthdate_toast_shown', 'true');
}

/**
 * Check if current page should show birth date toast
 */
export function shouldShowBirthDateToast(pathname: string): boolean {
  // Show on homepage or recipe pages
  return pathname === '/' || pathname.startsWith('/tarifler/');
}

/**
 * Format date to relative time (e.g., "2 saat önce", "3 gün önce")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'az önce';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} dakika önce`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} saat önce`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} gün önce`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} hafta önce`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} ay önce`;
  }

  const years = Math.floor(days / 365);
  return `${years} yıl önce`;
}
