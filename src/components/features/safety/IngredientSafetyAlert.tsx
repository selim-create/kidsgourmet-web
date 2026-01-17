'use client';

import { useState, useEffect } from 'react';
import { useActiveChild } from '@/contexts/ActiveChildContext';

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

  useEffect(() => {
    if (!activeChild?.id) {
      setSafetyStatus('no-child');
      return;
    }

    // Çocuğun yaşını hesapla (ay olarak)
    let ageInMonths = 24; // Varsayılan
    if (activeChild.birth_date) {
      const birthDate = new Date(activeChild.birth_date);
      const now = new Date();
      ageInMonths = Math.floor(
        (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      );
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
          setAlertMessage(`${activeChild.name} bu malzemeye alerjik olabilir!`);
          return;
        }
      }
    }

    // 2. Yaş Kontrolü - API'den gelen min_age_months kullan
    if (ingredientData?.min_age_months && ageInMonths < ingredientData.min_age_months) {
      setSafetyStatus('age-warning');
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
        setSafetyStatus('age-warning');
        setAlertMessage(
          `Bu malzeme ${startAgeMonths}+ ay için önerilmektedir. ` +
          `${activeChild.name} şu an ${ageInMonths} aylık.`
        );
        return;
      }
    }

    // 3. Hardcoded yaş kısıtlamaları (API'de min_age yoksa fallback)
    const ageRestrictions: Record<string, { minAge: number; message: string }> = {
      'bal': { minAge: 12, message: 'Bal 12 aydan küçük bebeklere verilmemelidir (botulizm riski).' },
      'honey': { minAge: 12, message: 'Bal 12 aydan küçük bebeklere verilmemelidir (botulizm riski).' },
      'tuz': { minAge: 12, message: '12 aydan küçük bebeklere tuz eklenmemelidir.' },
      'seker': { minAge: 24, message: '2 yaşından küçük çocuklara şeker eklenmemelidir.' },
      'sugar': { minAge: 24, message: '2 yaşından küçük çocuklara şeker eklenmemelidir.' },
      'findik': { minAge: 48, message: 'Tam fındık 4 yaşından küçük çocuklara boğulma riski oluşturur.' },
      'ceviz': { minAge: 48, message: 'Tam ceviz 4 yaşından küçük çocuklara boğulma riski oluşturur.' },
      'badem': { minAge: 48, message: 'Tam badem 4 yaşından küçük çocuklara boğulma riski oluşturur.' },
      'fistik': { minAge: 48, message: 'Tam fıstık 4 yaşından küçük çocuklara boğulma riski oluşturur.' },
    };

    for (const [ingredient, rule] of Object.entries(ageRestrictions)) {
      if (slugLower.includes(ingredient) && ageInMonths < rule.minAge) {
        setSafetyStatus('age-warning');
        setAlertMessage(`${rule.message} ${activeChild.name} şu an ${ageInMonths} aylık.`);
        return;
      }
    }

    // Tüm kontrollerden geçti - güvenli
    setSafetyStatus('safe');
    setAlertMessage('');
  }, [activeChild, ingredientSlug, ingredientData]);

  // Çocuk profili seçilmemiş
  if (safetyStatus === 'no-child') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-info-circle text-blue-500 text-xl"></i>
          <p className="text-sm text-blue-700">
            Kişiselleştirilmiş güvenlik kontrolü için üst menüden çocuk profilinizi seçin.
          </p>
        </div>
      </div>
    );
  }

  // Güvenli
  if (safetyStatus === 'safe') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-green-500 text-xl"></i>
          <div>
            <p className="font-medium text-green-800">
              {activeChild?.name} için Uygun Görünüyor
            </p>
            <p className="text-sm text-green-600">
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
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-triangle-exclamation text-amber-500 text-xl mt-0.5"></i>
          <div>
            <p className="font-bold text-amber-800">Yaş Uyarısı</p>
            <p className="text-sm text-amber-700 mt-1">{alertMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Alerji uyarısı
  if (safetyStatus === 'allergy-warning') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-circle-xmark text-red-500 text-xl mt-0.5"></i>
          <div>
            <p className="font-bold text-red-800">Alerji Uyarısı!</p>
            <p className="text-sm text-red-700 mt-1">{alertMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
