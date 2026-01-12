export interface Recipe {
    id: number;
    title: { rendered: string } | string; // WP standart veya custom dönüşe göre
    slug: string;
    image: string;
    prep_time?: string;
    age_group?: string[];
    ingredients?: string[]; // veya detaylı obje
    instructions?: string[];
    is_featured?: boolean;
    expert?: {
        name: string;
        approved: boolean;
    };
}

export interface Ingredient {
    id: number;
    name: string;
    slug: string;
    image?: string;
    start_age?: string;
    allergy_risk?: string;
    season?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    token?: string; // JWT token
}