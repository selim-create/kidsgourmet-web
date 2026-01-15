"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { blogService, BlogPost } from '@/services/blog-service';
import { notFound } from 'next/navigation';

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
            {/* Localde Link kullanın */}
            <Link href="/blog" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                Blog Listesine Dön
            </Link>
        </div>
    );
  }

  // Helper functions for data extraction
  const getImageUrl = (post: BlogPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/1200x600/E3F2FD/81D4FA?text=Gorsel+Yok';
  };

  const getAuthorName = (post: BlogPost) => {
    return post._embedded?.author?.[0]?.name || 'KidsGourmet Editörü';
  };
  
  const getAuthorImage = (post: BlogPost) => {
      return post._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://placehold.co/100x100/AED581/ffffff?text=Yazar';
  };

  const getCategoryName = (post: BlogPost) => {
      const cat = post._embedded?.['wp:term']?.[0]?.[0];
      return cat ? cat.name : 'Genel';
  };

  const calculateReadTime = (content: string) => {
      const words = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      return `${minutes} dk okuma`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">

        {/* HEADER / HERO SECTION */}
        <div className="bg-white border-b border-gray-100 pb-12 pt-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Breadcrumb */}
                <nav className="flex justify-center text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        {/* Localde Link kullanın */}
                        <li><Link href="/blog" className="hover:text-orange-500">Blog</Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li><span className="hover:text-orange-500 cursor-pointer">{getCategoryName(post)}</span></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li className="font-semibold text-orange-500 truncate max-w-[150px] md:max-w-xs" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    </ol>
                </nav>

                {/* Title & Meta */}
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    {getCategoryName(post)}
                </span>
                <h1 
                    className="font-display font-bold text-3xl md:text-5xl text-slate-800 mb-6 leading-tight font-sans"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <img src={getAuthorImage(post)} className="w-8 h-8 rounded-full border border-gray-200" alt={getAuthorName(post)} />
                        <span>Yazar: <strong className="text-slate-800">{getAuthorName(post)}</strong></span>
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
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            <div className="flex flex-col lg:flex-row gap-12">
                
                {/* LEFT: SHARE & SOCIAL (Desktop Sticky) */}
                <div className="hidden lg:flex flex-col gap-4 w-12 sticky top-32 h-fit">
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-brands fa-facebook-f"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-blue-400 hover:border-blue-400 flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-brands fa-twitter"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-500 flex items-center justify-center transition-all shadow-sm">
                        <i className="fa-brands fa-whatsapp text-lg"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500 flex items-center justify-center transition-all shadow-sm mt-4">
                        <i className="fa-regular fa-heart"></i>
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
                        className="prose prose-lg prose-slate max-w-none text-gray-600 leading-relaxed font-sans
                        prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-800 prose-h2:mt-8 prose-h2:mb-4 prose-h2:font-sans
                        prose-h3:text-xl prose-h3:font-bold prose-h3:text-slate-800 prose-h3:mt-6 prose-h3:mb-3 prose-h3:font-sans
                        prose-p:mb-6 prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:shadow-md prose-img:my-8"
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                    />

                    {/* Tags & Share (Mobile) */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        {/* Etiketler (Tags) varsa göster */}
                        {post._embedded?.['wp:term']?.[1] && post._embedded['wp:term'][1].length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post._embedded['wp:term'][1].map((tag: any) => (
                                    <Link key={tag.id} href={`/etiket/${tag.slug}`} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                        
                        {/* Author Box */}
                        <div className="bg-orange-50/50 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left border border-orange-100">
                            <img src={getAuthorImage(post)} className="w-20 h-20 rounded-full border-4 border-white shadow-sm" alt={getAuthorName(post)} />
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg mb-1">{getAuthorName(post)}</h3>
                                <p className="text-sm text-gray-600 mb-3">Çocuk Sağlığı ve Gelişimi üzerine içerikler üretiyor.</p>
                                <Link href="#" className="text-orange-500 font-bold text-sm hover:underline">Tüm Yazıları</Link>
                            </div>
                        </div>
                    </div>

                </article>

                {/* RIGHT: SIDEBAR (Sticky) */}
                <aside className="hidden lg:block w-80 flex-shrink-0">
                    <div className="sticky top-24 space-y-8">
                        
                        {/* Table of Contents (Could be dynamically generated from headings) */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">İçindekiler</h3>
                            <ul className="space-y-3 text-sm border-l-2 border-gray-100 ml-2">
                                <li><Link href="#" className="block pl-4 border-l-2 border-orange-500 -ml-[2px] text-orange-500 font-medium">Giriş</Link></li>
                                <li><Link href="#" className="block pl-4 text-gray-500 hover:text-slate-800 hover:border-gray-300 transition-all border-l-2 border-transparent -ml-[2px]">Konu Hakkında</Link></li>
                                <li><Link href="#" className="block pl-4 text-gray-500 hover:text-slate-800 hover:border-gray-300 transition-all border-l-2 border-transparent -ml-[2px]">Uzman Tavsiyeleri</Link></li>
                                <li><Link href="#" className="block pl-4 text-gray-500 hover:text-slate-800 hover:border-gray-300 transition-all border-l-2 border-transparent -ml-[2px]">Sonuç</Link></li>
                            </ul>
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

                        {/* Trending Posts */}
                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 font-sans">İlginizi Çekebilir</h3>
                            <div className="space-y-4">
                                {/* Localde Link kullanın */}
                                <Link href="#" className="flex gap-4 group">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                        {/* Placeholder Image */}
                                        <img src="https://placehold.co/100x100/FFCC80/ffffff?text=1" className="w-full h-full object-cover" alt="Trend 1" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-orange-500 transition-colors line-clamp-2">Ek Gıdaya Geçişte 3 Gün Kuralı</h4>
                                        <span className="text-xs text-gray-400">Ek Gıda</span>
                                    </div>
                                </Link>
                                <Link href="#" className="flex gap-4 group">
                                     <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img src="https://placehold.co/100x100/E1BEE7/ffffff?text=2" className="w-full h-full object-cover" alt="Trend 2" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-orange-500 transition-colors line-clamp-2">Diş Çıkaran Bebek Beslenmesi</h4>
                                        <span className="text-xs text-gray-400">Gelişim</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                </aside>

            </div>
        </div>

    </div>
  );
}