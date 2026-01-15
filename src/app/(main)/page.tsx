"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { recipeService } from '@/services/recipe-service';
import { blogService, BlogPost } from '@/services/blog-service';
import { featuredService, FeaturedItem } from '@/services/featured-service';
import { RecipeCard } from '@/lib/types';
import { decodeEntities } from '@/utils/textHelpers';
import { useAgeGroups } from '@/hooks/useAgeGroups';
import FeaturedSlider from '@/components/features/FeaturedSlider';
import BlogSection from '@/components/features/BlogSection';
import RecipeCardComponent from '@/components/ui/RecipeCard';

// --- HOME PAGE ---
export default function Home() {
  const router = useRouter();
  const { ageGroups } = useAgeGroups();
  const [latestRecipes, setLatestRecipes] = useState<RecipeCard[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAge, setSelectedAge] = useState('');

  // Prepare featured content for slider
  const [featuredContent, setFeaturedContent] = useState<Array<{
    id: number;
    type: 'recipe' | 'blog' | 'question' | 'sponsored' | 'ingredient';
    date: string;
    data: FeaturedItem;
  }>>([]);
  const [featuredIds, setFeaturedIds] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [featuredData, latest, posts] = await Promise.all([
          featuredService.getAll(5),
          recipeService.getAll({ perPage: 8 }),
          blogService.getAll(1, 12)
        ]);
        
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
        
        setFeaturedContent(featured);
        
        // Track featured IDs to exclude from lower sections
        const ids = featured.map((item) => item.id);
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

  return (
    <>
      {/* FontAwesome CDN Link */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
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
                              {ageGroups.map(ag => (
                                <option key={ag.id} value={ag.slug}>{decodeEntities(ag.name)}</option>
                              ))}
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

      {/* RECIPES SECTION */}
      <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="font-sans font-bold text-3xl text-slate-800">Minik Gurmelere Özel</h2>
                  <Link href="/tarifler" className="text-orange-500 font-bold hover:underline">Tümünü Gör</Link>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="h-56 relative overflow-hidden bg-orange-50">
                          <img src="https://placehold.co/600x400/FFF8E1/FF8A65?text=Pankek" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Pankek" />
                          <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                              <i className="fa-regular fa-heart"></i>
                          </button>
                          <div className="absolute bottom-3 left-3 flex gap-2">
                               <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                  +8 Ay
                              </span>
                          </div>
                      </div>
                      <div className="p-5">
                          <h3 className="font-sans font-bold text-lg text-slate-800 mb-1 leading-tight group-hover:text-orange-500 transition-colors">Muzlu Bebek Pankeki</h3>
                          <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3">
                              <span><i className="fa-regular fa-clock mr-1"></i> 15 dk</span>
                              <span><i className="fa-solid fa-fire mr-1"></i> Şekersiz</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                               <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] mr-2">👨‍⚕️</span>
                                  <span className="text-xs text-gray-500 font-medium">Dyt. Onaylı</span>
                               </div>
                          </div>
                      </div>
                  </div>

                  {/* Card 2 */}
                  <div className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="h-56 relative overflow-hidden bg-green-50">
                          <img src="https://placehold.co/600x400/E8F5E9/AED581?text=Sebze+Puresi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Sebze Püresi" />
                           <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                              <i className="fa-regular fa-heart"></i>
                          </button>
                          <div className="absolute bottom-3 left-3 flex gap-2">
                               <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                  +6 Ay
                              </span>
                          </div>
                      </div>
                      <div className="p-5">
                          <h3 className="font-sans font-bold text-lg text-slate-800 mb-1 leading-tight group-hover:text-orange-500 transition-colors">3 Renkli Sebze Püresi</h3>
                          <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3">
                              <span><i className="fa-regular fa-clock mr-1"></i> 20 dk</span>
                              <span><i className="fa-solid fa-leaf mr-1"></i> Vegan</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                               <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] mr-2">👨‍⚕️</span>
                                  <span className="text-xs text-gray-500 font-medium">Dyt. Onaylı</span>
                               </div>
                          </div>
                      </div>
                  </div>

                  {/* Card 3 */}
                  <div className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="h-56 relative overflow-hidden bg-orange-50">
                          <img src="https://placehold.co/600x400/FFF3E0/FF8A65?text=Kofte" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Köfte" />
                           <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                              <i className="fa-regular fa-heart"></i>
                          </button>
                          <div className="absolute bottom-3 left-3 flex gap-2">
                               <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                  +12 Ay
                               </span>
                          </div>
                      </div>
                      <div className="p-5">
                          <h3 className="font-sans font-bold text-lg text-slate-800 mb-1 leading-tight group-hover:text-orange-500 transition-colors">Yumuşak Tavuk Köftesi</h3>
                          <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3">
                              <span><i className="fa-regular fa-clock mr-1"></i> 35 dk</span>
                              <span><i className="fa-solid fa-drumstick-bite mr-1"></i> Protein</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                               <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] mr-2">👨‍⚕️</span>
                                  <span className="text-xs text-gray-500 font-medium">Dyt. Onaylı</span>
                               </div>
                          </div>
                      </div>
                  </div>

                  {/* Card 4 */}
                  <div className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="h-56 relative overflow-hidden bg-blue-50">
                          <img src="https://placehold.co/600x400/E3F2FD/81D4FA?text=Salata" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Salata" />
                           <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                              <i className="fa-regular fa-heart"></i>
                          </button>
                          <div className="absolute bottom-3 left-3 flex gap-2">
                               <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                  +12 Ay
                              </span>
                          </div>
                      </div>
                      <div className="p-5">
                          <h3 className="font-sans font-bold text-lg text-slate-800 mb-1 leading-tight group-hover:text-orange-500 transition-colors">Renkli Kinoa Salatası</h3>
                          <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3">
                              <span><i className="fa-regular fa-clock mr-1"></i> 10 dk</span>
                              <span><i className="fa-solid fa-carrot mr-1"></i> Vitamin</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                               <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] mr-2">👨‍⚕️</span>
                                  <span className="text-xs text-gray-500 font-medium">Dyt. Onaylı</span>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
              )}
          </div>
      </div>

      {/* CROSS-SELL SECTION: Bizimkiler Ne Yiyecek? */}
      <div className="py-12 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-purple-50 border border-purple-100 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none opacity-50"></div>

                  <div className="relative z-10 max-w-2xl">
                      <span className="text-purple-500 font-bold tracking-widest text-xs uppercase mb-2 block">Ebeveynlere Özel</span>
                      <h2 className="font-sans font-bold text-3xl md:text-4xl text-slate-800 mb-4">Bizimkiler Ne Yiyecek?</h2>
                      <p className="text-lg text-gray-600">
                          Bebeğine <span className="font-bold text-orange-500">Kabak Mücveri</span> yaparken artan malzemelerle kendine harika bir 
                          <Link href="#" className="text-purple-500 font-bold underline decoration-dotted underline-offset-4 hover:text-purple-700 ml-1">Fırında Kabak Sandal</Link> yapabilirsin.
                      </p>
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                      <Link href="#" className="inline-flex items-center justify-center bg-purple-500 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-purple-600 transition-all hover:-translate-y-1">
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
                  <h2 className="font-sans font-bold text-3xl text-slate-800">Sadece Tarif Değil, <span className="text-orange-500">Akıllı Araçlar</span></h2>
                  <p className="text-gray-500 mt-2">Çocuğunuzun gelişimi ve güvenliği için veri odaklı çözümler.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Tool 1: BLW */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col">
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
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col">
                      <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-magnifying-glass"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Ek Gıda Arama Motoru</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">"Bebekler bal yiyebilir mi?" gibi soruların cevabını anında bulun.</p>
                      <Link href="/arama" className="text-orange-500 font-bold flex items-center hover:underline">
                          Sorgula <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>

                  {/* Tool 3: Profile */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col">
                      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                          <i className="fa-solid fa-id-card"></i>
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-3">Çocuğum Profili</h3>
                      <p className="text-gray-600 text-sm mb-6 flex-grow">Ayına özel haftalık planlar ve alerjen filtreli öneriler için profil oluşturun.</p>
                      <Link href="/dashboard/profil" className="text-green-500 font-bold flex items-center hover:underline">
                          Profil Oluştur <i className="fa-solid fa-chevron-right ml-2 text-xs"></i>
                      </Link>
                  </div>
              </div>
          </div>
      </div>

      {/* BLOG SECTION */}
      <BlogSection posts={filteredPosts} />

      {/* FEATURES SECTION ("NEDEN KIDSGOURMET") */}
      <div className="py-16 bg-white relative overflow-hidden border-t border-gray-50">
          {/* Blobs */}
          <div className="absolute top-0 left-0 text-green-50 transform -translate-x-1/2 -translate-y-1/2">
              <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.2C93.5,8.9,82,22.1,70.9,33.4C59.8,44.7,49.1,54.1,37.3,61.9C25.5,69.7,12.7,75.9,-0.6,76.9C-13.9,77.9,-27.8,73.8,-40.3,66.6C-52.8,59.4,-63.9,49.1,-72.1,36.8C-80.3,24.5,-85.6,10.2,-83.8,-3.1C-82,-16.4,-73.1,-28.7,-63.3,-39.3C-53.5,-49.9,-42.8,-58.8,-31.3,-67.9C-19.8,-77,-7.4,-86.3,3.8,-92.9L15,-99.5L44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                  <h2 className="font-sans font-bold text-3xl text-slate-800">Neden KidsGourmet?</h2>
                  <p className="text-gray-500 mt-2">Sadece tarif değil, sağlıklı bir gelecek için yanınızdayız.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Feature 1 */}
                  <div className="bg-gray-50 p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                          👩‍⚕️
                      </div>
                      <h3 className="font-sans font-bold text-xl text-slate-800 mb-2">Uzman Onaylı</h3>
                      <p className="text-gray-500 text-sm">Tüm tarifler ve içerikler Rejimde.com uzman diyetisyenleri tarafından incelenir.</p>
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
                      {/* Placeholder Image */}
                      <img src="https://placehold.co/800x600/E8F5E9/455A64?text=Doktor+ve+Bebek" className="relative rounded-[3rem] shadow-xl w-full object-cover h-80 lg:h-96" alt="Doktor ve Bebek" />
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