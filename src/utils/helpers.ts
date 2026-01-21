import DOMPurify from 'isomorphic-dompurify';

/**
 * Decode HTML entities including emojis
 * Handles &#x1f970; format (hex) and &#128512; format (decimal)
 * Works on both client and server side
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof window === 'undefined') {
    // Server-side: use regex replacement
    return text
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ');
  } else {
    // Client-side: use DOMParser for better handling, but only body content
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.body.textContent || text;
  }
}

/**
 * Legacy alias for backward compatibility
 */
export function decodeHTMLEntities(text: string): string {
  return decodeHtmlEntities(text);
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

/**
 * Format ISO 8601 date string to localized Turkish date
 * Handles formats like "2026-01-15T12:09:12+03:00"
 * 
 * @param dateStr - ISO 8601 date string
 * @returns Formatted date string (e.g., "15 Ocak 2026") or "Tarih bilinmiyor" on error
 */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Tarih bilinmiyor';
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  } catch {
    return 'Tarih bilinmiyor';
  }
}

/**
 * Expert role identifiers
 * Users with these roles or is_expert flag are considered experts
 */
const EXPERT_ROLES = ['administrator', 'editor', 'author', 'kg_expert'] as const;
type ExpertRole = typeof EXPERT_ROLES[number];

/**
 * Check if a user has expert role
 * Expert roles: kg_expert, editor, author, administrator
 * Also checks for is_expert flag
 */
export function isUserExpert(user: { is_expert?: boolean; role?: string } | null | undefined): boolean {
  if (!user) return false;
  return user.is_expert === true || (EXPERT_ROLES as readonly string[]).includes(user.role || '');
}

/**
 * Get dashboard URL based on user role
 * Experts go to /dashboard/expert, parents go to /dashboard
 */
export function getDashboardUrl(user: { is_expert?: boolean; role?: string } | null | undefined): string {
  return isUserExpert(user) ? '/dashboard/expert' : '/dashboard';
}

/**
 * Get public profile URL based on user role
 * Experts: /uzman/{username}, Parents: /profil/{username}
 * 
 * @param user - User object with optional username, role, and is_expert fields
 * @returns Profile URL path. Returns '/profil' as fallback if:
 *          - User is null/undefined
 *          - Username is missing
 *          - Username contains invalid characters (only alphanumeric, underscore, hyphen allowed)
 */
export function getPublicProfileUrl(user: { is_expert?: boolean; role?: string; username?: string } | null | undefined): string {
  // Validate username exists and contains only safe characters
  if (!user?.username || !/^[a-zA-Z0-9_-]+$/.test(user.username)) {
    return '/profil';
  }
  
  // Username is already validated to be safe, use directly
  return isUserExpert(user) ? `/uzman/${user.username}` : `/profil/${user.username}`;
}

/**
 * Slugify text for URLs
 * Handles Turkish characters (ğ, ü, ş, ı, ö, ç)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Slugify for usernames - removes spaces instead of converting to hyphens
 */
export function slugifyUsername(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, ''); // Remove all non-alphanumeric characters (including spaces)
}

/**
 * Get profile URL for discussion/comment authors
 * Uses username if available, falls back to slugified name, or ID
 * 
 * @param author - Author object from discussion or comment
 * @returns Profile URL path
 */
export function getProfileUrl(author: {
  id: number;
  username?: string;
  slug?: string;
  user_login?: string;
  name?: string;
  role?: string;
  roles?: string[];
  is_expert?: boolean;
}): string {
  // Find username - try different field names
  let username = author.username || author.slug || author.user_login;
  
  // If no username, try to generate from name (remove spaces, don't use hyphens)
  if (!username && author.name) {
    const slugified = slugifyUsername(author.name);
    // Validate slugified result (at least 2 chars, valid URL characters)
    username = (slugified && slugified.length >= 2) ? slugified : undefined;
  }
  
  // Final fallback to ID
  username = username || author.id.toString();
  
  // Check if user is expert (normalize roles for consistent comparison)
  const expertRoles = ['kg_expert', 'kg-uzman', 'administrator', 'admin', 'editor'];
  const userRoles = author.roles || (author.role ? [author.role] : []);
  const normalizedUserRoles = userRoles.map(role => role.toLowerCase().replace(/[_-]/g, ''));
  const normalizedExpertRoles = expertRoles.map(role => role.replace(/[_-]/g, ''));
  const isExpert = author.is_expert || normalizedUserRoles.some(role => 
    normalizedExpertRoles.includes(role)
  );
  
  if (isExpert) {
    return `/uzman/${username}`;
  }
  return `/profil/${username}`;
}

/**
 * Strip HTML tags from text
 * Useful for creating excerpts from HTML content
 */
export function stripHtml(html: string): string {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Ensure discussion has default values for vote counts
 */
export function ensureDiscussionDefaults<T extends { 
  like_count?: number | null; 
  dislike_count?: number | null; 
  user_vote?: string | null;
}>(discussion: T): T {
  return {
    ...discussion,
    like_count: discussion.like_count ?? 0,
    dislike_count: discussion.dislike_count ?? 0,
    user_vote: discussion.user_vote ?? null,
  };
}

/**
 * Ensure comment has default values for vote counts
 */
export function ensureCommentDefaults<T extends { 
  like_count?: number | null; 
  dislike_count?: number | null; 
  user_vote?: string | null;
}>(comment: T): T {
  return {
    ...comment,
    like_count: comment.like_count ?? 0,
    dislike_count: comment.dislike_count ?? 0,
    user_vote: comment.user_vote ?? null,
  };
}
