'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AgeGroup } from '@/types/taxonomy';
import { calculateAgeInMonths, findAgeGroup } from '@/utils/ageCalculator';
import { useAgeGroups } from '@/hooks/useAgeGroups';

interface ChildProfile {
  birthDate: Date | null;
  ageInMonths: number;
  currentAgeGroup: AgeGroup | null;
}

interface ChildProfileContextType {
  profile: ChildProfile;
  setChildBirthDate: (date: Date) => void;
  getAgeInMonths: () => number;
  isRecipeSuitable: (recipeAgeGroups: AgeGroup[]) => boolean;
  getForbiddenIngredients: () => string[];
}

const ChildProfileContext = createContext<ChildProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'kg_child_birthdate';

export function ChildProfileProvider({ children }: { children: ReactNode }) {
  const { ageGroups } = useAgeGroups();
  const [profile, setProfile] = useState<ChildProfile>({
    birthDate: null,
    ageInMonths: 0,
    currentAgeGroup: null,
  });

  const updateProfile = useCallback((date: Date) => {
    const ageInMonths = calculateAgeInMonths(date);
    const currentAgeGroup = findAgeGroup(ageInMonths, ageGroups);
    
    setProfile({
      birthDate: date,
      ageInMonths,
      currentAgeGroup,
    });
  }, [ageGroups]);

  // Load birth date from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDate = localStorage.getItem(STORAGE_KEY);
      if (savedDate) {
        const birthDate = new Date(savedDate);
        updateProfile(birthDate);
      }
    }
  }, [updateProfile]);

  // Update profile when age groups are loaded
  useEffect(() => {
    if (profile.birthDate && ageGroups.length > 0 && !profile.currentAgeGroup) {
      const ageInMonths = calculateAgeInMonths(profile.birthDate);
      const currentAgeGroup = findAgeGroup(ageInMonths, ageGroups);
      
      setProfile(prev => ({
        ...prev,
        ageInMonths,
        currentAgeGroup,
      }));
    }
  }, [ageGroups, profile.birthDate, profile.currentAgeGroup]);

  const setChildBirthDate = (date: Date) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, date.toISOString());
    }
    updateProfile(date);
  };

  const getAgeInMonths = () => {
    return profile.ageInMonths;
  };

  const isRecipeSuitable = (recipeAgeGroups: AgeGroup[]): boolean => {
    if (!profile.currentAgeGroup || !recipeAgeGroups || recipeAgeGroups.length === 0) {
      return true; // Default to suitable if no profile or recipe age groups
    }
    
    // Check if any recipe age group matches the current age group
    return recipeAgeGroups.some(
      recipeAgeGroup => recipeAgeGroup.id === profile.currentAgeGroup?.id
    );
  };

  const getForbiddenIngredients = (): string[] => {
    if (!profile.currentAgeGroup) {
      return [];
    }
    return profile.currentAgeGroup.age_group_meta.forbidden_list || [];
  };

  return (
    <ChildProfileContext.Provider
      value={{
        profile,
        setChildBirthDate,
        getAgeInMonths,
        isRecipeSuitable,
        getForbiddenIngredients,
      }}
    >
      {children}
    </ChildProfileContext.Provider>
  );
}

export function useChildProfile() {
  const context = useContext(ChildProfileContext);
  if (context === undefined) {
    throw new Error('useChildProfile must be used within a ChildProfileProvider');
  }
  return context;
}
