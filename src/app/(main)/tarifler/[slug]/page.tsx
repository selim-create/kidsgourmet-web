"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipe-service';
import { Recipe, RecipeIngredient, RecipeInstruction } from '@/lib/types';
import CrossSellWidget from '@/components/features/recipe/CrossSellWidget';
import SafetyAlertBanner from '@/components/features/safety/SafetyAlertBanner';
import RecipeRating from '@/components/features/recipe/RecipeRating';
import { useAgeGroups } from '@/hooks/useAgeGroups';
import { useUser } from '@/hooks/use-user';
import { useActiveChild } from '@/contexts/ActiveChildContext';
import { useSimilarSafeRecipes } from '@/hooks/useRecommendations';
import { toast } from 'sonner';
import { decodeHTMLEntities, calculatePortion, portionMultipliers, sanitizeHTML } from '@/utils/helpers';
import { slugify } from '@/utils/textHelpers';
import ClientHead from '@/components/seo/ClientHead';
import CommentSection from '@/components/features/CommentSection';
import { EditButton } from '@/components/ui/EditButton';
import Image from 'next/image';
import RecipeCard from '@/components/ui/RecipeCard';
import { SidebarAds, InContentAd, AdZone } from '@/components/ads';

// Tüm 16 araçlık havuz - Standart İkonlar ve Renkler
const ALL_TOOLS = [
  { name: 'Alerjen Planlayıcı', path: '/akilli-asistan/alerjen-planlayici', icon: 'fa-solid fa-shield-heart', color: 'text-red-500', bg: 'bg-red-50' },
  { name: 'Bu Gıda Verilir mi?', path: '/akilli-asistan/bu-gida-verilir-mi', icon: 'fa-solid fa-magnifying-glass', color: 'text-amber-500', bg: 'bg-amber-50' },
  { name: 'Ek Gıdaya Başlama', path: '/akilli-asistan/ek-gidaya-baslama', icon: 'fa-solid fa-utensils', color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Ek Gıda Rehberi', path: '/akilli-asistan/ek-gida-rehberi', icon: 'fa-solid fa-carrot', color: 'text-green-500', bg: 'bg-green-50' },
  { name: 'Su İhtiyacı', path: '/akilli-asistan/su-ihtiyaci', icon: 'fa-solid fa-glass-water', color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { name: 'Persentil Hesaplayıcı', path: '/akilli-asistan/persentil', icon: 'fa-solid fa-chart-line', color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'BLW Hazırlık Testi', path: '/akilli-asistan/blw-testi', icon: 'fa-solid fa-baby', color: 'text-pink-500', bg: 'bg-pink-50' },
  { name: 'Leke Ansiklopedisi', path: '/akilli-asistan/leke-rehberi', icon: 'fa-solid fa-tshirt', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { name: 'Hava Kalitesi', path: '/akilli-asistan/hava-kalitesi', icon: 'fa-solid fa-wind', color: 'text-sky-500', bg: 'bg-sky-50' },
  { name: 'Akıllı Bez', path: '/akilli-asistan/bez-hesaplayici', icon: 'fa-solid fa-baby-carriage', color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Günlük Hijyen', path: '/akilli-asistan/hijyen-hesaplayici', icon: 'fa-solid fa-hand-sparkles', color: 'text-teal-500', bg: 'bg-teal-50' },
  { name: 'Banyo Planlayıcı', path: '/akilli-asistan/banyo-planlayici', icon: 'fa-solid fa-bath', color: 'text-blue-400', bg: 'bg-blue-50' },
  { name: 'Aşı Takvimi', path: '/dashboard/saglik/asilar', icon: 'fa-solid fa-syringe', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Sunum Önerileri', path: '/beslenme-rehberi/sunum-onerileri', icon: 'fa-solid fa-plate-wheat', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: '3 Gün Kuralı', path: '/beslenme-rehberi/3-gun-kurali', icon: 'fa-solid fa-clock-rotate-left', color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Besin Deneme Takvimi', path: '/akilli-asistan/besin-takvimi', icon: 'fa-solid fa-seedling', color: 'text-lime-500', bg: 'bg-lime-50' },
];

// Age group color mapping (matching RecipeCard.tsx)
const AGE_GROUP_COLORS: { [key: string]: string } = {
  '0-6': '#E1BEE7',   // Lila
  '6-8': '#FFCCBC',   // Şeftali
  '9-11': '#C8E6C9',  // Nane Yeşili
  '12-24': '#B3E5FC', // Gökyüzü Mavisi
  '2+': '#FFF9C4',    // Limon Sarısı
};

// Get background color for age group badge
const getAgeGroupColor = (ageGroup?: string): string => {
  if (!ageGroup) return '#22C55E';
  
  // Extract age range from string
  if (ageGroup.includes('0-6')) return AGE_GROUP_COLORS['0-6'];
  if (ageGroup.includes('6-8')) return AGE_GROUP_COLORS['6-8'];
  if (ageGroup.includes('9-11')) return AGE_GROUP_COLORS['9-11'];
  if (ageGroup.includes('12-24')) return AGE_GROUP_COLORS['12-24'];
  if (ageGroup.includes('2+') || ageGroup.match(/\(24\+?\s*(Ay|yaş)/i)) return AGE_GROUP_COLORS['2+'];
  
  return '#22C55E';
};

// Get text color for age group badge (dark text for light backgrounds)
const getAgeGroupTextColor = (ageGroup?: string): string => {
  if (!ageGroup) return '#FFFFFF';
  
  // Light backgrounds need dark text for readability
  if (ageGroup.includes('2+') || ageGroup.match(/\(24\+?\s*(Ay|yaş)/i) || ageGroup.toLowerCase().includes('gurme')) {
    return '#92400E'; // Amber-800 - Dark brown for yellow background
  }
  if (ageGroup.includes('9-11') || ageGroup.toLowerCase().includes('keşif')) {
    return '#166534'; // Green-800 - Dark green for light green background
  }
  
  // Dark backgrounds use white text
  return '#FFFFFF';
};

// Helper function to generate ui-avatars.com URL
const generateUIAvatarURL = (name: string, backgroundColor: string = '#FF8A65'): string => {
  const bgColor = backgroundColor.replace('#', '');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=128&bold=true`;
};

// Helper function to convert age group display name to slug
const getAgeGroupSlug = (ageGroupName: string): string => {
  const ageGroupMap: { [key: string]: string } = {
    '0-6 Ay (Hazırlık Evresi)': '0-6-ay-sadece-sut',
    '6-8 Ay (Başlangıç & Tadım)': '6-8-ay-baslangic',
    '9-11 Ay (Keşif & Pütürlüye Geçiş)': '9-11-ay-kesif',
    '12-24 Ay (Aile Sofrasına Geçiş)': '12-24-ay-gecis',
    '2+ Yaş (Çocuk Gurme)': '2-yas-ve-uzeri',
  };
  
  // Try exact match first
  if (ageGroupMap[ageGroupName]) {
    return ageGroupMap[ageGroupName];
  }
  
  // Fallback to slugify utility
  return slugify(ageGroupName);
};

// Helper function to convert diet type display name to slug
const getDietTypeSlug = (dietTypeName: string): string => {
  return slugify(dietTypeName);
};

// Helper function to convert meal type display name to slug
const getMealTypeSlug = (mealTypeName: string): string => {
  return slugify(mealTypeName);
};

// Get author avatar with fallback
const getAuthorAvatar = (author: any): string | null => {
  if (!author) return null;
  
  // Try multiple possible avatar fields
  const avatar = author.avatar || author.avatar_url || author.avatarUrl;
  if (avatar) return avatar;
  
  // Fallback to ui-avatars.com
  if (author.name) {
    return generateUIAvatarURL(author.name);
  }
  
  return null;
};

// Similar Safe Recipes Component
function SimilarSafeRecipesSection({ recipeId, childId }: { recipeId: number, childId: string }) {
  const { recipes, isLoading } = useSimilarSafeRecipes(recipeId, childId);
  const { activeChild } = useActiveChild();
  
  if (isLoading || !recipes || recipes.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <i className="fa-solid fa-shield-check text-green-600 mr-2"></i>
        Güvenli Alternatif Tarifler
      </h3>
      <p className="text-sm text-gray-700 mb-4">
        Bu tarifler{activeChild ? ` ${activeChild.name}` : ''} için güvenli olarak işaretlenmiş benzer tariflerdir.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recipes.slice(0, 4).map((recipe) => (
          <Link 
            key={recipe.id} 
            href={`/tarifler/${recipe.slug}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-white hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                {recipe.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-flex items-center">
                  <i className="fa-solid fa-clock mr-1"></i>
                  {recipe.prep_time}
                </span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  
  // Sidebar Tools State - EN ÜSTTE
  const [sidebarTools, setSidebarTools] = useState<typeof ALL_TOOLS>([]);

  useEffect(() => {
    // Sayfa yüklendiğinde 16 araçtan rastgele 4 tanesini seç
    const shuffled = [...ALL_TOOLS].sort(() => 0.5 - Math.random());
    setSidebarTools(shuffled.slice(0, 4));
  }, []);
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [originalIngredients, setOriginalIngredients] = useState<RecipeIngredient[]>([]);
  const [instructions, setInstructions] = useState<RecipeInstruction[]>([]);
  const [activePortion, setActivePortion] = useState("1 Öğün");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useUser();
  const { activeChild } = useActiveChild();

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);
        const data = await recipeService.getBySlug(slug);
        if (!data) {
          // Recipe not found - will show loading state
          setRecipe(null);
        } else {
          setRecipe(data);
          const ingredientsList = (data.ingredients || []).map((ing: RecipeIngredient, index: number) => ({
            ...ing,
            id: ing.id ?? index,
            checked: false
          }));
          setIngredients(ingredientsList);
          setOriginalIngredients(ingredientsList);
          setInstructions((data.instructions || []).map((inst: RecipeInstruction, index: number) => ({
            ...inst,
            id: inst.id ?? index,
            completed: false
          })));
        }
      } catch (error) {
        console.error("Tarif yüklenirken hata:", error);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [slug]);

  // Malzeme tikleme fonksiyonu
  const toggleIngredient = (id: number | string) => {
    setIngredients(ingredients.map((ing, index) => {
      const itemId = ing.id ?? index;
      return itemId === id ? { ...ing, checked: !ing.checked } : ing;
    }));
  };

  // Adım tamamlama fonksiyonu
  const toggleInstruction = (id: number | string) => {
    setInstructions(instructions.map((inst, index) => {
      const itemId = inst.id ?? index;
      return itemId === id ? { ...inst, completed: !inst.completed } : inst;
    }));
  };

  // Porsiyon değiştirme fonksiyonu
  const handlePortionChange = (portion: string) => {
    setActivePortion(portion);
    const multiplier = portionMultipliers[portion] || 1;
    
    // Calculate new amounts based on original ingredients
    const updatedIngredients = originalIngredients.map(ing => ({
      ...ing,
      amount: ing.amount ? calculatePortion(ing.amount, multiplier) : ing.amount
    }));
    
    setIngredients(updatedIngredients);
  };

  // Kopyalama fonksiyonu
  const copyIngredients = () => {
    const text = ingredients.map(i => {
      const amount = i.amount ? `${i.amount} ` : '';
      const unit = i.unit ? `${i.unit} ` : '';
      const name = i.name || i.text || '';
      return `- ${amount}${unit}${name}`;
    }).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Malzemeler kopyalandı!");
  };

  // WhatsApp ile malzeme paylaşımı
  const shareIngredientsWhatsApp = () => {
    const text = ingredients.map(i => {
      const amount = i.amount ? `${i.amount} ` : '';
      const unit = i.unit ? `${i.unit} ` : '';
      const name = i.name || i.text || '';
      return `• ${amount}${unit}${name}`;
    }).join("\n");
    
    const message = `*${recipe?.title || 'Tarif'} - Malzemeler (${activePortion})*\n\n${text}\n\n_KidsGourmet'ten paylaşıldı_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // WhatsApp paylaşım fonksiyonu
  const shareWhatsapp = () => {
    if (recipe) {
      const text = `Bu tarife bayıldım: ${recipe.title} - KidsGourmet`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // Haftalık plana ekleme
  const handleAddToMealPlan = () => {
    if (!isAuthenticated) {
      toast.error('Haftalık plan oluşturmak için giriş yapmalısınız', {
        action: {
          label: 'Giriş Yap',
          onClick: () => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
        }
      });
      return;
    }
    toast.success('Tarif haftalık plana eklendi!');
  };

  // Favorilere kaydetme
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi!');
  };

  const handleSaveToFavorites = () => {
    if (!isAuthenticated) {
      toast.error('Bu özelliği kullanmak için giriş yapmalısınız', {
        action: {
          label: 'Giriş Yap',
          onClick: () => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
        }
      });
      return;
    }
    toggleFavorite();
  };

  // Helper to find substitute for an ingredient
  const getSubstituteForIngredient = (ingredientName?: string) => {
    if (!recipe?.substitutes || !ingredientName) return null;
    return recipe.substitutes.find(
      sub => sub.original?.toLowerCase() === ingredientName.toLowerCase()
    );
  };

  // Sosyal medya paylaşımları
  const shareFacebook = () => {
    if (recipe) {
      const url = window.location.href;
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const shareTwitter = () => {
    if (recipe) {
      const text = `${recipe.title} - KidsGourmet`;
      const url = window.location.href;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link kopyalandı!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
        {/* SEO Meta Tags */}
        <ClientHead
          title={recipe.seo?.title || `${decodeHTMLEntities(recipe.title)} - KidsGourmet`}
          description={recipe.seo?.description || decodeHTMLEntities(recipe.excerpt || recipe.content).substring(0, 160)}
          keywords={recipe.seo?.focus_keywords || recipe.diet_types}
          ogImage={recipe.seo?.og_image || recipe.image}
          url={window.location.href}
        />
        
        {/* BREADCRUMB */}
        <div className="bg-white border-b border-gray-100 pt-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li><Link href="/" className="hover:text-orange-500"><i className="fa-solid fa-house"></i></Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li><Link href="/tarifler" className="hover:text-orange-500">Tarifler</Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li>
                          <Link 
                            href={`/tarifler?meal-type=${recipe.meal_type ? getMealTypeSlug(recipe.meal_type) : ''}`} 
                            className="hover:text-orange-500"
                          >
                            {recipe.meal_type || 'Tarifler'}
                          </Link>
                        </li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li className="font-semibold text-orange-500 capitalize">{recipe.title}</li>
                    </ol>
                </nav>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Safety Alert Banner */}
            {activeChild && (
              <SafetyAlertBanner 
                recipeId={recipe.id}
                childId={activeChild.id}
              />
            )}
            
            {/* HEADER SECTION */}
            <div className="flex flex-col lg:flex-row gap-8 mb-10">
                {/* Left: Image */}
                <div className="w-full lg:w-1/2 relative rounded-[2rem] overflow-hidden shadow-lg group h-[300px] lg:h-[400px]">
                    <img src={recipe.image || 'https://placehold.co/800x600/FF8A65/ffffff?text=Tarif'} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="bg-white/90 backdrop-blur text-slate-800 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm flex items-center w-fit">
                            <i className="fa-regular fa-clock text-orange-500 mr-2"></i> {recipe.prep_time}
                        </span>
                        {recipe.age_groups && recipe.age_groups.length > 0 && (
                          <span 
                            className="px-3 py-1.5 text-sm font-bold shadow-lg flex items-center w-fit"
                            style={{
                              backgroundColor: getAgeGroupColor(recipe.age_groups[0]),
                              color: getAgeGroupTextColor(recipe.age_groups[0]),
                              borderRadius: '12px 4px 12px 4px',
                            }}
                          >
                              <i className="fa-solid fa-baby mr-2"></i> {decodeHTMLEntities(recipe.age_groups[0])}
                          </span>
                        )}
                    </div>

                    {/* Edit Button */}
                    <EditButton 
                      contentType="recipe" 
                      contentId={recipe.id}
                      authorId={recipe.author?.id}
                      variant="text"
                      className="top-4 right-4"
                    />

                    {/* Video Button */}
                    {recipe.video_url && (
                      <button 
                        onClick={() => setShowVideoModal(true)}
                        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-red-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all animate-pulse"
                      >
                          <i className="fa-solid fa-play text-xl ml-1"></i>
                      </button>
                    )}
                </div>

                {/* Right: Meta Info */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {/* Age Groups */}
                        {recipe.age_groups?.map((age, index) => (
                          <Link 
                            key={index}
                            href={`/tarifler?age-group=${getAgeGroupSlug(age)}`}
                            className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                          >
                            {decodeHTMLEntities(age)}
                          </Link>
                        ))}
                        
                        {/* Diet Types */}
                        {recipe.diet_types?.map((diet, index) => (
                          <Link 
                            key={index}
                            href={`/tarifler?diet-type=${getDietTypeSlug(diet)}`}
                            className={`text-xs font-bold px-3 py-1 rounded-full hover:opacity-80 transition-colors ${
                              index === 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                            }`}
                          >
                            {decodeHTMLEntities(diet)}
                          </Link>
                        ))}
                        
                        {/* Meal Type */}
                        {recipe.meal_type && (
                          <Link 
                            href={`/tarifler?meal-type=${getMealTypeSlug(recipe.meal_type)}`}
                            className="text-xs font-bold px-3 py-1 rounded uppercase tracking-wide bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                          >
                            {decodeHTMLEntities(recipe.meal_type)}
                          </Link>
                        )}
                    </div>
                    
                    <div className="flex items-start justify-between gap-3 group">
                      <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 leading-tight font-sans">
                          {decodeHTMLEntities(recipe.title)}
                      </h1>
                      <EditButton 
                        contentType="recipe" 
                        contentId={recipe.id}
                        authorId={recipe.author?.id}
                        variant="icon"
                      />
                    </div>
                    
                    {/* Rating Section */}
                    <div className="mb-4">
                      <RecipeRating 
                        recipeId={recipe.id}
                        recipeTitle={recipe.title}
                        initialRating={recipe.rating || 0}
                        initialRatingCount={recipe.rating_count || 0}
                        currentUserRating={recipe.user_rating || 0}
                      />
                    </div>
                    
                    <div 
                      className="text-gray-600 mb-6 text-lg prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: sanitizeHTML(recipe.excerpt || recipe.content) 
                      }}
                    />

                    {/* Extended Quick Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                      {recipe.prep_time && (
                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-orange-600 font-medium mb-1">Hazırlık</div>
                          <div className="font-bold text-slate-800">{recipe.prep_time}</div>
                        </div>
                      )}
                      {recipe.cook_time && (
                        <div className="bg-red-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-red-600 font-medium mb-1">Pişirme</div>
                          <div className="font-bold text-slate-800">{recipe.cook_time}</div>
                        </div>
                      )}
                      {recipe.serving_size && (
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-blue-600 font-medium mb-1">Porsiyon</div>
                          <div className="font-bold text-slate-800">{recipe.serving_size}</div>
                        </div>
                      )}
                      {recipe.difficulty && (
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-purple-600 font-medium mb-1">Zorluk</div>
                          <div className="font-bold text-slate-800">{recipe.difficulty}</div>
                        </div>
                      )}
                      {recipe.freezable !== undefined && (
                        <div className="bg-cyan-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-cyan-600 font-medium mb-1">Dondurulabilir</div>
                          <div className="font-bold text-slate-800">{recipe.freezable ? 'Evet ❄️' : 'Hayır'}</div>
                        </div>
                      )}
                      {recipe.storage_info && (
                        <div className="bg-amber-50 rounded-lg p-3 text-center col-span-2">
                          <div className="text-xs text-amber-600 font-medium mb-1">Saklama</div>
                          <div className="font-bold text-slate-800 text-sm">{recipe.storage_info}</div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Yeniden Tasarlanmış (Mobil Uyumlu) */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 md:flex-wrap md:overflow-visible no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                      {/* Favorilere Kaydet */}
                      <button 
                        onClick={handleSaveToFavorites}
                        className={`flex-shrink-0 md:flex-1 md:min-w-[120px] font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                          isFavorite 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-white border-2 border-gray-200 hover:border-red-400 hover:text-red-500 text-gray-600'
                        }`}
                      >
                        <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart text-xl md:text-base`}></i>
                        <span className="hidden md:inline">{isFavorite ? 'Kaydedildi' : 'Kaydet'}</span>
                      </button>
                      
                      {/* Haftalık Plana Ekle */}
                      <button 
                        onClick={handleAddToMealPlan}
                        className="flex-shrink-0 md:flex-1 md:min-w-[120px] bg-purple-500 hover:bg-purple-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-calendar-plus text-xl md:text-base"></i>
                        <span className="hidden md:inline">Plana Ekle</span>
                      </button>
                      
                      {/* Ayracı Çizgi */}
                      <div className="w-px h-10 bg-gray-200 hidden md:block"></div>

                      {/* Sosyal Paylaşım - Mobilde hepsi tek satırda */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={shareWhatsapp} 
                          className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                          title="WhatsApp'ta Paylaş"
                        >
                          <i className="fa-brands fa-whatsapp text-xl"></i>
                        </button>
                        <button 
                          onClick={shareFacebook} 
                          className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                          title="Facebook'ta Paylaş"
                        >
                          <i className="fa-brands fa-facebook-f text-xl"></i>
                        </button>
                        <button 
                          onClick={shareTwitter} 
                          className="bg-black hover:bg-gray-800 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                          title="X'te Paylaş"
                        >
                          <i className="fa-brands fa-x-twitter text-xl"></i>
                        </button>
                        <button 
                          onClick={copyLink} 
                          className="bg-gray-500 hover:bg-gray-600 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                          title="Link Kopyala"
                        >
                          <i className="fa-solid fa-link text-lg"></i>
                        </button>
                      </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* LEFT COLUMN (Main Content) */}
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* INGREDIENTS */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <h2 className="font-display font-bold text-2xl text-slate-800 font-sans">
                                <i className="fa-solid fa-basket-shopping text-orange-500 mr-2"></i> Malzemeler
                            </h2>

                            <div className="flex flex-wrap items-center gap-3">
                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button onClick={copyIngredients} className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-9 h-9 rounded-lg flex items-center justify-center transition-colors" title="Kopyala">
                                        <i className="fa-regular fa-copy"></i>
                                    </button>
                                    <button onClick={shareIngredientsWhatsApp} className="bg-green-50 hover:bg-green-100 text-green-600 w-9 h-9 rounded-lg flex items-center justify-center transition-colors" title="WhatsApp ile Paylaş">
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </button>
                                </div>

                                <div className="w-px h-6 bg-gray-200 hidden md:block"></div>

                                {/* Dynamic Serving Selector */}
                                <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                                    {["Tadım", "1 Öğün", "2 Günlük"].map((portion) => (
                                        <button 
                                            key={portion}
                                            onClick={() => handlePortionChange(portion)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                activePortion === portion 
                                                ? "bg-white text-slate-800 shadow-sm border border-gray-200" 
                                                : "text-gray-500 hover:bg-white hover:shadow-sm"
                                            }`}
                                        >
                                            {portion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {ingredients.map((ing, index) => (
                                <li 
                                    key={ing.id ?? `ingredient-${index}`} 
                                    className={`flex items-start group cursor-pointer select-none transition-all ${ing.checked ? 'opacity-50' : ''}`}
                                >
                                    <div 
                                      className={`mt-1 mr-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                        ing.checked ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'
                                      }`}
                                      onClick={() => toggleIngredient(ing.id ?? index)}
                                    >
                                        <i className={`fa-solid fa-check text-white text-xs transition-transform ${ing.checked ? 'scale-100' : 'scale-0'}`}></i>
                                    </div>
                                    <div className="flex-grow border-b border-gray-50 pb-3 group-hover:border-gray-100 transition-colors">
                                        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${ing.checked ? 'line-through text-gray-400' : 'text-slate-700'}`}>
                                            <span className="font-bold" onClick={() => toggleIngredient(ing.id ?? index)}>
                                                {ing.amount && `${ing.amount} `}
                                                {ing.unit && `${ing.unit} `}
                                                {ing.name || ing.text}
                                            </span>
                                            
                                            <div className="flex items-center gap-2">
                                                {/* Malzeme Notu - Soru işareti */}
                                                {ing.note && !ing.checked && (
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toast.info(ing.note, {
                                                        duration: 4000,
                                                        icon: '💡',
                                                      });
                                                    }}
                                                    className="text-blue-500 hover:text-blue-600 w-6 h-6 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                                                    title="Malzeme notu"
                                                  >
                                                    <i className="fa-solid fa-question text-xs"></i>
                                                  </button>
                                                )}
                                                
                                                {/* İkame Malzeme - Varsa göster */}
                                                {getSubstituteForIngredient(ing.name || ing.text) && !ing.checked && (
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const sub = getSubstituteForIngredient(ing.name || ing.text);
                                                      if (sub) {
                                                        toast(
                                                          <div>
                                                            <p className="font-bold text-sm mb-1">
                                                              <i className="fa-solid fa-arrow-right-arrow-left text-blue-500 mr-2"></i>
                                                              {sub.substitute || sub.replacement} ile değiştirilebilir
                                                            </p>
                                                            {sub.note && <p className="text-xs text-gray-600">{sub.note}</p>}
                                                          </div>,
                                                          { duration: 5000 }
                                                        );
                                                      }
                                                    }}
                                                    className="text-purple-500 hover:text-purple-600 w-6 h-6 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center transition-colors"
                                                    title="İkame malzeme mevcut"
                                                  >
                                                    <i className="fa-solid fa-arrow-right-arrow-left text-xs"></i>
                                                  </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* DÜZENLENDİ: Alternatif Tarif Linki - encodeURIComponent kullanıldı */}
                        {recipe.substitutes && recipe.substitutes.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-dashed border-gray-200 text-center">
                            <p className="text-sm text-gray-500">
                              Evde {recipe.substitutes[0]?.original || 'malzeme'} yok mu?
                            </p>
                            <Link 
                              href={`/tarifler?ingredient=${encodeURIComponent(recipe.substitutes[0]?.substitute || recipe.substitutes[0]?.replacement || '')}`} 
                              className="text-orange-500 font-bold text-sm hover:underline"
                            >
                              {recipe.substitutes[0]?.substitute || recipe.substitutes[0]?.replacement} ile alternatif tariflere git{' '}
                              <i className="fa-solid fa-arrow-right ml-1"></i>
                            </Link>
                          </div>
                        )}
                    </div>

                    {/* Content - Top Ad (between Malzemeler and Hazırlanış) */}
                    <div className="flex justify-center">
                        <AdZone placement="content-top" />
                    </div>

                    {/* INSTRUCTIONS */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 className="font-display font-bold text-2xl text-slate-800 mb-6 font-sans">
                            <i className="fa-solid fa-utensils text-green-500 mr-2"></i> Hazırlanışı
                        </h2>
                        
                        <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:h-full before:w-0.5 before:bg-gray-100 before:content-['']">
                            {instructions.map((step, index) => (
                                <div 
                                    key={step.id ?? `step-${index}`} 
                                    className={`relative pl-10 cursor-pointer group transition-all ${step.completed ? 'opacity-50' : ''}`}
                                    onClick={() => toggleInstruction(step.id ?? index)}
                                >
                                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors font-bold ${
                                        step.completed 
                                        ? 'bg-green-500 border-green-500 text-white' 
                                        : 'bg-orange-50 text-orange-500 border-white shadow-sm group-hover:border-orange-500'
                                    }`}>
                                        {step.completed ? <i className="fa-solid fa-check"></i> : (step.id || index + 1)}
                                    </div>
                                    <h3 className={`font-bold mb-2 transition-colors ${step.completed ? 'line-through text-gray-400' : 'text-slate-800 group-hover:text-orange-500'}`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-gray-600 ${step.completed ? 'line-through' : ''}`}>
                                        {step.text}
                                    </p>
                                    {step.tip && !step.completed && (
                                        <div className="mt-3 bg-yellow-50 border border-yellow-100 p-3 rounded-xl flex gap-3 cursor-auto" onClick={(e) => e.stopPropagation()}>
                                            <i className="fa-solid fa-lightbulb text-yellow-500 mt-1"></i>
                                            <p className="text-xs text-gray-700"><span className="font-bold">Püf Noktası:</span> {step.tip}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* In-Content Ad after instructions */}
                    <InContentAd className="my-8" />

                    {/* Expert Approval - Moved here from header */}
                    {recipe.expert && recipe.expert.approved && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 md:p-5 mt-6">
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="relative flex-shrink-0">
                            <img 
                              src={recipe.expert.image || 'https://placehold.co/100x100/E8F5E9/455A64?text=Uzman'} 
                              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-sm object-cover" 
                              alt={recipe.expert.name || 'Uzman'} 
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[9px] md:text-[10px] border border-white">
                              <i className="fa-solid fa-check"></i>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <p className="text-xs md:text-sm text-slate-700 font-medium mb-2">
                              Bu tarif ile ilgili Uzman Notu:{' '}
                              <Link 
                                href={recipe.expert.slug ? `/uzman/${recipe.expert.slug}` : '#'} 
                                className="text-green-600 underline decoration-dotted font-bold hover:text-green-700"
                              >
                                {recipe.expert.title && `${recipe.expert.title} `}{recipe.expert.name}
                              </Link>
                            </p>
                            {recipe.expert.note && (
                              <div className="bg-white/70 rounded-xl p-2.5 md:p-3 mt-2">
                                <p className="text-[10px] md:text-xs text-gray-500 font-medium mb-1">
                                  <i className="fa-solid fa-comment-medical text-green-500 mr-1"></i> Uzman Notu:
                                </p>
                                <p className="text-xs md:text-sm text-gray-700">{recipe.expert.note}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NUTRITION & WARNINGS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Besin Değerleri - Genişletilmiş */}
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                                <i className="fa-solid fa-circle-info text-blue-400 mr-2"></i> Besin Değerleri
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                {recipe.nutrition?.calories && (
                                  <div className="flex justify-between border-b border-blue-100 pb-1">
                                      <span>Kalori</span>
                                      <span className="font-bold">{recipe.nutrition.calories}</span>
                                  </div>
                                )}
                                {recipe.nutrition?.protein && (
                                  <div className="flex justify-between border-b border-blue-100 pb-1">
                                      <span>Protein</span>
                                      <span className="font-bold">{recipe.nutrition.protein}</span>
                                  </div>
                                )}
                                {recipe.nutrition?.carbs && (
                                  <div className="flex justify-between border-b border-blue-100 pb-1">
                                      <span>Karbonhidrat</span>
                                      <span className="font-bold">{recipe.nutrition.carbs}</span>
                                  </div>
                                )}
                                {recipe.nutrition?.fat && (
                                  <div className="flex justify-between border-b border-blue-100 pb-1">
                                      <span>Yağ</span>
                                      <span className="font-bold">{recipe.nutrition.fat}</span>
                                  </div>
                                )}
                                {recipe.nutrition?.fiber && (
                                  <div className="flex justify-between border-b border-blue-100 pb-1">
                                      <span>Lif</span>
                                      <span className="font-bold">{recipe.nutrition.fiber}</span>
                                  </div>
                                )}
                                {recipe.nutrition?.sugar && (
                                  <div className="flex justify-between border-b border-blue-100 pb-1">
                                      <span>Şeker</span>
                                      <span className="font-bold">{recipe.nutrition.sugar}</span>
                                  </div>
                                )}
                                {recipe.nutrition?.sodium && (
                                  <div className="flex justify-between border-b border-blue-100 pb-1">
                                      <span>Sodyum</span>
                                      <span className="font-bold">{recipe.nutrition.sodium}</span>
                                  </div>
                                )}
                                {recipe.nutrition?.vitamins && (
                                  <div className="flex justify-between border-b border-blue-100 pb-1">
                                      <span>Vitaminler</span>
                                      <span className="font-bold text-green-600">{decodeHTMLEntities(recipe.nutrition.vitamins)}</span>
                                  </div>
                                )}
                                {recipe.nutrition?.minerals && (
                                  <div className="flex justify-between">
                                      <span>Mineraller</span>
                                      <span className="font-bold text-blue-600">{decodeHTMLEntities(recipe.nutrition.minerals)}</span>
                                  </div>
                                )}
                                {!recipe.nutrition?.calories && !recipe.nutrition?.protein && !recipe.nutrition?.fiber && (
                                  <p className="text-gray-500 text-xs italic">Besin değerleri henüz eklenmemiş.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                                <i className="fa-solid fa-triangle-exclamation text-red-400 mr-2"></i> Alerjen Uyarısı
                            </h4>
                            {recipe.allergens && recipe.allergens.length > 0 ? (
                              <>
                                <p className="text-sm text-gray-600 mb-3">Bu tarif aşağıdaki alerjenleri içermektedir:</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {recipe.allergens.map((allergen, index) => (
                                    <Link 
                                      key={index}
                                      href={`/tarifler?allergen=${encodeURIComponent(allergen.toLowerCase())}`}
                                      className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                                    >
                                      {decodeHTMLEntities(allergen)}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-sm text-gray-600 mb-2">Bu tarif düşük alerjen riskine sahiptir. Ancak bebeğinizin malzemeleri daha önce denediğinden emin olun.</p>
                            )}
                            <Link 
                              href="/beslenme-rehberi/3-gun-kurali" 
                              className="text-xs font-bold text-red-500 underline hover:text-red-600"
                            >
                              3 Gün Kuralı Nedir?
                            </Link>
                        </div>
                    </div>

                    {/* Özel Notlar */}
                    {recipe.special_notes && (
                      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                          <i className="fa-solid fa-sticky-note text-yellow-500 mr-2"></i> Özel Notlar
                        </h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{recipe.special_notes}</p>
                      </div>
                    )}

                    {/* Author Info - Dikkat Çekici Tasarım */}
                    {recipe.author && (
                      <Link 
                        href={`/uzman/${recipe.author.slug || recipe.author.id}`}
                        className="block bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 hover:shadow-md transition-all group mb-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={getAuthorAvatar(recipe.author) || 'https://placehold.co/64x64/FFF3E0/FF9800?text=👨‍🍳'} 
                              className="w-16 h-16 rounded-full border-3 border-white shadow-md object-cover" 
                              alt={recipe.author.name}
                              onError={(e) => {
                                // Fallback to ui-avatars.com on error
                                (e.target as HTMLImageElement).src = generateUIAvatarURL(recipe.author?.name || 'User');
                              }}
                            />
                            <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-white">
                              <i className="fa-solid fa-utensils"></i>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide mb-1">Tarif Sahibi</p>
                            <p className="font-bold text-slate-800 text-lg group-hover:text-orange-600 transition-colors">
                              {recipe.author.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">Tüm tariflerini görüntüle →</p>
                          </div>
                          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <i className="fa-solid fa-arrow-right"></i>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* SIMILAR SAFE RECIPES - shown only if recipe has safety concerns */}
                    {activeChild && (
                      <SimilarSafeRecipesSection recipeId={recipe.id} childId={activeChild.id} />
                    )}

                    {/* YORUM BÖLÜMÜ */}
                    <CommentSection postId={recipe.id} postType="recipe" />

                </div>

                {/* RIGHT COLUMN (Sidebar) - Sticky */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                    
                    {/* Sidebar Ads */}
                    <SidebarAds />
                    
                    {/* ECOSYSTEM CROSS-SELL */}
                    <CrossSellWidget 
                      crossSell={recipe.cross_sell}
                      ingredients={recipe.ingredients}
                      recipeTitle={recipe.title}
                    />

                    {/* SIDEBAR ARAÇLAR - Rastgele 4 Faydalı Araç */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <i className="fa-solid fa-wand-magic-sparkles text-orange-500 mr-2"></i> 
                        Faydalı Araçlar
                      </h3>
                      <div className="space-y-2">
                        {/* Loading State veya Araç Listesi */}
                        {sidebarTools.length === 0 ? (
                          // Yüklenirken gösterilecek skeleton
                          [1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 animate-pulse">
                              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                          ))
                        ) : (
                          sidebarTools.map((tool) => (
                            <Link
                              key={tool.path}
                              href={tool.path}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                              <div className={`w-10 h-10 ${tool.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <i className={`${tool.icon} ${tool.color}`}></i>
                              </div>
                              <span className="font-medium text-slate-700 group-hover:text-orange-500 transition-colors text-sm">
                                {tool.name}
                              </span>
                              <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs"></i>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>

                    {/* ASK AN EXPERT - Topluluk'a Yönlendir */}
                    <div className="bg-orange-50/50 border border-yellow-100 rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-yellow-500 text-xl">
                            <i className="fa-solid fa-question"></i>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Aklınıza takılan mı var?</h3>
                        <p className="text-xs text-gray-600 mb-4">Bu tarifle ilgili sorunuzu topluluğumuza sorun.</p>
                        <Link 
                          href={`/topluluk/soru-sor?konu=${encodeURIComponent(recipe.title)}`}
                          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl transition-colors"
                        >
                          <i className="fa-solid fa-comment-dots"></i> Soru Sor
                        </Link>
                    </div>

                    </div>
                </div>
            </div>

            {/* Content - After Hero Ad */}
            <div className="mt-10 flex justify-center">
                <AdZone placement="content-after-hero" />
            </div>

            {/* INGREDIENT CARDS - Malzemeler Bölümü */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mt-10">
                <h3 className="font-bold text-slate-800 mb-6 text-xl flex items-center">
                  <i className="fa-solid fa-carrot text-green-500 mr-2"></i> Tarifin Malzemeleri
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {recipe.ingredients.slice(0, 6).map((ingredient, index) => {
                    // Create slug from ingredient name
                    const ingredientSlug = (ingredient.name || ingredient.text || '')
                      .toLowerCase()
                      .replace(/ş/g, 's')
                      .replace(/ğ/g, 'g')
                      .replace(/ü/g, 'u')
                      .replace(/ö/g, 'o')
                      .replace(/ç/g, 'c')
                      .replace(/ı/g, 'i')
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    
                    return (
                      <Link 
                        key={ingredient.id || index}
                        href={`/beslenme-rehberi/${ingredientSlug}`}
                        className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center"
                      >
                        {/* Ingredient Icon/Image Placeholder */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-leaf text-2xl text-green-500"></i>
                        </div>
                        
                        {/* Ingredient Name */}
                        <h4 className="font-bold text-sm text-slate-800 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {decodeHTMLEntities(ingredient.name || ingredient.text || '')}
                        </h4>
                        
                        {/* Starting Age - if available */}
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full mt-auto">
                          <i className="fa-solid fa-info-circle mr-1"></i>
                          Detaylar
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DÜZENLENDİ: Benzer Tarifler - Filtreleme ve Sonra Dilimleme */}
            {recipe.related_recipes && recipe.related_recipes.length > 0 && (
              <div className="mt-10">
                <h3 className="font-bold text-slate-800 mb-6 text-xl flex items-center">
                  <i className="fa-solid fa-utensils text-orange-500 mr-2"></i> Benzer Tarifler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recipe.related_recipes
                    .filter(r => r.id !== recipe.id) // Önce mevcut tarifi çıkar
                    .slice(0, 4) // Sonra ilk 4 taneyi al
                    .map((related) => (
                    <RecipeCard 
                      key={related.id}
                      recipe={related}
                    />
                  ))}
                </div>
              </div>
            )}

        </div>

        {/* Video Modal */}
        {showVideoModal && recipe.video_url && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowVideoModal(false)}>
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold text-slate-800">Tarif Videosu</h3>
                <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <div className="aspect-video">
                <iframe 
                  src={recipe.video_url.replace('watch?v=', 'embed/')} 
                  className="w-full h-full" 
                  allowFullScreen
                  title={recipe.title}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}