"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/services/blog-service';
import { useFavorites } from '@/hooks/use-favorites';
import { decodeEntities, stripHtmlAndDecode } from '@/utils/textHelpers';
import { EditButton } from '@/components/ui/EditButton';

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

  // Position constant for edit button to avoid overlap with favorite button
  const EDIT_BUTTON_OFFSET = 'right-16';

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

  const getAuthorId = (post: BlogPost): number | undefined => {
    return post._embedded?.author?.[0]?.id;
  };

  const getAuthorAvatar = (post: BlogPost) => {
    const avatarUrls = post._embedded?.author?.[0]?.avatar_urls;
    const avatar = avatarUrls?.['96'] || avatarUrls?.['48'] || avatarUrls?.['24'];
    
    if (avatar && avatar.startsWith('//')) {
      return `https:${avatar}`;
    }
    
    if (!avatar || avatar.includes('blank.gif') || avatar.includes('mystery-man')) {
      return null;
    }
    
    return avatar;
  };

  // DÜZELTME BURADA YAPILDI:
  // Harici categories listesi olmasa bile, post verisinden ismi almaya çalışır.
  const getCategoryName = (post: BlogPost) => {
    // 1. Önce post'un kendi içindeki gömülü veriden ismi almayı dene
    const embeddedCategory = post._embedded?.['wp:term']?.[0]?.[0];
    if (embeddedCategory && embeddedCategory.name) {
      return embeddedCategory.name;
    }

    // 2. Bulunamazsa categories prop'una bak (Fallback)
    const catId = embeddedCategory?.id;
    const cat = categories?.find(c => c.id === catId);
    return cat ? cat.name : 'Genel';
  };

  const formattedDate = new Date(post.date).toLocaleDateString('tr-TR');
  const commentCount = post.comment_count || 0;
  const title = decodeEntities(post.title.rendered);
  const excerpt = stripHtmlAndDecode(post.excerpt.rendered);
  const imageUrl = getImageUrl(post);
  const authorName = getAuthorName(post);
  const authorId = getAuthorId(post);
  const authorAvatar = getAuthorAvatar(post);
  const categoryName = getCategoryName(post);

  // Build destination URL and final link
  const buildLinkUrl = () => {
    if (!isSponsored || !sponsorData) {
      return `/kesfet/${post.slug}`;
    }

    const destination = sponsorData.direct_redirect 
      ? sponsorData.sponsor_url 
      : `/kesfet/${post.slug}`;

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
        
        {/* Edit Button */}
        <EditButton 
          contentType="post" 
          contentId={post.id}
          authorId={authorId}
          variant="text"
          className={`top-6 ${EDIT_BUTTON_OFFSET}`}
        />
        
        {/* Favori Butonu */}
        <button 
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Favorilerden kaldır" : "Favorilere ekle"}
          aria-pressed={isFav}
          className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart text-white"}></i>
        </button>
        
        {/* Badge */}
        <span className="absolute top-6 left-6 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold uppercase tracking-wider shadow-lg">
          {isSponsored ? '📢 Sponsorlu İçerik' : '⭐ Editörün Seçimi'}
        </span>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-4xl">
          <h2 
            className="font-display font-bold text-2xl md:text-5xl text-white mb-4 leading-tight group-hover:underline decoration-green-500 decoration-4 underline-offset-4"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          
          {/* Meta */}
          {!isSponsored && (
            <div className="flex items-center text-white/80 text-sm gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                {authorAvatar ? (
                  <img src={authorAvatar} className="w-8 h-8 rounded-full border border-white/50" alt={authorName} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm border border-white/50">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
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
          
          {/* Sponsor Logo */}
          {isSponsored && sponsorData && (() => {
            const logoUrl = typeof sponsorData.sponsor_light_logo === 'string' 
              ? sponsorData.sponsor_light_logo 
              : (typeof sponsorData.sponsor_logo === 'string' 
                  ? sponsorData.sponsor_logo 
                  : null);
            
            if (!logoUrl || logoUrl === '' || logoUrl === 'null' || logoUrl === 'undefined') {
              return null;
            }
            
            const finalLogoUrl = logoUrl.startsWith('/') 
              ? `${process.env.NEXT_PUBLIC_API_URL || ''}${logoUrl}`
              : logoUrl;
            
            return logoUrl ? (
              <img 
                src={finalLogoUrl} 
                alt={sponsorData.sponsor_name || 'Sponsor'} 
                className="h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null;
          })()}
          {isSponsored && sponsorData?.sponsor_name && (
            <span className="text-white/80 text-sm">{sponsorData.sponsor_name} katkılarıyla</span>
          )}
        </div>
      </>
    );

    return (
      <article className="group relative block rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-xl aspect-[4/3] md:aspect-[21/9]">
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
    <article className="flex flex-col group h-full relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {renderImpressionPixel()}
      
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasGamTracking ? (
          <a 
            href={finalUrl}
            className="block w-full h-full"
            {...(isExternalLink && { 
              target: '_blank', 
              rel: 'noopener noreferrer sponsored' 
            })}
          >
            <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={title} />
          </a>
        ) : (
          <Link href={finalUrl} className="block w-full h-full">
            <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={title} />
          </Link>
        )}
        
        {/* Edit Button */}
        <EditButton 
          contentType="post" 
          contentId={post.id}
          authorId={authorId}
          variant="text"
          className={EDIT_BUTTON_OFFSET}
        />
        
        {/* Category Badge */}
        {isSponsored ? (
          <span className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md z-10">
            Sponsorlu
          </span>
        ) : (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-500 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
            {categoryName}
          </span>
        )}
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Favorilerden kaldır" : "Favorilere ekle"}
          aria-pressed={isFav}
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"}></i>
        </button>
        
        {/* Sponsor Logo */}
        {isSponsored && sponsorData && (() => {
          const logoUrl = typeof sponsorData.sponsor_logo === 'string' 
            ? sponsorData.sponsor_logo 
            : (typeof sponsorData.sponsor_light_logo === 'string' 
                ? sponsorData.sponsor_light_logo 
                : null);
          
          if (!logoUrl || logoUrl === '' || logoUrl === 'null' || logoUrl === 'undefined') {
            return null;
          }
          
          const finalLogoUrl = logoUrl.startsWith('/') 
            ? `${process.env.NEXT_PUBLIC_API_URL || ''}${logoUrl}`
            : logoUrl;
          
          return logoUrl ? (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg">
              <img 
                src={finalLogoUrl} 
                alt={sponsorData.sponsor_name || 'Sponsor'} 
                className="h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
            </div>
          ) : null;
        })()}
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Meta Info */}
        {isSponsored ? (
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">
              Sponsorlu
            </span>
            {sponsorData?.sponsor_name && (
              <span className="text-xs text-gray-500">{sponsorData.sponsor_name}</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{authorName}</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {isSponsored && sponsorData?.discount_text && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-2 mb-3">
            <span className="text-green-600 text-xs font-bold">
              <i className="fa-solid fa-tag mr-1"></i> {sponsorData.discount_text}
            </span>
          </div>
        )}
        
        {/* Title */}
        <h3 className="font-sans font-bold text-xl text-slate-800 mb-3 leading-snug group-hover:text-orange-500 transition-colors">
          {hasGamTracking ? (
            <a 
              href={finalUrl}
              dangerouslySetInnerHTML={{ __html: title }}
              {...(isExternalLink && { 
                target: '_blank', 
                rel: 'noopener noreferrer sponsored' 
              })}
            />
          ) : (
            <Link 
              href={finalUrl}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {excerpt}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {hasGamTracking ? (
            <a 
              href={finalUrl}
              className="text-xs font-bold text-slate-700 hover:text-orange-500 transition-colors"
              {...(isExternalLink && { 
                target: '_blank', 
                rel: 'noopener noreferrer sponsored' 
              })}
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
          
          {/* Comment Count */}
          <span className="text-xs text-gray-400">
            <i className="fa-regular fa-comment mr-1"></i> {commentCount}
          </span>
        </div>
      </div>
    </article>
  );
}