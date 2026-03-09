"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/services/blog-service';
import { useFavorites } from '@/hooks/use-favorites';
import { decodeEntities, stripHtmlAndDecode } from '@/utils/textHelpers';

interface SponsoredPostCardProps {
  post: BlogPost;
  categories?: Array<{ id: number; name: string; slug: string }>;
  variant?: 'default' | 'hero';
}

export default function SponsoredPostCard({ post, categories, variant = 'default' }: SponsoredPostCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const sponsorData = post.sponsor_data;
  const isSponsored = sponsorData?.is_sponsored ?? false;
  const isFav = isFavorite(post.id, 'post');

  // Fire GAM impression pixel on mount (client-side only, after render)
  useEffect(() => {
    if (isSponsored && sponsorData?.gam_impression_url) {
      const img = new Image();
      img.src = sponsorData.gam_impression_url.replace(
        '%%CACHEBUSTER%%',
        Math.floor(Math.random() * 1000000000).toString()
      );
    }
  }, [isSponsored, sponsorData?.gam_impression_url]);

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
    // Try different sizes
    const avatar = avatarUrls?.['96'] || avatarUrls?.['48'] || avatarUrls?.['24'];
    
    // Fix protocol if missing
    if (avatar && avatar.startsWith('//')) {
      return `https:${avatar}`;
    }
    
    // Return null for invalid avatars (will show initials instead)
    if (!avatar || avatar.includes('blank.gif') || avatar.includes('mystery-man')) {
      return null;
    }
    
    return avatar;
  };

  const getCategoryName = (post: BlogPost) => {
    const catId = post._embedded?.['wp:term']?.[0]?.[0]?.id;
    const cat = categories?.find(c => c.id === catId);
    return cat ? cat.name : 'Genel';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(post.id, 'post');
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
    }
  };
  
  // Get sponsor logo with validation
  const getSponsorLogo = (sponsorData: typeof post.sponsor_data): string | null => {
    if (!sponsorData) return null;
    
    // sponsor_logo veya sponsor_light_logo'yu al
    let logo = sponsorData.sponsor_logo || sponsorData.sponsor_light_logo;
    
    // Logo yoksa null döndür
    if (!logo) return null;
    
    // Logo bir object ise (WordPress media object olabilir)
    if (typeof logo === 'object') {
      // url, source_url veya src property'lerini dene
      const mediaObject = logo as { url?: string; source_url?: string; src?: string };
      logo = mediaObject.url || mediaObject.source_url || mediaObject.src || null;
    }
    
    // Hala geçerli bir string değilse null döndür
    if (typeof logo !== 'string' || !logo || logo === 'null' || logo === 'undefined' || logo.trim() === '') {
      return null;
    }
    
    // Relative URL'i absolute yap
    if (logo.startsWith('/')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_WP_URL || '';
      return `${apiUrl}${logo}`;
    }
    
    return logo;
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
      if (sponsorData.gam_click_url.endsWith('adurl=')) {
        // Redirect tracker: append destination to GAM URL
        return `${sponsorData.gam_click_url}${encodeURIComponent(destination)}`;
      }
      // Fire-and-forget tracker: navigate to destination directly, tracking done via onClick
      return destination;
    }

    return destination;
  };

  const handleSponsoredClick = () => {
    // Only fire for fire-and-forget trackers (not redirect trackers ending with 'adurl=')
    if (!sponsorData?.gam_click_url) return;
    if (sponsorData.gam_click_url.endsWith('adurl=')) return;
    const clickUrl = sponsorData.gam_click_url.replace(
      '%%CACHEBUSTER%%',
      Math.floor(Math.random() * 1000000000).toString()
    );
    // Use sendBeacon when available (reliable during page navigation), otherwise Image fallback
    if (navigator.sendBeacon) {
      navigator.sendBeacon(clickUrl);
    } else {
      new Image().src = clickUrl;
    }
  };

  const finalUrl = buildLinkUrl();
  const isExternalLink = isSponsored && sponsorData?.direct_redirect;
  const hasGamTracking = isSponsored && !!sponsorData?.gam_click_url;

  // Render sponsored badge
  const renderSponsoredBadge = () => {
    if (!isSponsored) return null;

    return (
      <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md z-10">
        Sponsorlu
      </span>
    );
  };

  // Hero variant for featured posts
  if (variant === 'hero') {
    const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
      href: finalUrl,
      className: "group relative block rounded-[2.5rem] overflow-hidden shadow-xl aspect-[16/9] md:aspect-[21/9]",
      onClick: handleSponsoredClick,
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
        
        {/* Favorite Button - Top Right */}
        <button 
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Favorilerden kaldır" : "Favorilere ekle"}
          aria-pressed={isFav}
          className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart text-white"}></i>
        </button>
        
        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-4xl">
          <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            {isSponsored ? 'Sponsorlu İçerik' : 'Editörün Seçimi'}
          </span>
          <h2 
            className="font-display font-bold text-3xl md:text-5xl text-white mb-4 leading-tight group-hover:underline decoration-green-500 decoration-4 underline-offset-4 font-sans"
            dangerouslySetInnerHTML={{ __html: decodeEntities(post.title.rendered) }}
          />
          <p className="text-gray-200 text-lg mb-6 line-clamp-2 hidden md:block">
            {stripHtmlAndDecode(post.excerpt.rendered)}
          </p>
          
          {/* Meta Info - Only for non-sponsored */}
          {!isSponsored && (
            <div className="flex items-center text-white/80 text-sm gap-6">
              <div className="flex items-center gap-2">
                {(() => {
                  const avatar = getAuthorAvatar(post);
                  const name = getAuthorName(post);
                  return avatar ? (
                    <img src={avatar} className="w-8 h-8 rounded-full border border-white/50" alt={name} />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm border border-white/50">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  );
                })()}
                <span>{getAuthorName(post)}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-calendar"></i> {formatDate(post.date)}
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-comment"></i> {post.comment_count || 0}
              </div>
            </div>
          )}
          
          {/* Sponsor Logo - Only for sponsored */}
          {isSponsored && sponsorData && (() => {
            const logoUrl = getSponsorLogo(sponsorData);
            return logoUrl ? (
              <div className="mt-4 flex items-center gap-2">
                <img 
                  src={logoUrl} 
                  alt={sponsorData.sponsor_name || 'Sponsor'}
                  className="h-6 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-white/80 text-sm">{sponsorData.sponsor_name}</span>
              </div>
            ) : null;
          })()}
        </div>
      </>
    );

    return (
      <div className="relative">
        {hasGamTracking ? (
          <a {...anchorProps}>
            {heroContent}
          </a>
        ) : (
          <Link href={finalUrl} className={anchorProps.className} onClick={handleSponsoredClick}>
            {heroContent}
          </Link>
        )}
      </div>
    );
  }

  // Default card variant
  return (
    <article className="flex flex-col group h-full relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasGamTracking ? (
          <a 
            href={finalUrl}
            className="block w-full h-full"
            onClick={handleSponsoredClick}
            {...(isExternalLink && { 
              target: '_blank', 
              rel: 'noopener noreferrer sponsored' 
            })}
          >
            <img src={getImageUrl(post)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={post.title.rendered} />
          </a>
        ) : (
          <Link href={finalUrl} className="block w-full h-full" onClick={handleSponsoredClick}>
            <img src={getImageUrl(post)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={post.title.rendered} />
          </Link>
        )}
        
        {/* Category Badge - Top Left (for non-sponsored) OR Sponsored Badge - Top Left (for sponsored) */}
        {isSponsored ? (
          <span className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md z-10">
            Sponsorlu
          </span>
        ) : (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-500 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
            {getCategoryName(post)}
          </span>
        )}
        
        {/* Favorite Button - Top Right */}
        <button 
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Favorilerden kaldır" : "Favorilere ekle"}
          aria-pressed={isFav}
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <i className={isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"}></i>
        </button>
        
        {/* Sponsor Logo - Bottom Left (for sponsored posts) */}
        {isSponsored && sponsorData && (() => {
          const logoUrl = getSponsorLogo(sponsorData);
          return logoUrl ? (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg">
              <img 
                src={logoUrl} 
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
        {/* Meta Info - Different for sponsored */}
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
            <span>{formatDate(post.date)}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{getAuthorName(post)}</span>
          </div>
        )}
        
        {/* Discount Badge - Only for sponsored with discount */}
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
              dangerouslySetInnerHTML={{ __html: decodeEntities(post.title.rendered) }}
              onClick={handleSponsoredClick}
              {...(isExternalLink && { 
                target: '_blank', 
                rel: 'noopener noreferrer sponsored' 
              })}
            />
          ) : (
            <Link 
              href={finalUrl}
              dangerouslySetInnerHTML={{ __html: decodeEntities(post.title.rendered) }}
              onClick={handleSponsoredClick}
            />
          )}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {stripHtmlAndDecode(post.excerpt.rendered)}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {hasGamTracking ? (
            <a 
              href={finalUrl}
              className="text-xs font-bold text-slate-700 hover:text-orange-500 transition-colors"
              onClick={handleSponsoredClick}
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
              onClick={handleSponsoredClick}
            >
              Devamını Oku <i className="fa-solid fa-arrow-right ml-1"></i>
            </Link>
          )}
          
          {/* Comment Count */}
          <span className="text-xs text-gray-400">
            <i className="fa-regular fa-comment mr-1"></i> {post.comment_count || 0}
          </span>
        </div>
      </div>
    </article>
  );
}
