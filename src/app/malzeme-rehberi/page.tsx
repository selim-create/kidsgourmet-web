"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { ingredientService } from '@/services/ingredient-service';
import { Ingredient } from '@/lib/types';

export default function IngredientsGuidePage() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["Tümü", "Sebzeler", "Meyveler", "Tahıllar", "Protein"];

  useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true);
        const data = await ingredientService.getAll();
        setIngredients(data || []);
      } catch (error) {
        console.error("Malzemeler yüklenirken hata:", error);
        setIngredients([]);
      } finally {
        setLoading(false);
      }
    }
    fetchIngredients();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO & SEARCH */}
      {/* DÜZELTME: -mt-8 kaldırıldı, tam genişlik için -mx sınıfları eklendi */}
      <div className="bg-green-50/50 relative overflow-hidden pb-16 pt-12 -mx-4 sm:-mx-6 lg:-mx-8">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100/50 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-800 mb-4 font-sans">Malzeme Rehberi</h1>
              <p className="text-gray-600 text-lg mb-8">
                  "Bebeğim neyi, ne zaman yiyebilir?" sorusunun cevabını uzman onaylı sözlüğümüzde arayın.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                  <input type="text" placeholder="Merak ettiğiniz besini yazın (Örn: Yumurta, Çilek...)" className="w-full py-4 pl-14 pr-6 rounded-full shadow-lg border-2 border-white focus:border-green-400 outline-none text-gray-700 font-medium transition-colors" />
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                      <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <button className="absolute right-2 top-2 bottom-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold transition-colors">
                      Ara
                  </button>
              </div>
          </div>
      </div>

      {/* SEASONAL SPOTLIGHT (Overlap Effect) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-12">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-xl md:text-2xl text-slate-800 flex items-center font-sans">
                      <i className="fa-solid fa-calendar-day text-orange-500 mr-3"></i> Bu Ayın Yıldızları (Ocak)
                  </h2>
                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Mevsiminde Güzel</span>
              </div>

              {/* Horizontal Scroll Grid */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {/* Seasonal Item 1 */}
                  {/* Localde Link kullanın */}
                  <Link href="/malzeme-rehberi/avokado" className="group text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-orange-100 mb-2 overflow-hidden border-2 border-transparent group-hover:border-orange-500 transition-all">
                          <img src="https://placehold.co/150x150/FF8A65/ffffff?text=Bal+Kabagi" className="w-full h-full object-cover" alt="Bal Kabağı" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-orange-500 transition-colors">Bal Kabağı</span>
                  </Link>
                  {/* Seasonal Item 2 */}
                  <Link href="#" className="group text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-green-100 mb-2 overflow-hidden border-2 border-transparent group-hover:border-green-500 transition-all">
                          <img src="https://placehold.co/150x150/AED581/ffffff?text=Brokoli" className="w-full h-full object-cover" alt="Brokoli" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-green-500 transition-colors">Brokoli</span>
                  </Link>
                  {/* Seasonal Item 3 */}
                  <Link href="#" className="group text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-green-100 mb-2 overflow-hidden border-2 border-transparent group-hover:border-green-500 transition-all">
                          <img src="https://placehold.co/150x150/81C784/ffffff?text=Ispanak" className="w-full h-full object-cover" alt="Ispanak" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-green-500 transition-colors">Ispanak</span>
                  </Link>
                  {/* Seasonal Item 4 */}
                  <Link href="#" className="group text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-orange-100 mb-2 overflow-hidden border-2 border-transparent group-hover:border-orange-500 transition-all">
                          <img src="https://placehold.co/150x150/FFCC80/ffffff?text=Portakal" className="w-full h-full object-cover" alt="Portakal" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-orange-500 transition-colors">Portakal</span>
                  </Link>
                  {/* Seasonal Item 5 */}
                  <Link href="#" className="group text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-red-100 mb-2 overflow-hidden border-2 border-transparent group-hover:border-red-500 transition-all">
                          <img src="https://placehold.co/150x150/EF9A9A/ffffff?text=Nar" className="w-full h-full object-cover" alt="Nar" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-red-500 transition-colors">Nar</span>
                  </Link>
                  {/* Seasonal Item 6 */}
                  <Link href="#" className="group text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-yellow-100 mb-2 overflow-hidden border-2 border-transparent group-hover:border-yellow-500 transition-all">
                          <img src="https://placehold.co/150x150/FFF59D/ffffff?text=Karnabahar" className="w-full h-full object-cover" alt="Karnabahar" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-yellow-500 transition-colors">Karnabahar</span>
                  </Link>
              </div>
          </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {categories.map((cat) => (
                  <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2.5 rounded-full font-bold shadow-sm transition-all flex items-center gap-2 ${
                          activeCategory === cat 
                          ? "bg-slate-800 text-white shadow-md transform scale-105" 
                          : "bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                      }`}
                  >
                      {cat === "Sebzeler" && <i className="fa-solid fa-carrot"></i>}
                      {cat === "Meyveler" && <i className="fa-solid fa-apple-whole"></i>}
                      {cat === "Tahıllar" && <i className="fa-solid fa-wheat-awn"></i>}
                      {cat === "Protein" && <i className="fa-solid fa-drumstick-bite"></i>}
                      {cat}
                  </button>
              ))}
          </div>

          {/* Ingredient Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {loading ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              ) : ingredients.length > 0 ? (
                ingredients.map((ingredient) => (
                  <Link key={ingredient.id} href={`/malzeme-rehberi/${ingredient.slug}`} className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                      <div className="w-full h-40 bg-green-50 rounded-2xl mb-4 overflow-hidden relative">
                          <img src={ingredient.image || `https://placehold.co/400x300/AED581/ffffff?text=${ingredient.name}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={ingredient.name} />
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                              <i className="fa-solid fa-baby text-green-500 mr-1"></i> {ingredient.start_age}
                          </div>
                      </div>
                      <h3 className="font-display font-bold text-xl text-slate-800 mb-1 font-sans">{ingredient.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ingredient.description}</p>
                      <div className="mt-auto flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                            ingredient.allergy_risk === 'Düşük' ? 'bg-green-100 text-green-700 border-green-200' :
                            ingredient.allergy_risk === 'Orta' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-red-100 text-red-700 border-red-200'
                          }`}>
                            {ingredient.allergy_risk === 'Yüksek' && <i className="fa-solid fa-triangle-exclamation mr-1"></i>}
                            {ingredient.allergy_risk} Alerjen
                          </span>
                      </div>
                  </Link>
                ))
              ) : (
                <>
              {/* Card 1: Avokado (Ideal) */}
              {/* Localde Link kullanın */}
              <Link href="/malzeme-rehberi/avokado" className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                  <div className="w-full h-40 bg-green-50 rounded-2xl mb-4 overflow-hidden relative">
                      <img src="https://placehold.co/400x300/AED581/ffffff?text=Avokado" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Avokado" />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                          <i className="fa-solid fa-baby text-green-500 mr-1"></i> +6 Ay
                      </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-1 font-sans">Avokado</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">Sağlıklı yağlar açısından zengin, mükemmel ilk gıda.</p>
                  <div className="mt-auto flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded border border-green-200">Düşük Alerjen</span>
                  </div>
              </Link>

              {/* Card 2: Yumurta (Allergen Warning) */}
              <Link href="#" className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                  <div className="w-full h-40 bg-yellow-50 rounded-2xl mb-4 overflow-hidden relative">
                      <img src="https://placehold.co/400x300/FFF176/ffffff?text=Yumurta" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Yumurta" />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                          <i className="fa-solid fa-baby text-orange-500 mr-1"></i> +6 Ay
                      </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-1 font-sans">Yumurta</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">Protein deposu ancak sarısı ve beyazı ayrı değerlendirilmeli.</p>
                  <div className="mt-auto flex items-center gap-2">
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded border border-yellow-200 flex items-center">
                          <i className="fa-solid fa-triangle-exclamation mr-1"></i> Yüksek Alerjen
                      </span>
                  </div>
              </Link>

              {/* Card 3: Bal (Danger - Forbidden) */}
              <Link href="#" className="bg-white rounded-[2rem] p-5 border border-red-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                  <div className="w-full h-40 bg-orange-50 rounded-2xl mb-4 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                      <img src="https://placehold.co/400x300/FFCC80/ffffff?text=Bal" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Bal" />
                      
                      {/* Updated Badge */}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-slate-800 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                          <i className="fa-solid fa-calendar-xmark text-red-500 mr-1"></i> +12 Ay
                      </div>
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center">
                          <i className="fa-solid fa-ban mr-1"></i> YASAK
                      </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-1 font-sans">Bal</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">Botulizm riski nedeniyle 1 yaşından önce kesinlikle verilmez.</p>
                  <div className="mt-auto flex items-center gap-2">
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded border border-red-200 flex items-center">
                          <i className="fa-solid fa-skull-crossbones mr-1"></i> Hayati Risk
                      </span>
                  </div>
              </Link>

              {/* Card 4: Ceviz (Choking Hazard) */}
              <Link href="#" className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                  <div className="w-full h-40 bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                      <img src="https://placehold.co/400x300/D7CCC8/ffffff?text=Ceviz" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Ceviz" />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                          <i className="fa-solid fa-baby text-green-500 mr-1"></i> +6 Ay
                      </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-1 font-sans">Ceviz</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">Omega-3 kaynağı. Sadece ezilerek veya toz halinde verilmeli.</p>
                  <div className="mt-auto flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded border border-purple-200 flex items-center">
                          <i className="fa-solid fa-circle-exclamation mr-1"></i> Boğulma Riski
                      </span>
                  </div>
              </Link>

              {/* Card 5: Çilek */}
              <Link href="#" className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                  <div className="w-full h-40 bg-red-50 rounded-2xl mb-4 overflow-hidden relative">
                      <img src="https://placehold.co/400x300/EF9A9A/ffffff?text=Cilek" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Çilek" />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                          <i className="fa-solid fa-baby text-orange-500 mr-1"></i> +8 Ay
                      </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-1 font-sans">Çilek</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">Yüksek C vitamini. Asitli yapısı nedeniyle pişik yapabilir.</p>
                  <div className="mt-auto flex items-center gap-2">
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded border border-yellow-200">Orta Alerjen</span>
                  </div>
              </Link>

              {/* Card 6: İlikli Kemik Suyu */}
              <Link href="#" className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                  <div className="w-full h-40 bg-yellow-50 rounded-2xl mb-4 overflow-hidden relative">
                      <img src="https://placehold.co/400x300/FFF9C4/ffffff?text=Kemik+Suyu" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Kemik Suyu" />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                          <i className="fa-solid fa-baby text-green-500 mr-1"></i> +6 Ay
                      </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-1 font-sans">İlikli Kemik Suyu</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">Bağışıklık ve kemik gelişimi için doğal kolajen deposu.</p>
                  <div className="mt-auto flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded border border-green-200">Süper Besin</span>
                  </div>
              </Link>
            </>
              )}

          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
              <button className="bg-white border-2 border-gray-100 text-gray-600 hover:border-green-500 hover:text-green-500 font-bold py-3 px-8 rounded-full transition-all shadow-sm">
                  Daha Fazla Göster
              </button>
          </div>

      </div>
    </div>
  );
}