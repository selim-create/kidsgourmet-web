"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CrossSellInfo, TariftenRecipe, RecipeIngredient } from '@/lib/types';
import { tariftenService } from '@/services/tariften-service';

interface CrossSellWidgetProps {
  crossSell?: CrossSellInfo;
  ingredients?: RecipeIngredient[];
  recipeTitle: string;
}

export default function CrossSellWidget({ crossSell, ingredients, recipeTitle }: CrossSellWidgetProps) {
  const [suggestion, setSuggestion] = useState<TariftenRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [usedIngredient, setUsedIngredient] = useState<string>('');

  useEffect(() => {
    // Eğer manuel cross-sell varsa, onu kullan
    if (crossSell?.url) {
      return;
    }

    // Yoksa otomatik öneri getir
    const fetchSuggestion = async () => {
      if (!ingredients || ingredients.length === 0) return;
      
      // İlk 3 malzemeden birini dene
      const mainIngredients = ingredients.slice(0, 3);
      
      for (const ing of mainIngredients) {
        const ingredientName = ing.name || ing.text || '';
        if (!ingredientName) continue;
        
        setLoading(true);
        const suggestions = await tariftenService.getByIngredient(ingredientName, 1);
        
        if (suggestions.length > 0) {
          setSuggestion(suggestions[0]);
          setUsedIngredient(ingredientName);
          setLoading(false);
          return;
        }
      }
      
      setLoading(false);
    };

    fetchSuggestion();
  }, [crossSell, ingredients]);

  // Hiçbir öneri yoksa widget'ı gösterme
  if (!crossSell?.url && !suggestion && !loading) {
    return null;
  }

  // Manuel cross-sell
  if (crossSell?.url) {
    return (
      <div className="bg-slate-800 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-2xl opacity-30 -mr-10 -mt-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <i className="fa-solid fa-utensils"></i>
            <span className="text-xs font-bold uppercase tracking-wider">Ebeveynlere Özel</span>
          </div>
          
          <h3 className="font-sans font-bold text-2xl mb-3">Bizimkiler Ne Yiyecek?</h3>
          
          {crossSell.image && (
            <div className="mb-4 rounded-xl overflow-hidden">
              <img 
                src={crossSell.image} 
                alt={crossSell.title} 
                className="w-full h-32 object-cover"
              />
            </div>
          )}
          
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            {crossSell.description ? (
              crossSell.description
            ) : (
              <>
                Artan malzemelerle kendinize harika bir{' '}
                <span className="text-purple-400 font-bold">{crossSell.title}</span>
                {' '}yapabilirsiniz.
              </>
            )}
          </p>

          <Link 
            href={crossSell.url} 
            target="_blank" 
            className="block w-full bg-purple-600 hover:bg-purple-500 text-white text-center font-bold py-3 rounded-xl transition-colors"
          >
            Tarifi Gör (Tariften.com) <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-xs"></i>
          </Link>
        </div>
      </div>
    );
  }

  // Otomatik öneri (loading veya suggestion)
  return (
    <div className="bg-slate-800 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-2xl opacity-30 -mr-10 -mt-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 opacity-80">
          <i className="fa-solid fa-utensils"></i>
          <span className="text-xs font-bold uppercase tracking-wider">Ebeveynlere Özel</span>
        </div>
        
        <h3 className="font-sans font-bold text-2xl mb-3">Bizimkiler Ne Yiyecek?</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : suggestion ? (
          <>
            {suggestion.image && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <img 
                  src={suggestion.image} 
                  alt={suggestion.title} 
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
            
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Artan <span className="text-purple-400 font-bold">{usedIngredient}</span> ile kendinize harika bir{' '}
              <span className="text-purple-400 font-bold">{suggestion.title}</span> yapabilirsiniz.
            </p>
            
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
              <span><i className="fa-regular fa-clock mr-1"></i> {suggestion.prep_time} dk</span>
              <span><i className="fa-solid fa-signal mr-1"></i> {suggestion.difficulty}</span>
            </div>

            <Link 
              href={`https://tariften.com/tarifler/${suggestion.slug}`}
              target="_blank" 
              className="block w-full bg-purple-600 hover:bg-purple-500 text-white text-center font-bold py-3 rounded-xl transition-colors"
            >
              Tarifi Gör (Tariften.com) <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-xs"></i>
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
