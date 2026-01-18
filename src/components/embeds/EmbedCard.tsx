import React from 'react';
import Link from 'next/link';
import { RecipeEmbedItem, IngredientEmbedItem, ToolEmbedItem, PostEmbedItem, EmbedItem } from '@/services/blog-service';
import { decodeEntities } from '@/utils/textHelpers';

// Placeholder image URLs
const PLACEHOLDER_IMAGES = {
  recipe: 'https://placehold.co/400x300/FFF3E0/FF8A65?text=Tarif+Görseli',
  ingredient: 'https://placehold.co/300x300/E0F2F1/26A69A?text=Malzeme',
  tool: 'https://placehold.co/400x200/F3E5F5/9C27B0?text=Araç',
  post: 'https://placehold.co/800x450/E3F2FD/2196F3?text=Yazı+Görseli'
};

// Age group color mapping (pastel colors) - from RecipeCard.tsx
const AGE_GROUP_COLORS: { [key: string]: string } = {
  '0-6': '#E1BEE7',   // Lila - 0-6 Ay / Hazırlık
  '6-8': '#FFCCBC',   // Şeftali - 6-8 Ay / Tadım
  '9-11': '#C8E6C9',  // Nane Yeşili - 9-11 Ay / Keşif
  '12-24': '#B3E5FC', // Gökyüzü Mavisi - 12-24 Ay / Aile
  '2+': '#FFF9C4',    // Limon Sarısı - 2+ Yaş / Gurme
};

// Tool URL mapping - maps backend tool_type to correct Turkish slugs
const TOOL_URL_MAPPING: { [key: string]: string } = {
  'bath_planner': '/akilli-asistan/banyo-planlayici',
  'stain_encyclopedia': '/akilli-asistan/leke-rehberi',
  'air_quality_guide': '/akilli-asistan/hava-kalitesi',
  'diaper_calculator': '/akilli-asistan/bez-hesaplayici',
  'hygiene_calculator': '/akilli-asistan/hijyen-hesaplayici',
};

// Regex pattern for matching 24+ months age group variations
const AGE_24_PLUS_PATTERN = /\(24\+?\s*(Ay|yaş)/i;

// Get background color for age group badge
const getAgeGroupColor = (ageGroup?: string | null, providedColor?: string): string => {
  if (providedColor) return providedColor;
  if (!ageGroup) return '#22C55E';
  
  // Extract age range from string
  if (ageGroup.includes('0-6')) return AGE_GROUP_COLORS['0-6'];
  if (ageGroup.includes('6-8')) return AGE_GROUP_COLORS['6-8'];
  if (ageGroup.includes('9-11')) return AGE_GROUP_COLORS['9-11'];
  if (ageGroup.includes('12-24')) return AGE_GROUP_COLORS['12-24'];
  if (ageGroup.includes('2+') || AGE_24_PLUS_PATTERN.test(ageGroup)) return AGE_GROUP_COLORS['2+'];
  
  return '#22C55E';
};

// Get text color for age group badge (dark text for light backgrounds)
const getAgeGroupTextColor = (ageGroup?: string | null): string => {
  if (!ageGroup) return '#FFFFFF';
  
  // Light backgrounds need dark text for readability
  if (ageGroup.includes('2+') || AGE_24_PLUS_PATTERN.test(ageGroup) || ageGroup.toLowerCase().includes('gurme')) {
    return '#92400E'; // Amber-800 - Dark brown for yellow background
  }
  if (ageGroup.includes('9-11') || ageGroup.toLowerCase().includes('keşif')) {
    return '#166534'; // Green-800 - Dark green for light green background
  }
  
  // Dark backgrounds use white text
  return '#FFFFFF';
};

// Validate FontAwesome icon class (prevent XSS)
const sanitizeIconClass = (iconClass: string): string => {
  // Only allow fa-* patterns with alphanumeric and hyphens
  const iconPattern = /^fa-(solid|regular|brands|light|duotone|thin)\s+fa-[\w-]+$/;
  if (iconPattern.test(iconClass.trim())) {
    return iconClass.trim();
  }
  // Default fallback icon
  return 'fa-solid fa-wand-magic-sparkles';
};

interface EmbedCardProps {
  item: EmbedItem;
}

// Recipe Card - Horizontal layout with age group colors
function RecipeEmbedCard({ item }: { item: RecipeEmbedItem }) {
  const ageGroupBgColor = getAgeGroupColor(item.age_group, item.age_group_color);
  const ageGroupTextColor = getAgeGroupTextColor(item.age_group);

  return (
    <Link 
      href={item.url}
      className="group flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Left: Image */}
      <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden bg-gray-100">
        <img 
          src={item.image || PLACEHOLDER_IMAGES.recipe} 
          alt={decodeEntities(item.title)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Age Group Badge */}
        {item.age_group && (
          <div 
            className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-bold shadow-md"
            style={{
              backgroundColor: ageGroupBgColor,
              color: ageGroupTextColor,
            }}
          >
            {item.age_group}
          </div>
        )}
      </div>
      
      {/* Right: Content */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-orange-500 transition-colors mb-2">
          {decodeEntities(item.title)}
        </h4>
        
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {item.prep_time && (
            <div className="flex items-center gap-1">
              <i className="fa-regular fa-clock text-orange-500"></i>
              <span>{item.prep_time}</span>
            </div>
          )}
          {item.diet_types && item.diet_types.length > 0 && (
            <div className="flex items-center gap-1">
              <i className="fa-solid fa-leaf text-green-500"></i>
              <span>{item.diet_types[0]}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Ingredient Card - Horizontal layout with corrected URL
function IngredientEmbedCard({ item }: { item: IngredientEmbedItem }) {
  return (
    <Link 
      href={`/beslenme-rehberi/${item.slug}`}
      className="group flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Left: Image */}
      <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden bg-emerald-50">
        <img 
          src={item.image || PLACEHOLDER_IMAGES.ingredient} 
          alt={decodeEntities(item.title)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Start Age Badge */}
        {item.start_age && (
          <div className="absolute bottom-2 left-2 bg-emerald-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow-md">
            {item.start_age} Ay+
          </div>
        )}
      </div>
      
      {/* Right: Content */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors mb-1">
          {decodeEntities(item.title)}
        </h4>
        
        {item.benefits && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {decodeEntities(item.benefits)}
          </p>
        )}
        
        {/* Allergen warnings */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.allergens.slice(0, 2).map((allergen, idx) => (
              <span key={idx} className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                {allergen}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// Tool Card - Horizontal layout with URL mapping and no tool_type display
function ToolEmbedCard({ item }: { item: ToolEmbedItem }) {
  const safeIconClass = sanitizeIconClass(item.tool_icon || 'fa-solid fa-wand-magic-sparkles');
  
  // Get correct URL from mapping or use item.slug as fallback
  const toolUrl = TOOL_URL_MAPPING[item.tool_type] || (item.slug ? `/akilli-asistan/${item.slug}` : '/akilli-asistan');
  
  return (
    <Link 
      href={toolUrl}
      className="group flex bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-violet-100"
    >
      {/* Left: Icon */}
      <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
        <i className={`${safeIconClass} text-white text-3xl`}></i>
      </div>
      
      {/* Right: Content */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-violet-600 transition-colors mb-1">
          {decodeEntities(item.title)}
        </h4>
        
        {item.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {decodeEntities(item.excerpt)}
          </p>
        )}
      </div>
    </Link>
  );
}

// Post Card - Horizontal layout with corrected URL
function PostEmbedCard({ item }: { item: PostEmbedItem }) {
  return (
    <Link 
      href={`/kesfet/${item.slug}`}
      className="group flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Left: Image */}
      <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden bg-gray-100">
        <img 
          src={item.image || PLACEHOLDER_IMAGES.post} 
          alt={decodeEntities(item.title)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Category Badge */}
        {item.category && (
          <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow-md">
            {item.category.name}
          </div>
        )}
      </div>
      
      {/* Right: Content */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-blue-500 transition-colors mb-2">
          {decodeEntities(item.title)}
        </h4>
        
        <div className="flex items-center gap-2 text-xs text-gray-600">
          {/* Author Avatar */}
          {item.author.avatar ? (
            <img 
              src={item.author.avatar} 
              alt={item.author.name}
              className="w-5 h-5 rounded-full border border-gray-200"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
              {item.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span>{item.author.name}</span>
          
          {item.read_time && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span>{item.read_time}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// Main EmbedCard Component
export default function EmbedCard({ item }: EmbedCardProps) {
  switch (item.embed_type) {
    case 'recipe':
      return <RecipeEmbedCard item={item} />;
    case 'ingredient':
      return <IngredientEmbedCard item={item} />;
    case 'tool':
      return <ToolEmbedCard item={item} />;
    case 'post':
      return <PostEmbedCard item={item} />;
    default:
      return null;
  }
}
