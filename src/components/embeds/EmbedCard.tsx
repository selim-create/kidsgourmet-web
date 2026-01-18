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

// Recipe Card - Orange theme
function RecipeEmbedCard({ item }: { item: RecipeEmbedItem }) {
  const getAgeGroupColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      '#4CAF50': 'bg-green-500',
      '#FF9800': 'bg-orange-500',
      '#F44336': 'bg-red-500',
      '#2196F3': 'bg-blue-500',
    };
    return colorMap[color] || 'bg-orange-500';
  };

  return (
    <Link 
      href={item.url}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform-gpu"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={item.image || PLACEHOLDER_IMAGES.recipe} 
          alt={decodeEntities(item.title)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Age Group Badge */}
        {item.age_group && (
          <div className={`absolute top-3 left-3 ${getAgeGroupColor(item.age_group_color)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}>
            {item.age_group}
          </div>
        )}
        {/* Recipe Icon */}
        <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
          <i className="fa-solid fa-carrot text-orange-500 text-lg"></i>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-lg mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {decodeEntities(item.title)}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
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

// Ingredient Card - Green theme (emerald/teal gradient)
function IngredientEmbedCard({ item }: { item: IngredientEmbedItem }) {
  return (
    <Link 
      href={item.url}
      className="group block bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-emerald-100 transform-gpu"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <img 
          src={item.image || PLACEHOLDER_IMAGES.ingredient} 
          alt={decodeEntities(item.title)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Start Age Badge */}
        {item.start_age && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            {item.start_age} Ay+
          </div>
        )}
        {/* Leaf Icon */}
        <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
          <i className="fa-solid fa-leaf text-emerald-500 text-lg"></i>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {decodeEntities(item.title)}
        </h3>
        
        {item.benefits && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {decodeEntities(item.benefits)}
          </p>
        )}
        
        {/* Allergen warnings */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.allergens.slice(0, 2).map((allergen, idx) => (
              <span key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                {allergen}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// Tool Card - Purple theme (violet/purple gradient)
function ToolEmbedCard({ item }: { item: ToolEmbedItem }) {
  const safeIconClass = sanitizeIconClass(item.tool_icon || 'fa-solid fa-wand-magic-sparkles');
  
  return (
    <Link 
      href={item.url}
      className="group block bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-violet-100 transform-gpu"
    >
      <div className="flex items-center gap-4 p-5">
        {/* Gradient Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <i className={`${safeIconClass} text-white text-2xl`}></i>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1 group-hover:text-violet-600 transition-colors">
            {decodeEntities(item.title)}
          </h3>
          
          {item.tool_type && (
            <span className="inline-block bg-violet-100 text-violet-700 px-2 py-1 rounded text-xs font-medium mb-2">
              {item.tool_type}
            </span>
          )}
          
          {item.excerpt && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {decodeEntities(item.excerpt)}
            </p>
          )}
        </div>
        
        {/* Arrow Icon */}
        <div className="flex-shrink-0">
          <i className="fa-solid fa-arrow-right text-gray-400 group-hover:text-violet-500 transition-colors"></i>
        </div>
      </div>
    </Link>
  );
}

// Post Card - Blue theme
function PostEmbedCard({ item }: { item: PostEmbedItem }) {
  return (
    <Link 
      href={item.url}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform-gpu"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img 
          src={item.image || PLACEHOLDER_IMAGES.post} 
          alt={decodeEntities(item.title)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Category Badge */}
        {item.category && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            {item.category.name}
          </div>
        )}
        {/* Book Icon */}
        <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
          <i className="fa-solid fa-book-open text-blue-500 text-lg"></i>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-lg mb-3 line-clamp-2 group-hover:text-blue-500 transition-colors">
          {decodeEntities(item.title)}
        </h3>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          {/* Author Avatar */}
          {item.author.avatar ? (
            <img 
              src={item.author.avatar} 
              alt={item.author.name}
              className="w-6 h-6 rounded-full border border-gray-200"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
              {item.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span>{item.author.name}</span>
          
          {item.read_time && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1">
                <i className="fa-regular fa-clock text-blue-500"></i>
                <span>{item.read_time}</span>
              </div>
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
