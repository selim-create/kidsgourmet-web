"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { recipeService } from '@/services/recipe-service';
import { blogService, BlogPost } from '@/services/blog-service';
import { featuredService, FeaturedItem } from '@/services/featured-service';
import { tariftenService } from '@/services/tariften-service';
import { rejimdeService, RejimdeContent } from '@/services/rejimde-service';
import { RecipeCard, TariftenRecipe } from '@/lib/types';
import { decodeEntities } from '@/utils/textHelpers';
import { useAgeGroups } from '@/hooks/useAgeGroups';
import { useUser } from '@/hooks/use-user';
import FeaturedSlider from '@/components/features/FeaturedSlider';
import BlogSection from '@/components/features/BlogSection';
import RecipeCardComponent from '@/components/ui/RecipeCard';

// --- HOME PAGE ---
export default function Home() {
  const router = useRouter();
  const { ageGroups } = useAgeGroups();
  const { isAuthenticated } = useUser();
  const [latestRecipes, setLatestRecipes] = useState<RecipeCard[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [tariftenRecipe, setTariftenRecipe] = useState<TariftenRecipe | null>(null);
  const [rejimdeContent, setRejimdeContent] = useState<RejimdeContent | null>(null);
  
  // Random tools state
  const [randomTools, setRandomTools] = useState<Array<{name: string; path: string; icon: string; color: string; description: string}>>([]);
  
  // Age dropdown state
  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);
  const [selectedAgeLabel, setSelectedAgeLabel] = useState('Tüm Aylar');

  // Prepare featured content for slider
  const [featuredContent, setFeaturedContent] = useState<Array<{
    id: number;
    type: 'recipe' | 'blog' | 'question' | 'sponsored' | 'ingredient' | 'tool';
    date: string;
    data: FeaturedItem;
  }>>([]);
  const [featuredIds, setFeaturedIds] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [featuredData, latest, posts, randomRecipe, randomRejimde] = await Promise.all([
          featuredService.getAll(5),
          recipeService.getAll({ perPage: 8 }),
          blogService.getAll(1, 12),
          tariftenService.getRandom(),
          rejimdeService.getRandom()
        ]);
        
        // Set Tariften recipe
        setTariftenRecipe(randomRecipe);
        
        // Set Rejimde content
        setRejimdeContent(randomRejimde);
        
        // Prepare featured content - map FeaturedItem to content types
        const featured = (featuredData || []).map((item: FeaturedItem) => {
          let type: 'recipe' | 'blog' | 'question' | 'sponsored' | 'ingredient';
          
          // API'den gelen tip doğrudan kullan, dönüştürme yapma
          switch(item.type) {
            case 'recipe':
              type = 'recipe';
              break;
            case 'post':
              type = 'blog';  // Normal post = blog/rehber
              break;
            case 'sponsor':
              type = 'sponsored';  // Sponsorlu = sponsored
              break;
            case 'question':
              type = 'question';
              break;
            case 'ingredient':
              type = 'ingredient';  // Malzeme = ingredient
              break;
            default:
              type = 'blog';
          }
          
          return {
            id: item.id,
            type,
            date: item.date,
            data: item
          };
        });
        
        // Add static tool card to featured content
        const currentDate = new Date().toISOString();
        const toolItem = {
          id: -1, // Negative ID to avoid conflicts with API data
          type: 'tool' as const,
          date: currentDate,
          data: {
            id: -1,
            title: 'Akıllı Asistan',
            slug: 'akilli-asistan',
            type: 'post',
            date: currentDate,
            excerpt: 'Bebeğinizin sağlığı için akıllı araçlar',
            image: '',
            meta: {}
          } as FeaturedItem
        };
        
        // Add tool card to the featured content list
        const featuredWithTool = [...featured, toolItem];
        setFeaturedContent(featuredWithTool);
        
        // Track featured IDs to exclude from lower sections
        const ids = featuredWithTool.map((item) => item.id);
        setFeaturedIds(ids);
        
        // Handle new getAll response format
        const latestRecipesArray = Array.isArray(latest) ? latest : (latest?.recipes || []);
        setLatestRecipes(latestRecipesArray);
        setBlogPosts(posts?.posts || []);
      } catch (error) {
        console.error("Ana sayfa verileri yüklenirken hata:", error);
        setFeaturedContent([]);
        setLatestRecipes([]);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  // Random tools selection
  useEffect(() => {
    const allTools = [
      { name: 'BLW Hazırlık Testi', path: '/akilli-asistan/blw-testi', icon: 'fa-baby', color: 'blue', description: 'WHO standartlarında 8 soruda bebeğinizin BLW\'ye hazır olup olmadığını öğrenin.' },
      { name: 'Persentil Hesaplama', path: '/akilli-asistan/persentil-hesaplama', icon: 'fa-chart-line', color: 'purple', description: 'Bebeğinizin boy ve kilosunu WHO büyüme eğrileriyle karşılaştırın.' },
      { name: 'Ek Gıda Rehberi', path: '/akilli-asistan/ek-gida-rehberi', icon: 'fa-magnifying-glass', color: 'orange', description: 'Bu besin bebeğime uygun mu? Malzemeleri arayın ve yaşa göre uygunluğunu öğrenin.' },
      { name: 'Çocuğum Profili', path: '/profil', icon: 'fa-id-card', color: 'green', description: 'Bebeğinizin gelişimini takip edin ve kişiselleştirilmiş öneriler alın.' },
      { name: 'Aşı Takvimi', path: '/dashboard/saglik/asilar', icon: 'fa-syringe', color: 'red', description: 'Bebeğinizin aşı takvimini takip edin ve hatırlatıcılar alın.' },
      { name: 'Su İhtiyacı Hesaplama', path: '/akilli-asistan/su-ihtiyaci', icon: 'fa-droplet', color: 'cyan', description: 'Bebeğinizin günlük sıvı ihtiyacını yaşına göre hesaplayın.' },
      { name: 'Alerjen Planlayıcı', path: '/akilli-asistan/alerjen-planlayici', icon: 'fa-triangle-exclamation', color: 'amber', description: 'Potansiyel alerjenleri güvenli şekilde tanıtma planı oluşturun.' },
      { name: 'Besin Takvimi', path: '/akilli-asistan/besin-takvimi', icon: 'fa-calendar-days', color: 'lime', description: 'Hangi gıdaların ne zaman denendiğini takip edin ve kayıt altına alın.' },
      { name: 'Haftalık Plan', path: '/dashboard/haftalik-plan', icon: 'fa-calendar-week', color: 'teal', description: 'Bebeğiniz için haftalık beslenme planı oluşturun ve takip edin.' },
      { name: 'Alışveriş Listesi', path: '/alisveris-listesi', icon: 'fa-basket-shopping', color: 'pink', description: 'Tariflerden otomatik alışveriş listesi oluşturun ve düzenleyin.' },
      { name: 'Besin Deneme Takvimi', path: '/akilli-asistan/besin-deneme-takvimi', icon: 'fa-clipboard-check', color: 'indigo', description: 'Yeni gıdaları 3 gün kuralıyla tanıtın ve alerjik reaksiyonları takip edin.' },
      { name: 'Banyo Planlayıcı', path: '/akilli-asistan/banyo-planlayici', icon: 'fa-bath', color: 'sky', description: 'Bebeğiniz için mevsime ve cilt tipine uygun banyo rutini oluşturun.' },
      { name: 'Bez Hesaplayıcı', path: '/akilli-asistan/bez-hesaplayici', icon: 'fa-baby-carriage', color: 'rose', description: 'Doğru bez numarası ve aylık ihtiyacınızı öğrenin.' },
    ];
    
    // Fisher-Yates shuffle algorithm for proper randomization
    const shuffled = [...allTools];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setRandomTools(shuffled.slice(0, 4));
  }, []);
  
  // Click outside handler for age dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isAgeDropdownOpen && e.target && !(e.target as Element).closest('.age-dropdown')) {
        setIsAgeDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isAgeDropdownOpen]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (selectedAge) params.append('age', selectedAge);
    router.push(`/arama?${params.toString()}`);
  };
  
  // Filter out featured content from lower sections
  const filteredRecipes = latestRecipes.filter(recipe => !featuredIds.includes(recipe.id));
  const filteredPosts = blogPosts.filter(post => !featuredIds.includes(post.id)).slice(0, 6);
  
  // Helper function to get color classes for tool cards
  const getToolColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-500' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-500' },
      green: { bg: 'bg-green-50', text: 'text-green-500' },
      red: { bg: 'bg-red-50', text: 'text-red-500' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-500' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
      lime: { bg: 'bg-lime-50', text: 'text-lime-600' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-500' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-500' },
      sky: { bg: 'bg-sky-50', text: 'text-sky-500' },
      rose: { bg: 'bg-rose-50', text: 'text-rose-500' },
    };
    return colorMap[color] || { bg: 'bg-gray-50', text: 'text-gray-500' };
  };
  
  // Age groups for dropdown
  const ageGroupsOrdered = [
    { value: '', label: 'Tüm Aylar' },
    { value: '0-6-ay', label: '0-6 Ay (Hazırlık Evresi)' },
    { value: '6-8-ay', label: '6-8 Ay (Başlangıç & Tadım)' },
    { value: '9-11-ay', label: '9-11 Ay (Keşif & Pütürlüye Geçiş)' },
    { value: '12-24-ay', label: '12-24 Ay (Aile Sofrasına Geçiş)' },
    { value: '2-yas-ve-uzeri', label: '2+ Yaş (Çocuk Gurme)' },
  ];

  // Dalgalı arka plan görseli (SVG)
  const waveBgImage = "data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 12.878 58.749 10 50 10c-8.749 0-14.889 2.878-25.371 7.072-3.094 1.237-5.723 2.198-8.233 2.928h6.225zM0 20c2.51-.73 5.139-1.691 8.233-2.928C18.749 12.878 24.889 10 35 10c8.749 0 14.889 2.878 25.371 7.072 3.094 1.237 5.723 2.198 8.233 2.928H0zM50 0c8.749 0 14.889 2.878 25.371 7.072 3.094 1.237 5.723 2.198 8.233 2.928C74.638 6.253 68.647 5 50 5c-10.271 0-15.362 1.222-24.629 4.928C14.112 14.122 6.973 17 0 17v3h100v-3s-2.51-.73-5.139-1.691C84.362 10.928 77.223 8 68.474 8c-8.749 0-14.889 2.878-25.371 7.072-3.094 1.237-5.723 2.198-8.233 2.928C24.362 14.072 17.223 11 11.526 11c-8.749 0-14.889 2.878-25.371 7.072-3.094 1.237-5.723 2.198-8.233 2.928h11.474z' fill='%23FFF8E1' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E";

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://kidsgourmet.com.tr/#organization",
        "name": "KidsGourmet",
        "url": "https://kidsgourmet.com.tr",
        "logo": {
          "@type": "ImageObject",
          "url": "https://kidsgourmet.com.tr/logo.png"
        },
        "sameAs": [
          "https://facebook.com/kidsgourmet",
          "https://instagram.com/kidsgourmet",
          "https://twitter.com/kidsgourmet"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://kidsgourmet.com.tr/#website",
        "url": "https://kidsgourmet.com.tr",
        "name": "KidsGourmet",
        "description": "Bebek ve çocuk beslenmesinde güvenilir rehberiniz",
        "publisher": {
          "@id": "https://kidsgourmet.com.tr/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://kidsgourmet.com.tr/arama?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://kidsgourmet.com.tr/#webpage",
        "url": "https://kidsgourmet.com.tr",
        "name": "KidsGourmet - Bebek ve Çocuk Beslenme Rehberi",
        "isPartOf": {
          "@id": "https://kidsgourmet.com.tr/#website"
        },
        "description": "Uzman onaylı bebek ve çocuk tarifleri, beslenme rehberleri ve akıllı araçlar",
        "breadcrumb": {
          "@id": "https://kidsgourmet.com.tr/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://kidsgourmet.com.tr/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Ana Sayfa",
            "item": "https://kidsgourmet.com.tr"
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* FontAwesome CDN Link */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* FEATURED SLIDER */}
      {loading ? (
        <div className="relative bg-orange-50/50 pt-8 pb-12" style={{ backgroundImage: `url("${waveBgImage}")`, backgroundColor: '#FFFBE6' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ backgroundImage: `url("${waveBgImage}")`, backgroundColor: '#FFFBE6' }}>
          <FeaturedSlider items={featuredContent} />
        </div>
      )}

      {/* QUICK SEARCH (With Age Filter) */}
      <div className="bg-white -mt-6 relative z-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <div className="max-w-7xl mx-auto px-4 py-8">
               {/* Search Bar */}
               <form onSubmit={handleSearch} className="max-w-3xl mx-auto -mt-16 mb-10 relative">
                  <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-2">
                      
                      {/* Search Input */}
                      <div className="flex-grow flex items-center w-full sm:w-auto px-4">
                          <div className="text-gray-400 mr-3">
                              <i className="fa-solid fa-carrot text-xl"></i>
                          </div>
                          <input 
                            type="text" 
                            placeholder="Evde ne var? (Örn: Havuç, Yumurta)" 
                            className="w-full py-3 outline-none text-gray-700 font-medium bg-transparent placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>

                      {/* Separator (Desktop) */}
                      <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

                      {/* Age Filter - Custom Dropdown */}
                      <div className="w-full sm:w-auto px-2 age-dropdown relative">
                          <button
                            type="button"
                            onClick={() => setIsAgeDropdownOpen(!isAgeDropdownOpen)}
                            className="w-full flex items-center justify-between gap-2 bg-gray-50 text-gray-600 font-medium text-sm rounded-xl px-4 py-3 border border-transparent hover:border-orange-200 transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <i className="fa-solid fa-calendar-days text-orange-400"></i>
                              {selectedAgeLabel}
                            </span>
                            <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${isAgeDropdownOpen ? 'rotate-180' : ''}`}></i>
                          </button>
                          
                          {isAgeDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto">
                              {ageGroupsOrdered.map((age) => (
                                <button
                                  key={age.value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedAge(age.value);
                                    setSelectedAgeLabel(age.label);
                                    setIsAgeDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 transition-colors ${
                                    selectedAge === age.value ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                                  }`}
                                >
                                  {age.label}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* Submit Button */}
                      <button 
                        type="submit"
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md whitespace-nowrap"
                      >
                          Tarif Bul
                      </button>
                  </div>
              </form>

              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/tarifler?category=ilk-tadimlar" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-all font-bold text-sm border border-red-100">
                      <i className="fa-solid fa-apple-whole"></i> İlk Tadımlar
                  </Link>
                  <Link href="/tarifler?diet-type=vegan" className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-all font-bold text-sm border border-green-100">
                      <i className="fa-solid fa-leaf"></i> Vegan
                  </Link>
                  <Link href="/tarifler?meal-type=corba" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-all font-bold text-sm border border-blue-100">
                      <i className="fa-solid fa-bowl-food"></i> Çorbalar
                  </Link>
                  <Link href="/tarifler?meal-type=atistirmalik" className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full hover:bg-yellow-100 transition-all font-bold text-sm border border-yellow-100">
                      <i className="fa-solid fa-cookie-bite"></i> Atıştırmalık
                  </Link>
              </div>
          </div>
      </div>

      {/* MOBILE LOGIN/REGISTER SECTION */}
      {!isAuthenticated && (
        <div className="py-8 bg-gradient-to-r from-orange-50 to-amber-50 md:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <p className="text-gray-600 font-medium">Özelleştirilmiş içerik için</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/login" className="flex-1 max-w-[200px] inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-full text-white bg-orange-500 hover:bg-orange-600 shadow-md transition-all">
                Giriş Yap
              </Link>
              <Link href="/register" className="flex-1 max-w-[200px] inline-flex items-center justify-center px-6 py-3 border border-orange-500 text-sm font-bold rounded-full text-orange-500 bg-white hover:bg-orange-50 transition-all">
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* RECIPES SECTION */}
      <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                  <div>
                    <h2 className="font-sans font-bold text-2xl sm:text-3xl text-slate-800">Minik Gurmelere Özel</h2>
                    <p className="text-gray-500 mt-1 text-sm">İştah açan besleyici tarifler</p>
                  </div>
                  <Link href="/tarifler" className="text-orange-500 font-bold hover:underline whitespace-nowrap">Tümünü Gör</Link>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
              ) : latestRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredRecipes.map((recipe) => {
                      // Enhance recipe with age group color from ageGroups
                      const ageGroup = ageGroups.find(ag => ag.name === recipe.age_group);
                      const enhancedRecipe = {
                        ...recipe,
                        age_group_color: ageGroup?.age_group_meta?.color_code
                      };
                      return (
                        <RecipeCardComponent key={recipe.id} recipe={enhancedRecipe} />
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Henüz tarif yüklenmedi. Lütfen daha sonra tekrar kontrol edin.</p>
                </div>
              )}
          </div>
      </div>

      {/* CROSS-SELL SECTION: Bizimkiler Ne Yiyecek? - Tariften.com */}
      <div className="py-12 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none opacity-50"></div>

                  <div className="relative z-10 max-w-2xl">
                      <span className="text-purple-500 font-bold tracking-widest text-xs uppercase mb-2 block">EBEVEYNLERE ÖZEL</span>
                      <h2 className="font-sans font-bold text-3xl md:text-4xl text-slate-800 mb-4">Bizimkiler Ne Yiyecek?</h2>
                      {tariftenRecipe ? (
                        <p className="text-lg text-gray-600">
                            Bebeğine sağlıklı tarifler hazırlarken kendini de unutma! Lezzetli bir{' '}
                            <Link href={`https://www.tariften.com/recipe/${tariftenRecipe.slug}`} target="_blank" rel="noopener noreferrer" className="text-purple-500 font-bold underline decoration-dotted underline-offset-4 hover:text-purple-700">
                              {decodeEntities(tariftenRecipe.title)}
                            </Link>{' '}
                            denemek ister misin?
                        </p>
                      ) : (
                        <p className="text-lg text-gray-600">
                            Bebeğine sağlıklı tarifler hazırlarken kendini de unutma! Lezzetli tarifler için Tariften.com'u keşfet.
                        </p>
                      )}
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                      <Link href="https://tariften.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-purple-500 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-purple-600 transition-all hover:-translate-y-1">
                          Tariften.com'da Keşfet
                          <i className="fa-solid fa-arrow-up-right-from-square ml-3"></i>
                      </Link>
                  </div>
              </div>
          </div>
      </div>

      {/* TOOLS SECTION */}
      <div className="py-16 bg-orange-50/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                  <h2 className="font-sans font-bold text-3xl text-slate-800"><span className="text-orange-500">Akıllı Asistan</span> ile Yanınızdayız!</h2>
                  <p className="text-gray-500 mt-2">Çocuğunuzun gelişimi ve güvenliği için veri odaklı çözümler.</p>
              </div>

              {/* Mobil için yatay scroll */}
              <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex gap-4" style={{ width: 'max-content' }}>
                  {randomTools.map((tool, index) => {
                    const colors = getToolColorClasses(tool.color);
                    return (
                      <div key={index} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col min-w-[280px]">
                        <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                          <i className={`fa-solid ${tool.icon}`}></i>
                        </div>
                        <h3 className="font-sans font-bold text-xl text-slate-800 mb-2">{tool.name}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-3">{tool.description}</p>
                        <div className="flex-grow"></div>
                        <Link href={tool.path} className={`${colors.text} font-bold flex items-center hover:underline mt-4`}>
                          Keşfet <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop için grid */}
              <div className="hidden lg:grid grid-cols-4 gap-6">
                {randomTools.map((tool, index) => {
                  const colors = getToolColorClasses(tool.color);
                  return (
                    <div key={index} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col">
                      <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                        <i className={`fa-solid ${tool.icon}`}></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-2">{tool.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">{tool.description}</p>
                      <div className="flex-grow"></div>
                      <Link href={tool.path} className={`${colors.text} font-bold flex items-center hover:underline mt-4`}>
                        Keşfet <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                    </div>
                  );
                })}
              </div>
          </div>
      </div>

      {/* BLOG SECTION */}
      <BlogSection posts={filteredPosts} />

      {/* CROSS-SELL SECTION: Rejimde.com */}
      <div className="py-12 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none opacity-50"></div>

                  <div className="relative z-10 max-w-2xl">
                      <span className="text-green-600 font-bold tracking-widest text-xs uppercase mb-2 block">EBEVEYNLERE ÖZEL</span>
                      <h2 className="font-sans font-bold text-3xl md:text-4xl text-slate-800 mb-4">Sağlıklı Yaşamın Eğlenceli Hali</h2>
                      {rejimdeContent ? (
                        <p className="text-lg text-gray-600">
                            Kanıtlanmış bilimsel verilerle, sürdürülebilir sağlıklı yaşam için size uygun{' '}
                            <Link href={rejimdeContent.url || `https://www.rejimde.com/${rejimdeContent.type === 'diet' ? 'diets' : 'exercises'}/${rejimdeContent.slug}`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold underline decoration-dotted underline-offset-4 hover:text-green-700">
                              {decodeEntities(rejimdeContent.title)}
                            </Link>{' '}
                            {rejimdeContent.type === 'diet' ? 'diyet programını' : 'egzersiz programını'} hemen keşfedin!
                        </p>
                      ) : (
                        <p className="text-lg text-gray-600">
                            Kanıtlanmış bilimsel verilerle, sürdürülebilir sağlıklı yaşam için size uygun diyet ya da egzersiz programını hemen keşfedin!
                        </p>
                      )}
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                      <Link href="https://rejimde.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-green-700 transition-all hover:-translate-y-1">
                          Rejimde.com'da Keşfet
                          <i className="fa-solid fa-arrow-up-right-from-square ml-3"></i>
                      </Link>
                  </div>
              </div>
          </div>
      </div>

      {/* FEATURES SECTION ("NEDEN KIDSGOURMET") */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="font-display font-bold text-3xl text-slate-800">Neden KidsGourmet?</h2>
                  <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                      Bebek ve çocuk beslenmesinde ebeveynlere güvenilir, bilimsel ve pratik rehberlik desteği sunmak için varız.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature 1 - Uzman Görüşü */}
                  <div className="group bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-3xl border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-glasses text-2xl text-emerald-600"></i>
                      </div>
                      <h3 className="font-display font-bold text-xl text-slate-800 mb-3">Uzman Görüşü</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                          Uzman yazılarını takip edin, çocuğunuzun sağlığı konusunda içiniz rahat olsun.
                      </p>
                  </div>

                  {/* Feature 2 - Güvenli İçerik */}
                  <div className="group bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-3xl border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-magnifying-glass text-2xl text-blue-600"></i>
                      </div>
                      <h3 className="font-display font-bold text-xl text-slate-800 mb-3">Güvenli İçerik</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                          Alerjen filtreleri ve yaşa uygun içerik denetimi ile aradığınızı kolayca bulun.
                      </p>
                  </div>

                  {/* Feature 3 - K&G Topluluğu */}
                  <div className="group bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl border border-amber-100 hover:shadow-xl hover:shadow-amber-100/50 hover:-translate-y-1 transition-all duration-300">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-heart text-2xl text-amber-600"></i>
                      </div>
                      <h3 className="font-display font-bold text-xl text-slate-800 mb-3">K&G Topluluğu</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                          Diğer ebeveynlerin deneyimlerini okuyun, sorularınızı uzmanlara sorun.
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}