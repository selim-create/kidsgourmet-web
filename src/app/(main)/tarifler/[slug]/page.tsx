"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipe-service';
import { Recipe, RecipeIngredient, RecipeInstruction } from '@/lib/types';
import CrossSellWidget from '@/components/features/recipe/CrossSellWidget';
import AgeWarningBanner from '@/components/features/age/AgeWarningBanner';
import { useAgeGroups } from '@/hooks/useAgeGroups';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';
import { decodeHTMLEntities, calculatePortion, portionMultipliers } from '@/utils/helpers';
import ClientHead from '@/components/seo/ClientHead';

export default function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [originalIngredients, setOriginalIngredients] = useState<RecipeIngredient[]>([]);
  const [instructions, setInstructions] = useState<RecipeInstruction[]>([]);
  const [activePortion, setActivePortion] = useState("1 Öğün");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { ageGroups } = useAgeGroups();
  const { user, isAuthenticated } = useUser();

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
          onClick: () => router.push('/giris?redirect=' + encodeURIComponent(window.location.pathname))
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
          onClick: () => router.push('/giris?redirect=' + encodeURIComponent(window.location.pathname))
        }
      });
      return;
    }
    toggleFavorite();
  };

  // Helper to find substitute for an ingredient
  const getSubstituteForIngredient = (ingredientName: string) => {
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
        
        {/* BREADCRUMB - Header altında kalmayacak şekilde padding ekle */}
        <div className="bg-white border-b border-gray-100 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li><Link href="/" className="hover:text-orange-500"><i className="fa-solid fa-house"></i></Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li><Link href="/tarifler" className="hover:text-orange-500">Tarifler</Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li>
                          <Link 
                            href={`/tarifler?meal-type=${recipe.meal_type ? encodeURIComponent(recipe.meal_type.toLowerCase()) : ''}`} 
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
            
            {/* Age Warning Banner */}
            <AgeWarningBanner 
              recipeAgeGroups={ageGroups.filter(ag => (recipe.age_groups || []).includes(ag.name))}
              recipeIngredients={(recipe.ingredients || []).map(ing => ing.name || ing.text || '')}
            />
            
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
                          <span className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm flex items-center w-fit">
                              <i className="fa-solid fa-baby mr-2"></i> {decodeHTMLEntities(recipe.age_groups[0])}
                          </span>
                        )}
                    </div>

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
                        {/* Age Groups - Tıklanabilir */}
                        {recipe.age_groups?.map((age, index) => (
                          <Link 
                            key={index}
                            href={`/tarifler?age-group=${encodeURIComponent(age.toLowerCase().replace(/\s/g, '-'))}`}
                            className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                          >
                            {decodeHTMLEntities(age)}
                          </Link>
                        ))}
                        
                        {/* Diet Types - Tıklanabilir */}
                        {recipe.diet_types?.map((diet, index) => (
                          <Link 
                            key={index}
                            href={`/tarifler?diet-type=${encodeURIComponent(diet.toLowerCase().replace(/\s/g, '-'))}`}
                            className={`text-xs font-bold px-3 py-1 rounded-full hover:opacity-80 transition-colors ${
                              index === 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                            }`}
                          >
                            {decodeHTMLEntities(diet)}
                          </Link>
                        ))}
                        
                        {/* Meal Type - Tıklanabilir */}
                        {recipe.meal_type && (
                          <Link 
                            href={`/tarifler?meal-type=${encodeURIComponent(recipe.meal_type.toLowerCase().replace(/\s/g, '-'))}`}
                            className="text-xs font-bold px-3 py-1 rounded uppercase tracking-wide bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                          >
                            {decodeHTMLEntities(recipe.meal_type)}
                          </Link>
                        )}
                    </div>
                    
                    <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-4 leading-tight font-sans">
                        {decodeHTMLEntities(recipe.title)}
                    </h1>
                    
                    <p className="text-gray-600 mb-6 text-lg">
                        {decodeHTMLEntities(recipe.excerpt || recipe.content)}
                    </p>

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

                    {/* Action Buttons - Yeniden Tasarlanmış */}
                    <div className="flex flex-wrap gap-3">
                      {/* Favorilere Kaydet */}
                      <button 
                        onClick={handleSaveToFavorites}
                        className={`flex-1 min-w-[120px] font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                          isFavorite 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-white border-2 border-gray-200 hover:border-red-400 hover:text-red-500 text-gray-600'
                        }`}
                      >
                        <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                        {isFavorite ? 'Kaydedildi' : 'Kaydet'}
                      </button>
                      
                      {/* Haftalık Plana Ekle */}
                      <button 
                        onClick={handleAddToMealPlan}
                        className="flex-1 min-w-[120px] bg-purple-500 hover:bg-purple-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-calendar-plus"></i>
                        Plana Ekle
                      </button>
                      
                      {/* Sosyal Paylaşım */}
                      <div className="flex gap-2">
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
                          className="bg-sky-500 hover:bg-sky-600 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                          title="Twitter'da Paylaş"
                        >
                          <i className="fa-brands fa-twitter text-xl"></i>
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

                        {/* Alternatif Tarif Önerisi */}
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

                    {/* Expert Approval - Moved here from header */}
                    {recipe.expert && recipe.expert.approved && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 mt-6">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <img 
                              src={recipe.expert.image || 'https://placehold.co/100x100/E8F5E9/455A64?text=Uzman'} 
                              className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover" 
                              alt={recipe.expert.name || 'Uzman'} 
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-white">
                              <i className="fa-solid fa-check"></i>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm text-slate-700 font-medium mb-2">
                              Bu tarif{' '}
                              <Link 
                                href={recipe.expert.slug ? `/uzman/${recipe.expert.slug}` : '#'} 
                                className="text-green-600 underline decoration-dotted font-bold hover:text-green-700"
                              >
                                {recipe.expert.title && `${recipe.expert.title} `}{recipe.expert.name}
                              </Link>
                              {' '}tarafından onaylanmıştır.
                            </p>
                            {recipe.expert.note && (
                              <div className="bg-white/70 rounded-xl p-3 mt-2">
                                <p className="text-xs text-gray-500 font-medium mb-1">
                                  <i className="fa-solid fa-comment-medical text-green-500 mr-1"></i> Uzman Notu:
                                </p>
                                <p className="text-sm text-gray-700">{recipe.expert.note}</p>
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
                              src={recipe.author.avatar || 'https://placehold.co/64x64/FFF3E0/FF9800?text=👨‍🍳'} 
                              className="w-16 h-16 rounded-full border-3 border-white shadow-md object-cover" 
                              alt={recipe.author.name} 
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

                </div>

                {/* RIGHT COLUMN (Sidebar) - Sticky */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                    
                    {/* ECOSYSTEM CROSS-SELL */}
                    <CrossSellWidget 
                      crossSell={recipe.cross_sell}
                      ingredients={recipe.ingredients}
                      recipeTitle={recipe.title}
                    />

                    {/* SIDEBAR ARAÇLAR - Yeni Tasarım */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <i className="fa-solid fa-wand-magic-sparkles text-orange-500 mr-2"></i> 
                        Faydalı Araçlar
                      </h3>
                      <div className="space-y-2">
                        {[
                          { name: 'BLW Hazırlık Testi', slug: 'blw-testi', icon: 'fa-baby', color: 'text-pink-500', bg: 'bg-pink-50' },
                          { name: 'Persentil Hesaplayıcı', slug: 'persentil', icon: 'fa-chart-line', color: 'text-blue-500', bg: 'bg-blue-50' },
                          { name: 'Su İhtiyacı Hesaplayıcı', slug: 'su-ihtiyaci', icon: 'fa-droplet', color: 'text-cyan-500', bg: 'bg-cyan-50' },
                          { name: 'Alerjen Planlayıcı', slug: 'alerjen-planlayici', icon: 'fa-shield-halved', color: 'text-red-500', bg: 'bg-red-50' },
                          { name: 'Ek Gıda Rehberi', slug: 'ek-gida-rehberi', icon: 'fa-book-open', color: 'text-green-500', bg: 'bg-green-50' },
                          { name: 'Bu Gıda Verilir mi?', slug: 'bu-gida-verilir-mi', icon: 'fa-circle-question', color: 'text-amber-500', bg: 'bg-amber-50' },
                        ].sort(() => Math.random() - 0.5).slice(0, 4).map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/akilli-asistan/${tool.slug}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className={`w-10 h-10 ${tool.bg} rounded-xl flex items-center justify-center`}>
                              <i className={`fa-solid ${tool.icon} ${tool.color}`}></i>
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-orange-500 transition-colors text-sm">
                              {tool.name}
                            </span>
                            <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs"></i>
                          </Link>
                        ))}
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
                          href={`/topluluk/yeni-soru?konu=${encodeURIComponent(recipe.title)}`}
                          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl transition-colors"
                        >
                          <i className="fa-solid fa-comment-dots"></i> Soru Sor
                        </Link>
                    </div>

                    </div>
                </div>
            </div>

            {/* RELATED RECIPES - 3 Adet Büyük Kartlar */}
            {recipe.related_recipes && recipe.related_recipes.length > 0 && (
              <div className="mt-10">
                <h3 className="font-bold text-slate-800 mb-6 text-xl flex items-center">
                  <i className="fa-solid fa-utensils text-orange-500 mr-2"></i> Benzer Tarifler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recipe.related_recipes.slice(0, 3).map((related) => (
                    <Link 
                      key={related.id}
                      href={`/tarifler/${related.slug}`} 
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={related.image || 'https://placehold.co/400x300/FF8A65/ffffff?text=Tarif'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={related.title} 
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors mb-2">
                          {decodeHTMLEntities(related.title)}
                        </h4>
                        <div className="flex items-center gap-2">
                          {related.age_group && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {related.age_group}
                            </span>
                          )}
                          {related.prep_time && (
                            <span className="text-xs text-gray-500">
                              <i className="fa-regular fa-clock mr-1"></i>{related.prep_time}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
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