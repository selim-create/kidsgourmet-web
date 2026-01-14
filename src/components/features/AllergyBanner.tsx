'use client';

import { Child } from '@/lib/types';

interface AllergyBannerProps {
  child: Child;
}

export default function AllergyBanner({ child }: AllergyBannerProps) {
  // Support both 'allergies' (new) and 'allergens' (backward compatibility)
  const allergies = child.allergies || child.allergens || [];
  
  if (allergies.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
        <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-red-700 mb-1">Alerji Uyarısı</h4>
        <p className="text-sm text-red-600">
          {allergies.length === 1 ? (
            <><strong>{allergies[0]}</strong> Alerjisi Modu Aktif</>
          ) : (
            <>
              <strong>{allergies.slice(0, -1).join(', ')}</strong> ve <strong>{allergies[allergies.length - 1]}</strong> Alerjileri Aktif
            </>
          )}
        </p>
        <p className="text-xs text-red-500 mt-1">
          Önerilen tariflerde bu alerjenleri içeren yemekler gösterilmeyecektir.
        </p>
      </div>
    </div>
  );
}
