'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FavoriteItemType,
  FavoritesResponse,
  Collection,
  CollectionInput,
} from '@/lib/types';
import { userService } from '@/services/user-service';
import { useUser } from './use-user';

export function useFavorites() {
  const { isAuthenticated } = useUser();
  const [favorites, setFavorites] = useState<FavoritesResponse | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Favorileri yükle
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAllFavorites();
      setFavorites(data);
      setIsLoaded(true);
    } catch (err) {
      console.error('Failed to load favorites:', err);
      setError('Favoriler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Koleksiyonları yükle
  const loadCollections = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await userService.getCollections();
      setCollections(data);
      setIsLoaded(true);
    } catch (err) {
      console.error('Failed to load collections:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || isLoaded) {
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [favoritesData, collectionsData] = await Promise.all([
          userService.getAllFavorites(),
          userService.getCollections(),
        ]);
        setFavorites(favoritesData);
        setCollections(collectionsData);
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Veriler yüklenirken hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, isLoaded]);

  // Reset isLoaded when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites(null);
      setCollections([]);
      setIsLoaded(false);
    }
  }, [isAuthenticated]);

  // Favori ID'leri (hızlı lookup için)
  const favoriteIds = useMemo(() => ({
    recipes: new Set(favorites?.recipes?.map(r => r.id) || []),
    ingredients: new Set(favorites?.ingredients?.map(i => i.id) || []),
    posts: new Set(favorites?.posts?.map(p => p.id) || []),
    discussions: new Set(favorites?.discussions?.map(d => d.id) || []),
  }), [favorites]);

  // Favori mi kontrol et (tüm tipler için)
  const isFavorite = useCallback((itemId: number, itemType: FavoriteItemType = 'recipe'): boolean => {
    const typeKey = `${itemType}s` as keyof typeof favoriteIds;
    return favoriteIds[typeKey]?.has(itemId) || false;
  }, [favoriteIds]);

  // Favori ekle
  const addFavorite = useCallback(async (itemId: number, itemType: FavoriteItemType = 'recipe') => {
    if (!isAuthenticated) {
      throw new Error('Favorilere eklemek için giriş yapmalısınız');
    }
    await userService.addFavoriteItem(itemId, itemType);
    await loadFavorites();
  }, [isAuthenticated, loadFavorites]);

  // Favori çıkar
  const removeFavorite = useCallback(async (itemId: number, itemType: FavoriteItemType = 'recipe') => {
    await userService.removeFavoriteItem(itemId, itemType);
    await loadFavorites();
  }, [loadFavorites]);

  // Favori toggle
  const toggleFavorite = useCallback(async (itemId: number, itemType: FavoriteItemType = 'recipe') => {
    if (isFavorite(itemId, itemType)) {
      await removeFavorite(itemId, itemType);
    } else {
      await addFavorite(itemId, itemType);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  // Koleksiyon işlemleri
  const createCollection = useCallback(async (data: CollectionInput) => {
    const collection = await userService.createCollection(data);
    setCollections(prev => [...prev, collection]);
    return collection;
  }, []);

  const deleteCollection = useCallback(async (id: string) => {
    await userService.deleteCollection(id);
    setCollections(prev => prev.filter(c => c.id !== id));
  }, []);

  const addToCollection = useCallback(async (collectionId: string, itemId: number, itemType: FavoriteItemType) => {
    await userService.addCollectionItem(collectionId, itemId, itemType);
    await loadCollections();
  }, [loadCollections]);

  const removeFromCollection = useCallback(async (collectionId: string, itemId: number, itemType: FavoriteItemType) => {
    await userService.removeCollectionItem(collectionId, itemId, itemType);
    await loadCollections();
  }, [loadCollections]);

  // Sayılar
  const counts = useMemo(() => favorites?.counts || {
    all: 0, recipes: 0, ingredients: 0, posts: 0, discussions: 0
  }, [favorites]);

  return {
    favorites,
    collections,
    isLoading,
    error,
    counts,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    createCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    refreshFavorites: loadFavorites,
    refreshCollections: loadCollections,
  };
}
