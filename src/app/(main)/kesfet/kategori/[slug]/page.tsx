"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { use } from 'react'; // Next.js 15+ için gerekli
import { blogService, BlogPost } from '@/services/blog-service';
import BlogCard from '@/components/features/BlogCard';
import { AdZone } from '@/components/ads';
import NewsletterForm from '@/components/common/NewsletterForm';
import { userService } from '@/services/user-service';
import { ExpertPublicProfile } from '@/lib/types';

// Tüm 16 araçlık havuz - Standart İkonlar
const ALL_TOOLS = [
  { name: 'Sunum Önerileri', path: '/beslenme-rehberi/sunum-onerileri', icon: 'fa-solid fa-plate-wheat', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: 'Ek Gıda Rehberi', path: '/akilli-asistan/ek-gida-rehberi', icon: 'fa-solid fa-carrot', color: 'text-green-500', bg: 'bg-green-50' },
  { name: 'Ek Gıdaya Başlama', path: '/akilli-asistan/ek-gidaya-baslama', icon: 'fa-solid fa-utensils', color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Bu Gıda Verilir mi?', path: '/akilli-asistan/bu-gida-verilir-mi', icon: 'fa-solid fa-magnifying-glass', color: 'text-amber-500', bg: 'bg-amber-50' },
  { name: 'Besin Deneme Takvimi', path: '/akilli-asistan/besin-takvimi', icon: 'fa-solid fa-seedling', color: 'text-lime-500', bg: 'bg-lime-50' },
  { name: 'BLW Hazırlık Testi', path: '/akilli-asistan/blw-testi', icon: 'fa-solid fa-baby', color: 'text-pink-500', bg: 'bg-pink-50' },
  { name: 'Persentil Hesaplayıcı', path: '/akilli-asistan/persentil', icon: 'fa-solid fa-chart-line', color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Su İhtiyacı', path: '/akilli-asistan/su-ihtiyaci', icon: 'fa-solid fa-glass-water', color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { name: 'Alerjen Planlayıcı', path: '/akilli-asistan/alerjen-planlayici', icon: 'fa-solid fa-shield-heart', color: 'text-red-500', bg: 'bg-red-50' },
  { name: 'Banyo Planlayıcı', path: '/akilli-asistan/banyo-planlayici', icon: 'fa-solid fa-bath', color: 'text-blue-400', bg: 'bg-blue-50' },
  { name: 'Günlük Hijyen', path: '/akilli-asistan/hijyen-hesaplayici', icon: 'fa-solid fa-hand-sparkles', color: 'text-teal-500', bg: 'bg-teal-50' },
  { name: 'Akıllı Bez', path: '/akilli-asistan/bez-hesaplayici', icon: 'fa-solid fa-baby-carriage', color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Hava Kalitesi', path: '/akilli-asistan/hava-kalitesi', icon: 'fa-solid fa-wind', color: 'text-sky-500', bg: 'bg-sky-50' },
  { name: 'Leke Ansiklopedisi', path: '/akilli-asistan/leke-rehberi', icon: 'fa-solid fa-tshirt', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { name: '3 Gün Kuralı', path: '/beslenme-rehberi/3-gun-kurali', icon: 'fa-solid fa-clock-rotate-left', color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Aşı Takvimi', path: '/dashboard/saglik/asilar', icon: 'fa-solid fa-syringe', color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

// Kategori İkonları Eşleştirmesi (Slug -> Icon Class)
const categoryIcons: { [key: string]: string } = {
  'anne': 'fa-solid fa-heart',
  'hamilelik': 'fa-solid fa-person-pregnant',
  'bebek': 'fa-solid fa-baby',
  'cocuk': 'fa-solid fa-child-reaching',
  'saglik': 'fa-solid fa-heart-pulse',
  'aile': 'fa-solid fa-people-roof',
  'psikoloji': 'fa-solid fa-person-breastfeeding',
  'seyahat': 'fa-solid fa-plane',
  'oyun': 'fa-solid fa-gamepad',
  // Fallback icon
  'default': 'fa-solid fa-folder-open'
};

export default function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [categoryInfo, setCategoryInfo] = useState<{ id: number, name: string, slug: string, description?: string } | null>(null);
  
  // Random tool state (Hydration safe)
  const [randomTool, setRandomTool] = useState<typeof ALL_TOOLS[0] | null>(null);
  
  // Random expert selection
  const [randomExpert, setRandomExpert] = useState<ExpertPublicProfile | null>(null);

  useEffect(() => {
    // Sayfa yüklendiğinde rastgele bir araç seç
    const randomIndex = Math.floor(Math.random() * ALL_TOOLS.length);
    setRandomTool(ALL_TOOLS[randomIndex]);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Kategorileri çek
        const allCategories = await blogService.getCategories();
        const currentCategory = allCategories.find((c: any) => c.slug === slug);

        if (!currentCategory) {
          setError(true);
          setLoading(false);
          return;
        }

        setCategoryInfo({
          id: currentCategory.id,
          name: currentCategory.name,
          slug: currentCategory.slug,
          description: currentCategory.description || "Bu kategorideki en güncel rehberler ve ipuçları."
        });

        // 2. Yazıları çek
        const categoryPosts = await blogService.getAll(1, 10, currentCategory.id);
        setPosts(categoryPosts.posts);
        setTotalPages(categoryPosts.totalPages);
        
        // 3. Uzman çek
        const experts = await userService.getExperts();
        if (experts && experts.length > 0) {
          const randomIndex = Math.floor(Math.random() * experts.length);
          setRandomExpert(experts[randomIndex]);
        }

      } catch (err) {
        console.error("Kategori verileri çekilemedi:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  const handleLoadMore = async () => {
    if (!categoryInfo || loadingMore || page >= totalPages) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
        const response = await blogService.getAll(nextPage, 10, categoryInfo.id);
        setPosts(prevPosts => [...prevPosts, ...response.posts]);
        setPage(nextPage);
    } catch (error) {
        console.error("Daha fazla yazı yüklenirken hata:", error);
    } finally {
        setLoadingMore(false);
    }
  };

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const otherPosts = posts.length > 1 ? posts.slice(1) : [];

  // Helper to get icon based on category slug
  const getCategoryIcon = (catSlug: string) => {
    return categoryIcons[catSlug] || categoryIcons['default'];
  };

  if (loading) {
      return (
          <div className="flex justify-center items-center h-screen bg-gray-50">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          </div>
      );
  }

  if (error || !categoryInfo) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">Kategori Bulunamadı</h1>
              <p className="text-gray-600 mb-8">Aradığınız kategori mevcut değil veya yanlış bir adrese geldiniz.</p>
              <Link href="/kesfet" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                  Blog Ana Sayfasına Dön
              </Link>
          </div>
      );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

        {/* CATEGORY HERO SECTION */}
        <div className="bg-green-50 pb-12 pt-8 border-b border-green-100 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100/50 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    <div className="max-w-2xl text-center md:text-left">
                        <nav className="flex justify-center md:justify-start text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-2">
                                <li><Link href="/" className="hover:text-green-600"><i className="fa-solid fa-house"></i></Link></li>
                                <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                                <li><Link href="/kesfet" className="hover:text-green-600">Keşfet</Link></li>
                                <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                                <li className="font-bold text-green-600">{categoryInfo.name}</li>
                            </ol>
                        </nav>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                            {/* Kategori İkonu - Dinamik */}
                            <div className="w-14 h-14 bg-white text-green-600 rounded-2xl flex items-center justify-center shadow-sm text-2xl rotate-3">
                                <i className={getCategoryIcon(categoryInfo.slug)}></i>
                            </div>
                            <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-800 font-sans">{categoryInfo.name}</h1>
                        </div>
                        
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {categoryInfo.description}
                        </p>
                    </div>

                    {/* Category Specific Tool Promo (Dynamic Random Tool) */}
                    {randomTool && (
                        <Link href={randomTool.path} className="hidden md:block w-80 bg-white p-5 rounded-3xl shadow-lg border border-green-100 transform rotate-2 hover:rotate-0 transition-transform duration-300 cursor-pointer group">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 ${randomTool.bg} ${randomTool.color} rounded-full flex items-center justify-center`}>
                                    <i className={randomTool.icon}></i>
                                </div>
                                <i className="fa-solid fa-arrow-right text-gray-300 group-hover:text-orange-500 transition-colors"></i>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">{randomTool.name}</h3>
                            <p className="text-sm text-gray-500">Bebeğinizin sağlığı ve gelişimi için kişiselleştirilmiş öneriler ve hesaplamalar.</p>
                        </Link>
                    )}

                </div>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* FEATURED IN CATEGORY (First Post) */}
            {featuredPost && (
                <div className="mb-12">
                    <BlogCard 
                        post={featuredPost} 
                        variant="hero"
                    />
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* LEFT: BLOG POSTS (3 Columns Grid) */}
                <div className="flex-1">
                    
                    {otherPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherPosts.map((post) => (
                                <BlogCard 
                                    key={post.id}
                                    post={post}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Bu kategoride başka yazı bulunmuyor.
                        </div>
                    )}

                    {/* Load More */}
                    {page < totalPages && (
                        <div className="mt-12 text-center">
                            <button 
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="bg-white border-2 border-gray-100 text-gray-600 hover:border-green-600 hover:text-green-600 font-bold py-3 px-8 rounded-full transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingMore ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                        Yükleniyor...
                                    </span>
                                ) : (
                                    'Daha Fazla Göster'
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT: SIDEBAR (Category Specific) */}
                <aside className="hidden lg:block space-y-8 sticky top-24 w-[300px]">
                    
                    {/* Sidebar - Top */}
                    <AdZone placement="sidebar-top" />

                    {/* Expert Widget */}
                    {randomExpert ? (
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                            <div className="mb-4 relative inline-block">
                                <img 
                                    src={randomExpert.avatar_url || 'https://placehold.co/100x100/AED581/ffffff?text=Uzman'} 
                                    className="w-20 h-20 rounded-full border-4 border-green-50 object-cover" 
                                    alt={randomExpert.display_name} 
                                />
                                <div className="absolute bottom-0 right-0 bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs border border-white">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800">{randomExpert.display_name}</h3>
                            <p className="text-xs text-green-600 font-bold mb-2">
                                {randomExpert.expertise && randomExpert.expertise.length > 0 
                                    ? randomExpert.expertise[0] 
                                    : 'KidsGourmet Uzmanı'}
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                {randomExpert.biography 
                                    ? (randomExpert.biography.length > 100 
                                        ? randomExpert.biography.substring(0, 100) + '...' 
                                        : randomExpert.biography)
                                    : 'Alanında uzman, deneyimli ve güvenilir içerik üreticisi.'}
                            </p>
                            <Link 
                                href={`/uzman/${randomExpert.username}`}
                                className="block w-full border border-gray-200 text-gray-600 text-xs font-bold py-2 rounded-xl hover:border-green-600 hover:text-green-600 transition-colors"
                            >
                                Tüm Yazıları
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                            <div className="mb-4 relative inline-block">
                                <img src="https://placehold.co/100x100/AED581/ffffff?text=Uzman" className="w-20 h-20 rounded-full border-4 border-green-50" alt="Uzman" />
                                <div className="absolute bottom-0 right-0 bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs border border-white">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800">KidsGourmet Uzmanı</h3>
                            <p className="text-xs text-green-600 font-bold mb-2">Çocuk Beslenme Uzmanı</p>
                            <p className="text-xs text-gray-500 mb-4">Alanında uzman, deneyimli ve güvenilir içerik üreticisi.</p>
                        </div>
                    )}

                    {/* Sidebar - Middle (Yazar bloğunun altında) */}
                    <AdZone placement="sidebar-middle" />

                    {/* Newsletter Widget */}
                    <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 text-center">
                        <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-xl">
                            <i className="fa-regular fa-envelope"></i>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2 font-sans">{categoryInfo.name} Bülteni</h3>
                        <p className="text-xs text-gray-600 mb-4">Bebeğinizin ayına özel beslenme ipuçları, yeni tarifler ve doktor önerileri güncel olarak mail kutunuzda!</p>
                        <NewsletterForm 
                            source="category"
                            variant="default"
                            placeholder="Mail Adresiniz"
                            buttonText="Abone Ol"
                            className=""
                        />
                    </div>

                    {/* Sidebar - Bottom (Newsletter altında) */}
                    <AdZone placement="sidebar-bottom" />

                </aside>

            </div>

        </div>

    </div>
  );
}