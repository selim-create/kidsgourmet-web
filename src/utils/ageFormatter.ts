/**
 * Format age from birth date to "7 Ay 12 Günlük" format
 */
export function formatAge(birthDate: string | Date): string {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  // Calculate the difference in days
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate years, months, and days
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  
  // Adjust for negative days
  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Format the output
  if (years > 0) {
    if (months > 0) {
      return `${years} Yaş ${months} Aylık`;
    }
    return `${years} Yaşında`;
  } else if (months > 0) {
    if (days > 0) {
      return `${months} Ay ${days} Günlük`;
    }
    return `${months} Aylık`;
  } else {
    return `${days} Günlük`;
  }
}

/**
 * Calculate age in months from birth date
 */
export function calculateAgeInMonths(birthDate: string | Date): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  const years = today.getFullYear() - birth.getFullYear();
  const months = today.getMonth() - birth.getMonth();
  
  return years * 12 + months;
}
