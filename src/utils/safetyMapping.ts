/**
 * Centralized Safety and Age Group Mapping Utility
 * 
 * This module provides a single source of truth for:
 * - Age group safety compliance rules
 * - Alert severity determination
 * - UI color and icon mapping
 * 
 * Yaş Grubu Uyum Kuralları:
 * - Çocuk yaşı < Tarif yaş grubu (1+ seviye fark) → WARNING
 * - Çocuk yaşı << Tarif yaş grubu (2+ seviye fark) → CRITICAL
 * - Çocuk yaşı > Tarif yaş grubu → INFO
 * - Çocuk yaşı = Tarif yaş grubu → SUCCESS
 */

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface AlertUIConfig {
  severity: AlertSeverity;
  icon: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
}

/**
 * Yaş grubu eşik değerleri (ay olarak)
 * Age group thresholds in months
 */
export const AGE_GROUP_THRESHOLDS = {
  INFANT_0_6: { min: 0, max: 5, name: '0-6 Ay' },
  INFANT_6_9: { min: 6, max: 8, name: '6-9 Ay' },
  INFANT_9_12: { min: 9, max: 11, name: '9-12 Ay' },
  TODDLER_12_18: { min: 12, max: 17, name: '12-18 Ay' },
  TODDLER_18_24: { min: 18, max: 23, name: '18-24 Ay' },
  CHILD_2_3: { min: 24, max: 35, name: '2-3 Yaş' },
  CHILD_3_4: { min: 36, max: 47, name: '3-4 Yaş' },
  CHILD_4_PLUS: { min: 48, max: 999, name: '4+ Yaş' },
} as const;

/**
 * UI konfigürasyonu severity'ye göre
 * Alert UI configuration based on severity
 */
export const ALERT_UI_CONFIG: Record<AlertSeverity, AlertUIConfig> = {
  critical: {
    severity: 'critical',
    icon: '🛑',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    iconColor: 'text-red-500',
  },
  warning: {
    severity: 'warning',
    icon: '⚠️',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-500',
  },
  info: {
    severity: 'info',
    icon: 'ℹ️',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
  success: {
    severity: 'success',
    icon: '✅',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    iconColor: 'text-green-500',
  },
};

/**
 * Çocuğun yaş grubunu belirle
 * Determine child's age group
 */
export function getAgeGroupFromMonths(ageInMonths: number): keyof typeof AGE_GROUP_THRESHOLDS | null {
  for (const [key, value] of Object.entries(AGE_GROUP_THRESHOLDS)) {
    if (ageInMonths >= value.min && ageInMonths <= value.max) {
      return key as keyof typeof AGE_GROUP_THRESHOLDS;
    }
  }
  return null;
}

/**
 * İki yaş grubu arasındaki seviye farkını hesapla
 * Calculate level difference between two age groups
 */
export function calculateAgeGroupDifference(
  childAgeGroup: keyof typeof AGE_GROUP_THRESHOLDS,
  recipeAgeGroup: keyof typeof AGE_GROUP_THRESHOLDS
): number {
  const ageGroupOrder = Object.keys(AGE_GROUP_THRESHOLDS);
  const childIndex = ageGroupOrder.indexOf(childAgeGroup);
  const recipeIndex = ageGroupOrder.indexOf(recipeAgeGroup);
  
  return recipeIndex - childIndex; // Positive = recipe for older, Negative = recipe for younger
}

/**
 * Yaş uyumuna göre alert severity belirle
 * Determine alert severity based on age compliance
 * 
 * @param childAgeInMonths - Çocuğun yaşı (ay)
 * @param recipeMinAgeInMonths - Tarifin minimum yaşı (ay)
 * @returns AlertSeverity
 */
export function determineAgeSafetySeverity(
  childAgeInMonths: number,
  recipeMinAgeInMonths: number
): AlertSeverity {
  const childAgeGroup = getAgeGroupFromMonths(childAgeInMonths);
  const recipeAgeGroup = getAgeGroupFromMonths(recipeMinAgeInMonths);
  
  if (!childAgeGroup || !recipeAgeGroup) {
    // Eğer yaş grubu belirlenemiyorsa, doğrudan ay karşılaştırması yap
    if (childAgeInMonths >= recipeMinAgeInMonths) {
      return 'success';
    } else if (recipeMinAgeInMonths - childAgeInMonths >= 12) {
      return 'critical'; // 12+ ay fark critical
    } else if (recipeMinAgeInMonths - childAgeInMonths >= 6) {
      return 'warning'; // 6+ ay fark warning
    }
    return 'info';
  }
  
  const levelDiff = calculateAgeGroupDifference(childAgeGroup, recipeAgeGroup);
  
  // Çocuk tarif için uygun veya daha büyük
  if (levelDiff <= 0) {
    if (levelDiff === 0) {
      return 'success'; // Aynı yaş grubu
    }
    return 'info'; // Çocuk daha büyük (tarif çocuk için kolay/uygun)
  }
  
  // Tarif çocuktan daha büyük yaş grubu için
  if (levelDiff >= 2) {
    return 'critical'; // 2+ seviye fark - KRİTİK
  }
  
  return 'warning'; // 1 seviye fark - UYARI
}

/**
 * Yaş uyarı mesajı oluştur
 * Generate age warning message
 */
export function generateAgeWarningMessage(
  childName: string,
  childAgeInMonths: number,
  recipeMinAgeInMonths: number,
  severity: AlertSeverity
): string {
  const childAgeGroup = getAgeGroupFromMonths(childAgeInMonths);
  const recipeAgeGroup = getAgeGroupFromMonths(recipeMinAgeInMonths);
  
  const childAgeName = childAgeGroup ? AGE_GROUP_THRESHOLDS[childAgeGroup].name : `${childAgeInMonths} ay`;
  const recipeAgeName = recipeAgeGroup ? AGE_GROUP_THRESHOLDS[recipeAgeGroup].name : `${recipeMinAgeInMonths}+ ay`;
  
  if (severity === 'critical') {
    return `⚠️ Bu tarif ${recipeAgeName} için tasarlanmıştır. ${childName} (${childAgeName}) için henüz uygun değildir. Lütfen çocuğunuzun yaşına uygun tariflere bakın.`;
  }
  
  if (severity === 'warning') {
    return `⚠️ Bu tarif ${recipeAgeName} için önerilmektedir. ${childName} (${childAgeName}) için dikkatli kullanın ve malzemeleri kontrol edin.`;
  }
  
  if (severity === 'info') {
    return `ℹ️ Bu tarif ${recipeAgeName} için hazırlanmıştır. ${childName} (${childAgeName}) için uygun görünüyor.`;
  }
  
  return `✅ Bu tarif ${childName}'in yaş grubuna (${childAgeName}) uygun.`;
}

/**
 * Severity'ye göre UI config al
 * Get UI configuration for a severity level
 */
export function getAlertUIConfig(severity: AlertSeverity): AlertUIConfig {
  return ALERT_UI_CONFIG[severity];
}

/**
 * Malzeme yaş kısıtlamaları
 * Ingredient age restrictions
 */
export const INGREDIENT_AGE_RESTRICTIONS: Record<string, { minAgeMonths: number; reason: string }> = {
  bal: { minAgeMonths: 12, reason: 'Botulizm riski nedeniyle 12 aydan küçük bebeklere verilmemelidir.' },
  honey: { minAgeMonths: 12, reason: 'Botulizm riski nedeniyle 12 aydan küçük bebeklere verilmemelidir.' },
  tuz: { minAgeMonths: 12, reason: 'Böbrek sağlığı için 12 aydan küçük bebeklere tuz eklenmemelidir.' },
  salt: { minAgeMonths: 12, reason: 'Böbrek sağlığı için 12 aydan küçük bebeklere tuz eklenmemelidir.' },
  seker: { minAgeMonths: 24, reason: 'Diş ve metabolik sağlık için 2 yaşından küçük çocuklara şeker eklenmemelidir.' },
  sugar: { minAgeMonths: 24, reason: 'Diş ve metabolik sağlık için 2 yaşından küçük çocuklara şeker eklenmemelidir.' },
  findik: { minAgeMonths: 48, reason: 'Boğulma riski nedeniyle tam fındık 4 yaşından küçük çocuklara verilmemelidir.' },
  hazelnut: { minAgeMonths: 48, reason: 'Boğulma riski nedeniyle tam fındık 4 yaşından küçük çocuklara verilmemelidir.' },
  ceviz: { minAgeMonths: 48, reason: 'Boğulma riski nedeniyle tam ceviz 4 yaşından küçük çocuklara verilmemelidir.' },
  walnut: { minAgeMonths: 48, reason: 'Boğulma riski nedeniyle tam ceviz 4 yaşından küçük çocuklara verilmemelidir.' },
  badem: { minAgeMonths: 48, reason: 'Boğulma riski nedeniyle tam badem 4 yaşından küçük çocuklara verilmemelidir.' },
  almond: { minAgeMonths: 48, reason: 'Boğulma riski nedeniyle tam badem 4 yaşından küçük çocuklara verilmemelidir.' },
  fistik: { minAgeMonths: 48, reason: 'Boğulma riski nedeniyle tam fıstık 4 yaşından küçük çocuklara verilmemelidir.' },
  peanut: { minAgeMonths: 48, reason: 'Boğulma riski nedeniyle tam fıstık 4 yaşından küçük çocuklara verilmemelidir.' },
};

/**
 * Malzeme için yaş kısıtlaması kontrol et
 * Check ingredient age restriction
 */
export function checkIngredientAgeRestriction(
  ingredientSlug: string,
  childAgeInMonths: number
): { restricted: boolean; severity: AlertSeverity; message: string } | null {
  const slugLower = ingredientSlug.toLowerCase();
  
  for (const [ingredient, rule] of Object.entries(INGREDIENT_AGE_RESTRICTIONS)) {
    if (slugLower.includes(ingredient) && childAgeInMonths < rule.minAgeMonths) {
      const ageDiff = rule.minAgeMonths - childAgeInMonths;
      const severity: AlertSeverity = ageDiff >= 12 ? 'critical' : 'warning';
      
      return {
        restricted: true,
        severity,
        message: rule.reason,
      };
    }
  }
  
  return null;
}
