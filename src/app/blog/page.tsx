"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { blogService, BlogPost } from '@/services/blog-service';

export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState<number | "Tümü">("Tümü");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  // Verileri çek
  useEffect(() => {
    async function fetchData() {
      try {
        // Kategorileri çek
        const cats = await blogService.getCategories();
        setCategories(cats);

        // Yazıları çek
        const allPosts = await blogService.getAll(1, 10, activeCategory !== "Tümü" ? activeCategory : undefined);
        setPosts(allPosts);

        // Öne çıkan yazı (ilk yazı)
        if (activeCategory === "Tümü" && allPosts.length > 0) {
            setFeaturedPost(allPosts[0]);
        }

      } catch (error) {
        console.error("Blog verileri çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeCategory]);

  // Yardımcı fonksiyon: HTML etiketlerini temizle
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  // Yardımcı fonksiyon: Görsel URL'ini al
  const getImageUrl = (post: BlogPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/600x400/E3F2FD/81D4FA?text=No+Image';
  };

  // Yardımcı fonksiyon: Yazar adını al
  const getAuthorName = (post: BlogPost) => {
    return post._embedded?.author?.[0]?.name || 'KidsGourmet Editörü';
  };
  
   // Yardımcı fonksiyon: Kategori adını al
   const getCategoryName = (post: BlogPost) => {
      const catId = post._embedded?.['wp:term']?.[0]?.[0]?.id;
      const cat = categories.find(c => c.id === catId);
      return cat ? cat.name : 'Genel';
   };


  return (
    <div className="bg-gray-50 min-h-screen">

        {/* HEADER SECTION */}
        <div className="bg-white pb-12 pt-12 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <span className="text-green-600 font-bold text-sm tracking-widest uppercase mb-2 block font-sans">Ebeveyn Kütüphanesi</span>
                    <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-800 mb-4 font-sans">Bilgili Ebeveynler, <br /> <span className="text-orange-500">Mutlu Çocuklar.</span></h1>
                    <p className="text-gray-600 text-lg">
                        Uzman doktor ve diyetisyenlerimiz tarafından hazırlanan güncel rehberler, beslenme ipuçları ve gelişim notları.
                    </p>
                </div>

                {/* Categories (Horizontal Scroll) */}
                <div className="flex justify-center gap-3 overflow-x-auto hide-scroll pb-2">
                    <button 
                        onClick={() => setActiveCategory("Tümü")}
                        className={`px-6 py-2 rounded-full font-medium text-sm shadow-sm whitespace-nowrap transition-all ${
                            activeCategory === "Tümü"
                            ? "bg-slate-800 text-white shadow-md transform scale-105 font-bold" 
                            : "bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                        }`}
                    >
                        Tümü
                    </button>
                    
                    {categories.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2 rounded-full font-medium text-sm shadow-sm whitespace-nowrap transition-all ${
                                activeCategory === cat.id 
                                ? "bg-slate-800 text-white shadow-md transform scale-105 font-bold" 
                                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <>
                    {/* FEATURED POST (Hero Card) - Only show on "All" tab */}
                    {activeCategory === "Tümü" && featuredPost && (
                        <div className="mb-16">
                            {/* Localde Link kullanın */}
                            <Link href={`/blog/${featuredPost.slug}`} className="group relative block rounded-[2.5rem] overflow-hidden shadow-xl aspect-[16/9] md:aspect-[21/9]">
                                <img src={getImageUrl(featuredPost)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={featuredPost.title.rendered} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-4xl">
                                    <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                                        Editörün Seçimi
                                    </span>
                                    <h2 
                                        className="font-display font-bold text-3xl md:text-5xl text-white mb-4 leading-tight group-hover:underline decoration-green-500 decoration-4 underline-offset-4 font-sans"
                                        dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }}
                                    />
                                    <p className="text-gray-200 text-lg mb-6 line-clamp-2 hidden md:block">
                                        {stripHtml(featuredPost.excerpt.rendered)}
                                    </p>
                                    <div className="flex items-center text-white/80 text-sm gap-6">
                                        <div className="flex items-center gap-2">
                                            {/* Yazar avatarı olmadığı için placeholder */}
                                            <img src="https://placehold.co/50x50/AED581/ffffff?text=Dr" className="w-8 h-8 rounded-full border border-white/50" alt="Author" />
                                            <span>{getAuthorName(featuredPost)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="fa-regular fa-calendar"></i> {new Date(featuredPost.date).toLocaleDateString('tr-TR')}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* BLOG GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                             // Featured post'u listede tekrar gösterme (sadece "Tümü" sekmesinde)
                            (activeCategory !== "Tümü" || post.id !== featuredPost?.id) && (
                                <article key={post.id} className="flex flex-col group h-full">
                                    {/* Localde Link kullanın */}
                                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-[2rem] mb-4 relative aspect-[4/3]">
                                        <img src={getImageUrl(post)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={post.title.rendered} />
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-500 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                            {getCategoryName(post)}
                                        </span>
                                    </Link>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                            <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span>{getAuthorName(post)}</span>
                                        </div>
                                        <h3 className="font-display font-bold text-xl text-slate-800 mb-3 leading-snug group-hover:text-orange-500 transition-colors font-sans">
                                            {/* Localde Link kullanın */}
                                            <Link href={`/blog/${post.slug}`} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                            {stripHtml(post.excerpt.rendered)}
                                        </p>
                                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                             <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-slate-700 hover:text-orange-500 transition-colors">
                                                Devamını Oku <i className="fa-solid fa-arrow-right ml-1"></i>
                                             </Link>
                                        </div>
                                    </div>
                                </article>
                            )
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Bu kategoride henüz yazı bulunmuyor.
                        </div>
                    )}
                </>
            )}

        </div>
    </div>
  );
}