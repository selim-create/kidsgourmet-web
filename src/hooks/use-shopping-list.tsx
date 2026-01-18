'use client';

import { useState, useEffect } from 'react';
import { ShoppingListItem, ShoppingCategory } from '@/lib/types';
import { userService } from '@/services/user-service';
import { useUser } from './use-user';
import { toast } from 'sonner';

/**
 * Malzeme adına göre kategori tahmini yap
 */
const guessCategory = (ingredientName: string): ShoppingCategory => {
  const name = ingredientName.toLowerCase();
  
  // Süt Ürünleri
  if (/süt|yoğurt|peynir|tereyağ|kaymak|kefir|lor|çökelek|labne|ayran/i.test(name)) {
    return 'dairy';
  }
  
  // Et & Protein
  if (/et|tavuk|balık|yumurta|köfte|sucuk|sosis|jambon|hindi|kuzu|dana|kıyma|biftek|pirzola|karides|somon|ton|levrek|çupra|sardalya|hamsi|uskumru|alabalık/i.test(name)) {
    return 'meat_protein';
  }
  
  // Meyve & Sebze
  if (/elma|armut|muz|portakal|mandalina|üzüm|çilek|kiraz|şeftali|kayısı|erik|karpuz|kavun|avokado|domates|salatalık|biber|patlıcan|kabak|havuç|patates|soğan|sarımsak|brokoli|karnabahar|ıspanak|marul|lahana|pırasa|kereviz|enginar|bamya|fasulye|bezelye|nane|maydanoz|dereotu|roka|semizotu|börülce|kırmızı|yeşil|turp|pancar/i.test(name)) {
    return 'fruits_vegetables';
  }
  
  // Kuru Gıda
  if (/un|şeker|tuz|pirinç|bulgur|makarna|nohut|mercimek|börülce|yulaf|mısır|ekmek|bisküvi|kraker|gevrek|kahve|çay|kakao|bal|reçel|zeytinyağ|ayçiçek|sıvıyağ|margarin|pekmez|tahin|fıstık|fındık|badem|ceviz|susam|irmik|kepek|kinoa/i.test(name)) {
    return 'grains';
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

  const removeItem = async (id: number) => {
    await userService.removeFromShoppingList(id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItem = async (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      await userService.toggleShoppingListItem(id, !item.checked);
      setItems(prev => prev.map(i => 
        i.id === id ? { ...i, checked: !i.checked } : i
      ));
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
