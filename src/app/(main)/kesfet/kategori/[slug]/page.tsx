"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { use } from 'react'; // Next.js 15+ için gerekli
import { blogService, BlogPost } from '@/services/blog-service';
import BlogCard from '@/components/features/BlogCard';
import NewsletterForm from '@/components/common/NewsletterForm';
import { userService } from '@/services/user-service';
import { ExpertPublicProfile } from '@/lib/types';

// Smart Assistant Tools list
const SMART_TOOLS = [
  { name: 'Sunum Önerileri', path: '/beslenme-rehberi/sunum-onerileri', icon: 'fa-plate-utensils' },
  { name: 'Ek Gıda Rehberi', path: '/akilli-asistan/ek-gida-rehberi', icon: 'fa-book-sparkles' },
  { name: 'Ek Gıdaya Başlama Kontrolü', path: '/akilli-asistan/ek-gidaya-baslama', icon: 'fa-list-check' },
  { name: 'Bu Gıda Verilir mi?', path: '/akilli-asistan/bu-gida-verilir-mi', icon: 'fa-circle-question' },
  { name: 'Besin Deneme Takvimi', path: '/akilli-asistan/besin-takvimi', icon: 'fa-calendar-days' },
  { name: 'BLW Hazırlık Testi', path: '/akilli-asistan/blw-testi', icon: 'fa-clipboard-check' },
  { name: 'Persentil Hesaplayıcı', path: '/akilli-asistan/persentil', icon: 'fa-chart-line' },
  { name: 'Su İhtiyacı Hesaplayıcı', path: '/akilli-asistan/su-ihtiyaci', icon: 'fa-droplet' },
  { name: 'Alerjen Deneme Planlayıcı', path: '/akilli-asistan/alerjen-planlayici', icon: 'fa-shield-virus' },
  { name: 'Banyo Rutini Planlayıcı', path: '/akilli-asistan/banyo-planlayici', icon: 'fa-bath' },
  { name: 'Günlük Hijyen Hesaplayıcı', path: '/akilli-asistan/gunluk-hijyen', icon: 'fa-hand-sparkles' },
  { name: 'Akıllı Bez Hesaplayıcı', path: '/akilli-asistan/bez-hesaplayici', icon: 'fa-baby' },
  { name: 'Hava Kalitesi Rehberi', path: '/akilli-asistan/hava-kalitesi', icon: 'fa-wind' },
  { name: 'Leke Ansiklopedisi', path: '/akilli-asistan/leke-rehberi', icon: 'fa-spray-can-sparkles' },
  { name: '3 Gün Kuralı', path: '/beslenme-rehberi/3-gun-kurali', icon: 'fa-clock-rotate-left' },
];

export default function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Kategori bilgilerini (ID, isim vb.) tutmak için state
  // Gerçek uygulamada, slug'dan kategori ID'sini bulmak için ayrı bir servis çağrısı gerekebilir
  // veya tüm kategorileri çekip slug ile eşleştirebiliriz.
  const [categoryInfo, setCategoryInfo] = useState<{ id: number, name: string, description?: string } | null>(null);
  
  // Random tool selection
  const [randomTool] = useState(() => {
    return SMART_TOOLS[Math.floor(Math.random() * SMART_TOOLS.length)];
  });
  
  // Random expert selection
  const [randomExpert, setRandomExpert] = useState<ExpertPublicProfile | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Önce kategorileri çekip slug'a uygun olanı bulalım
        const allCategories = await blogService.getCategories();
        const currentCategory = allCategories.find((c: any) => c.slug === slug);

        if (!currentCategory) {
          setError(true); // Kategori bulunamadı
          setLoading(false);
          return;
        }

        setCategoryInfo({
          id: currentCategory.id,
          name: currentCategory.name,
          description: currentCategory.description || "Bu kategorideki en güncel rehberler ve ipuçları."
        });

        // 2. Bulunan kategori ID'sine göre yazıları çekelim
        const categoryPosts = await blogService.getAll(1, 10, currentCategory.id);
        setPosts(categoryPosts.posts);
        
        // 3. Uzmanları çek ve rastgele birini seç
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

  // Yardımcı fonksiyonlar (Blog listesindeki gibi)
  const getImageUrl = (post: BlogPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/600x450/E3F2FD/81D4FA?text=Gorsel+Yok';
  };

  const getAuthorName = (post: BlogPost) => {
    return post._embedded?.author?.[0]?.name || 'KidsGourmet Editörü';
  };
  
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  // Featured Post (Kategorideki ilk yazı)
  const featuredPost = posts.length > 0 ? posts[0] : null;
  // Diğer yazılar (Featured hariç)
  const otherPosts = posts.length > 1 ? posts.slice(1) : [];


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
              {/* Localde Link kullanın */}
              <Link href="/blog" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
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
                                {/* Localde Link kullanın */}
                                <li><Link href="/" className="hover:text-green-600"><i className="fa-solid fa-house"></i></Link></li>
                                <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                                <li><Link href="/kesfet" className="hover:text-green-600">Keşfet</Link></li>
                                <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                                <li className="font-bold text-green-600">{categoryInfo.name}</li>
                            </ol>
                        </nav>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                            <div className="w-14 h-14 bg-white text-green-600 rounded-2xl flex items-center justify-center shadow-sm text-2xl rotate-3">
                                <i className="fa-solid fa-folder-open"></i>
                            </div>
                            <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-800 font-sans">{categoryInfo.name}</h1>
                        </div>
                        
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {categoryInfo.description}
                        </p>
                    </div>

                    {/* Category Specific Tool Promo (Dynamic Random Tool) */}
                    <Link href={randomTool.path} className="hidden md:block w-80 bg-white p-5 rounded-3xl shadow-lg border border-green-100 transform rotate-2 hover:rotate-0 transition-transform duration-300 cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
                                <i className={`fa-solid ${randomTool.icon}`}></i>
                            </div>
                            <i className="fa-solid fa-arrow-right text-gray-300 group-hover:text-orange-500 transition-colors"></i>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">{randomTool.name}</h3>
                        <p className="text-sm text-gray-500">Bebeğinizin sağlığı ve gelişimi için kişiselleştirilmiş öneriler ve hesaplamalar.</p>
                    </Link>

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

                    {/* Load More (Şimdilik statik) */}
                    {otherPosts.length >= 9 && (
                        <div className="mt-12 text-center">
                            <button className="bg-white border-2 border-gray-100 text-gray-600 hover:border-green-600 hover:text-green-600 font-bold py-3 px-8 rounded-full transition-all shadow-sm">
                                Daha Fazla Göster
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT: SIDEBAR (Category Specific) */}
                <aside className="hidden lg:block space-y-8 sticky top-24" style={{ width: '300px' }}>
                    
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

                </aside>

            </div>

        </div>

        {/* NEWSLETTER BANNER */}
        <div className="bg-green-50/50 border-y border-green-100 py-16 mt-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="w-16 h-16 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-2xl">
                    <i className="fa-regular fa-envelope"></i>
                </div>
                <h2 className="font-display font-bold text-3xl text-slate-800 mb-4 font-sans">Haftalık {categoryInfo?.name} Bülteni</h2>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                    Bebeğinizin ayına özel beslenme ipuçları, yeni tarifler ve doktor önerileri her hafta e-posta kutunuzda.
                </p>
                <NewsletterForm 
                    source="category"
                    variant="inline"
                    placeholder="E-posta adresiniz"
                    buttonText="Abone Ol"
                    className="max-w-lg mx-auto"
                />
                <p className="text-xs text-gray-400 mt-4">Asla spam yapmayız. İstediğiniz zaman ayrılabilirsiniz.</p>
            </div>
        </div>

    </div>
  );
}