'use client';

import { useState, useEffect } from 'react';
import { RecipeCard } from '@/lib/types';
import { userService } from '@/services/user-service';
import { useUser } from './use-user';

export function useFavorites() {
  const { isAuthenticated } = useUser();
  const [favorites, setFavorites] = useState<RecipeCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getFavorites();
      setFavorites(data);
      setFavoriteIds(new Set(data.map(f => f.id)));
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (recipeId: number) => {
    if (!isAuthenticated) {
      throw new Error('Favorilere eklemek için giriş yapmalısınız');
    }
    await userService.addFavorite(recipeId);
    setFavoriteIds(prev => new Set([...prev, recipeId]));
    await loadFavorites();
  };

  const removeFavorite = async (recipeId: number) => {
    await userService.removeFavorite(recipeId);
    setFavoriteIds(prev => {
      const next = new Set(prev);
      next.delete(recipeId);
      return next;
    });
    setFavorites(prev => prev.filter(f => f.id !== recipeId));
  };

  const isFavorite = (recipeId: number) => favoriteIds.has(recipeId);

  const toggleFavorite = async (recipeId: number) => {
    if (isFavorite(recipeId)) {
      await removeFavorite(recipeId);
    } else {
      await addFavorite(recipeId);
    }
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites: loadFavorites,
  };
}
