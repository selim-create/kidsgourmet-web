"use client";

import React, { useState, useEffect } from 'react';
import { blogService, BlogPost } from '@/services/blog-service';
import BlogCard from '@/components/features/BlogCard';
import { AdZone } from '@/components/ads';
import { useAds } from '@/contexts/AdContext';
import { useDeviceType } from '@/hooks/useDeviceType';

export default function BlogListClient() {
  const [activeCategory, setActiveCategory] = useState<number | "Tümü">("Tümü");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { hasSlotForPlacement } = useAds();
  const deviceType = useDeviceType();
  
  // Reklam kontrolü - desktop için sidebar-middle, mobile için content-in-feed
  const hasDesktopAd = hasSlotForPlacement('sidebar-middle');
  const hasMobileAd = hasSlotForPlacement('content-in-feed');
  const hasAnyAd = deviceType === 'mobile' ? hasMobileAd : hasDesktopAd;
  
  // Reklam varsa grid'de 8, yoksa 9 gösterilecek
  const getPostsPerPage = (page: number) => {
    if (page === 1) {
      // Hero (1) + Grid (8 veya 9) = 9 veya 10
      return hasAnyAd ? 9 : 10;
    }
    // Diğer sayfalar: 8 veya 9
    return hasAnyAd ? 8 : 9;
  };

  // Verileri çek
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Kategorileri çek (sadece ilk yüklemede)
        if (categories.length === 0) {
          const cats = await blogService.getCategories();
          setCategories(cats);
        }

        // Yazıları çek - Dinamik limit ile
        const response = await blogService.getAll(
          currentPage, 
          getPostsPerPage(currentPage), 
          activeCategory !== "Tümü" ? activeCategory : undefined
        );
        
        setPosts(response.posts);
        setTotalPages(response.totalPages);

        // Öne çıkan yazı (ilk yazı, sadece "Tümü" sekmesinde ve ilk sayfada)
        if (activeCategory === "Tümü" && currentPage === 1 && response.posts.length > 0) {
          setFeaturedPost(response.posts[0]);
        } else {
          setFeaturedPost(null);
        }

      } catch (error) {
        console.error("Blog verileri çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeCategory, currentPage, hasAnyAd]);

  // Kategori değiştiğinde sayfayı sıfırla ve scroll to top
  const handleCategoryChange = (category: number | "Tümü") => {
    setActiveCategory(category);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sayfa değiştiğinde scroll to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HEADER SECTION */}
      <div className="bg-white pb-12 pt-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-green-600 font-bold text-sm tracking-widest uppercase mb-2 block font-sans">Ebeveyn Kütüphanesi</span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-800 mb-4 font-sans">Bilgili Ebeveynler <br /> <span className="text-orange-500">Mutlu Çocuklar</span></h1>
            <p className="text-gray-600 text-lg">
              Uzmanlardan bilgiler, güncel rehberler, beslenme ipuçları ve gelişim notları.
            </p>
          </div>

          {/* Categories (Horizontal Scroll) */}
          <div className="overflow-x-auto hide-scroll scrollbar-hide pb-2 -mx-4 px-4 scroll-pl-4">
            <div className="flex gap-3 justify-start min-w-max">
              <button 
                onClick={() => handleCategoryChange("Tümü")}
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
                  onClick={() => handleCategoryChange(cat.id)}
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
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* FEATURED POST (Hero Card) - Only show on "All" tab and first page */}
            {activeCategory === "Tümü" && currentPage === 1 && featuredPost && (
              <div className="mb-16">
                <BlogCard 
                  post={featuredPost} 
                  categories={categories}
                  variant="hero"
                />
              </div>
            )}

            {/* BLOG GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(() => {
                // Featured post'u filtrele (sadece "Tümü" sekmesinde ve ilk sayfada)
                const filteredPosts = posts.filter(post => {
                  const shouldSkip = activeCategory === "Tümü" && currentPage === 1 && post.id === featuredPost?.id;
                  return !shouldSkip;
                });
                
                // Reklam pozisyonu: 6. kart yerine (index 5)
                const adPosition = 5;
                let displayIndex = 0;
                
                return filteredPosts.map((post, index) => {
                  const currentDisplayIndex = displayIndex;
                  displayIndex++;
                  
                  // Reklam 6. pozisyonda (index 5) gösterilecek
                  const showAdBefore = hasAnyAd && currentDisplayIndex === adPosition;
                  
                  return (
                    <React.Fragment key={post.id}>
                      {/* Reklam kartı - 6. pozisyonda - Minik Gurmeler tarzı */}
                      {showAdBefore && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                          {/* Ad Area */}
                          <div className="relative bg-gradient-to-br from-slate-50 to-gray-100 p-4 flex items-center justify-center flex-1 min-h-[280px]">
                            {/* Desktop: sidebar-middle (300x600) */}
                            <div className="hidden lg:block">
                              <AdZone placement="sidebar-middle" instanceId={`kesfet-grid-${currentPage}`} />
                            </div>
                            {/* Mobile/Tablet: content-in-feed (300x250) */}
                            <div className="lg:hidden">
                              <AdZone placement="content-in-feed" instanceId={`kesfet-grid-${currentPage}`} />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <BlogCard 
                        post={post}
                        categories={categories}
                      />
                    </React.Fragment>
                  );
                });
              })()}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Bu kategoride henüz yazı bulunmuyor.
              </div>
            )}

            {/* Pagination */}
            {!loading && posts.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500 transition-colors"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                
                {/* Sayfa numaraları - max 5 görünür */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages || pageNum < 1) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === pageNum 
                          ? 'bg-orange-500 text-white' 
                          : 'border border-gray-200 hover:border-orange-500 hover:text-orange-500'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500 transition-colors"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}