"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/services/blog-service';
import { decodeEntities } from '@/utils/textHelpers';

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  const getImageUrl = (post: BlogPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
           'https://placehold.co/600x400/E3F2FD/81D4FA?text=Blog';
  };

  const getAuthorName = (post: BlogPost) => {
    return post._embedded?.author?.[0]?.name || 'KidsGourmet Editörü';
  };

  const getCategoryName = (post: BlogPost) => {
    return post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Genel';
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-sans font-bold text-3xl text-slate-800">Ebeveyn Rehberi</h2>
            <p className="text-gray-500 mt-2">Uzmanlardan bilgiler ve ipuçları</p>
          </div>
          <Link 
            href="/blog" 
            className="text-orange-500 font-bold hover:underline flex items-center gap-2"
          >
            Tümünü Gör
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const isSponsored = post.sponsor_data?.is_sponsored;
            
            return (
              <article key={post.id} className="group">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="block overflow-hidden rounded-[2rem] mb-4 relative aspect-[4/3]"
                >
                  <img 
                    src={getImageUrl(post)} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={decodeEntities(stripHtml(post.title.rendered))} 
                  />
                  {/* Kategori Badge - Sol Üst */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-500 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                    {decodeEntities(getCategoryName(post))}
                  </span>
                  
                  {/* Sponsorlu Badge - Sağ Üst - SADECE SPONSORLU İÇİN */}
                  {isSponsored && (
                    <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                      Sponsorlu
                    </span>
                  )}
                </Link>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{getAuthorName(post)}</span>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`}>
                    <h3 
                      className="font-sans font-bold text-xl text-slate-800 mb-3 leading-snug group-hover:text-orange-500 transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </Link>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {decodeEntities(stripHtml(post.excerpt.rendered))}
                  </p>
                  
                  {/* Sponsor Logo - SADECE SPONSORLU İÇİN */}
                  {isSponsored && post.sponsor_data?.sponsor_logo && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-400">Sponsor:</span>
                      <img 
                        src={typeof post.sponsor_data.sponsor_logo === 'string' ? post.sponsor_data.sponsor_logo : ''} 
                        alt={post.sponsor_data.sponsor_name || 'Sponsor'}
                        className="h-4 object-contain"
                      />
                    </div>
                  )}
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-slate-700 hover:text-orange-500 transition-colors"
                  >
                    Devamını Oku <i className="fa-solid fa-arrow-right ml-1"></i>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
