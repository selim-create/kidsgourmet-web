/**
 * Safely converts icon name to FontAwesome class
 * Handles cases where icon might already have prefix or not
 */
export const getIconClass = (iconName: string): string => {
  // Eğer zaten prefix varsa, olduğu gibi döndür
  if (iconName.startsWith('fa-')) return iconName;
  // Prefix yoksa ekle
  return `fa-solid fa-${iconName}`;
};
