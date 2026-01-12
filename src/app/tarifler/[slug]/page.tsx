"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { recipeService } from '@/services/recipe-service';
import { Recipe } from '@/lib/types';

export default function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [instructions, setInstructions] = useState<any[]>([]);
  const [activePortion, setActivePortion] = useState("1 Öğün");

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
          setIngredients(data.ingredients || []);
          setInstructions(data.instructions || []);
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
  const toggleIngredient = (id: number) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, checked: !ing.checked } : ing
    ));
  };

  // Adım tamamlama fonksiyonu
  const toggleInstruction = (id: number) => {
    setInstructions(instructions.map(inst => 
      inst.id === id ? { ...inst, completed: !inst.completed } : inst
    ));
  };

  // Kopyalama fonksiyonu
  const copyIngredients = () => {
    const text = ingredients.map(i => `- ${i.text}`).join("\n");
    navigator.clipboard.writeText(text);
    alert("Malzemeler kopyalandı!");
  };

  // WhatsApp paylaşım fonksiyonu
  const shareWhatsapp = () => {
    if (recipe) {
      const text = `Bu tarife bayıldım: ${recipe.title} - KidsGourmet`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
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
        
        {/* BREADCRUMB */}
        <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        {/* Localde Link kullanın */}
                        <li><Link href="/" className="hover:text-orange-500"><i className="fa-solid fa-house"></i></Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li><Link href="/tarifler" className="hover:text-orange-500">Tarifler</Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li><Link href="/tarifler?kategori=corbalar" className="hover:text-orange-500">Çorbalar</Link></li>
                        <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                        <li className="font-semibold text-orange-500 capitalize">{recipe.title}</li>
                    </ol>
                </nav>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* HEADER SECTION */}
            <div className="flex flex-col lg:flex-row gap-8 mb-10">
                {/* Left: Image */}
                <div className="w-full lg:w-1/2 relative rounded-[2rem] overflow-hidden shadow-lg group h-[300px] lg:h-[400px]">
                    <img src={recipe.image || 'https://placehold.co/800x600/FF8A65/ffffff?text=Tarif'} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="bg-white/90 backdrop-blur text-slate-800 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm flex items-center">
                            <i className="fa-regular fa-clock text-orange-500 mr-2"></i> {recipe.prep_time}
                        </span>
                        {recipe.age_groups && recipe.age_groups.length > 0 && (
                          <span className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm flex items-center">
                              <i className="fa-solid fa-baby mr-2"></i> {recipe.age_groups[0]}
                          </span>
                        )}
                    </div>

                    {/* Video Button */}
                    {recipe.video_url && (
                      <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-red-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all animate-pulse">
                          <i className="fa-solid fa-play text-xl ml-1"></i>
                      </button>
                    )}
                </div>

                {/* Right: Meta Info */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                        {recipe.diet_types && recipe.diet_types.map((feature, index) => (
                            <span key={index} className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${index === 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                {feature}
                            </span>
                        ))}
                    </div>
                    
                    <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-4 leading-tight font-sans">
                        {recipe.title}
                    </h1>
                    
                    <p className="text-gray-600 mb-6 text-lg">
                        {recipe.excerpt || recipe.content}
                    </p>

                    {/* Expert Approval Box */}
                    {recipe.expert && recipe.expert.approved && (
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4 mb-6">
                          <div className="relative">
                              <img src={recipe.expert.image || 'https://placehold.co/100x100/E8F5E9/455A64?text=Uzman'} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Uzman" />
                              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-white">
                                  <i className="fa-solid fa-check"></i>
                              </div>
                          </div>
                          <div>
                              <p className="text-xs text-green-600 font-bold uppercase mb-0.5">Beslenme Uzmanı Onaylı</p>
                              <p className="text-sm text-slate-700 font-medium">Bu tarif <Link href="#" className="text-green-600 underline decoration-dotted font-bold">{recipe.expert.name} (Rejimde.com)</Link> tarafından onaylanmıştır.</p>
                          </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
                            <i className="fa-solid fa-print"></i> Yazdır
                        </button>
                        <button className="flex-1 bg-white border-2 border-gray-200 hover:border-red-400 hover:text-red-500 text-gray-600 font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                            <i className="fa-regular fa-heart"></i> Kaydet
                        </button>
                        <button onClick={shareWhatsapp} className="bg-white border-2 border-gray-200 hover:border-green-500 hover:text-green-500 text-gray-600 w-14 rounded-xl flex items-center justify-center transition-colors">
                            <i className="fa-brands fa-whatsapp text-xl"></i>
                        </button>
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
                                </div>

                                <div className="w-px h-6 bg-gray-200 hidden md:block"></div>

                                {/* Dynamic Serving Selector */}
                                <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                                    {["Tadım", "1 Öğün", "2 Günlük"].map((portion) => (
                                        <button 
                                            key={portion}
                                            onClick={() => setActivePortion(portion)}
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
                            {ingredients.map((ing) => (
                                <li 
                                    key={ing.id} 
                                    className={`flex items-start group cursor-pointer select-none transition-all ${ing.checked ? 'opacity-50' : ''}`}
                                    onClick={() => toggleIngredient(ing.id)}
                                >
                                    <div className={`mt-1 mr-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                        ing.checked ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'
                                    }`}>
                                        <i className={`fa-solid fa-check text-white text-xs transition-transform ${ing.checked ? 'scale-100' : 'scale-0'}`}></i>
                                    </div>
                                    <div className="flex-grow border-b border-gray-50 pb-3 group-hover:border-gray-100 transition-colors">
                                        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${ing.checked ? 'line-through text-gray-400' : 'text-slate-700'}`}>
                                            <span className="font-bold">{ing.text}</span>
                                            
                                            {ing.note && !ing.checked && (
                                                <div className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors w-fit" onClick={(e) => { e.stopPropagation(); alert(ing.note); }}>
                                                    <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                                    <span>İkame Mevcut</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 pt-4 border-t border-dashed border-gray-200 text-center">
                            <p className="text-sm text-gray-500">Evde bal kabağı yok mu?</p>
                            {/* Localde Link kullanın */}
                            <Link href="#" className="text-orange-500 font-bold text-sm hover:underline">Havuçlu alternatif tarife git <i className="fa-solid fa-arrow-right ml-1"></i></Link>
                        </div>
                    </div>

                    {/* INSTRUCTIONS */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 className="font-display font-bold text-2xl text-slate-800 mb-6 font-sans">
                            <i className="fa-solid fa-utensils text-green-500 mr-2"></i> Hazırlanışı
                        </h2>
                        
                        <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:h-full before:w-0.5 before:bg-gray-100 before:content-['']">
                            {instructions.map((step) => (
                                <div 
                                    key={step.id} 
                                    className={`relative pl-10 cursor-pointer group transition-all ${step.completed ? 'opacity-50' : ''}`}
                                    onClick={() => toggleInstruction(step.id)}
                                >
                                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors font-bold ${
                                        step.completed 
                                        ? 'bg-green-500 border-green-500 text-white' 
                                        : 'bg-orange-50 text-orange-500 border-white shadow-sm group-hover:border-orange-500'
                                    }`}>
                                        {step.completed ? <i className="fa-solid fa-check"></i> : step.id}
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

                    {/* NUTRITION & WARNINGS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                                <i className="fa-solid fa-circle-info text-blue-400 mr-2"></i> Besin Değerleri
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between border-b border-blue-100 pb-1">
                                    <span>Kalori</span>
                                    <span className="font-bold">65 kcal</span>
                                </div>
                                <div className="flex justify-between border-b border-blue-100 pb-1">
                                    <span>A Vitamini</span>
                                    <span className="font-bold text-green-600">Yüksek</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Lif</span>
                                    <span className="font-bold">2.4g</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                                <i className="fa-solid fa-triangle-exclamation text-red-400 mr-2"></i> Alerjen Uyarısı
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">Bu tarif düşük alerjen riskine sahiptir. Ancak bebeğinizin daha önce bal kabağı veya patates denediğinden emin olun.</p>
                            {/* Localde Link kullanın */}
                            <Link href="#" className="text-xs font-bold text-red-500 underline">3 Gün Kuralı Nedir?</Link>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (Sidebar) */}
                <div className="lg:col-span-1 space-y-8">
                    
                    {/* ECOSYSTEM CROSS-SELL */}
                    <div className="bg-slate-800 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl sticky top-24">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-2xl opacity-30 -mr-10 -mt-10"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 opacity-80">
                                <i className="fa-solid fa-utensils"></i>
                                <span className="text-xs font-bold uppercase tracking-wider">Ebeveynlere Özel</span>
                            </div>
                            
                            <h3 className="font-sans font-bold text-2xl mb-3">Bizimkiler Ne Yiyecek?</h3>
                            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                Artan bal kabağı ile kendinize harika bir <span className="text-purple-400 font-bold">Sinkonta (Fırın Kabak)</span> yapabilirsiniz.
                            </p>

                            <Link href="https://tariften.com" target="_blank" className="block w-full bg-purple-600 hover:bg-purple-500 text-white text-center font-bold py-3 rounded-xl transition-all shadow-lg border border-purple-400">
                                Tarifi Gör (Tariften.com) <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-xs"></i>
                            </Link>
                        </div>
                    </div>

                    {/* RELATED RECIPES */}
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4 text-lg">Benzer Tarifler</h3>
                        <div className="space-y-4">
                            {/* Localde Link kullanın */}
                            <Link href="#" className="flex gap-4 group">
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src="https://placehold.co/150x150/AED581/ffffff?text=Brokoli" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Brokoli" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors text-sm mb-1">Brokoli Çorbası</h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">+6 Ay</span>
                                </div>
                            </Link>
                            
                             <Link href="#" className="flex gap-4 group">
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src="https://placehold.co/150x150/FF8A65/ffffff?text=Havuc" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Havuç" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors text-sm mb-1">Havuç Püresi</h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">+4 Ay</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* ASK AN EXPERT */}
                    <div className="bg-orange-50/50 border border-yellow-100 rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-yellow-500 text-xl">
                            <i className="fa-solid fa-question"></i>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Aklınıza takılan mı var?</h3>
                        <p className="text-xs text-gray-600 mb-4">Bu tarifle ilgili sorunuzu Rejimde.com uzmanlarına iletin.</p>
                        <button className="text-slate-800 font-bold text-sm underline hover:text-orange-500">Soru Sor</button>
                    </div>

                </div>
            </div>

        </div>
    </div>
  );
}