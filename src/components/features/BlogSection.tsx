"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/services/blog-service';
import BlogCard from '@/components/features/BlogCard';
import { InFeedAdWrapper } from '@/components/ads';

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <div>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-slate-800">Ebeveyn Rehberi</h2>
            <p className="text-gray-500 mt-2 text-sm">Uzmanlardan bilgiler, güncel rehberler, beslenme ipuçları ve gelişim notları.</p>
          </div>
          <Link 
            href="/kesfet" 
            className="text-orange-500 font-bold hover:underline flex items-center gap-2 whitespace-nowrap"
          >
            Tümünü Gör
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {/* Blog Posts Grid with InFeed Ad */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InFeedAdWrapper 
            adPositions={[2]} // 3rd position (0-indexed = 2)
            totalItems={6} // Show total 6 items (5 posts + 1 ad)
          >
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </InFeedAdWrapper>
        </div>
      </div>
    </div>
  );
}
