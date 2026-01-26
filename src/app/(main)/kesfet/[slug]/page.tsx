"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import { blogService, BlogPost } from '@/services/blog-service';
import { recipeService } from '@/services/recipe-service';
import { ingredientService } from '@/services/ingredient-service';
import { useFavorites } from '@/hooks/use-favorites';
import { toast } from 'sonner';
import ClientHead from '@/components/seo/ClientHead';
import { SITE_URL } from '@/lib/constants';
import { decodeEntities, stripHtmlAndDecode, slugify } from '@/utils/textHelpers';
import CommentSection from '@/components/features/CommentSection';
import { EditButton } from '@/components/ui/EditButton';
import NewsletterForm from '@/components/common/NewsletterForm';
import RecipeCard from '@/components/ui/RecipeCard';
import { RecipeCard as RecipeCardType } from '@/lib/types';
import ContentWithEmbeds from '@/components/embeds/ContentWithEmbeds';
import { SidebarAds, InContentAd } from '@/components/ads';

// React.use'u import ediyoruz (Next.js 15+ için gerekli)
import { use } from 'react';

// Tüm 16 araçlık havuz - Standart İkonlar ve Renkler
const ALL_TOOLS = [
  { name: 'Alerjen Planlayıcı', path: '/akilli-asistan/alerjen-planlayici', icon: 'fa-solid fa-shield-heart', color: 'text-red-500', bg: 'bg-red-50' },
  { name: 'Bu Gıda Verilir mi?', path: '/akilli-asistan/bu-gida-verilir-mi', icon: 'fa-solid fa-magnifying-glass', color: 'text-amber-500', bg: 'bg-amber-50' },
  { name: 'Ek Gıdaya Başlama', path: '/akilli-asistan/ek-gidaya-baslama', icon: 'fa-solid fa-utensils', color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Ek Gıda Rehberi', path: '/akilli-asistan/ek-gida-rehberi', icon: 'fa-solid fa-carrot', color: 'text-green-500', bg: 'bg-green-50' },
  { name: 'Su İhtiyacı', path: '/akilli-asistan/su-ihtiyaci', icon: 'fa-solid fa-glass-water', color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { name: 'Persentil Hesaplayıcı', path: '/akilli-asistan/persentil', icon: 'fa-solid fa-chart-line', color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'BLW Hazırlık Testi', path: '/akilli-asistan/blw-testi', icon: 'fa-solid fa-baby', color: 'text-pink-500', bg: 'bg-pink-50' },
  { name: 'Leke Ansiklopedisi', path: '/akilli-asistan/leke-rehberi', icon: 'fa-solid fa-tshirt', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { name: 'Hava Kalitesi', path: '/akilli-asistan/hava-kalitesi', icon: 'fa-solid fa-wind', color: 'text-sky-500', bg: 'bg-sky-50' },
  { name: 'Akıllı Bez', path: '/akilli-asistan/bez-hesaplayici', icon: 'fa-solid fa-baby-carriage', color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Günlük Hijyen', path: '/akilli-asistan/hijyen-hesaplayici', icon: 'fa-solid fa-hand-sparkles', color: 'text-teal-500', bg: 'bg-teal-50' },
  { name: 'Banyo Planlayıcı', path: '/akilli-asistan/banyo-planlayici', icon: 'fa-solid fa-bath', color: 'text-blue-400', bg: 'bg-blue-50' },
  { name: 'Aşı Takvimi', path: '/dashboard/saglik/asilar', icon: 'fa-solid fa-syringe', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Sunum Önerileri', path: '/beslenme-rehberi/sunum-onerileri', icon: 'fa-solid fa-plate-wheat', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: '3 Gün Kuralı', path: '/beslenme-rehberi/3-gun-kurali', icon: 'fa-solid fa-clock-rotate-left', color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Besin Deneme Takvimi', path: '/akilli-asistan/besin-takvimi', icon: 'fa-solid fa-seedling', color: 'text-lime-500', bg: 'bg-lime-50' },
];

// params tipini Promise olarak güncelliyoruz
export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // params Promise'ini çözüyoruz
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<RecipeCardType[]>([]);
  const [randomIngredients, setRandomIngredients] = useState<Array<{
    id: number;
    slug: string;
    name: string;
    image: string;
    start_age: string;
  }>>([]);
  const [headings, setHeadings] = useState<{ level: number; id: string; text: string }[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  
  // Sidebar Tools State - Hydration safe random selection
  const [sidebarTools, setSidebarTools] = useState<typeof ALL_TOOLS>([]);

  useEffect(() => {
    // Sayfa yüklendiğinde 16 araçtan rastgele 4 tanesini seç
    const shuffled = [...ALL_TOOLS].sort(() => 0.5 - Math.random());
    setSidebarTools(shuffled.slice(0, 4));
  }, []);

  // Favorites hook
  const { isFavorite, toggleFavorite } = useFavorites();

  // Veriyi çek
  useEffect(() => {
    async function fetchPost() {
      try {
        // Artık çözülmüş slug değerini kullanıyoruz
        const fetchedPost = await blogService.getBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Blog yazısı çekilemedi:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  // Fetch related posts
  useEffect(() => {
    async function fetchRelatedPosts() {
      if (!post) return;
      try {
        const categoryId = post._embedded?.['wp:term']?.[0]?.[0]?.id;
        if (categoryId) {
          const response = await blogService.getAll(1, 4, categoryId);
          // Filter out current post
          setRelatedPosts(response.posts.filter(p => p.id !== post.id).slice(0, 3));
        }
      } catch (error) {
        console.error('Related posts fetch error:', error);
      }
    }
    
    fetchRelatedPosts();
  }, [post]);

  // Fetch random recipes and ingredients
  useEffect(() => {
    async function fetchRandomContent() {
      try {
        const [recipesData, ingredientsData] = await Promise.all([
          recipeService.getAll({ perPage: 3, orderBy: 'date' }),
          ingredientService.getAll({ perPage: 6 })
        ]);
        
        setRandomRecipes(recipesData.recipes || []);
        
        // Handle both array and object response formats
        const ingredients = Array.isArray(ingredientsData) 
          ? ingredientsData 
          : ingredientsData.ingredients || [];
        setRandomIngredients(ingredients);
      } catch (error) {
        console.error('Random content fetch error:', error);
      }
    }
    
    fetchRandomContent();
  }, []);

  // Extract headings from content
  useEffect(() => {
    if (!post?.content?.rendered) return;
    
    const extractHeadings = (content: string) => {
      // Match H2 and H3 tags with optional id attribute
      const headingRegex = /<h([2-3])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h\1>/gi;
      const headings: { level: number; id: string; text: string }[] = [];
      let match;
      let index = 0;
      
      while ((match = headingRegex.exec(content)) !== null) {
        const level = parseInt(match[1]);
        // Strip HTML from heading text
        const rawText = match[3].replace(/<[^>]*>/g, '');
        // Decode HTML entities
        const decodedText = decodeEntities(rawText);
        // Generate ID from text if not present
        const id = match[2] || `heading-${slugify(decodedText)}-${index}`;
        
        headings.push({ level, id, text: decodedText });
        index++;
      }
      
      return headings;
    };

    const extracted = extractHeadings(post.content.rendered);
    setHeadings(extracted);
  }, [post]);

  // Inject heading IDs directly into DOM for reliable TOC navigation
  useEffect(() => {
    if (headings.length === 0) return;

    // Wait for DOM to be ready
    const injectIds = () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (!element) {
          // Try to find the heading by text content, including wp-block-heading class
          const allHeadings = document.querySelectorAll('article h2, article h3, article h2.wp-block-heading, article h3.wp-block-heading');
          allHeadings.forEach((el) => {
            const text = el.textContent?.trim() || '';
            const decodedText = decodeEntities(text);
            if (decodedText === heading.text && !el.id) {
              el.id = heading.id;
            }
          });
        }
      });
    };

    // Run after a short delay to ensure content is rendered
    const timer = setTimeout(injectIds, 100);
    return () => clearTimeout(timer);
  }, [headings]);

  // Intersection Observer for active heading
  const OBSERVER_ROOT_MARGIN = '-100px 0px -80% 0px'; // Top and bottom margins for visibility
  const OBSERVER_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1]; // Track visibility at these percentages
  
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the most visible (highest intersection ratio) heading
    const visibleEntries = entries.filter(entry => entry.isIntersecting);
    if (visibleEntries.length > 0) {
      const mostVisible = visibleEntries.reduce((prev, current) => 
        (current.intersectionRatio > prev.intersectionRatio) ? current : prev
      );
      setActiveHeading(mostVisible.target.id);
    }
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      observerCallback,
      { rootMargin: OBSERVER_ROOT_MARGIN, threshold: OBSERVER_THRESHOLDS }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings, observerCallback]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Yazı Bulunamadı</h1>
            <p className="text-gray-600 mb-8">Aradığınız blog yazısı mevcut değil veya yayından kaldırılmış olabilir.</p>
            <Link href="/kesfet" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                Keşfet Listesine Dön
            </Link>
        </div>
    );
  }

  // Helper functions for data extraction
  const stripHtml = (html: string) => {
    if (typeof document !== 'undefined') {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }
    // Fallback for SSR
    return html.replace(/<[^>]*>/g, '');
  };
  
  // Inject heading IDs into content for TOC navigation
  const injectHeadingIds = (content: string, headings: { id: string; text: string }[]): string => {
    let result = content;
    headings.forEach((heading) => {
      // Escape special regex characters in heading text
      const escapedText = heading.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      const patterns = [
        new RegExp(`(<h[2-3]\\b[^>]*?)(>)([^<]*${escapedText}[^<]*)(</h[2-3]>)`, 'i'),
        new RegExp(`(<h[2-3]\\b[^>]*?)(>)((?:(?!<h[2-3]).)*?${escapedText}(?:(?!<h[2-3]).)*?)(</h[2-3]>)`, 'is'),
      ];
      
      for (const regex of patterns) {
        const newResult = result.replace(regex, (match, openTag, closeBracket, content, closeTag) => {
          if (openTag.includes('id=')) return match;
          return `${openTag} id="${heading.id}"${closeBracket}${content}${closeTag}`;
        });
        
        if (newResult !== result) {
          result = newResult;
          break;
        }
      }
    });
    return result;
  };
  
  // Process content with heading IDs
  const baseProcessedContent = post ? injectHeadingIds(post.content.rendered, headings) : '';

  const getImageUrl = (post: BlogPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/1200x600/E3F2FD/81D4FA?text=Gorsel+Yok';
  };

  const getAuthorName = (post: BlogPost) => {
    return post._embedded?.author?.[0]?.name || 'KidsGourmet Editörü';
  };
  
  const getAuthorImage = (post: BlogPost) => {
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

  const getAuthorSlug = (post: BlogPost) => {
    const author = post._embedded?.author?.[0];
    const slug = author?.slug || author?.id?.toString();
    return slug || 'unknown';
  };

  const getCategoryName = (post: BlogPost) => {
      const cat = post._embedded?.['wp:term']?.[0]?.[0];
      return cat ? cat.name : 'Genel';
  };

  const getCategorySlug = (post: BlogPost) => {
    return post._embedded?.['wp:term']?.[0]?.[0]?.slug || '';
  };

  const calculateReadTime = (content: string) => {
      const words = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      return `${minutes} dk okuma`;
  };
  
  const getSponsorLogo = (sponsorData: typeof post.sponsor_data): string | null => {
    if (!sponsorData) return null;
    
    let logo = sponsorData.sponsor_logo || sponsorData.sponsor_light_logo;
    
    if (!logo) return null;
    
    if (typeof logo === 'object') {
      const mediaObject = logo as { url?: string; source_url?: string; src?: string };
      logo = mediaObject.url || mediaObject.source_url || mediaObject.src || null;
    }
    
    if (typeof logo !== 'string' || !logo || logo === 'null' || logo === 'undefined' || logo.trim() === '') {
      return null;
    }
    
    if (logo.startsWith('/')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_WP_URL || '';
      return `${apiUrl}${logo}`;
    }
    
    return logo;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `${SITE_URL}/kesfet/${slug}`;
  const shareTitle = post ? stripHtml(post.title.rendered) : '';

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' - ' + shareUrl)}`, '_blank');
  };

  const copyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success('Link kopyalandı!');
        })
        .catch(() => {
          toast.error('Link kopyalanamadı');
        });
    } else {
      toast.error('Link kopyalama desteklenmiyor');
    }
  };

  const shareMail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleFavorite = async () => {
    if (!post) return;
    const isFav = isFavorite(post.id, 'post');
    try {
      await toggleFavorite(post.id, 'post');
      toast.success(isFav ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi!');
    } catch {
      toast.error('Giriş yapmanız gerekiyor');
    }
  };

  const isSponsored = post?.sponsor_data?.is_sponsored ?? false;
  const sponsorData = post?.sponsor_data;
  const isFav = post ? isFavorite(post.id, 'post') : false;
  
  let processedContent = baseProcessedContent;
  if (isSponsored && sponsorData?.sponsor_url && processedContent) {
    const sponsorLogo = getSponsorLogo(sponsorData);
    const sponsorCard = `
      <div class="my-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
        <div class="flex items-center gap-4">
          ${sponsorLogo ? `<img src="${sponsorLogo}" alt="${sponsorData.sponsor_name}" class="h-10 object-contain" onerror="this.style.display='none'" />` : ''}
          <div class="flex-1">
            <p class="text-sm text-gray-600 mb-2">
              Bu içerik <strong>${sponsorData.sponsor_name}</strong> tarafından desteklenmektedir.
            </p>
            <a 
              href="${sponsorData.sponsor_url}"
              target="_blank"
              rel="noopener noreferrer sponsored"
              class="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-600 transition-colors"
            >
              Daha Fazla Bilgi <i class="fa-solid fa-external-link"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    
    let pCount = 0;
    let injected = false;
    processedContent = processedContent.replace(/<\/p>/g, (match) => {
      pCount++;
      if (pCount === 2 && !injected) {
        injected = true;
        return match + sponsorCard;
      }
      return match;
    });
    
    if (!injected && pCount > 0) {
      pCount = 0;
      processedContent = processedContent.replace(/<\/p>/, (match) => {
        return match + sponsorCard;
      });
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">

        {/* SEO Meta Tags */}
        {post && (
          <ClientHead
            title={post.seo?.title || `${stripHtml(post.title.rendered)} | KidsGourmet`}
            description={post.seo?.description || stripHtml(post.excerpt.rendered).substring(0, 160)}
            keywords={post.seo?.focus_keywords || [getCategoryName(post)]}
            ogImage={post.seo?.og_image || getImageUrl(post)}
            url={`${SITE_URL}/kesfet/${slug}`}
          />
        )}

        {/* HEADER / HERO SECTION */}
        <div className="bg-white border-b border-gray-100 pb-12 pt-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Breadcrumb */}
                <nav className="flex justify-center text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li><Link href="/kesfet" className="hover:text-orange-500">Keşfet</Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li>
                          <Link 
                            href={`/kesfet/kategori/${getCategorySlug(post)}`} 
                            className="hover:text-orange-500"
                          >
                            {decodeEntities(getCategoryName(post))}
                          </Link>
                        </li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li className="font-semibold text-orange-500 truncate max-w-[150px] md:max-w-xs" dangerouslySetInnerHTML={{ __html: decodeEntities(post.title.rendered) }} />
                    </ol>
                </nav>

                {/* Title & Meta */}
                <Link 
                  href={`/kesfet/kategori/${getCategorySlug(post)}`}
                  className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 hover:bg-blue-100 transition-colors"
                >
                  {decodeEntities(getCategoryName(post))}
                </Link>
                <div className="flex items-start justify-between gap-3 mb-6 group">
                  <h1 
                      className="font-display font-bold text-3xl md:text-5xl text-slate-800 leading-tight font-sans"
                      dangerouslySetInnerHTML={{ __html: decodeEntities(post.title.rendered) }}
                  />
                  <EditButton 
                    contentType="post" 
                    contentId={post.id}
                    authorId={post._embedded?.author?.[0]?.id}
                    variant="icon"
                  />
                </div>
                
                {/* Sponsored or Normal Meta */}
                {isSponsored && sponsorData ? (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                    {/* Sponsor Badge */}
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                      Sponsorlu İçerik
                    </span>
                    {/* Sponsor Logo & Name */}
                    {(() => {
                      const sponsorLogo = getSponsorLogo(sponsorData);
                      return sponsorLogo ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={sponsorLogo} 
                            alt={sponsorData.sponsor_name} 
                            className="h-6 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <span className="text-gray-500">{sponsorData.sponsor_name} katkılarıyla</span>
                        </div>
                      ) : sponsorData.sponsor_name ? (
                        <span className="text-gray-500">{sponsorData.sponsor_name} katkılarıyla</span>
                      ) : null;
                    })()}
                    {/* Reading Time */}
                    <div className="flex items-center gap-2 text-gray-500">
                      <i className="fa-regular fa-clock"></i> {calculateReadTime(post.content.rendered)}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                          {(() => {
                            const authorAvatar = getAuthorImage(post);
                            const authorName = getAuthorName(post);
                            return authorAvatar ? (
                              <img src={authorAvatar} className="w-8 h-8 rounded-full border border-gray-200" alt={authorName} />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm border border-gray-200">
                                {authorName.charAt(0).toUpperCase()}
                              </div>
                            );
                          })()}
                          <span>Yazar: <Link 
                            href={`/uzman/${getAuthorSlug(post)}`}
                            className="hover:text-orange-500 transition-colors"
                          >
                            <strong className="text-slate-800">{getAuthorName(post)}</strong>
                          </Link></span>
                      </div>
                      <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="flex items-center gap-2">
                          <i className="fa-regular fa-calendar"></i> {new Date(post.date).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="flex items-center gap-2">
                          <i className="fa-regular fa-clock"></i> {calculateReadTime(post.content.rendered)}
                      </div>
                  </div>
                )}
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            <div className="flex flex-col lg:flex-row gap-12">
                
                {/* LEFT: SHARE & SOCIAL (Desktop Sticky) */}
                <div className="hidden lg:flex flex-col gap-4 w-12 sticky top-32 h-fit">
                    <button onClick={shareFacebook} className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-brands fa-facebook-f"></i>
                    </button>
                    <button onClick={shareTwitter} className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-black hover:border-black flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-brands fa-x-twitter"></i>
                    </button>
                    <button onClick={shareWhatsapp} className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-500 flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-brands fa-whatsapp text-lg"></i>
                    </button>
                    <button onClick={copyLink} className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-orange-500 hover:border-orange-500 flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-solid fa-link"></i>
                    </button>
                    <button onClick={shareMail} className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-purple-500 hover:border-purple-500 flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-regular fa-envelope"></i>
                    </button>
                    <button onClick={handleFavorite} className={`w-10 h-10 rounded-full bg-white border flex items-center justify-center transition-all shadow-sm mt-4 ${isFav ? 'text-red-500 border-red-500 hover:text-red-600 hover:border-red-600' : 'border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500'}`}>
                        <i className={isFav ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                    </button>
                </div>

                {/* CENTER: ARTICLE CONTENT */}
                <article className="flex-1 max-w-3xl">
                    
                    {/* Featured Image */}
                    <div className="rounded-[2rem] overflow-hidden shadow-lg mb-10">
                        <img src={getImageUrl(post)} className="w-full h-auto object-cover" alt={post.title.rendered} />
                    </div>

                    {/* Content Body */}
                    <div 
                        className="prose prose-lg prose-slate max-w-none text-gray-700 leading-relaxed font-sans
                        prose-headings:font-sans prose-headings:text-slate-800 prose-headings:font-bold
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                        prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2
                        prose-p:mb-6 prose-p:text-gray-600
                        prose-a:text-orange-500 prose-a:font-medium prose-a:no-underline prose-a:transition-all prose-a:duration-300
                        hover:prose-a:text-orange-600 hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                        prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:text-gray-700
                        prose-ul:my-6 prose-ul:space-y-2 prose-li:text-gray-600
                        prose-ol:my-6 prose-ol:space-y-2
                        prose-strong:text-slate-800 prose-strong:font-bold
                        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-orange-600
                        prose-pre:bg-slate-800 prose-pre:rounded-xl prose-pre:shadow-lg
                        prose-table:my-8 prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm
                        prose-th:bg-gray-100 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-bold prose-th:text-slate-800
                        prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-100
                        prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-gray-500 prose-figcaption:mt-2
                        [&_.wp-block-quote]:border-l-4 [&_.wp-block-quote]:border-orange-500 [&_.wp-block-quote]:bg-orange-50/50 [&_.wp-block-quote]:rounded-r-xl [&_.wp-block-quote]:p-6 [&_.wp-block-quote]:my-8
                        [&_.wp-block-image]:my-8 [&_.wp-block-image_img]:rounded-2xl [&_.wp-block-image_img]:shadow-lg
                        [&_.wp-block-gallery]:grid [&_.wp-block-gallery]:gap-4 [&_.wp-block-gallery]:my-8
                        [&_.wp-block-embed]:my-8 [&_.wp-block-embed_iframe]:rounded-xl [&_.wp-block-embed_iframe]:shadow-lg
                        [&_.has-text-align-center]:text-center
                        [&_.has-large-font-size]:text-xl
                        [&_.wp-block-separator]:my-10 [&_.wp-block-separator]:border-gray-200
                        [&_.wp-block-heading]:font-bold [&_.wp-block-heading]:text-slate-800 [&_.wp-block-heading]:font-sans
                        [&_h2.wp-block-heading]:text-2xl [&_h2.wp-block-heading]:mt-10 [&_h2.wp-block-heading]:mb-4 [&_h2.wp-block-heading]:pb-2 [&_h2.wp-block-heading]:border-b [&_h2.wp-block-heading]:border-gray-100
                        [&_h3.wp-block-heading]:text-xl [&_h3.wp-block-heading]:mt-8 [&_h3.wp-block-heading]:mb-3
                        [&_h4.wp-block-heading]:text-lg [&_h4.wp-block-heading]:mt-6 [&_h4.wp-block-heading]:mb-2"
                    >
                      <ContentWithEmbeds 
                        htmlContent={processedContent}
                        embeddedContent={post.embedded_content}
                      />
                    </div>

                    <InContentAd className="my-8" />

                    {/* Expert Approval */}
                    {post.expert && post.expert.approved && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 md:p-5 mt-8">
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="relative flex-shrink-0">
                            <img 
                              src={post.expert.image || 'https://placehold.co/100x100/E8F5E9/455A64?text=Uzman'} 
                              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-sm object-cover" 
                              alt={post.expert.name || 'Uzman'} 
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[9px] md:text-[10px] border-2 border-white">
                              <i className="fa-solid fa-check"></i>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <p className="text-xs md:text-sm text-slate-700 font-medium mb-2">
                              Bu yazı ile ilgili Uzman Notu:{' '}
                              <Link 
                                href={post.expert.slug ? `/uzman/${post.expert.slug}` : '#'} 
                                className="text-green-600 underline decoration-dotted font-bold hover:text-green-700"
                              >
                                {post.expert.title && `${post.expert.title} `}{post.expert.name}
                              </Link>
                            </p>
                            {post.expert.note && (
                              <div className="bg-white/70 rounded-xl p-2.5 md:p-3 mt-2">
                                <p className="text-[10px] md:text-xs text-gray-500 font-medium mb-1">
                                  <i className="fa-solid fa-comment-medical text-green-500 mr-1"></i> Uzman Notu:
                                </p>
                                <p className="text-xs md:text-sm text-gray-700">{post.expert.note}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags & Share */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        {post._embedded?.['wp:term']?.[1] && post._embedded['wp:term'][1].length > 0 && (
                            <div className="mt-10 pt-8 border-t border-gray-100">
                              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                <i className="fa-solid fa-tags mr-2 text-orange-500"></i>Etiketler
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {post._embedded['wp:term'][1].map((tag: any) => (
                                  <Link 
                                    key={tag.id} 
                                    href={`/kesfet?etiket=${tag.slug}`} 
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-orange-100 hover:text-orange-600 transition-colors"
                                  >
                                    #{tag.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                        )}
                        
                        {!isSponsored && (
                          <div className="bg-orange-50/50 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left border border-orange-100 mt-8">
                              {(() => {
                                const authorAvatar = getAuthorImage(post);
                                const authorName = getAuthorName(post);
                                return authorAvatar ? (
                                  <img src={authorAvatar} className="w-20 h-20 rounded-full border-4 border-white shadow-sm" alt={authorName} />
                                ) : (
                                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl border-4 border-white shadow-sm">
                                    {authorName.charAt(0).toUpperCase()}
                                  </div>
                                );
                              })()}
                              <div className="flex-1">
                                  <Link 
                                    href={`/uzman/${getAuthorSlug(post)}`}
                                    className="font-bold text-slate-800 text-lg mb-1 hover:text-orange-500 transition-colors block"
                                  >
                                    {getAuthorName(post)}
                                  </Link>
                                  <p className="text-sm text-gray-600 mb-3">Çocuk Sağlığı ve Gelişimi üzerine içerikler üretiyor.</p>
                                  <Link 
                                    href={`/uzman/${getAuthorSlug(post)}`} 
                                    className="text-orange-500 font-bold text-sm hover:underline"
                                  >
                                    Tüm Yazıları
                                  </Link>
                              </div>
                          </div>
                        )}
                        
                        {isSponsored && sponsorData && (
                          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mt-8">
                            <div className="flex items-center gap-4">
                              {(() => {
                                const sponsorLogo = getSponsorLogo(sponsorData);
                                return sponsorLogo ? (
                                  <img 
                                    src={sponsorLogo} 
                                    alt={sponsorData.sponsor_name}
                                    className="h-12 object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : null;
                              })()}
                              <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg mb-1">
                                  {sponsorData.sponsor_name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  Bu içerik sponsorlu bir içeriktir.
                                </p>
                                {sponsorData?.sponsor_url && (
                                  <a 
                                    href={sponsorData.sponsor_url}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-600 transition-colors mt-3"
                                  >
                                    Daha Fazla Bilgi <i className="fa-solid fa-external-link"></i>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                    
                    <div className="mt-8">
                      <CommentSection postId={post.id} postType="post" initialCommentCount={post.comment_count || 0} />
                    </div>
                    
                    {/* RELATED CONTENT SECTIONS */}
                    <div className="mt-12 space-y-10">
                      
                      {relatedPosts.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-800 text-xl mb-6 flex items-center">
                            <i className="fa-solid fa-newspaper text-orange-500 mr-3"></i>
                            İlginizi Çekebilir
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                              <Link 
                                key={relatedPost.id} 
                                href={`/kesfet/${relatedPost.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                              >
                                <div className="aspect-[4/3] overflow-hidden">
                                  <img 
                                    src={relatedPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/400x300'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    alt={stripHtmlAndDecode(relatedPost.title.rendered)}
                                  />
                                </div>
                                <div className="p-4">
                                  <h4 
                                    className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: decodeEntities(relatedPost.title.rendered) }}
                                  />
                                  <span className="text-xs text-gray-400 mt-2 block">
                                    {decodeEntities(relatedPost._embedded?.['wp:term']?.[0]?.[0]?.name || 'Genel')}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {randomRecipes.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-800 text-xl mb-6 flex items-center">
                            <i className="fa-solid fa-utensils text-orange-500 mr-3"></i>
                            Önerilen Tarifler
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {randomRecipes.slice(0, 3).map((recipe) => (
                              <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                          </div>
                          <div className="text-center mt-6">
                            <Link href="/tarifler" className="text-orange-500 font-bold hover:underline">
                              Tüm Tarifler →
                            </Link>
                          </div>
                        </div>
                      )}

                      {randomIngredients.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-800 text-xl mb-6 flex items-center">
                            <i className="fa-solid fa-carrot text-green-500 mr-3"></i>
                            Keşfedilecek Malzemeler
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {randomIngredients.slice(0, 6).map((ingredient) => (
                              <Link
                                key={ingredient.id}
                                href={`/beslenme-rehberi/${ingredient.slug}`}
                                className="group bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all text-center"
                              >
                                <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gray-50">
                                  <img 
                                    src={ingredient.image || 'https://placehold.co/100x100'}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    alt={decodeEntities(ingredient.name)}
                                  />
                                </div>
                                <h4 className="font-medium text-slate-800 text-sm group-hover:text-orange-500 transition-colors">
                                  {decodeEntities(ingredient.name)}
                                </h4>
                                <span className="text-xs text-gray-400">
                                  {ingredient.start_age ? `${ingredient.start_age} Ay` : '+6 Ay'}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="text-center mt-6">
                            <Link href="/malzemeler" className="text-green-500 font-bold hover:underline">
                              Tüm Malzemeler →
                            </Link>
                          </div>
                        </div>
                      )}

                    </div>

                </article>

                {/* RIGHT: SIDEBAR (Sticky) */}
                <aside className="hidden lg:block w-80 flex-shrink-0">
                    <div className="sticky top-24 space-y-8">
                        
                        <SidebarAds />
                        
                        {/* Table of Contents */}
                        {headings.length > 0 && (
                          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center">
                              <i className="fa-solid fa-list-ul text-orange-500 mr-2"></i>İçindekiler
                            </h3>
                            <ul className="space-y-2 text-sm border-l-2 border-gray-100 ml-2">
                              {headings.map((heading) => (
                                <li key={heading.id}>
                                  <a
                                    href={`#${heading.id}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const element = document.getElementById(heading.id);
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        window.history.pushState(null, '', `#${heading.id}`);
                                      }
                                    }}
                                    className={`block pl-4 py-1 border-l-2 -ml-[2px] transition-all ${
                                      activeHeading === heading.id
                                        ? 'border-orange-500 text-orange-500 font-medium'
                                        : 'border-transparent text-gray-500 hover:text-slate-800 hover:border-gray-300'
                                    } ${heading.level === 3 ? 'pl-8 text-xs' : ''}`}
                                  >
                                    {heading.text}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Faydalı Araçlar Widget - GÜNCELLENDİ */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center text-sm uppercase tracking-wider">
                            <i className="fa-solid fa-wand-magic-sparkles text-orange-500 mr-2"></i> 
                            Faydalı Araçlar
                          </h3>
                          <div className="space-y-2">
                            {/* Loading State veya Araç Listesi */}
                            {sidebarTools.length === 0 ? (
                              // Skeleton Loading
                              [1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 animate-pulse">
                                  <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </div>
                              ))
                            ) : (
                              sidebarTools.map((tool) => (
                                <Link
                                  key={tool.path}
                                  href={tool.path}
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                >
                                  <div className={`w-10 h-10 ${tool.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <i className={`${tool.icon} ${tool.color}`}></i>
                                  </div>
                                  <span className="font-medium text-slate-700 group-hover:text-orange-500 transition-colors text-sm">
                                    {tool.name}
                                  </span>
                                  <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs"></i>
                                </Link>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Newsletter Widget */}
                        <div className="bg-green-50/50 p-6 rounded-[2rem] border border-green-100 text-center">
                            <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-xl">
                                <i className="fa-regular fa-envelope"></i>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2 font-sans">İÇERİKLERİ KEŞFET!</h3>
                            <p className="text-xs text-gray-600 mb-4">Ebeveyn Rehberi&apos;nden En Güncel İçerikler Mailine Gelsin.</p>
                            <NewsletterForm 
                                source="blog" 
                                variant="default"
                                placeholder="Mail Adresiniz"
                                buttonText="Abone Ol"
                                interests={['recipes', 'tips']}
                            />
                        </div>

                    </div>
                </aside>

            </div>
        </div>

    </div>
  );
}