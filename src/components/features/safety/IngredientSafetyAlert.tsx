'use client';

import { useState, useEffect } from 'react';
import { useActiveChild } from '@/contexts/ActiveChildContext';

interface IngredientSafetyAlertProps {
  ingredientSlug: string;
  ingredientId?: number;
}

export default function IngredientSafetyAlert({ ingredientSlug, ingredientId }: IngredientSafetyAlertProps) {
  const { activeChild } = useActiveChild();
  const [safetyStatus, setSafetyStatus] = useState<'loading' | 'safe' | 'warning' | 'error' | 'no-child'>('no-child');
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    if (!activeChild?.id) {
      setSafetyStatus('no-child');
      return;
    }

    // Çocuğun alerjilerini kontrol et
    const childAllergies = Array.isArray(activeChild.allergies) ? activeChild.allergies : [];
    
    // Basit lokal kontrol - API'ye gerek kalmadan
    const isAllergic = childAllergies.some(allergy => 
      ingredientSlug.toLowerCase().includes(allergy.toLowerCase()) ||
      allergy.toLowerCase().includes(ingredientSlug.toLowerCase())
    );

    if (isAllergic) {
      setSafetyStatus('warning');
      setAlertMessage(`${activeChild.name} bu malzemeye alerjik olabilir!`);
      return;
    }

    // Yaş kontrolü - bazı malzemeler için
    const ageInMonths = activeChild.birth_date 
      ? Math.floor((Date.now() - new Date(activeChild.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30))
      : 24;

    const restrictedIngredients: Record<string, { minAge: number; message: string }> = {
      'bal': { minAge: 12, message: 'Bal 12 aydan küçük bebeklere verilmemelidir.' },
      'honey': { minAge: 12, message: 'Bal 12 aydan küçük bebeklere verilmemelidir.' },
      'findik': { minAge: 12, message: 'Tam fındık boğulma riski oluşturabilir.' },
      'ceviz': { minAge: 12, message: 'Tam ceviz boğulma riski oluşturabilir.' },
      'fistik': { minAge: 12, message: 'Tam fıstık boğulma riski oluşturabilir.' },
      'tuz': { minAge: 12, message: '12 aydan küçük bebeklere tuz eklenmemelidir.' },
      'seker': { minAge: 24, message: '2 yaşından küçük çocuklara şeker eklenmemelidir.' },
    };

    const slugLower = ingredientSlug.toLowerCase();
    for (const [ingredient, rule] of Object.entries(restrictedIngredients)) {
      if (slugLower.includes(ingredient) && ageInMonths < rule.minAge) {
        setSafetyStatus('warning');
        setAlertMessage(rule.message);
        return;
      }
    }

    setSafetyStatus('safe');
    setAlertMessage('');
  }, [activeChild, ingredientSlug]);

  // Çocuk profili yoksa bilgilendirme
  if (safetyStatus === 'no-child') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-child text-gray-400 text-xl"></i>
          <div>
            <p className="text-sm text-gray-600">
              Kişiselleştirilmiş güvenlik kontrolü için çocuk profilinizi seçin
            </p>
          </div>
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
              {activeChild?.name} için Uygun
            </p>
            <p className="text-sm text-green-600">
              Bu malzeme çocuğunuzun yaşı ve alerjileri için güvenli görünüyor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Uyarı
  if (safetyStatus === 'warning') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-triangle-exclamation text-red-500 text-xl"></i>
          <div>
            <p className="font-medium text-red-800">Dikkat!</p>
            <p className="text-sm text-red-600">{alertMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
