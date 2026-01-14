"use client";

import React from 'react';
import Link from 'next/link';
import { FeaturedItem } from '@/services/featured-service';
import { decodeEntities } from '@/utils/textHelpers';

interface GuideCardProps {
  item: FeaturedItem;
}

export default function GuideCard({ item }: GuideCardProps) {
  const imageUrl = item.image || 'https://placehold.co/800x400/81D4FA/ffffff?text=Rehber';
  const category = item.meta?.category || '';
  const author = item.meta?.author || '';
  const readTime = item.meta?.read_time || '5 dk';

  return (
    <Link
      href={`/blog/${item.slug}`}
      data-type="guide"
      className="featured-card flex-shrink-0 w-[85vw] md:w-[420px] snap-center bg-white rounded-4xl shadow-md hover:shadow-xl overflow-hidden relative flex flex-col group cursor-pointer border border-gray-100 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-48 relative overflow-hidden bg-blue-100">
        <img
          src={imageUrl}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={decodeEntities(item.title)}
        />
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
          <i className="fa-solid fa-book-open"></i> {category || 'Rehber'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-xl text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
          {decodeEntities(item.title)}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {item.excerpt ? decodeEntities(item.excerpt) : ''}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {author && (
              <span className="font-medium text-gray-600">
                <i className="fa-solid fa-user mr-1"></i> {author}
              </span>
            )}
            <span className="bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-lg">
              <i className="fa-regular fa-clock mr-1"></i> {readTime}
            </span>
          </div>
          <span className="text-blue-500 text-sm font-bold group-hover:translate-x-1 transition-transform">
            İncele <i className="fa-solid fa-arrow-right ml-2"></i>
          </span>
        </div>
      </div>
    </Link>
  );
}
