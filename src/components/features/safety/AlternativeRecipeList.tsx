'use client';

import Link from 'next/link';
import Image from 'next/image';
import { RecipeCard } from '@/lib/types';

interface AlternativeRecipeListProps {
  recipes: RecipeCard[];
}

export default function AlternativeRecipeList({ recipes }: AlternativeRecipeListProps) {
  if (!recipes || recipes.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {recipes.map((recipe) => (
        <Link 
          key={recipe.id} 
          href={`/tarifler/${recipe.slug}`}
          className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
              {recipe.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="inline-flex items-center">
                <i className="fa-solid fa-clock mr-1"></i>
                {recipe.prep_time}
              </span>
              {recipe.age_group && (
                <span 
                  className="px-2 py-0.5 rounded-full text-white text-xs"
                  style={{ backgroundColor: recipe.age_group_color || '#FF8A65' }}
                >
                  {recipe.age_group}
                </span>
              )}
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
        </Link>
      ))}
    </div>
  );
}
