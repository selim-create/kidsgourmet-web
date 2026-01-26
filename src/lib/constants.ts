// WordPress sitenizin adresi (Localde veya Canlıda)
// .env.local dosyasında NEXT_PUBLIC_WORDPRESS_API_URL tanımlamayı unutmayın.
export const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.kidsgourmet.com.tr/wp-json';

// Site URL (Frontend)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kidsgourmet.com.tr';

// Özel Namespace'imiz (Backend'de tanımladığımız)
export const KG_API_NAMESPACE = '/kg/v1';
export const WP_API_NAMESPACE = '/wp/v2';

// Tariften.com API
export const TARIFTEN_API_URL = 'https://api.tariften.com/wp-json/tariften/v1';

// Rejimde.com API
export const REJIMDE_API_URL = process.env.NEXT_PUBLIC_REJIMDE_API_URL || 'https://api.rejimde.com/wp-json/rejimde/v1';

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
  INGREDIENT_CATEGORIES: `${KG_API_NAMESPACE}/ingredient-categories`,
  INGREDIENTS_BY_SEASON: (season: string) => `${KG_API_NAMESPACE}/ingredients?season=${encodeURIComponent(season)}`,
  
  // Auth
  AUTH_LOGIN: `${KG_API_NAMESPACE}/auth/login`,
  AUTH_REGISTER: `${KG_API_NAMESPACE}/auth/register`,
  AUTH_ME: `${KG_API_NAMESPACE}/auth/me`,
  AUTH_GOOGLE: `${KG_API_NAMESPACE}/auth/google`,
  AUTH_FORGOT_PASSWORD: `${KG_API_NAMESPACE}/auth/forgot-password`,
  AUTH_RESET_PASSWORD: `${KG_API_NAMESPACE}/auth/reset-password`,
  
  // User
  USER_PROFILE: `${KG_API_NAMESPACE}/user/profile`,
  USER_CHILDREN: `${KG_API_NAMESPACE}/user/children`,
  USER_FAVORITES: `${KG_API_NAMESPACE}/user/favorites`,
  USER_SHOPPING_LIST: `${KG_API_NAMESPACE}/user/shopping-list`,
  USER_COLLECTIONS: `${KG_API_NAMESPACE}/user/collections`,
  USER_COLLECTION_BY_ID: (id: string) => `${KG_API_NAMESPACE}/user/collections/${id}`,
  USER_COLLECTION_ITEMS: (id: string) => `${KG_API_NAMESPACE}/user/collections/${id}/items`,
  USER_AVATAR: `${KG_API_NAMESPACE}/user/avatar`,
  CHILD_PROFILE_AVATAR: (childId: string) => `${KG_API_NAMESPACE}/child-profiles/${childId}/avatar`,
  
  // Consent Management
  USER_CONSENTS: `${KG_API_NAMESPACE}/user/consents`,
  USER_CONSENT_UPDATE: (type: string) => `${KG_API_NAMESPACE}/user/consents/${type}`,
  
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
  DIET_TYPES: `${WP_API_NAMESPACE}/diet-type`,
  
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
  TOP_CONTRIBUTORS: `${KG_API_NAMESPACE}/community/top-contributors`,
  
  // Comments (using custom endpoint for JWT auth compatibility)
  // WordPress standard /wp/v2/comments endpoint doesn't accept JWT tokens for authentication
  // Our custom /kg/v1/comments endpoint is configured to work with JWT auth
  COMMENTS: `${KG_API_NAMESPACE}/comments`,
  COMMENTS_BY_POST: (postId: number) => `${KG_API_NAMESPACE}/comments?post_id=${postId}`,
  
  // Expert & Public Profile Endpoints
  USER_ME: `${KG_API_NAMESPACE}/user/me`,
  USER_PUBLIC: (username: string) => `${KG_API_NAMESPACE}/user/public/${username}`,
  EXPERT_PUBLIC: (username: string) => `${KG_API_NAMESPACE}/expert/public/${username}`,
  EXPERT_DASHBOARD: `${KG_API_NAMESPACE}/expert/dashboard`,
  EXPERTS_LIST: `${KG_API_NAMESPACE}/experts`,
  
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
  
  // Tools
  TOOLS: `${KG_API_NAMESPACE}/tools`,
  TOOL_BY_SLUG: (slug: string) => `${KG_API_NAMESPACE}/tools/${slug}`,
  BLW_TEST_CONFIG: `${KG_API_NAMESPACE}/tools/blw-test/config`,
  BLW_TEST_SUBMIT: `${KG_API_NAMESPACE}/tools/blw-test/submit`,
  USER_BLW_RESULTS: `${KG_API_NAMESPACE}/user/blw-results`,
  CHILD_BLW_RESULTS: (childId: string) => `${KG_API_NAMESPACE}/user/children/${childId}/blw-results`,
  
  // Percentile Calculator
  PERCENTILE_CALCULATE: `${KG_API_NAMESPACE}/tools/percentile/calculate`,
  PERCENTILE_SAVE: `${KG_API_NAMESPACE}/tools/percentile/save`,
  USER_PERCENTILE_RESULTS: `${KG_API_NAMESPACE}/user/percentile-results`,
  CHILD_PERCENTILE_RESULTS: (childId: string) => `${KG_API_NAMESPACE}/user/children/${childId}/percentile-results`,
  
  // Water Calculator
  WATER_CALCULATOR: `${KG_API_NAMESPACE}/tools/water-need/calculate`,
  
  // Solid Food Readiness
  SOLID_FOOD_CONFIG: `${KG_API_NAMESPACE}/tools/solid-food-readiness/config`,
  SOLID_FOOD_SUBMIT: `${KG_API_NAMESPACE}/tools/solid-food-readiness/submit`,
  USER_SOLID_FOOD_RESULTS: `${KG_API_NAMESPACE}/user/solid-food-results`,
  CHILD_SOLID_FOOD_RESULTS: (childId: string) => `${KG_API_NAMESPACE}/user/children/${childId}/solid-food-results`,
  
  // Allergen Planner
  ALLERGEN_LIST: `${KG_API_NAMESPACE}/tools/allergen-planner/allergens`,
  ALLERGEN_PLAN: (allergenId: string) => `${KG_API_NAMESPACE}/tools/allergen-planner/${allergenId}`,
  
  // Food Trial Calendar
  FOOD_TRIALS: `${KG_API_NAMESPACE}/tools/food-trials`,
  FOOD_TRIAL_ADD: `${KG_API_NAMESPACE}/tools/food-trials`,
  FOOD_TRIAL_SUMMARY: (childId: string, startDate: string, endDate: string) => 
    `${KG_API_NAMESPACE}/tools/food-trials/summary?child_id=${childId}&start_date=${startDate}&end_date=${endDate}`,
  
  // Sponsored Tools
  BATH_PLANNER_CONFIG: `${KG_API_NAMESPACE}/tools/bath-planner/config`,
  BATH_PLANNER_GENERATE: `${KG_API_NAMESPACE}/tools/bath-planner/generate`,
  HYGIENE_CALCULATOR: `${KG_API_NAMESPACE}/tools/hygiene-calculator/calculate`,
  DIAPER_CALCULATOR: `${KG_API_NAMESPACE}/tools/diaper-calculator/calculate`,
  DIAPER_RASH_RISK: `${KG_API_NAMESPACE}/tools/diaper-calculator/rash-risk`,
  AIR_QUALITY_ANALYZE: `${KG_API_NAMESPACE}/tools/air-quality/analyze`,
  STAIN_SEARCH: `${KG_API_NAMESPACE}/tools/stain-encyclopedia/search`,
  STAIN_BY_SLUG: (slug: string) => `${KG_API_NAMESPACE}/tools/stain-encyclopedia/${slug}`,
  
  // Vaccination Tracker Endpoints
  VACCINES_MASTER: `${KG_API_NAMESPACE}/health/vaccines/master`,
  VACCINES_SCHEDULE_VERSIONS: `${KG_API_NAMESPACE}/health/vaccines/schedule-versions`,
  VACCINES_BY_CHILD: (childId: string) => `${KG_API_NAMESPACE}/health/vaccines?child_id=${childId}`,
  VACCINES_MARK_DONE: `${KG_API_NAMESPACE}/health/vaccines/mark-done`,
  VACCINES_UPDATE_STATUS: `${KG_API_NAMESPACE}/health/vaccines/update-status`,
  VACCINES_ADD_PRIVATE: `${KG_API_NAMESPACE}/health/vaccines/private/add`,
  VACCINES_SIDE_EFFECTS: `${KG_API_NAMESPACE}/health/vaccines/side-effects`,
  VACCINES_UPCOMING: (childId: string) => `${KG_API_NAMESPACE}/health/vaccines/upcoming?child_id=${childId}`,
  VACCINES_HISTORY: (childId: string) => `${KG_API_NAMESPACE}/health/vaccines/history?child_id=${childId}`,
  
  // Notification Preferences
  NOTIFICATION_PREFERENCES: `${KG_API_NAMESPACE}/notifications/preferences`,
  PUSH_SUBSCRIBE: `${KG_API_NAMESPACE}/notifications/push/subscribe`,
  PUSH_UNSUBSCRIBE: `${KG_API_NAMESPACE}/notifications/push/unsubscribe`,
  
  // Personalization - Recommendations
  RECOMMENDATIONS_DASHBOARD: `${KG_API_NAMESPACE}/recommendations/dashboard`,
  RECOMMENDATIONS_RECIPES: `${KG_API_NAMESPACE}/recommendations/recipes`,
  RECOMMENDATIONS_SIMILAR: (recipeId: number) => `${KG_API_NAMESPACE}/recommendations/similar/${recipeId}`,
  
  // Personalization - Safety
  SAFETY_CHECK_RECIPE: `${KG_API_NAMESPACE}/safety/check-recipe`,
  SAFETY_CHECK_INGREDIENT: `${KG_API_NAMESPACE}/safety/check-ingredient`,
  SAFETY_BATCH_CHECK: `${KG_API_NAMESPACE}/safety/batch-check`,
  
  // Personalization - Nutrition
  NUTRITION_WEEKLY_SUMMARY: `${KG_API_NAMESPACE}/nutrition/weekly-summary`,
  NUTRITION_MISSING_NUTRIENTS: `${KG_API_NAMESPACE}/nutrition/missing-nutrients`,
  NUTRITION_VARIETY_ANALYSIS: `${KG_API_NAMESPACE}/nutrition/variety-analysis`,
  
  // Personalization - Food Introduction
  FOOD_INTRODUCTION_SUGGESTED: `${KG_API_NAMESPACE}/food-introduction/suggested`,
  FOOD_INTRODUCTION_NEXT: `${KG_API_NAMESPACE}/food-introduction/next-suggestion`,
} as const;