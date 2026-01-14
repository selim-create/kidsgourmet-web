"use client";

import React from 'react';
import Link from 'next/link';
import { FavoriteDiscussionCard as FavoriteDiscussionCardType } from '@/lib/types';
import { decodeEntities } from '@/utils/textHelpers';
import { useFavorites } from '@/hooks/use-favorites';

interface FavoriteDiscussionCardProps {
  discussion: FavoriteDiscussionCardType;
}

export default function FavoriteDiscussionCard({ discussion }: FavoriteDiscussionCardProps) {
  const { toggleFavorite } = useFavorites();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(discussion.id, 'discussion');
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
    }
  };

  return (
    <Link
      href={`/topluluk/${discussion.slug}`}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {discussion.author_avatar ? (
              <img
                src={discussion.author_avatar}
                alt={discussion.author}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                <i className="fa-solid fa-user"></i>
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{discussion.author}</p>
            {discussion.circle && (
              <p className="text-xs text-gray-400">{discussion.circle}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-red-500 transition-colors"
        >
          <i className="fa-solid fa-heart"></i>
        </button>
      </div>

      <h3 className="font-bold text-slate-800 mb-2 group-hover:text-purple-500 transition-colors line-clamp-2">
        {decodeEntities(discussion.title)}
      </h3>

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          <i className="fa-solid fa-comment mr-1"></i>
          {discussion.answer_count} Yanıt
        </span>
        <button className="text-gray-400 hover:text-slate-600">
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>
    </Link>
  );
}
