"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/services/blog-service';
import BlogCard from '@/components/features/BlogCard';
import { AdZone } from '@/components/ads';
import { useAds } from '@/contexts/AdContext';

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const { hasSlotForPlacement } = useAds();
  
  if (!posts || posts.length === 0) {
    return null;
  }

  // Check if blog section ad exists (using sidebar-middle for desktop, sidebar-top for mobile)
  const hasBlogAd = hasSlotForPlacement('sidebar-middle') || hasSlotForPlacement('sidebar-top');
  
  // Show 5 posts if ad exists, 6 if not (to keep 6 items in grid)
  const postsToShow = hasBlogAd ? 5 : 6;
  const postsSlice = posts.slice(0, postsToShow);

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
          {postsSlice.map((post, index) => (
            <React.Fragment key={post.id}>
              <BlogCard post={post} />
              {/* Insert ad at position 3 (after index 2, so 3rd card) if ad exists */}
              {hasBlogAd && index === 2 && (
                <article className="flex flex-col group h-full relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Full height ad container */}
                  <div className="relative flex-1 min-h-[300px] bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
              
                    
                    {/* Desktop: sidebar-middle */}
                    <div className="hidden lg:flex items-center justify-center">
                      <AdZone placement="sidebar-middle" />
                    </div>
                    {/* Mobile/Tablet: sidebar-top */}
                    <div className="lg:hidden flex items-center justify-center">
                      <AdZone placement="sidebar-top" />
                    </div>
                  </div>
                </article>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}