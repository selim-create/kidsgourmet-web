// Recipe tam tip tanımı
export interface Recipe {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  prep_time: string;
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

// Ingredient (Malzeme) tip tanımı
export interface Ingredient {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  start_age: string;
  benefits: string;
  prep_methods: string[];
  allergy_risk: 'Düşük' | 'Orta' | 'Yüksek';
  season: string;
  storage_tips?: string;
  related_recipes: RecipeCard[];
  faq?: FAQ[];
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
  display_name: string;
  avatar_url?: string;
  children: Child[];
  created_at: string;
}

export interface Child {
  id: string;
  name: string;
  birth_date: string;
  age_months?: number; // Hesaplanmış ay
  allergens: string[];
  notes?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
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

export interface ApiError {
  code: string;
  message: string;
  status: number;
}