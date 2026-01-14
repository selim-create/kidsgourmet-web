"use client";

import React from 'react';
import Link from 'next/link';
import { FeaturedItem } from '@/services/featured-service';
import { decodeEntities } from '@/utils/textHelpers';

interface QuestionCardProps {
  item: FeaturedItem;
}

export default function QuestionCard({ item }: QuestionCardProps) {
  // Get initials from author name
  const getInitials = (name?: string) => {
    const authorName = name?.trim() || '';
    
    // Validate name exists
    if (!authorName) return 'U'; // Default to 'U' for unknown
    
    const names = authorName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] || '') + (names[names.length - 1][0] || '');
    }
    return authorName.substring(0, 2).toUpperCase();
  };

  const authorName = item.meta?.author_name || 'Anonim';
  const authorInitials = item.meta?.author_initials || getInitials(authorName);
  const answerCount = item.meta?.answer_count || 0;

  return (
    <Link
      href={`/topluluk/sorular/${item.slug}`}
      data-type="question"
      className="featured-card flex-shrink-0 w-[85vw] md:w-[320px] snap-center bg-gradient-to-br from-purple-50 to-white rounded-4xl shadow-md hover:shadow-xl overflow-hidden relative flex flex-col border border-purple-100 group transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-6 flex flex-col h-full relative">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-purple-100 text-purple-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <i className="fa-regular fa-comments"></i> Soru
          </span>
          <i className="fa-solid fa-quote-right text-purple-200 text-4xl absolute top-6 right-6"></i>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-bold text-xs">
            {authorInitials}
          </div>
          <span className="text-xs font-medium text-gray-500">{decodeEntities(authorName)} sordu</span>
        </div>

        <h3 className="font-display font-bold text-lg text-slate-800 mb-2 leading-snug">
          &quot;{decodeEntities(item.title)}&quot;
        </h3>

        <div className="mt-auto pt-4">
          <button className="w-full py-2 rounded-xl bg-purple-500 text-white text-sm font-bold shadow-sm group-hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
            <i className="fa-regular fa-comment-dots"></i>
            {answerCount} Cevabı Gör
          </button>
        </div>
      </div>
    </Link>
  );
}
