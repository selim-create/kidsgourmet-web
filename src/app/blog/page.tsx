"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { blogService, BlogPost } from '@/services/blog-service';
import SponsoredPostCard from '@/components/features/SponsoredPostCard';

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
                            <SponsoredPostCard 
                                post={featuredPost} 
                                categories={categories}
                                variant="hero"
                            />
                        </div>
                    )}

                    {/* BLOG GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                             // Featured post'u listede tekrar gösterme (sadece "Tümü" sekmesinde)
                            (activeCategory !== "Tümü" || post.id !== featuredPost?.id) && (
                                <SponsoredPostCard 
                                    key={post.id}
                                    post={post}
                                    categories={categories}
                                />
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