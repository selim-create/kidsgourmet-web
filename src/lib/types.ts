// Recipe tam tip tanımı
export interface Recipe {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  prep_time: string;
  cook_time?: string;
  serving_size?: string;
  meal_type?: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  nutrition: NutritionInfo;
  allergens: string[];
  age_groups: string[];
  diet_types: string[];
  video_url?: string;
  substitutes?: Substitute[];
  is_featured: boolean;
  expert: ExpertInfo;
  related_recipes?: RecipeCard[];
  cross_sell?: CrossSellInfo;
  seo?: SEOData;
  difficulty?: string;
  freezable?: boolean;
  storage_info?: string;
  special_notes?: string;
  rating?: number;
  rating_count?: number;
  user_rating?: number;
  author?: {
    id: number;
    name: string;
    slug?: string;
    avatar?: string;
    avatar_url?: string;
    avatarUrl?: string;
  };
}

export interface RecipeIngredient {
  id?: number;
  name: string;
  amount: string;
  unit: string;
  ingredient_id?: number | null; // Ingredient CPT ile ilişki
  checked?: boolean; // Frontend state
  // Backward compatibility
  text?: string;
  note?: string;
}

export interface RecipeInstruction {
  id?: number;
  title: string;
  text: string;
  tip?: string;
  completed?: boolean; // Frontend state
}

export interface NutritionInfo {
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
  vitamins?: string;
  sugar?: string;
  sodium?: string;
  minerals?: string;
}

export interface ExpertInfo {
  name: string;
  title: string;
  image?: string;
  approved: boolean;
  note?: string;
  slug?: string;
}

export interface Substitute {
  original: string;
  substitute: string; // 'replacement' yerine 'substitute'
  note?: string;
  // Backward compatibility
  replacement?: string;
}

export interface CrossSellInfo {
  mode: 'manual' | 'auto';
  url: string;
  title: string;
  description?: string;
  image?: string;
  ingredient?: string; // Otomatik mod için kullanılan malzeme
  tariften_id?: number;
}

export interface RecipeCard {
  id: number;
  title: string;
  slug: string;
  image: string;
  age_group: string;
  age_group_color?: string;
  prep_time: string;
  // YENİ ALANLAR
  meal_type?: string;
  diet_types?: string[];
  author?: {
    id: number;
    name: string;
    avatar?: string;
  };
  expert?: {
    name: string;
    title: string;
    approved: boolean;
  };
  is_featured?: boolean;
}

// Yeni: Tariften Recipe (cross-sell önerileri için)
export interface TariftenRecipe {
  id: number;
  title: string;
  slug: string;
  url: string;
  image: string;
  prep_time: string;
  cook_time: string;
  difficulty: string;
  servings: string;
}

// Ingredient (Malzeme) tip tanımı - GÜNCELLENMİŞ
export interface Ingredient {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  category?: string; // 🆕 "Meyveler", "Sebzeler", "Proteinler", "Tahıllar", "Süt Ürünleri"
  start_age: string;
  min_age_months?: number; // 🆕 API'den gelen minimum yaş (ay olarak)
  benefits: string;
  prep_methods: string[];
  allergy_risk: 'Düşük' | 'Orta' | 'Yüksek';
  season: string;
  storage_tips?: string;
  
  // 🆕 YENİ ALANLAR
  prep_by_age?: PrepByAge[];        // Yaşa göre hazırlama
  selection_tips?: string;           // Nasıl seçilir?
  pro_tips?: string;                 // Püf noktaları
  pairings?: IngredientPairing[];   // Uyumlu ikililer
  nutrition?: IngredientNutrition;  // Besin değerleri (genişletilmiş)
  
  related_recipes: RecipeCard[];
  faq?: FAQ[];
  
  // 🆕 AI Meta
  ai_generated?: boolean;
  image_source?: string;
  image_credit?: string;
  
  // 🆕 Yeni backend alanları (konsolidasyon sonrası)
  allergen_info?: AllergenInfo;
  allergens?: string[];  // Taxonomy'den gelen alerjen isimleri
  nutrition_per_100g?: NutritionPer100g;
  prep_methods_list?: string[];
  seo?: SEOData;  // 🆕 RankMath SEO data
}

// 🆕 Yaşa göre hazırlama
export interface PrepByAge {
  age: string;      // "6-9 Ay", "9+ Ay (BLW)"
  method: string;   // "Püre", "Parmak Yiyecek"
  text: string;     // Detaylı açıklama
}

// 🆕 Uyumlu ikili
export interface IngredientPairing {
  emoji: string;   // "🍌"
  name: string;    // "Muz"
}

// 🆕 Besin değerleri (genişletilmiş)
export interface IngredientNutrition {
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
  vitamins?: string;
  sugar?: string;
  minerals?: string;
}

// 🆕 Besin değerleri (100g başına) - Backend konsolidasyonu
export interface NutritionPer100g {
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
  sugar?: string;
  vitamins?: string;
  minerals?: string;
}

// 🆕 Alerjen bilgileri
export interface AllergenInfo {
  is_allergen: boolean;
  allergen_type?: string;
  cross_contamination_risk?: string;
  allergy_symptoms?: string;
  alternative_ingredients?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// User ve Auth tipleri
export interface User {
  id: number;
  email: string;
  name: string;
  username?: string;
  display_name: string;
  parent_role?: 'Anne' | 'Baba' | 'Bakıcı' | 'Diğer';
  gender?: 'male' | 'female' | 'other';
  birth_date?: string; // YYYY-MM-DD
  avatar_url?: string;
  biography?: string;
  social_links?: SocialLinks;
  show_email?: boolean;
  expertise?: string[];
  children: Child[];
  role?: string; // 'subscriber' | 'kg_expert' | 'editor' | 'administrator'
  roles?: string[];
  is_expert?: boolean;
  is_admin?: boolean;
  is_editor?: boolean;
  is_author?: boolean;
  has_editor_access?: boolean;
  capabilities?: UserCapabilities;
  can_edit?: UserCanEdit;
  can_edit_others?: UserCanEdit;
  admin_url?: string;
  edit_urls?: UserEditUrls;
  created_at: string;
}

// Sosyal medya linkleri
export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
  facebook?: string;
}

// User capabilities for authorization
export interface UserCapabilities {
  edit_posts?: boolean;
  edit_others_posts?: boolean;
  edit_published_posts?: boolean;
  publish_posts?: boolean;
  edit_recipes?: boolean;
  edit_others_recipes?: boolean;
  edit_ingredients?: boolean;
  edit_others_ingredients?: boolean;
  manage_categories?: boolean;
  moderate_comments?: boolean;
  upload_files?: boolean;
}

export interface UserCanEdit {
  posts: boolean;
  recipes: boolean;
  ingredients: boolean;
  discussions: boolean;
}

export interface UserEditUrls {
  new_post: string;
  new_recipe: string;
  new_ingredient: string;
  new_discussion?: string;
  edit_post: string;
  edit_recipe: string;
  edit_ingredient: string;
}

export interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'unspecified';
  allergies: string[];
  feeding_style: 'blw' | 'puree' | 'mixed';
  photo_id?: number | null;
  age_months?: number;
  notes?: string;
  kvkk_consent?: boolean;
  avatar_url?: string;      // Signed URL (geçici)
  has_avatar?: boolean;     // Avatar var mı?
  // Backward compatibility
  allergens?: string[];
  blw_test_results?: BLWTestResult[];
}

export interface AuthResponse {
  token: string;
  user: User;
  redirect_url?: string;
  is_expert?: boolean;
}

export interface LoginCredentials {
  username: string; // email VEYA kullanıcı adı olabilir
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username?: string;
  child?: {
    name: string;
    birth_date: string;
  };
}

// Favoriler
export interface Favorite {
  id: number;
  recipe_id: number;
  recipe: RecipeCard;
  created_at: string;
}

// Yeni Favoriler API Tipleri
export type FavoriteItemType = 'recipe' | 'ingredient' | 'post' | 'discussion';

export interface FavoriteRecipeCard {
  id: number;
  title: string;
  slug: string;
  image: string;
  age_group: string;
  age_group_color?: string;
  prep_time: string;
  categories?: string[];
}

export interface FavoriteIngredientCard {
  id: number;
  name: string;
  slug: string;
  image: string;
  start_age: string;
  allergy_risk: 'Düşük' | 'Orta' | 'Yüksek';
}

export interface FavoriteBlogCard {
  id: number;
  title: string;
  slug: string;
  image: string;
  category: string;
  read_time: string;
}

export interface FavoriteDiscussionCard {
  id: number;
  title: string;
  slug: string;
  author: string;
  author_avatar?: string;
  answer_count: number;
  circle?: string;
}

export interface FavoritesResponse {
  recipes: FavoriteRecipeCard[];
  ingredients: FavoriteIngredientCard[];
  posts: FavoriteBlogCard[];
  discussions: FavoriteDiscussionCard[];
  counts: { all: number; recipes: number; ingredients: number; posts: number; discussions: number; };
}

export interface CollectionItem {
  item_id: number;
  item_type: FavoriteItemType;
  added_at: string;
  data?: FavoriteRecipeCard | FavoriteIngredientCard | FavoriteBlogCard | FavoriteDiscussionCard;
}

export interface Collection {
  id: string;
  name: string;
  icon: string;
  color: string;
  item_count: number;
  items?: CollectionItem[];
  created_at: string;
  updated_at?: string;
}

export interface CollectionInput {
  name: string;
  icon: string;
  color: string;
}

// Alışveriş Listesi
export interface ShoppingListItem {
  id: number | string; // Backend string döndürüyor, her ikisini de destekle
  ingredient: string;
  amount?: string;
  checked: boolean;
  category?: ShoppingCategory;
  recipe_id?: number;
  recipe_title?: string;
}

// API Response tipleri
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// SEO Data
export interface SEOData {
  title?: string;
  description?: string;
  focus_keywords?: string[];
  og_image?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

// Sponsor Data Interface
export interface SponsorData {
  is_sponsored: boolean;
  sponsor_name: string;
  sponsor_url: string;
  sponsor_logo: string | null | { url?: string; source_url?: string; src?: string };
  sponsor_light_logo: string | null | { url?: string; source_url?: string; src?: string };
  direct_redirect: boolean;
  gam_impression_url: string | null;
  gam_click_url: string | null;
  discount_text?: string | null;
}

// ==================== COMMUNITY / DISCUSSION TYPES ====================

export interface Circle {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color_code: string;
  order: number;
  is_following: boolean;
  discussion_count: number;
}

export interface DiscussionAuthor {
  id: number;
  name: string;
  avatar: string | null;
  username?: string;
}

export interface DiscussionCircle {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color_code: string;
}

export interface Discussion {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  status: 'publish' | 'pending' | 'draft';
  author: DiscussionAuthor;
  circle: DiscussionCircle | null;
  is_featured: boolean;
  expert_answered: boolean;
  comment_count: number;
  created_at: string;
  type: 'discussion';
  like_count: number;
  dislike_count: number;
  user_vote: 'like' | 'dislike' | null;
  seo?: {
    title: string;
    description: string;
    og_image: string;
    canonical_url: string;
  };
}

export interface DiscussionComment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar: string;
    username?: string;
  };
  is_expert_comment: boolean;
  parent_id: number;
  created_at: string;
  like_count: number;
  dislike_count: number;
  user_vote: 'like' | 'dislike' | null;
}

export interface DiscussionsResponse {
  discussions: Discussion[];
  total: number;
  pages: number;
  current_page: number;
}

export interface FeedResponse {
  discussions: Discussion[];
  recipes: RecipeCard[];
  total: number;
}

export interface CreateDiscussionRequest {
  title: string;
  content: string;
  circle_id: number;
  is_anonymous?: boolean;
}

export interface CreateDiscussionResponse {
  id: number;
  message: string;
  status: 'pending';
}

export interface TopContributor {
  id: number;
  name: string;
  avatar: string | null;
  contribution_count: number;
  rank: number;
}

// ==================== PUBLIC PROFILE & EXPERT DASHBOARD ====================

export interface PublicProfile {
  id: number;
  display_name: string;
  parent_role?: string;
  avatar_url?: string;
  badges: string[];
  stats: {
    question_count: number;
    approved_comments: number;
  };
  recent_questions?: Discussion[];
}

// Blog yazısı kartı
export interface BlogPostCard {
  id: number;
  title: string;
  slug: string;
  image: string;
  category: string;
  read_time: string;
  published_at?: string;
}

// Cevaplanan soru
export interface AnsweredQuestion {
  id: number;
  title: string;
  slug: string;
  answer_excerpt: string;
  answered_at: string;
}

// Uzman Public Profil
export interface ExpertPublicProfile {
  id: number;
  username: string;
  display_name: string;
  avatar_url?: string;
  biography?: string;
  expertise: string[];
  social_links?: SocialLinks;
  email?: string;
  show_email?: boolean;
  stats: {
    total_recipes: number;
    total_blog_posts: number;
    total_posts?: number;  // Backend'den gelen alternatif field
    total_answers: number;
    total_questions: number;
  };
  // Content fields are at the top level (not nested in a content object)
  recipes: RecipeCard[];
  blog_posts: BlogPostCard[];
  answered_questions: AnsweredQuestion[];
  asked_questions: Discussion[];
  role: string;
}

export interface ExpertDashboard {
  pending_questions: number;
  pending_comments: number;
  today_answers: number;
  weekly_stats: {
    questions_answered: number;
    comments_moderated: number;
  };
}

// ========== MEAL PLAN TYPES ==========

export interface MealPlan {
  id: string;
  child_id: string;
  week_start: string;
  week_end: string;
  status: 'draft' | 'active' | 'completed';
  days: MealPlanDay[];
  nutrition_summary?: WeeklyNutritionSummary;
  created_at: string;
  updated_at: string;
}

export interface MealPlanDay {
  date: string;
  day_name: string;
  slots: MealSlot[];
}

export interface MealSlot {
  id: string;
  slot_type: MealSlotType;
  slot_label: string;
  status: MealSlotStatus;
  recipe?: MealSlotRecipe | null;
  skip_reason?: SkipReason | null;
  time_range?: string;
  color_code?: string;
}

export type MealSlotType = 
  | 'breakfast' 
  | 'lunch' 
  | 'snack_morning' 
  | 'snack_afternoon' 
  | 'dinner';

export type MealSlotStatus = 'filled' | 'empty' | 'skipped';

export type SkipReason = 
  | 'eating_out' 
  | 'ready_meal' 
  | 'family_meal' 
  | 'other';

export interface MealSlotRecipe {
  id: number;
  title: string;
  slug: string;
  image: string;
  prep_time: string;
  age_group: string;
  allergens: string[];
}

export interface WeeklyNutritionSummary {
  total_meals: number;
  vegetables_servings: number;
  protein_servings: number;
  grains_servings: number;
  fruits_servings: number;
  new_allergens_introduced: string[];
}

export interface GeneratePlanRequest {
  child_id: string;
  week_start: string;
  preferences?: {
    exclude_recipes?: number[];
    preferred_recipes?: number[];
    max_prep_time?: number;
  };
}

export interface GeneratePlanResponse {
  success: boolean;
  plan: MealPlan;
  message?: string;
}

export interface AggregatedShoppingItem {
  ingredient_name: string;
  total_amount: number;
  unit: string;
  category: ShoppingCategory;
  recipes: { id: number; title: string; amount: string }[];
  checked: boolean;
}

export type ShoppingCategory = 
  | 'fruits_vegetables' 
  | 'meat_protein' 
  | 'dairy' 
  | 'grains' 
  | 'other';

export interface GenerateShoppingListResponse {
  success: boolean;
  items: AggregatedShoppingItem[];
  total_count: number;
}

// ===============================
// TOOL (ARAÇ) TİPLERİ
// ===============================

export type ToolType = 
  | 'blw_test' 
  | 'percentile' 
  | 'water_calculator' 
  | 'meal_planner' 
  | 'food_guide' 
  | 'solid_food_readiness' 
  | 'food_checker' 
  | 'allergen_planner' 
  | 'food_trial_calendar'
  | 'bath_planner'
  | 'hygiene_calculator'
  | 'diaper_calculator'
  | 'air_quality'
  | 'stain_encyclopedia'
  | 'vaccine_calendar';

export interface Tool {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  tool_type: ToolType;
  is_active?: boolean;
  requires_auth: boolean;
  is_sponsored?: boolean;
  sponsor_name?: string;
  sponsor_url?: string;
  seo?: SEOData;
}

// BLW Test Types
export interface BLWTestQuestion {
  id: string;
  category: 'physical_readiness' | 'safety' | 'environment' | 'feeding_history';
  question: string;
  description?: string;
  icon?: string;
  options: BLWTestOption[];
  weight: number;
}

export interface BLWTestOption {
  id: string;
  text: string;
  value: number;
  is_red_flag?: boolean;
  red_flag_message?: string;
}

export interface BLWTestConfig {
  id: number;
  title: string;
  description: string;
  questions: BLWTestQuestion[];
  result_buckets: BLWResultBucket[];
  disclaimer_text: string;
  emergency_text: string;
  recommended_links: BLWRecommendedLink[];
}

export interface BLWResultBucket {
  id: string;
  min_score: number;
  max_score: number;
  title: string;
  subtitle: string;
  color: 'green' | 'yellow' | 'red';
  icon: string;
  description: string;
  action_items: string[];
  next_steps: string[];
}

export interface BLWRecommendedLink {
  title: string;
  url: string;
  type: 'guide' | 'recipe' | 'ingredient';
}

export interface BLWTestResult {
  id?: number;
  user_id?: number;
  child_id?: string;
  child_name?: string;
  score: number;
  result_bucket_id: string;
  red_flags: BLWRedFlag[];
  answers: BLWTestAnswer[];
  created_at: string;
}

export interface BLWTestAnswer {
  question_id: string;
  option_id: string;
  score: number;
}

export interface BLWRedFlag {
  question_id: string;
  message: string;
  severity: 'warning' | 'critical';
}

// ===============================
// PERSENTİL HESAPLAYICI TİPLERİ
// ===============================

export interface PercentileMeasurement {
  gender: 'male' | 'female';
  birth_date: string;
  measurement_date: string;
  weight_kg?: number;
  height_cm?: number;
  head_circumference_cm?: number;
}

export interface PercentileValue {
  measurement_type: 'weight_for_age' | 'height_for_age' | 'head_for_age' | 'weight_for_height' | 'bmi_for_age';
  value: number;
  percentile: number;
  z_score: number;
  category: 'very_low' | 'low' | 'normal' | 'high' | 'very_high';
  interpretation: string;
}

export interface PercentileResult {
  id?: string;
  child_id?: string;
  child_name?: string;
  measurement: PercentileMeasurement;
  age_in_days: number;
  age_in_months: number;
  percentiles: PercentileValue[];
  red_flags: PercentileRedFlag[];
  created_at: string;
}

export interface PercentileRedFlag {
  type: 'weight' | 'height' | 'head' | 'growth_deviation';
  message: string;
  severity: 'warning' | 'critical';
}

export interface PercentileConfig {
  disclaimer_text: string;
  emergency_text: string;
  interpretation_texts: {
    very_low: string;
    low: string;
    normal: string;
    high: string;
    very_high: string;
  };
}

export interface PercentileHistory {
  child_id: string;
  measurements: PercentileResult[];
}

// ===============================
// SU İHTİYACI HESAPLAYICI
// ===============================

export interface WaterNeedResult {
  daily_water_ml: number;
  age_months: number;
  weight_kg: number;
  formula: string;
  recommendations: string[];
  warnings?: string[];
}

// ===============================
// EK GIDAYA BAŞLAMA KONTROLÜ
// ===============================

export interface SolidFoodReadinessConfig {
  questions: SolidFoodQuestion[];
  result_buckets: SolidFoodResultBucket[];
}

export interface SolidFoodQuestion {
  id: string;
  question: string;
  description?: string;
  icon?: string;
  weight: number;
  options: SolidFoodOption[];
}

export interface SolidFoodOption {
  id: string;
  text: string;
  value: number;
  is_red_flag?: boolean;
  red_flag_message?: string;
}

export interface SolidFoodResultBucket {
  id: string;
  min_score: number;
  max_score: number;
  title: string;
  subtitle: string;
  color: 'green' | 'yellow' | 'red';
  icon: string;
  description: string;
  recommendations: string[];
}

export interface SolidFoodReadinessResult {
  id?: string;
  user_id?: number;
  child_id?: string;
  child_name?: string;
  score: number;
  result_bucket_id: string;
  red_flags: string[];
  answers: Record<string, string>;
  created_at: string;
}

// ===============================
// ALERJEN PLANLAYICI
// ===============================

export interface Allergen {
  id: string;
  name: string;
  emoji: string;
  risk_level: 'low' | 'medium' | 'high';
  start_age: string;
  description: string;
}

export interface AllergenTrialPlan {
  allergen: Allergen;
  days: AllergenTrialDay[];
  warning_signs: string[];
  emergency_info: string;
  notes: string[];
}

export interface AllergenTrialDay {
  day: number;
  amount: string;
  tip: string;
  watch_for?: string;
}

// ===============================
// BESİN DENEME TAKVİMİ
// ===============================

export interface FoodTrial {
  id: string;
  child_id: string;
  ingredient_id?: number;
  ingredient_name: string;
  trial_date: string;
  form: 'puree' | 'finger_food' | 'mixed';
  reaction?: 'none' | 'mild' | 'moderate' | 'severe';
  reaction_notes?: string;
  rating?: number; // 1-5 stars
  is_new: boolean;
  created_at: string;
}

export interface FoodTrialInput {
  child_id: string;
  ingredient_id?: number;
  ingredient_name: string;
  trial_date: string;
  form: 'puree' | 'finger_food' | 'mixed';
  reaction?: 'none' | 'mild' | 'moderate' | 'severe';
  reaction_notes?: string;
  rating?: number;
}

export interface FoodTrialSummary {
  total_foods: number;
  new_this_week: number;
  reactions: FoodTrial[];
  latest_trials: FoodTrial[];
}

// ===============================
// SPONSORLU ARAÇLAR TİPLERİ
// ===============================

export type SponsoredToolType = 
  | 'bath_planner'
  | 'hygiene_calculator'
  | 'diaper_calculator'
  | 'air_quality'
  | 'stain_encyclopedia';

export interface ToolSponsorData {
  is_sponsored: boolean;
  sponsor_name: string;
  sponsor_logo: string | null;
  sponsor_light_logo: string | null;
  sponsor_tagline: string;
  sponsor_cta_text: string;
  sponsor_cta_url: string;
  gam_impression_url: string | null;
  gam_click_url: string | null;
}

// Banyo Planlayıcı
export interface BathPlannerConfig {
  tool_info?: {
    id: number;
    title: string;
    description: string;
    icon: string;
  };
  skin_types: { id: string; label: string }[];
  seasons: { id: string; label: string }[];
  frequency_options: { id: string; label: string; description: string }[];
  age_groups?: { id: string; label: string; frequency: string }[];
  bath_types?: { id: string; label: string; suitable_for: string }[];
  sponsor?: ToolSponsorData;
}

export interface BathPlannerResult {
  recommended_frequency: string;
  weekly_schedule: { day: string; bath: boolean; note?: string }[];
  tips: string[];
  warnings: string[];
  product_recommendations: string[];
  products?: { type: string; recommendation: string }[];
  routine?: { step: number; title: string; description: string }[];
  sponsor?: ToolSponsorData;
}

// Hijyen Hesaplayıcı
export interface HygieneCalculatorResult {
  daily_wipes_needed: number;
  weekly_wipes_needed: number;
  monthly_wipes_needed: number;
  recommendations: string[];
  carry_bag_essentials: string[];
  sponsor?: ToolSponsorData;
}

// Bez Hesaplayıcı
export interface DiaperCalculatorResult {
  recommended_size: string;
  size_range: string;
  daily_count: number;
  monthly_count: number;
  monthly_packs: number;
  pack_type: string;
  size_change_alert?: string;
  tips: string[];
  sponsor?: ToolSponsorData;
}

export interface RashRiskResult {
  risk_level: 'low' | 'medium' | 'high';
  risk_score: number;
  risk_factors: string[];
  prevention_tips: string[];
  sponsor?: ToolSponsorData;
}

// Hava Kalitesi
export interface AirQualityResult {
  risk_level: 'low' | 'medium' | 'high';
  risk_score: number;
  risk_factors: { 
    factor: string; 
    impact: string;
    severity?: 'low' | 'medium' | 'high';
    category?: 'heating' | 'environment' | 'lifestyle' | 'external';
  }[];
  recommendations: string[];
  seasonal_alerts: string[];
  indoor_tips?: string[];
  external_aqi?: {
    aqi: number;
    quality_level: {
      level: string;
      color: string;
      description: string;
    };
    is_safe_for_outdoor: boolean;
  };
  sponsor?: ToolSponsorData;
}

// Leke Ansiklopedisi
export interface StainGuide {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: { step: number; instruction: string; tip?: string }[];
  warnings: string[];
  related_ingredients: string[];
  sponsor?: ToolSponsorData;
}

// Leke arama response tipi
export interface StainSearchResponse {
  total: number;
  stains: StainGuide[];
  categories: { id: string; label: string }[];
  sponsor: ToolSponsorData | null;
}

// ===============================
// AŞI TAKVİMİ TİPLERİ
// ===============================

export type VaccineStatus = 'upcoming' | 'done' | 'skipped' | 'delayed' | 'overdue';

export interface VaccineMaster {
  id: number;
  code: string;
  name: string;
  name_short: string;
  description: string;
  timing_rule: VaccineTimingRule;
  min_age_days: number;
  max_age_days: number | null;
  is_mandatory: boolean;
  depends_on: string | null;
  brand_options: VaccineBrandOptions | null;
  schedule_version: string;
  source_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface VaccineTimingRule {
  type: 'birth' | 'month' | 'week' | 'day' | 'custom';
  value?: number;
  offset_days?: number;
  tolerance_days_before?: number;
  tolerance_days_after?: number;
  custom_logic?: string;
}

export interface VaccineBrandOptions {
  brand?: string;
  total_doses?: number;
  dose_number?: number;
  types?: string[];
}

export interface VaccineRecord {
  id: number;
  child_id: string;
  vaccine_code: string;
  vaccine: VaccineMaster;
  status: VaccineStatus;
  scheduled_date: string;
  actual_date: string | null;
  notes: string | null;
  side_effects: VaccineSideEffects | null;
  side_effect_severity: 'none' | 'mild' | 'moderate' | 'severe';
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export interface VaccineSideEffects {
  fever: boolean;
  irritability: boolean;
  swelling: boolean;
  rash: boolean;
  loss_of_appetite: boolean;
  other: string | null;
}

export interface VaccineSchedule {
  child_id: string;
  child_name: string;
  birth_date: string;
  is_premature: boolean;
  schedule_version: string;
  vaccines: VaccineRecord[];
  stats: VaccineStats;
}

export interface VaccineStats {
  total: number;
  done: number;
  upcoming: number;
  overdue: number;
  skipped: number;
  completion_percentage: number;
}

export interface MarkVaccineDoneRequest {
  record_id: number;
  actual_date: string;
  notes?: string;
}

export interface UpdateVaccineStatusRequest {
  record_id: number;
  status: VaccineStatus;
  actual_date?: string;
  notes?: string;
}

export interface AddPrivateVaccineRequest {
  child_id: string;
  type: 'rotavirus' | 'meningococcal_acwy' | 'meningococcal_b' | 'varicella' | 'influenza';
  brand_code: string;
  schedule_key?: string;
}

export interface ReportSideEffectRequest {
  record_id: number;
  side_effects: VaccineSideEffects;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface UpcomingVaccine {
  vaccine: VaccineMaster;
  record: VaccineRecord;
  days_until: number;
  is_overdue: boolean;
}

export interface VaccineHistoryItem {
  record: VaccineRecord;
  vaccine: VaccineMaster;
  age_at_vaccination: string;
}

// Notification Preferences
export interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  vaccine_reminder_3day: boolean;
  vaccine_reminder_1day: boolean;
  vaccine_overdue: boolean;
  growth_tracking: boolean;
  weekly_digest: boolean;
}