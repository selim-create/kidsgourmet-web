// WordPress sitenizin adresi (Localde veya Canlıda)
// .env.local dosyasında NEXT_PUBLIC_WORDPRESS_API_URL tanımlamayı unutmayın.
export const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.kidsgourmet.com.tr/wp-json';

// Özel Namespace'imiz (Backend'de tanımladığımız)
export const KG_API_NAMESPACE = '/kg/v1';
export const WP_API_NAMESPACE = '/wp/v2';

// Tariften.com API
export const TARIFTEN_API_URL = 'https://api.tariften.com/wp-json/tariften/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Recipes
  RECIPES: `${KG_API_NAMESPACE}/recipes`,
  RECIPE_BY_SLUG: (slug: string) => `${KG_API_NAMESPACE}/recipes/${slug}`,
  RECIPES_FEATURED: `${KG_API_NAMESPACE}/recipes/featured`,
  RECIPES_BY_AGE: (age: string) => `${KG_API_NAMESPACE}/recipes/by-age/${age}`,
  
  // Ingredients
  INGREDIENTS: `${KG_API_NAMESPACE}/ingredients`,
  INGREDIENT_BY_SLUG: (slug: string) => `${KG_API_NAMESPACE}/ingredients/${slug}`,
  INGREDIENTS_SEARCH: `${KG_API_NAMESPACE}/ingredients/search`,
  
  // Auth
  AUTH_LOGIN: `${KG_API_NAMESPACE}/auth/login`,
  AUTH_REGISTER: `${KG_API_NAMESPACE}/auth/register`,
  AUTH_ME: `${KG_API_NAMESPACE}/auth/me`,
  
  // User
  USER_PROFILE: `${KG_API_NAMESPACE}/user/profile`,
  USER_CHILDREN: `${KG_API_NAMESPACE}/user/children`,
  USER_FAVORITES: `${KG_API_NAMESPACE}/user/favorites`,
  USER_SHOPPING_LIST: `${KG_API_NAMESPACE}/user/shopping-list`,
  
  // Search
  SEARCH: `${KG_API_NAMESPACE}/search`,
  
  // Tariften.com Cross-Sell
  TARIFTEN_BY_INGREDIENT: (ingredient: string) => 
    `${TARIFTEN_API_URL}/recipes/by-ingredient?ingredient=${encodeURIComponent(ingredient)}&limit=3`,
  
  // Taxonomies
  AGE_GROUPS: `${WP_API_NAMESPACE}/age-group`,
  MEAL_TYPES: `${WP_API_NAMESPACE}/meal-type`,
} as const;