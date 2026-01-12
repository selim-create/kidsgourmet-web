import { AgeGroup } from '@/types/taxonomy';

/**
 * Calculates age in months from birth date
 * Takes into account the day of month for accurate calculation
 */
export function calculateAgeInMonths(birthDate: Date): number {
  const today = new Date();
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months += today.getMonth() - birthDate.getMonth();
  
  // Subtract a month if current day is before birth day
  if (today.getDate() < birthDate.getDate()) {
    months--;
  }
  
  return Math.max(0, months); // Ensure we don't return negative months
}

/**
 * Finds the appropriate age group for a given age in months
 */
export function findAgeGroup(ageInMonths: number, ageGroups: AgeGroup[]): AgeGroup | null {
  return ageGroups.find(
    group => ageInMonths >= group.age_group_meta.min_month && 
             ageInMonths <= group.age_group_meta.max_month
  ) || null;
}

/**
 * Checks if recipe ingredients contain any forbidden items
 */
export function checkForbiddenIngredients(
  recipeIngredients: string[],
  forbiddenList: string[]
): string[] {
  return recipeIngredients.filter(ingredient =>
    forbiddenList.some(forbidden => 
      ingredient.toLowerCase().includes(forbidden.toLowerCase())
    )
  );
}
