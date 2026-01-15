"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/services/blog-service';
import { useFavorites } from '@/hooks/use-favorites';

interface BlogCardProps {
  post: BlogPost;
  categories?: Array<{ id: number; name: string; slug: string }>;
  variant?: 'default' | 'hero' | 'compact';
}

export default function BlogCard({ post, categories, variant = 'default' }: BlogCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(post.id, 'post');
  
  const sponsorData = post.sponsor_data;
  const isSponsored = sponsorData?.is_sponsored ?? false;

  // Helper functions
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  const getImageUrl = (post: BlogPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/600x400/E3F2FD/81D4FA?text=No+Image';
  };

  const getAuthorName = (post: BlogPost) => {
    return post._embedded?.author?.[0]?.name || 'KidsGourmet Editörü';
  };

  const getAuthorAvatar = (post: BlogPost) => {
    const avatarUrls = post._embedded?.author?.[0]?.avatar_urls;
    return avatarUrls?.['96'] || avatarUrls?.['48'] || 'https://placehold.co/50x50/AED581/ffffff?text=Dr';
  };

  const getCategoryName = (post: BlogPost) => {
    const catId = post._embedded?.['wp:term']?.[0]?.[0]?.id;
    const cat = categories?.find(c => c.id === catId);
    return cat ? cat.name : 'Genel';
  };

  const formattedDate = new Date(post.date).toLocaleDateString('tr-TR');
  const commentCount = post.comment_count || 0;
  const title = post.title.rendered;
  const excerpt = stripHtml(post.excerpt.rendered);
  const imageUrl = getImageUrl(post);
  const authorName = getAuthorName(post);
  const authorAvatar = getAuthorAvatar(post);
  const categoryName = getCategoryName(post);

  // Build destination URL and final link
  const buildLinkUrl = () => {
    if (!isSponsored || !sponsorData) {
      return `/blog/${post.slug}`;
    }

    const destination = sponsorData.direct_redirect 
      ? sponsorData.sponsor_url 
      : `/blog/${post.slug}`;

    if (sponsorData.gam_click_url) {
      return `${sponsorData.gam_click_url}${encodeURIComponent(destination)}`;
    }

    return destination;
  };

  const finalUrl = buildLinkUrl();
  const isExternalLink = isSponsored && sponsorData?.direct_redirect;
  const hasGamTracking = isSponsored && !!sponsorData?.gam_click_url;

  // Favori butonu handler
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(post.id, 'post');
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
    }
  };

  // Render impression tracking pixel
  const renderImpressionPixel = () => {
    if (!isSponsored || !sponsorData?.gam_impression_url) {
      return null;
    }

    return (
      <img
        src={sponsorData.gam_impression_url}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none'
        }}
      />
    );
  };

  // Hero variant for featured posts
  if (variant === 'hero') {
    const heroContent = (
      <>
        {/* Background Image */}
        <img 
          src={imageUrl} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          alt={title} 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Favori Butonu */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart text-white"}></i>
        </button>
        
        {/* Badge */}
        <span className="absolute top-6 left-6 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold uppercase tracking-wider shadow-lg">
          {isSponsored ? '📢 Sponsorlu İçerik' : '⭐ Editörün Seçimi'}
        </span>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-4xl">
          <h2 
            className="font-display font-bold text-3xl md:text-5xl text-white mb-4 leading-tight group-hover:underline decoration-green-500 decoration-4 underline-offset-4"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="text-gray-200 text-lg mb-6 line-clamp-2 hidden md:block">
            {excerpt}
          </p>
          
          {/* Meta - Sponsorlu değilse yazar ve tarih göster */}
          {!isSponsored && (
            <div className="flex items-center text-white/80 text-sm gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <img src={authorAvatar} className="w-8 h-8 rounded-full border border-white/50" alt={authorName} />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-calendar"></i>
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-comment"></i>
                <span>{commentCount} yorum</span>
              </div>
            </div>
          )}
          
          {/* Sponsor Logo - Sponsorlu ise */}
          {isSponsored && sponsorData && (
            <div className="flex items-center gap-3 mt-4">
              {(() => {
                const logoUrl = typeof sponsorData.sponsor_light_logo === 'string' 
                  ? sponsorData.sponsor_light_logo 
                  : (typeof sponsorData.sponsor_logo === 'string' 
                      ? sponsorData.sponsor_logo 
                      : null);
                return logoUrl ? (
                  <img src={logoUrl} alt={sponsorData.sponsor_name || 'Sponsor'} className="h-8 object-contain" />
                ) : null;
              })()}
              <span className="text-white/80 text-sm">{sponsorData.sponsor_name} katkılarıyla</span>
            </div>
          )}
        </div>
      </>
    );

    return (
      <article className="group relative block rounded-[2.5rem] overflow-hidden shadow-xl aspect-[16/9] md:aspect-[21/9]">
        {renderImpressionPixel()}
        {hasGamTracking ? (
          <a 
            href={finalUrl}
            className="absolute inset-0"
            {...(isExternalLink && { 
              target: '_blank', 
              rel: 'noopener noreferrer sponsored' 
            })}
          >
            {heroContent}
          </a>
        ) : (
          <Link href={finalUrl} className="absolute inset-0">
            {heroContent}
          </Link>
        )}
      </article>
    );
  }

  // Default card variant
  return (
    <article className={`group bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all ${isSponsored ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'}`}>
      {renderImpressionPixel()}
      
      {/* Image Container */}
      <div className="h-56 relative overflow-hidden rounded-t-3xl bg-gray-50">
        <img 
          src={imageUrl} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          alt={title}
        />
        
        {/* Sponsor Logo Overlay - Sol Alt */}
        {isSponsored && sponsorData && (() => {
          const logoUrl = typeof sponsorData.sponsor_logo === 'string' 
            ? sponsorData.sponsor_logo 
            : (typeof sponsorData.sponsor_light_logo === 'string' 
                ? sponsorData.sponsor_light_logo 
                : null);
          return logoUrl ? (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
              <img src={logoUrl} alt={sponsorData.sponsor_name || 'Sponsor'} className="h-5 object-contain" />
            </div>
          ) : null;
        })()}
        
        {/* Sponsorlu Badge - Sağ Üst (veya Normal Kategori Badge - Sol Üst) */}
        {isSponsored ? (
          <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
            Sponsorlu
          </span>
        ) : (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-500 px-3 py-1 rounded-lg text-xs font-bold">
            {categoryName}
          </span>
        )}
        
        {/* Favori Butonu - Sağ Üst (sponsorlu badge'in altında) */}
        <button 
          onClick={handleFavoriteClick}
          className={`absolute ${isSponsored ? 'top-14' : 'top-4'} right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10`}
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"}></i>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Meta - SPONSORLU İÇİN FARKLI */}
        {isSponsored ? (
          <div className="flex items-center gap-3 text-xs text-amber-600 mb-3 flex-wrap">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-bullhorn"></i>
              {sponsorData?.sponsor_name}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 flex-wrap">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{authorName}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span><i className="fa-regular fa-comment mr-1"></i>{commentCount}</span>
          </div>
        )}
        
        {/* Title */}
        {hasGamTracking ? (
          <a href={finalUrl} {...(isExternalLink && { target: '_blank', rel: 'noopener noreferrer sponsored' })}>
            <h3 
              className="font-bold text-xl text-slate-800 mb-3 leading-snug group-hover:text-orange-500 transition-colors"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </a>
        ) : (
          <Link href={finalUrl}>
            <h3 
              className="font-bold text-xl text-slate-800 mb-3 leading-snug group-hover:text-orange-500 transition-colors"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </Link>
        )}
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {excerpt}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {hasGamTracking ? (
            <a 
              href={finalUrl}
              className="text-xs font-bold text-slate-700 hover:text-orange-500 transition-colors"
              {...(isExternalLink && { target: '_blank', rel: 'noopener noreferrer sponsored' })}
            >
              Devamını Oku <i className="fa-solid fa-arrow-right ml-1"></i>
            </a>
          ) : (
            <Link 
              href={finalUrl}
              className="text-xs font-bold text-slate-700 hover:text-orange-500 transition-colors"
            >
              Devamını Oku <i className="fa-solid fa-arrow-right ml-1"></i>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
