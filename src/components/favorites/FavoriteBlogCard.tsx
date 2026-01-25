"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FavoriteBlogCard as FavoriteBlogCardType } from '@/lib/types';
import { decodeEntities } from '@/utils/textHelpers';
import { useFavorites } from '@/hooks/use-favorites';
import { toast } from 'sonner';

interface FavoriteBlogCardProps {
  post: FavoriteBlogCardType;
  onRemove?: () => void;
}

export default function FavoriteBlogCard({ post, onRemove }: FavoriteBlogCardProps) {
  const { toggleFavorite, collections, addToCollection } = useFavorites();
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onRemove) {
      onRemove();
      return;
    }

    try {
      await toggleFavorite(post.id, 'post');
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
      await addToCollection(collectionId, post.id, 'post');
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
      href={`/kesfet/${post.slug}`}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col relative"
    >
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleFavoriteClick}
          className={`w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform ${
            onRemove ? 'text-gray-400 hover:text-red-500' : 'text-red-500'
          }`}
          title={onRemove ? "Listeden Kaldır" : "Favorilerden Çıkar"}
        >
          <i className={`fa-solid ${onRemove ? 'fa-trash-can' : 'fa-heart'}`}></i>
        </button>
      </div>
      <div className="w-full h-40 bg-blue-50 relative overflow-hidden">
        <img
          src={post.image || 'https://placehold.co/400x300/E3F2FD/81D4FA?text=Blog'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={decodeEntities(post.title)}
        />
        <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-blue-500 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
          {decodeEntities(post.category)}
        </span>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-500 transition-colors line-clamp-2">
          {decodeEntities(post.title)}
        </h3>
        <p className="text-xs text-gray-500 mb-3">Keşfet</p>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">{post.read_time} okuma</span>
          {!onRemove && (
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
                        <i className={`fa-solid fa-${collection.icon} text-gray-400`}></i>
                        <span className="text-slate-800">{collection.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}