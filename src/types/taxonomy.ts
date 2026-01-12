export interface AgeGroupMeta {
  min_month: number;
  max_month: number;
  daily_meal_count: number;
  max_salt_limit: string;
  texture_guide: string;
  forbidden_list: string[];
  color_code: string;
  warning_message: string;
}

export interface AgeGroup {
  id: number;
  name: string;
  slug: string;
  description: string;
  age_group_meta: AgeGroupMeta;
}

export interface MealTypeMeta {
  icon: string;
  time_range: string;
  color_code: string;
}

export interface MealType {
  id: number;
  name: string;
  slug: string;
  description: string;
  meal_type_meta: MealTypeMeta;
}
