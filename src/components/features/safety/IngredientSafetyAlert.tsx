'use client';

import { useState, useEffect } from 'react';
import { useActiveChild } from '@/contexts/ActiveChildContext';
import { calculateAgeInMonths } from '@/utils/ageCalculator';
import { 
  checkIngredientAgeRestriction, 
  getAlertUIConfig, 
  type AlertSeverity 
} from '@/utils/safetyMapping';
import { decodeEntities } from '@/utils/textHelpers';

interface IngredientSafetyAlertProps {
  ingredientSlug: string;
  ingredientId?: number;
  ingredientData?: {
    min_age_months?: number;
    start_age?: string;
    allergen_info?: {
      is_allergen: boolean;
      allergen_type?: string;
    };
    name?: string;
  };
}

export default function IngredientSafetyAlert({ 
  ingredientSlug, 
  ingredientId,
  ingredientData 
}: IngredientSafetyAlertProps) {
  const { activeChild } = useActiveChild();
  const [safetyStatus, setSafetyStatus] = useState<'loading' | 'safe' | 'age-warning' | 'allergy-warning' | 'no-child'>('no-child');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [severity, setSeverity] = useState<AlertSeverity>('info');

  useEffect(() => {
    if (!activeChild?.id) {
      setSafetyStatus('no-child');
      return;
    }

    // Çocuğun yaşını hesapla (ay olarak)
    let ageInMonths = 24; // Varsayılan
    if (activeChild.birth_date) {
      const birthDate = new Date(activeChild.birth_date);
      ageInMonths = calculateAgeInMonths(birthDate);
    }

    // 1. Alerji Kontrolü
    const childAllergies = Array.isArray(activeChild.allergies) 
      ? activeChild.allergies.map(a => a.toLowerCase()) 
      : [];
    
    // Malzemenin alerjen bilgisini kontrol et
    if (ingredientData?.allergen_info?.is_allergen) {
      const allergenType = ingredientData.allergen_info.allergen_type?.toLowerCase();
      if (allergenType && childAllergies.some(a => 
        a.includes(allergenType) || allergenType.includes(a)
      )) {
        setSafetyStatus('allergy-warning');
        setSeverity('critical');
        setAlertMessage(`${activeChild.name} bu malzemeye (${ingredientData.allergen_info.allergen_type}) alerjik!`);
        return;
      }
    }

    // Slug bazlı alerji kontrolü (fallback)
    const slugLower = ingredientSlug.toLowerCase();
    const allergenMapping: Record<string, string[]> = {
      'yumurta': ['yumurta', 'egg'],
      'sut': ['süt', 'sut', 'milk', 'süt ürünleri'],
      'gluten': ['gluten', 'buğday', 'bugday', 'wheat'],
      'fistik': ['fıstık', 'fistik', 'peanut', 'yer fıstığı'],
      'findik': ['fındık', 'findik', 'hazelnut'],
      'balik': ['balık', 'balik', 'fish'],
      'kabuklu': ['kabuklu', 'shellfish', 'karides', 'midye'],
      'soya': ['soya', 'soy'],
      'susam': ['susam', 'sesame'],
    };

    for (const [allergen, keywords] of Object.entries(allergenMapping)) {
      if (childAllergies.includes(allergen) || childAllergies.some(a => keywords.includes(a))) {
        if (keywords.some(k => slugLower.includes(k))) {
          setSafetyStatus('allergy-warning');
          setSeverity('critical');
          setAlertMessage(`${activeChild.name} bu malzemeye alerjik olabilir!`);
          return;
        }
      }
    }

    // 2. Yaş Kontrolü - API'den gelen min_age_months kullan
    if (ingredientData?.min_age_months && ageInMonths < ingredientData.min_age_months) {
      const ageDiff = ingredientData.min_age_months - ageInMonths;
      const ageSeverity: AlertSeverity = ageDiff >= 12 ? 'critical' : 'warning';
      
      setSafetyStatus('age-warning');
      setSeverity(ageSeverity);
      setAlertMessage(
        `Bu malzeme ${ingredientData.min_age_months} aydan küçük bebekler için uygun değildir. ` +
        `${activeChild.name} şu an ${ageInMonths} aylık.`
      );
      return;
    }

    // 2b. start_age string'inden de kontrol et (örn: "+6 Ay", "6 ay", "6+ Ay")
    if (ingredientData?.start_age) {
      const startAgeMatch = ingredientData.start_age.match(/\d+/);
      const startAgeMonths = startAgeMatch ? parseInt(startAgeMatch[0], 10) : 0;
      
      if (startAgeMonths > 0 && ageInMonths < startAgeMonths) {
        const ageDiff = startAgeMonths - ageInMonths;
        const ageSeverity: AlertSeverity = ageDiff >= 12 ? 'critical' : 'warning';
        
        setSafetyStatus('age-warning');
        setSeverity(ageSeverity);
        setAlertMessage(
          `Bu malzeme ${startAgeMonths}+ ay için önerilmektedir. ` +
          `${activeChild.name} şu an ${ageInMonths} aylık.`
        );
        return;
      }
    }

    // 3. Centralized ingredient age restrictions
    const restriction = checkIngredientAgeRestriction(slugLower, ageInMonths);
    if (restriction && restriction.restricted) {
      setSafetyStatus('age-warning');
      setSeverity(restriction.severity);
      setAlertMessage(`${restriction.message} ${activeChild.name} şu an ${ageInMonths} aylık.`);
      return;
    }

    // Tüm kontrollerden geçti - güvenli
    setSafetyStatus('safe');
    setSeverity('success');
    setAlertMessage('');
  }, [activeChild, ingredientSlug, ingredientData]);

  // Decode alert message
  const decodedMessage = decodeEntities(alertMessage);

  // Get UI config based on severity
  const uiConfig = getAlertUIConfig(severity);

  // Çocuk profili seçilmemiş
  if (safetyStatus === 'no-child') {
    const infoConfig = getAlertUIConfig('info');
    return (
      <div className={`${infoConfig.bgColor} border ${infoConfig.borderColor.replace('border-', 'border-')} rounded-xl p-4 mb-6`}>
        <div className="flex items-center gap-3">
          <i className={`fa-solid fa-info-circle ${infoConfig.iconColor} text-xl`}></i>
          <p className={`text-sm ${infoConfig.textColor}`}>
            Kişiselleştirilmiş güvenlik kontrolü için üst menüden çocuk profilinizi seçin.
          </p>
        </div>
      </div>
    );
  }

  // Güvenli
  if (safetyStatus === 'safe') {
    return (
      <div className={`${uiConfig.bgColor} border ${uiConfig.borderColor.replace('border-', 'border-')} rounded-xl p-4 mb-6`}>
        <div className="flex items-center gap-3">
          <i className={`fa-solid fa-circle-check ${uiConfig.iconColor} text-xl`}></i>
          <div>
            <p className={`font-medium ${uiConfig.textColor}`}>
              {activeChild?.name} için Uygun Görünüyor
            </p>
            <p className={`text-sm ${uiConfig.textColor}`}>
              Bu malzeme çocuğunuzun yaşı ve alerjileri için güvenli görünüyor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Yaş uyarısı
  if (safetyStatus === 'age-warning') {
    return (
      <div className={`${uiConfig.bgColor} border ${uiConfig.borderColor.replace('border-', 'border-')} rounded-xl p-4 mb-6`}>
        <div className="flex items-start gap-3">
          <i className={`fa-solid fa-triangle-exclamation ${uiConfig.iconColor} text-xl mt-0.5`}></i>
          <div>
            <p className={`font-bold ${uiConfig.textColor}`}>Yaş Uyarısı</p>
            <p className={`text-sm ${uiConfig.textColor} mt-1`}>{decodedMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Alerji uyarısı
  if (safetyStatus === 'allergy-warning') {
    return (
      <div className={`${uiConfig.bgColor} border ${uiConfig.borderColor.replace('border-', 'border-')} rounded-xl p-4 mb-6`}>
        <div className="flex items-start gap-3">
          <i className={`fa-solid fa-circle-xmark ${uiConfig.iconColor} text-xl mt-0.5`}></i>
          <div>
            <p className={`font-bold ${uiConfig.textColor}`}>Alerji Uyarısı!</p>
            <p className={`text-sm ${uiConfig.textColor} mt-1`}>{decodedMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
