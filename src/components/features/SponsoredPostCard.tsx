"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/services/blog-service';

interface SponsoredPostCardProps {
  post: BlogPost;
  categories?: any[];
  variant?: 'default' | 'hero';
}

export default function SponsoredPostCard({ post, categories, variant = 'default' }: SponsoredPostCardProps) {
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

  const getCategoryName = (post: BlogPost) => {
    const catId = post._embedded?.['wp:term']?.[0]?.[0]?.id;
    const cat = categories?.find(c => c.id === catId);
    return cat ? cat.name : 'Genel';
  };

  // Build destination URL and final link
  const buildLinkUrl = () => {
    if (!isSponsored || !sponsorData) {
      return `/blog/${post.slug}`;
    }

    // 1. Determine destination URL
    const destination = sponsorData.direct_redirect 
      ? sponsorData.sponsor_url 
      : `/blog/${post.slug}`;

    // 2. Build final link with GAM tracking if available
    if (sponsorData.gam_click_url) {
      return `${sponsorData.gam_click_url}${encodeURIComponent(destination)}`;
    }

    return destination;
  };

  const finalUrl = buildLinkUrl();
  const isExternalLink = isSponsored && sponsorData?.direct_redirect;
  const hasGamTracking = isSponsored && !!sponsorData?.gam_click_url;

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

  // Render sponsored badge
  const renderSponsoredBadge = () => {
    if (!isSponsored) return null;

    return (
      <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md z-10">
        Sponsorlu
      </span>
    );
  };

  // Render sponsor logo in footer
  const renderSponsorLogo = () => {
    if (!isSponsored || !sponsorData) return null;

    const logoUrl = sponsorData.sponsor_logo || sponsorData.sponsor_light_logo;
    if (!logoUrl) return null;

    return (
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
        <span className="text-xs text-gray-400">Sponsor:</span>
        <img 
          src={logoUrl} 
          alt={sponsorData.sponsor_name}
          className="h-4 object-contain"
        />
      </div>
    );
  };

  // Hero variant for featured posts
  if (variant === 'hero') {
    const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
      href: finalUrl,
      className: "group relative block rounded-[2.5rem] overflow-hidden shadow-xl aspect-[16/9] md:aspect-[21/9]",
      ...(isExternalLink && { 
        target: '_blank', 
        rel: 'noopener noreferrer sponsored' 
      })
    };

    const heroContent = (
      <>
        <img src={getImageUrl(post)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title.rendered} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {renderSponsoredBadge()}
        
        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-4xl">
          <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            {isSponsored ? 'Sponsorlu İçerik' : 'Editörün Seçimi'}
          </span>
          <h2 
            className="font-display font-bold text-3xl md:text-5xl text-white mb-4 leading-tight group-hover:underline decoration-green-500 decoration-4 underline-offset-4 font-sans"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <p className="text-gray-200 text-lg mb-6 line-clamp-2 hidden md:block">
            {stripHtml(post.excerpt.rendered)}
          </p>
          <div className="flex items-center text-white/80 text-sm gap-6">
            <div className="flex items-center gap-2">
              <img src="https://placehold.co/50x50/AED581/ffffff?text=Dr" className="w-8 h-8 rounded-full border border-white/50" alt="Author" />
              <span>{getAuthorName(post)}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar"></i> {new Date(post.date).toLocaleDateString('tr-TR')}
            </div>
          </div>
          {isSponsored && sponsorData && (
            <div className="mt-4 flex items-center gap-2">
              {sponsorData.sponsor_logo && (
                <img 
                  src={sponsorData.sponsor_light_logo || sponsorData.sponsor_logo} 
                  alt={sponsorData.sponsor_name}
                  className="h-6 object-contain filter brightness-0 invert"
                />
              )}
            </div>
          )}
        </div>
      </>
    );

    return (
      <div className="relative">
        {renderImpressionPixel()}
        {hasGamTracking ? (
          <a {...anchorProps}>
            {heroContent}
          </a>
        ) : (
          <Link href={finalUrl} className={anchorProps.className}>
            {heroContent}
          </Link>
        )}
      </div>
    );
  }

  // Default card variant
  const cardImageContent = (
    <>
      <img src={getImageUrl(post)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={post.title.rendered} />
      {isSponsored ? (
        renderSponsoredBadge()
      ) : (
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-500 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
          {getCategoryName(post)}
        </span>
      )}
    </>
  );

  return (
    <article className="flex flex-col group h-full relative">
      {renderImpressionPixel()}
      
      {hasGamTracking ? (
        <a 
          href={finalUrl}
          className="block overflow-hidden rounded-[2rem] mb-4 relative aspect-[4/3]"
          {...(isExternalLink && { 
            target: '_blank', 
            rel: 'noopener noreferrer sponsored' 
          })}
        >
          {cardImageContent}
        </a>
      ) : (
        <Link 
          href={finalUrl}
          className="block overflow-hidden rounded-[2rem] mb-4 relative aspect-[4/3]"
        >
          {cardImageContent}
        </Link>
      )}
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{getAuthorName(post)}</span>
        </div>
        <h3 className="font-display font-bold text-xl text-slate-800 mb-3 leading-snug group-hover:text-orange-500 transition-colors font-sans">
          {hasGamTracking ? (
            <a 
              href={finalUrl}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              {...(isExternalLink && { 
                target: '_blank', 
                rel: 'noopener noreferrer sponsored' 
              })}
            />
          ) : (
            <Link 
              href={finalUrl}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          )}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {stripHtml(post.excerpt.rendered)}
        </p>
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
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
        </div>
        {renderSponsorLogo()}
      </div>
    </article>
  );
}
