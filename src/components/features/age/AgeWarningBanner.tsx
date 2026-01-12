'use client';

import { AgeGroup } from '@/types/taxonomy';
import { useChildProfile } from '@/contexts/ChildProfileContext';
import { checkForbiddenIngredients } from '@/utils/ageCalculator';

interface AgeWarningBannerProps {
  recipeAgeGroups: AgeGroup[];
  recipeIngredients: string[];
}

export default function AgeWarningBanner({ recipeAgeGroups, recipeIngredients }: AgeWarningBannerProps) {
  const { profile, isRecipeSuitable, getForbiddenIngredients } = useChildProfile();

  // Don't show banner if no child profile
  if (!profile.birthDate || !profile.currentAgeGroup) {
    return null;
  }

  // Check if recipe is suitable
  const isSuitable = isRecipeSuitable(recipeAgeGroups);
  
  // Check for forbidden ingredients
  const forbiddenList = getForbiddenIngredients();
  const foundForbidden = checkForbiddenIngredients(recipeIngredients, forbiddenList);

  // Don't show banner if recipe is suitable and no forbidden ingredients
  if (isSuitable && foundForbidden.length === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i className="fa-solid fa-triangle-exclamation text-orange-500 text-xl mt-0.5"></i>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-bold text-orange-800 mb-1">
            ⚠️ Dikkat: Çocuğunuz {profile.ageInMonths} aylık
          </h3>
          
          {foundForbidden.length > 0 ? (
            <div className="text-sm text-orange-700">
              <p className="mb-2">
                Bu tarifteki <strong>{foundForbidden.join(', ')}</strong> onun için uygun değildir.
              </p>
              <p className="text-xs">
                Bu malzemeleri çıkararak veya uygun alternatiflerle değiştirerek yapabilirsiniz.
              </p>
            </div>
          ) : (
            <p className="text-sm text-orange-700">
              Bu tarif çocuğunuzun yaş grubu için önerilmemektedir. 
              {profile.currentAgeGroup.age_group_meta.warning_message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
