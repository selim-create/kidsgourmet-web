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

                      {/* Age Filter */}
                      <div className="w-full sm:w-auto px-2">
                          <select 
                            className="w-full bg-gray-50 text-gray-600 font-medium text-sm rounded-xl p-3 outline-none border border-transparent hover:border-orange-200 cursor-pointer transition-colors focus:ring-2 focus:ring-orange-200 appearance-none"
                            value={selectedAge}
                            onChange={(e) => setSelectedAge(e.target.value)}
                          >
                              <option value="">Tüm Aylar</option>
                              <option value="0-6-ay">0-6 Ay (Hazırlık Evresi)</option>
                              <option value="6-8-ay">6-8 Ay (Başlangıç & Tadım)</option>
                              <option value="9-11-ay">9-11 Ay (Keşif & Pütürlüye Geçiş)</option>
                              <option value="12-24-ay">12-24 Ay (Aile Sofrasına Geçiş)</option>
                              <option value="2-yas">2+ Yaş (Çocuk Gurme)</option>
                          </select>
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
                            <Link href={`https://www.rejimde.com/${rejimdeContent.type}/${rejimdeContent.slug}`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold underline decoration-dotted underline-offset-4 hover:text-green-700">
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

      {/* TOOLS SECTION */}
      <div className="py-16 bg-orange-50/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                  <h2 className="font-sans font-bold text-3xl text-slate-800"><span className="text-orange-500">Akıllı Asistan</span> ile Yanınızdayız!</h2>
                  <p className="text-gray-500 mt-2">Çocuğunuzun gelişimi ve güvenliği için veri odaklı çözümler.</p>
              </div>

              <div className="overflow-x-auto pb-8 -mx-4 px-4 md:overflow-visible">
                <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 min-w-max md:min-w-0">
                  {/* Tool 1: BLW */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-baby"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">BLW Hazırlık Testi</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Bebeğiniz katı gıdaya hazır mı? 8 soruluk interaktif test ile öğrenin.</p>
                      <Link href="/akilli-asistan/blw-testi" className="text-blue-500 font-bold flex items-center hover:underline">
                          Teste Başla <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 2: Search Engine */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-magnifying-glass"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Ek Gıda Rehberi</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">"Bebekler bal yiyebilir mi?" gibi soruların cevabını anında bulun.</p>
                      <Link href="/akilli-asistan/ek-gida-rehberi" className="text-orange-500 font-bold flex items-center hover:underline">
                          Sorgula <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 3: Profile */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-id-card"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Çocuğum Profili</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Ayına özel haftalık planlar ve alerjen filtreli öneriler için profil oluşturun.</p>
                      <Link href="/profil" className="text-green-500 font-bold flex items-center hover:underline">
                          Profil Oluştur <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 4: Vaccination Tracker */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-syringe"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Aşı Takvimi</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Çocuğunuzun aşı takvimini takip edin ve hatırlatıcı alın.</p>
                      <Link href="/dashboard/saglik/asilar" className="text-red-500 font-bold flex items-center hover:underline">
                          Takvimi Gör <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 5: Percentile Calculator */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-chart-line"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Persentil Hesaplama</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Boy, kilo ve baş çevresi persentillerini hesaplayın.</p>
                      <Link href="/akilli-asistan/persentil-hesaplama" className="text-purple-500 font-bold flex items-center hover:underline">
                          Hesapla <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 6: Water Calculator */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-droplet"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Su İhtiyacı Hesaplama</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Çocuğunuzun günlük su ihtiyacını öğrenin.</p>
                      <Link href="/akilli-asistan/su-ihtiyaci" className="text-cyan-500 font-bold flex items-center hover:underline">
                          Hesapla <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 7: Allergen Planner */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-triangle-exclamation"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Alerjen Planlayıcı</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">8 büyük alerjeni tanıtma planınızı oluşturun.</p>
                      <Link href="/akilli-asistan/alerjen-planlayici" className="text-amber-600 font-bold flex items-center hover:underline">
                          Plan Yap <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 8: Besin Takvimi */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-lime-50 text-lime-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-calendar-days"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Besin Takvimi</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Ayına göre hangi besinleri tanıtabileceğinizi görün.</p>
                      <Link href="/akilli-asistan/besin-takvimi" className="text-lime-600 font-bold flex items-center hover:underline">
                          Takvimi Gör <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 9: Meal Planner */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-calendar-week"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Haftalık Plan</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Haftalık beslenme planınızı otomatik oluşturun.</p>
                      <Link href="/dashboard/haftalik-plan" className="text-teal-600 font-bold flex items-center hover:underline">
                          Plan Oluştur <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 10: Shopping List */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-basket-shopping"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Alışveriş Listesi</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Akıllı alışveriş listenizi oluşturun ve yönetin.</p>
                      <Link href="/alisveris-listesi" className="text-pink-500 font-bold flex items-center hover:underline">
                          Liste Oluştur <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 11: Food Trial Calendar */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-clipboard-check"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Besin Deneme Takvimi</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Denediğiniz besinleri ve reaksiyonları kaydedin.</p>
                      <Link href="/akilli-asistan/besin-deneme-takvimi" className="text-indigo-500 font-bold flex items-center hover:underline">
                          Kayıt Tut <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 12: Bath Planner */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-bath"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Banyo Planlayıcı</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Bebeğiniz için ideal banyo rutini oluşturun.</p>
                      <Link href="/akilli-asistan/banyo-planlayici" className="text-sky-500 font-bold flex items-center hover:underline">
                          Plan Oluştur <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 13: Diaper Calculator */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col w-[280px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-baby-carriage"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Bez Hesaplayıcı</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Aylık bez ihtiyacınızı ve maliyetinizi hesaplayın.</p>
                      <Link href="/akilli-asistan/bez-hesaplayici" className="text-rose-500 font-bold flex items-center hover:underline">
                          Hesapla <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>
                </div>
              </div>
          </div>
      </div>

      {/* BLOG SECTION */}
      <BlogSection posts={filteredPosts} />

      {/* FEATURES SECTION ("NEDEN KIDSGOURMET") */}
      <div className="py-16 bg-white relative border-t border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                  <h2 className="font-sans font-bold text-3xl text-slate-800">Neden KidsGourmet?</h2>
                  <p className="text-gray-500 mt-2">Bebek ve çocuk beslenmesinde ebeveynlere güvenilir, bilimsel ve pratik rehberlik desteği sunmak için varız.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Feature 1: UZMAN GÖRÜŞÜ */}
                  <div className="bg-green-100 p-8 rounded-[2rem] shadow-sm border border-green-200 text-center hover:-translate-y-2 transition-transform duration-300">
                      <div className="w-16 h-16 mx-auto mb-6 text-5xl text-green-700 flex items-center justify-center">
                          <i className="fa-solid fa-glasses"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">UZMAN GÖRÜŞÜ</h3>
                      <p className="text-gray-700 text-sm">Uzman yazılarını takip edin, çocuğunuzun sağlığı konusunda içiniz rahat olsun.</p>
                  </div>
                   {/* Feature 2 */}
                   <div className="bg-gray-50 p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                          🔍
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-2">Güvenli İçerik</h3>
                      <p className="text-gray-500 text-sm">Alerjen filtreleri ve yaşa uygun içerik denetimi ile içiniz rahat olsun.</p>
                  </div>
                   {/* Feature 3 */}
                   <div className="bg-gray-50 p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                          🤝
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-2">Anneler Topluluğu</h3>
                      <p className="text-gray-500 text-sm">Diğer annelerin deneyimlerini okuyun, sorularınızı uzmanlara sorun.</p>
                  </div>
              </div>
          </div>
      </div>

      {/* EXPERT TRUST SECTION */}
      <div className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2 relative">
                      <div className="absolute inset-0 bg-green-50 rounded-[3rem] transform rotate-3 scale-95"></div>
                      {/* Expert Trust Image - Will be replaced with actual photo */}
                      <div className="relative rounded-[3rem] shadow-xl w-full h-80 lg:h-96 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4">👩‍⚕️👶</div>
                          <p className="text-green-600 font-bold">Uzman & Bebek</p>
                        </div>
                      </div>
                  </div>
                  
                  {/* Content Side */}
                  <div className="w-full lg:w-1/2">
                      <div className="flex items-center space-x-3 mb-4 bg-green-50 w-fit px-4 py-2 rounded-full border border-green-100">
                          <i className="fa-solid fa-user-doctor text-green-600"></i>
                          <span className="font-bold text-sm text-gray-700">Rejimde.com İş Birliğiyle</span>
                      </div>
                      <h2 className="font-sans font-bold text-3xl md:text-4xl text-slate-800 mb-6 leading-tight">İçiniz Rahat Olsun, <br/><span className="text-green-500">Uzmanlar Yanınızda.</span></h2>
                      <p className="text-gray-600 mb-8 text-lg">
                          KidsGourmet'teki tüm tarifler ve beslenme rehberleri, Rejimde.com'un diyetisyen ve çocuk doktoru kadrosu tarafından gözden geçirilir.
                      </p>
                      <ul className="space-y-4 mb-8">
                          <li className="flex items-start text-gray-700">
                              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                  <i className="fa-solid fa-check text-xs"></i>
                              </div>
                              Alerjen kontrolleri yapılmış tarifler
                          </li>
                          <li className="flex items-start text-gray-700">
                              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                  <i className="fa-solid fa-check text-xs"></i>
                              </div>
                              Yaşa uygun besin değerleri
                          </li>
                          <li className="flex items-start text-gray-700">
                              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                  <i className="fa-solid fa-check text-xs"></i>
                              </div>
                              Güvenilir kaynaklı malzeme rehberi
                          </li>
                      </ul>
                      <Link href="#" className="inline-block border-2 border-green-500 text-green-500 font-bold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition-all">
                          Uzman Kadromuzu Gör
                      </Link>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}