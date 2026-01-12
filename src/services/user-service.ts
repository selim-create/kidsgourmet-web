import { fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { User, Child, RecipeCard, ShoppingListItem } from '@/lib/types';

export const userService = {
  /**
   * Profil bilgisi getir
   */
  getProfile: async (): Promise<User> => {
    return await fetchAuthAPI<User>(API_ENDPOINTS.USER_PROFILE);
  },

  /**
   * Profil güncelle
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return await fetchAuthAPI<User>(API_ENDPOINTS.USER_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Çocuk Profili İşlemleri
  getChildren: async (): Promise<Child[]> => {
    return await fetchAuthAPI<Child[]>(API_ENDPOINTS.USER_CHILDREN);
  },

  addChild: async (child: Omit<Child, 'id'>): Promise<Child> => {
    return await fetchAuthAPI<Child>(API_ENDPOINTS.USER_CHILDREN, {
      method: 'POST',
      body: JSON.stringify(child),
    });
  },

  updateChild: async (id: string, data: Partial<Child>): Promise<Child> => {
    return await fetchAuthAPI<Child>(`${API_ENDPOINTS.USER_CHILDREN}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteChild: async (id: string): Promise<void> => {
    await fetchAuthAPI<void>(`${API_ENDPOINTS.USER_CHILDREN}/${id}`, {
      method: 'DELETE',
    });
  },

  // Favoriler
  getFavorites: async (): Promise<RecipeCard[]> => {
    return await fetchAuthAPI<RecipeCard[]>(API_ENDPOINTS.USER_FAVORITES);
  },

  addFavorite: async (recipeId: number): Promise<void> => {
    await fetchAuthAPI<void>(API_ENDPOINTS.USER_FAVORITES, {
      method: 'POST',
      body: JSON.stringify({ recipe_id: recipeId }),
    });
  },

  removeFavorite: async (recipeId: number): Promise<void> => {
    await fetchAuthAPI<void>(`${API_ENDPOINTS.USER_FAVORITES}/${recipeId}`, {
      method: 'DELETE',
    });
  },

  // Alışveriş Listesi
  getShoppingList: async (): Promise<ShoppingListItem[]> => {
    return await fetchAuthAPI<ShoppingListItem[]>(API_ENDPOINTS.USER_SHOPPING_LIST);
  },

  addToShoppingList: async (items: Omit<ShoppingListItem, 'id'>[]): Promise<ShoppingListItem[]> => {
    return await fetchAuthAPI<ShoppingListItem[]>(API_ENDPOINTS.USER_SHOPPING_LIST, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  removeFromShoppingList: async (id: number): Promise<void> => {
    await fetchAuthAPI<void>(`${API_ENDPOINTS.USER_SHOPPING_LIST}/${id}`, {
      method: 'DELETE',
    });
  },

  toggleShoppingListItem: async (id: number, checked: boolean): Promise<void> => {
    await fetchAuthAPI<void>(`${API_ENDPOINTS.USER_SHOPPING_LIST}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ checked }),
    });
  },
};
