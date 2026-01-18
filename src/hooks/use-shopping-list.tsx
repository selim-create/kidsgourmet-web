'use client';

import { useState, useEffect } from 'react';
import { ShoppingListItem, ShoppingCategory } from '@/lib/types';
import { userService } from '@/services/user-service';
import { useUser } from './use-user';
import { toast } from 'sonner';

/**
 * Category keyword configuration
 * Keywords are matched as substrings in lowercase ingredient names
 */
const CATEGORY_KEYWORDS: Record<ShoppingCategory, string[]> = {
  dairy: ['süt', 'yoğurt', 'peynir', 'tereyağ', 'kaymak', 'kefir', 'lor', 'çökelek', 'labne', 'ayran'],
  meat_protein: [
    'et', 'tavuk', 'balık', 'yumurta', 'köfte', 'sucuk', 'sosis', 'jambon', 
    'hindi', 'kuzu', 'dana', 'kıyma', 'biftek', 'pirzola', 'karides', 'somon', 
    'ton', 'levrek', 'çupra', 'sardalya', 'hamsi', 'uskumru', 'alabalık'
  ],
  fruits_vegetables: [
    'elma', 'armut', 'muz', 'portakal', 'mandalina', 'üzüm', 'çilek', 'kiraz', 
    'şeftali', 'kayısı', 'erik', 'karpuz', 'kavun', 'avokado', 'domates', 
    'salatalık', 'biber', 'patlıcan', 'kabak', 'havuç', 'patates', 'soğan', 
    'sarımsak', 'brokoli', 'karnabahar', 'ıspanak', 'marul', 'lahana', 'pırasa', 
    'kereviz', 'enginar', 'bamya', 'fasulye', 'bezelye', 'nane', 'maydanoz', 
    'dereotu', 'roka', 'semizotu', 'börülce', 'kırmızı', 'yeşil', 'turp', 'pancar'
  ],
  grains: [
    'un', 'şeker', 'tuz', 'pirinç', 'bulgur', 'makarna', 'nohut', 'mercimek', 
    'yulaf', 'mısır', 'ekmek', 'bisküvi', 'kraker', 'gevrek', 'kahve', 'çay', 
    'kakao', 'bal', 'reçel', 'zeytinyağ', 'ayçiçek', 'sıvıyağ', 'margarin', 
    'pekmez', 'tahin', 'fıstık', 'fındık', 'badem', 'ceviz', 'susam', 'irmik', 
    'kepek', 'kinoa'
  ],
  other: [] // Default category, no keywords needed
};

/**
 * Malzeme adına göre kategori tahmini yap
 */
const guessCategory = (ingredientName: string): ShoppingCategory => {
  const name = ingredientName.toLowerCase();
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'other') continue; // Skip default category
    
    if (keywords.some(keyword => name.includes(keyword))) {
      return category as ShoppingCategory;
    }
  }
  
  return 'other';
};

export function useShoppingList() {
  const { isAuthenticated } = useUser();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadShoppingList();
    }
  }, [isAuthenticated]);

  const loadShoppingList = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getShoppingList();
      setItems(data);
    } catch (error) {
      console.error('Failed to load shopping list:', error);
      toast.error('Alışveriş listesi yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const addItems = async (newItems: Omit<ShoppingListItem, 'id'>[]) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      // Kategorisi olmayan itemlara kategori tahmin et
      const itemsWithCategory = newItems.map(item => ({
        ...item,
        category: item.category || guessCategory(item.ingredient),
      }));
      
      const added = await userService.addToShoppingList(itemsWithCategory);
      setItems(prev => [...prev, ...added]);
      
      // Başarılı eklenen item sayısına göre mesaj göster
      if (added.length === newItems.length) {
        toast.success(`${newItems.length} ürün listeye eklendi`);
      } else if (added.length > 0) {
        toast.success(`${added.length}/${newItems.length} ürün eklendi`);
      }
    } catch (error) {
      console.error('Shopping list add error:', error);
      toast.error('Ürünler eklenirken hata oluştu');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: number | string) => {
    // Optimistic update için önceki state'i sakla
    const previousItems = [...items];
    
    // Hemen UI'dan kaldır (optimistic)
    setItems(prev => prev.filter(item => String(item.id) !== String(id)));
    
    try {
      await userService.removeFromShoppingList(id);
      toast.success('Ürün silindi');
    } catch (error) {
      // Hata durumunda geri al
      setItems(previousItems);
      console.error('Remove item error:', error);
      toast.error('Ürün silinemedi');
    }
  };

  const toggleItem = async (id: number | string) => {
    const item = items.find(i => String(i.id) === String(id));
    if (item) {
      // Optimistic update
      setItems(prev => prev.map(i => 
        String(i.id) === String(id) ? { ...i, checked: !i.checked } : i
      ));
      
      try {
        await userService.toggleShoppingListItem(id, !item.checked);
      } catch (error) {
        // Hata durumunda geri al
        setItems(prev => prev.map(i => 
          String(i.id) === String(id) ? { ...i, checked: item.checked } : i
        ));
        toast.error('İşlem başarısız');
      }
    }
  };

  const clearChecked = async () => {
    const checkedItems = items.filter(i => i.checked);
    await Promise.all(checkedItems.map(i => userService.removeFromShoppingList(i.id)));
    setItems(prev => prev.filter(i => !i.checked));
  };

  const copyToClipboard = () => {
    const text = items
      .filter(i => !i.checked)
      .map(i => `- ${i.amount ? `${i.amount} ` : ''}${i.ingredient}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const shareWhatsapp = () => {
    const text = `Alışveriş Listem (KidsGourmet):\n${items
      .filter(i => !i.checked)
      .map(i => `• ${i.amount ? `${i.amount} ` : ''}${i.ingredient}`)
      .join('\n')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return {
    items,
    isLoading,
    addItems,
    removeItem,
    toggleItem,
    clearChecked,
    copyToClipboard,
    shareWhatsapp,
    refreshList: loadShoppingList,
  };
}
