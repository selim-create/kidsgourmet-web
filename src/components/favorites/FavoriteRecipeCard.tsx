"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FavoriteRecipeCard as FavoriteRecipeCardType } from '@/lib/types';
import { decodeEntities } from '@/utils/textHelpers';
import { getIconClass } from '@/utils/iconHelpers';
import { useFavorites } from '@/hooks/use-favorites';
import { toast } from 'sonner';

interface FavoriteRecipeCardProps {
  recipe: FavoriteRecipeCardType;
}

export default function FavoriteRecipeCard({ recipe }: FavoriteRecipeCardProps) {
  const { toggleFavorite, collections, addToCollection } = useFavorites();
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(recipe.id, 'recipe');
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
    }
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCollectionMenu(!showCollectionMenu);
  };

  const handleAddToCollection = async (e: React.MouseEvent, collectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCollection(collectionId, recipe.id, 'recipe');
      toast.success('Koleksiyona eklendi');
      setShowCollectionMenu(false);
    } catch (error) {
      toast.error('Eklenemedi');
      console.error('Koleksiyona ekleme başarısız:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowCollectionMenu(false);
      }
    };

    if (showCollectionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCollectionMenu]);

  return (
    <Link
      href={`/tarifler/${recipe.slug}`}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image || 'https://placehold.co/400x300/FFF8E1/FF8A65?text=Tarif'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={decodeEntities(recipe.title)}
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform"
        >
          <i className="fa-solid fa-heart"></i>
        </button>
        <div className="absolute bottom-3 left-3">
          <span
            className="text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm"
            style={{ backgroundColor: recipe.age_group_color || '#22C55E' }}
          >
            {decodeEntities(recipe.age_group)}
          </span>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
          {decodeEntities(recipe.title)}
        </h3>
        {recipe.categories && recipe.categories.length > 0 && (
          <p className="text-xs text-gray-500 mb-3">
            {recipe.categories.map(decodeEntities).join(', ')}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">
            <i className="fa-regular fa-clock mr-1"></i> {recipe.prep_time}
          </span>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={handleMenuToggle}
              className="text-gray-400 hover:text-slate-600"
            >
              <i className="fa-solid fa-ellipsis"></i>
            </button>
            {showCollectionMenu && (
              <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[200px] z-10">
                <div className="px-3 py-2 text-xs font-bold text-gray-500 border-b border-gray-100">
                  Koleksiyona Ekle
                </div>
                {collections.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-400">
                    Henüz koleksiyon yok
                  </div>
                ) : (
                  collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={(e) => handleAddToCollection(e, collection.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <i className={getIconClass(collection.icon) + ' text-gray-400'}></i>
                      <span className="text-slate-800">{collection.name}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
