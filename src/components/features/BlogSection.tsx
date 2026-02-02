"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/services/blog-service';
import BlogCard from '@/components/features/BlogCard';
import { AdZone } from '@/components/ads';

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

        {/* Blog Posts Grid with Ads */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <BlogCard post={post} />
              {/* Insert ad at position 3 (index 2) */}
              {index === 2 && (
                <>
                  {/* Desktop: sidebar-middle */}
                  <div className="hidden lg:block">
                    <AdZone placement="sidebar-middle" />
                  </div>
                  {/* Mobile: sidebar-top */}
                  <div className="lg:hidden">
                    <AdZone placement="sidebar-top" />
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
