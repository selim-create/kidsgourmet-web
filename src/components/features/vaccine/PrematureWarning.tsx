"use client";

import React from 'react';

interface PrematureWarningProps {
  isPremature: boolean;
}

export default function PrematureWarning({ isPremature }: PrematureWarningProps) {
  if (!isPremature) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-2">
            <i className="fa-solid fa-baby"></i>
            Prematüre Bebek Bilgilendirmesi
          </h4>
          <p className="text-sm text-amber-800 mb-2">
            Prematüre doğan bebeklerde aşı takvimi, doğum tarihine göre değil, düzeltilmiş yaşa göre 
            uygulanır. Aşı programınız hekim tarafından kişiselleştirilebilir.
          </p>
          <p className="text-xs text-amber-700 font-medium">
            💡 Herhangi bir aşıyı yaptırmadan önce mutlaka çocuk hekiminize danışın.
          </p>
        </div>
      </div>
    </div>
  );
}
