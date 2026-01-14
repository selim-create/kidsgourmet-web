"use client";

import React from 'react';
import Link from 'next/link';
import { FeaturedItem } from '@/services/featured-service';
import { decodeEntities } from '@/utils/textHelpers';
import { useFavorites } from '@/hooks/use-favorites';

interface IngredientCardProps {
  item: FeaturedItem;
}

export default function IngredientCard({ item }: IngredientCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(item.id, 'ingredient');

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(item.id, 'ingredient');
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
    }
  };

  return (
    <Link
      href={`/malzeme-rehberi/${item.slug}`}
      data-type="ingredient"
      className="featured-card flex-shrink-0 w-[85vw] md:w-[420px] snap-center bg-white rounded-4xl shadow-md hover:shadow-xl overflow-hidden relative flex flex-col group cursor-pointer border border-green-100 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-48 relative overflow-hidden bg-green-50">
        <img
          src={item.image || 'https://placehold.co/800x400/A5D6A7/ffffff?text=Malzeme'}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={decodeEntities(item.title)}
        />
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
          <i className="fa-solid fa-seedling"></i> Beslenme Rehberi
        </div>
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"}></i>
        </button>
        
        {/* Başlangıç Yaşı */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
          {item.meta?.start_age || '+6 Ay'}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-xl text-slate-800 mb-2 leading-tight group-hover:text-green-600 transition-colors">
          {decodeEntities(item.title)}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {item.excerpt ? decodeEntities(item.excerpt) : 'Bebeğiniz için besleyici bir malzeme'}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          {/* Alerji Riski */}
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
            item.meta?.allergy_risk === 'Yüksek' ? 'bg-red-50 text-red-600' :
            item.meta?.allergy_risk === 'Orta' ? 'bg-yellow-50 text-yellow-600' :
            'bg-green-50 text-green-600'
          }`}>
            {item.meta?.allergy_risk || 'Düşük'} Risk
          </span>
          
          {/* Mevsim */}
          {item.meta?.season && (
            <span className="text-xs text-gray-400">
              <i className="fa-solid fa-calendar mr-1"></i> {item.meta.season}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
