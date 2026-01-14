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
  AUTH_GOOGLE: `${KG_API_NAMESPACE}/auth/google`,
  
  // User
  USER_PROFILE: `${KG_API_NAMESPACE}/user/profile`,
  USER_CHILDREN: `${KG_API_NAMESPACE}/user/children`,
  USER_FAVORITES: `${KG_API_NAMESPACE}/user/favorites`,
  USER_SHOPPING_LIST: `${KG_API_NAMESPACE}/user/shopping-list`,
  USER_COLLECTIONS: `${KG_API_NAMESPACE}/user/collections`,
  USER_COLLECTION_BY_ID: (id: string) => `${KG_API_NAMESPACE}/user/collections/${id}`,
  USER_COLLECTION_ITEMS: (id: string) => `${KG_API_NAMESPACE}/user/collections/${id}/items`,
  
  // Search
  SEARCH: `${KG_API_NAMESPACE}/search`,
  
  // Featured Content
  FEATURED: `${KG_API_NAMESPACE}/featured`,
  
  // Tariften.com Cross-Sell
  TARIFTEN_BY_INGREDIENT: (ingredient: string) => 
    `${TARIFTEN_API_URL}/recipes/by-ingredient?ingredient=${encodeURIComponent(ingredient)}&limit=3`,
  
  // Taxonomies
  AGE_GROUPS: `${WP_API_NAMESPACE}/age-group`,
  MEAL_TYPES: `${WP_API_NAMESPACE}/meal-type`,
  
  // Community / Discussion Endpoints
  CIRCLES: `${KG_API_NAMESPACE}/circles`,
  CIRCLE_FOLLOW: (id: number) => `${KG_API_NAMESPACE}/circles/${id}/follow`,
  CIRCLE_UNFOLLOW: (id: number) => `${KG_API_NAMESPACE}/circles/${id}/unfollow`,
  USER_CIRCLES: `${KG_API_NAMESPACE}/user/circles`,
  DISCUSSIONS: `${KG_API_NAMESPACE}/discussions`,
  DISCUSSION_BY_ID: (id: number) => `${KG_API_NAMESPACE}/discussions/${id}`,
  DISCUSSION_BY_SLUG: (slug: string) => `${KG_API_NAMESPACE}/discussions?slug=${slug}`,
  DISCUSSION_COMMENTS: (id: number) => `${KG_API_NAMESPACE}/discussions/${id}/comments`,
  USER_DISCUSSIONS: `${KG_API_NAMESPACE}/user/discussions`,
  FEED: `${KG_API_NAMESPACE}/feed`,
  
  // Expert & Public Profile Endpoints
  USER_ME: `${KG_API_NAMESPACE}/user/me`,
  USER_PUBLIC: (username: string) => `${KG_API_NAMESPACE}/user/public/${username}`,
  EXPERT_DASHBOARD: `${KG_API_NAMESPACE}/expert/dashboard`,
  
  // Meal Plans
  MEAL_PLANS_GENERATE: `${KG_API_NAMESPACE}/meal-plans/generate`,
  MEAL_PLANS_ACTIVE: (childId: string) => `${KG_API_NAMESPACE}/meal-plans/active?child_id=${childId}`,
  MEAL_PLAN_BY_ID: (id: string) => `${KG_API_NAMESPACE}/meal-plans/${id}`,
  MEAL_PLAN_REFRESH_SLOT: (planId: string, slotId: string) => 
    `${KG_API_NAMESPACE}/meal-plans/${planId}/slots/${slotId}/refresh`,
  MEAL_PLAN_SKIP_SLOT: (planId: string, slotId: string) => 
    `${KG_API_NAMESPACE}/meal-plans/${planId}/slots/${slotId}/skip`,
  MEAL_PLAN_ASSIGN_SLOT: (planId: string, slotId: string) => 
    `${KG_API_NAMESPACE}/meal-plans/${planId}/slots/${slotId}/assign`,
  MEAL_PLAN_SHOPPING_LIST: (planId: string) => 
    `${KG_API_NAMESPACE}/meal-plans/${planId}/shopping-list`,
} as const;