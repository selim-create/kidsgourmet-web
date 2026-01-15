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
}

export interface ExpertInfo {
  name: string;
  title: string;
  image?: string;
  approved: boolean;
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
  prep_time: string;
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
  is_expert?: boolean;
  created_at: string;
}

// Sosyal medya linkleri
export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
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
  // Backward compatibility
  allergens?: string[];
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
  id: number;
  ingredient: string;
  amount?: string;
  checked: boolean;
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
  sponsor_logo: string | null;
  sponsor_light_logo: string | null;
  direct_redirect: boolean;
  gam_impression_url: string | null;
  gam_click_url: string | null;
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
}

export interface DiscussionComment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  is_expert_comment: boolean;
  parent_id: number;
  created_at: string;
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
  stats: {
    total_recipes: number;
    total_blog_posts: number;
    total_answers: number;
    total_questions: number;
  };
  content: {
    recipes: RecipeCard[];
    blog_posts: BlogPostCard[];
    answered_questions: AnsweredQuestion[];
    asked_questions: Discussion[];
  };
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