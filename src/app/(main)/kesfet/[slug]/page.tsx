"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import { blogService, BlogPost } from '@/services/blog-service';
import { recipeService } from '@/services/recipe-service';
import { notFound } from 'next/navigation';
import { useFavorites } from '@/hooks/use-favorites';
import { toast } from 'sonner';
import ClientHead from '@/components/seo/ClientHead';
import { SITE_URL } from '@/lib/constants';

// React.use'u import ediyoruz (Next.js 15+ için gerekli)
import { use } from 'react';

// params tipini Promise olarak güncelliyoruz
export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // params Promise'ini çözüyoruz
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<any[]>([]);
  const [headings, setHeadings] = useState<{ level: number; id: string; text: string }[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');

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

  // Fetch random recipes
  useEffect(() => {
    async function fetchRandomContent() {
      try {
        const recipes = await recipeService.getAll({ perPage: 3, orderBy: 'date' });
        setRandomRecipes(recipes.recipes || []);
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
      const headingRegex = /<h([2-3])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h\1>/gi;
      const headings: { level: number; id: string; text: string }[] = [];
      let match;
      let index = 0;
      
      while ((match = headingRegex.exec(content)) !== null) {
        const level = parseInt(match[1]);
        const id = match[2] || `heading-${index}`;
        const text = match[3].replace(/<[^>]*>/g, ''); // Strip HTML tags
        headings.push({ level, id, text });
        index++;
      }
      
      return headings;
    };

    const extracted = extractHeadings(post.content.rendered);
    setHeadings(extracted);
  }, [post]);

  // Intersection Observer for active heading
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
      { rootMargin: '-100px 0px -80% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
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

  const getImageUrl = (post: BlogPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/1200x600/E3F2FD/81D4FA?text=Gorsel+Yok';
  };

  const getAuthorName = (post: BlogPost) => {
    return post._embedded?.author?.[0]?.name || 'KidsGourmet Editörü';
  };
  
  const getAuthorImage = (post: BlogPost) => {
      return post._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://placehold.co/100x100/AED581/ffffff?text=Yazar';
  };

  const getAuthorSlug = (post: BlogPost) => {
    const author = post._embedded?.author?.[0];
    return author?.slug || author?.id?.toString() || '';
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

  // Social sharing functions
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
    if (!navigator.clipboard) {
      toast.error('Clipboard desteği mevcut değil. Lütfen URL\'yi manuel olarak kopyalayın.');
      return;
    }
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link kopyalandı!');
    }).catch(() => {
      toast.error('Link kopyalanamadı. Lütfen manuel olarak kopyalayın.');
    });
  };

  const handleFavorite = async () => {
    if (!post) return;
    const isFav = isFavorite(post.id, 'post');
    try {
      await toggleFavorite(post.id, 'post');
      toast.success(isFav ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi!');
    } catch (error) {
      toast.error('Giriş yapmanız gerekiyor');
    }
  };

  // Check if post is sponsored
  const isSponsored = post?.sponsor_data?.is_sponsored ?? false;
  const sponsorData = post?.sponsor_data;
  const isFav = post ? isFavorite(post.id, 'post') : false;

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
                            href={`/kesfet?kategori=${getCategorySlug(post)}`} 
                            className="hover:text-orange-500"
                          >
                            {getCategoryName(post)}
                          </Link>
                        </li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li className="font-semibold text-orange-500 truncate max-w-[150px] md:max-w-xs" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    </ol>
                </nav>

                {/* Title & Meta */}
                <Link 
                  href={`/kesfet?kategori=${getCategorySlug(post)}`}
                  className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 hover:bg-blue-100 transition-colors"
                >
                  {getCategoryName(post)}
                </Link>
                <h1 
                    className="font-display font-bold text-3xl md:text-5xl text-slate-800 mb-6 leading-tight font-sans"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                
                {/* Sponsored or Normal Meta */}
                {isSponsored && sponsorData ? (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                    {/* Sponsor Badge */}
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                      Sponsorlu İçerik
                    </span>
                    {/* Sponsor Logo & Name */}
                    {sponsorData.sponsor_logo && (
                      <div className="flex items-center gap-2">
                        <img 
                          src={sponsorData.sponsor_logo} 
                          alt={sponsorData.sponsor_name} 
                          className="h-6 object-contain"
                        />
                        <span className="text-gray-500">{sponsorData.sponsor_name} katkılarıyla</span>
                      </div>
                    )}
                    {/* Reading Time - Show in sponsored posts too */}
                    <div className="flex items-center gap-2 text-gray-500">
                      <i className="fa-regular fa-clock"></i> {calculateReadTime(post.content.rendered)}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                          <img src={getAuthorImage(post)} className="w-8 h-8 rounded-full border border-gray-200" alt={getAuthorName(post)} />
                          <span>Yazar: <Link 
                            href={`/yazar/${getAuthorSlug(post)}`}
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
                    <button onClick={shareTwitter} className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-blue-400 hover:border-blue-400 flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-brands fa-twitter"></i>
                    </button>
                    <button onClick={shareWhatsapp} className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-500 flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-brands fa-whatsapp text-lg"></i>
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

                    {/* Content Body - WordPress Content Render */}
                    <div 
                        className="prose prose-lg prose-slate max-w-none text-gray-700 leading-relaxed font-sans
                        prose-headings:font-sans prose-headings:text-slate-800 prose-headings:font-bold
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                        prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2
                        prose-p:mb-6 prose-p:text-gray-600
                        prose-a:text-orange-500 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
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
                        [&_.wp-block-separator]:my-10 [&_.wp-block-separator]:border-gray-200"
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                    />

                    {/* Sponsor CTA */}
                    {isSponsored && sponsorData?.sponsor_url && (
                      <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                        <div className="flex items-center gap-4">
                          {sponsorData.sponsor_logo && (
                            <img 
                              src={sponsorData.sponsor_logo} 
                              alt={sponsorData.sponsor_name}
                              className="h-10 object-contain"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-2">
                              Bu içerik <strong>{sponsorData.sponsor_name}</strong> tarafından desteklenmektedir.
                            </p>
                            <a 
                              href={sponsorData.sponsor_url}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-600 transition-colors"
                            >
                              Daha Fazla Bilgi <i className="fa-solid fa-external-link"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags & Share (Mobile) */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        {/* Etiketler (Tags) varsa göster */}
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
                        
                        {/* Author Box */}
                        <div className="bg-orange-50/50 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left border border-orange-100 mt-8">
                            <img src={getAuthorImage(post)} className="w-20 h-20 rounded-full border-4 border-white shadow-sm" alt={getAuthorName(post)} />
                            <div className="flex-1">
                                <Link 
                                  href={`/yazar/${getAuthorSlug(post)}`}
                                  className="font-bold text-slate-800 text-lg mb-1 hover:text-orange-500 transition-colors block"
                                >
                                  {getAuthorName(post)}
                                </Link>
                                <p className="text-sm text-gray-600 mb-3">Çocuk Sağlığı ve Gelişimi üzerine içerikler üretiyor.</p>
                                <Link 
                                  href={`/yazar/${getAuthorSlug(post)}`} 
                                  className="text-orange-500 font-bold text-sm hover:underline"
                                >
                                  Tüm Yazıları
                                </Link>
                            </div>
                        </div>
                    </div>

                </article>

                {/* RIGHT: SIDEBAR (Sticky) */}
                <aside className="hidden lg:block w-80 flex-shrink-0">
                    <div className="sticky top-24 space-y-8">
                        
                        {/* Table of Contents (Dynamic) */}
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

                        {/* Faydalı Araçlar Widget */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center text-sm uppercase tracking-wider">
                            <i className="fa-solid fa-wand-magic-sparkles text-orange-500 mr-2"></i> 
                            Faydalı Araçlar
                          </h3>
                          <div className="space-y-2">
                            {[
                              { name: 'BLW Hazırlık Testi', slug: 'blw-testi', icon: 'fa-baby', color: 'text-pink-500', bg: 'bg-pink-50' },
                              { name: 'Persentil Hesaplayıcı', slug: 'persentil', icon: 'fa-chart-line', color: 'text-blue-500', bg: 'bg-blue-50' },
                              { name: 'Su İhtiyacı', slug: 'su-ihtiyaci', icon: 'fa-droplet', color: 'text-cyan-500', bg: 'bg-cyan-50' },
                              { name: 'Bu Gıda Verilir mi?', slug: 'bu-gida-verilir-mi', icon: 'fa-circle-question', color: 'text-amber-500', bg: 'bg-amber-50' },
                            ].map((tool) => (
                              <Link
                                key={tool.slug}
                                href={`/akilli-asistan/${tool.slug}`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                              >
                                <div className={`w-10 h-10 ${tool.bg} rounded-xl flex items-center justify-center`}>
                                  <i className={`fa-solid ${tool.icon} ${tool.color}`}></i>
                                </div>
                                <span className="font-medium text-slate-700 group-hover:text-orange-500 transition-colors text-sm">
                                  {tool.name}
                                </span>
                                <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs"></i>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Newsletter Widget */}
                        <div className="bg-green-50/50 p-6 rounded-[2rem] border border-green-100 text-center">
                            <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-xl">
                                <i className="fa-regular fa-envelope"></i>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2 font-sans">Haftalık Menü Cebine Gelsin</h3>
                            <p className="text-xs text-gray-600 mb-4">Bebeğinin ayına uygun tarifler ve ipuçları her hafta e-postanda.</p>
                            <input type="email" placeholder="E-posta adresin" className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm mb-2 outline-none focus:border-green-500" />
                            <button className="w-full bg-green-600 text-white font-bold py-2 rounded-xl text-sm hover:bg-green-700 transition-colors">Abone Ol</button>
                        </div>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                          <div>
                            <h3 className="font-bold text-slate-800 mb-4 font-sans flex items-center">
                              <i className="fa-solid fa-newspaper text-orange-500 mr-2"></i>İlginizi Çekebilir
                            </h3>
                            <div className="space-y-4">
                              {relatedPosts.map((relatedPost) => (
                                <Link 
                                  key={relatedPost.id} 
                                  href={`/kesfet/${relatedPost.slug}`} 
                                  className="flex gap-4 group"
                                >
                                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img 
                                      src={relatedPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/100x100'} 
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                      alt={stripHtml(relatedPost.title.rendered)} 
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 
                                      className="font-bold text-slate-800 text-sm group-hover:text-orange-500 transition-colors line-clamp-2"
                                      dangerouslySetInnerHTML={{ __html: relatedPost.title.rendered }}
                                    />
                                    <span className="text-xs text-gray-400">
                                      {relatedPost._embedded?.['wp:term']?.[0]?.[0]?.name || 'Genel'}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Random Recipes Widget */}
                        {randomRecipes.length > 0 && (
                          <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100">
                            <h3 className="font-bold text-slate-800 mb-4 font-sans flex items-center text-sm">
                              <i className="fa-solid fa-utensils text-orange-500 mr-2"></i>Önerilen Tarifler
                            </h3>
                            <div className="space-y-3">
                              {randomRecipes.slice(0, 3).map((recipe) => (
                                <Link 
                                  key={recipe.id} 
                                  href={`/tarifler/${recipe.slug}`}
                                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors group"
                                >
                                  <img 
                                    src={recipe.image || 'https://placehold.co/60x60'} 
                                    className="w-12 h-12 rounded-lg object-cover"
                                    alt={recipe.title}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-800 text-sm group-hover:text-orange-500 transition-colors line-clamp-1">
                                      {recipe.title}
                                    </h4>
                                    <span className="text-xs text-gray-400">{recipe.prep_time}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <Link 
                              href="/tarifler" 
                              className="block text-center text-orange-500 font-bold text-sm mt-4 hover:underline"
                            >
                              Tüm Tarifler →
                            </Link>
                          </div>
                        )}

                    </div>
                </aside>

            </div>
        </div>

    </div>
  );
}