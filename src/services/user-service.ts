import { fetchAuthAPI, fetchAPI, getToken } from '@/lib/api';
import { API_ENDPOINTS, API_URL } from '@/lib/constants';
import { 
  User, 
  Child, 
  RecipeCard, 
  ShoppingListItem, 
  PublicProfile, 
  ExpertDashboard,
  FavoritesResponse,
  FavoriteItemType,
  Collection,
  CollectionInput,
  ExpertPublicProfile,
  SocialLinks
} from '@/lib/types';

// Backend response format for shopping list items
interface BackendShoppingListItem {
  id: string | number;
  item: string;
  quantity: string;
  checked: boolean;
  recipe_id?: number;
  recipe_title?: string;
  category?: string;
}

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
  updateProfile: async (data: Partial<User> & {
    parent_role?: string;
    gender?: string;
    birth_date?: string;
    avatar_id?: number;
    biography?: string;
    social_links?: SocialLinks;
    show_email?: boolean;
    expertise?: string[];
  }): Promise<User> => {
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

  // Favoriler (eski metodlar - backward compatibility için saklanıyor)
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

  // Yeni Favoriler API
  getAllFavorites: async (type?: 'all' | 'recipe' | 'ingredient' | 'post' | 'discussion'): Promise<FavoritesResponse> => {
    const queryParam = type ? `?type=${type}` : '';
    return await fetchAuthAPI<FavoritesResponse>(`${API_ENDPOINTS.USER_FAVORITES}${queryParam}`);
  },

  addFavoriteItem: async (itemId: number, itemType: FavoriteItemType): Promise<void> => {
    await fetchAuthAPI<void>(API_ENDPOINTS.USER_FAVORITES, {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, item_type: itemType }),
    });
  },

  removeFavoriteItem: async (itemId: number, itemType: FavoriteItemType): Promise<void> => {
    await fetchAuthAPI<void>(`${API_ENDPOINTS.USER_FAVORITES}/${itemId}?type=${itemType}`, {
      method: 'DELETE',
    });
  },

  // Koleksiyonlar API
  getCollections: async (): Promise<Collection[]> => {
    return await fetchAuthAPI<Collection[]>(API_ENDPOINTS.USER_COLLECTIONS);
  },

  createCollection: async (data: CollectionInput): Promise<Collection> => {
    return await fetchAuthAPI<Collection>(API_ENDPOINTS.USER_COLLECTIONS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCollection: async (id: string): Promise<Collection> => {
    return await fetchAuthAPI<Collection>(API_ENDPOINTS.USER_COLLECTION_BY_ID(id));
  },

  updateCollection: async (id: string, data: CollectionInput): Promise<Collection> => {
    return await fetchAuthAPI<Collection>(API_ENDPOINTS.USER_COLLECTION_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCollection: async (id: string): Promise<void> => {
    await fetchAuthAPI<void>(API_ENDPOINTS.USER_COLLECTION_BY_ID(id), {
      method: 'DELETE',
    });
  },

  addCollectionItem: async (collectionId: string, itemId: number, itemType: FavoriteItemType): Promise<void> => {
    await fetchAuthAPI<void>(API_ENDPOINTS.USER_COLLECTION_ITEMS(collectionId), {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, item_type: itemType }),
    });
  },

  removeCollectionItem: async (collectionId: string, itemId: number, itemType: FavoriteItemType): Promise<void> => {
    await fetchAuthAPI<void>(`${API_ENDPOINTS.USER_COLLECTION_ITEMS(collectionId)}/${itemId}?type=${itemType}`, {
      method: 'DELETE',
    });
  },

  // Alışveriş Listesi
  getShoppingList: async (): Promise<ShoppingListItem[]> => {
    // Backend dönen format: BackendShoppingListItem
    // Frontend format: ShoppingListItem
    const backendResponse = await fetchAuthAPI<BackendShoppingListItem[]>(API_ENDPOINTS.USER_SHOPPING_LIST);
    
    // Transform backend response to frontend format
    return backendResponse.map((item) => ({
      id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
      ingredient: item.item || '',
      amount: item.quantity,
      checked: item.checked || false,
      category: item.category as any,
      recipe_id: item.recipe_id,
      recipe_title: item.recipe_title,
    }));
  },

  addToShoppingList: async (items: Omit<ShoppingListItem, 'id'>[]): Promise<ShoppingListItem[]> => {
    // Backend tek item kabul ediyor ve 'item' ile 'quantity' parametreleri bekliyor
    // Her item için ayrı ayrı API çağrısı yap
    const addedItems: ShoppingListItem[] = [];
    const failedItems: string[] = [];
    
    for (const item of items) {
      try {
        // Backend'e göndermek için format dönüşümü
        const backendResponse = await fetchAuthAPI<BackendShoppingListItem>(API_ENDPOINTS.USER_SHOPPING_LIST, {
          method: 'POST',
          body: JSON.stringify({
            item: item.ingredient,      // 'ingredient' -> 'item'
            quantity: item.amount || '1 adet',  // 'amount' -> 'quantity'
          }),
        });
        
        // Backend response'unu frontend formatına dönüştür
        const transformedItem: ShoppingListItem = {
          id: typeof backendResponse.id === 'string' ? parseInt(backendResponse.id, 10) : backendResponse.id,
          ingredient: backendResponse.item || item.ingredient,
          amount: backendResponse.quantity || item.amount,
          checked: backendResponse.checked || false,
          category: item.category, // Frontend'den gelen kategoriyi koru
          recipe_id: backendResponse.recipe_id,
          recipe_title: backendResponse.recipe_title,
        };
        
        addedItems.push(transformedItem);
      } catch (error) {
        console.error(`Failed to add item: ${item.ingredient}`, error);
        failedItems.push(item.ingredient);
      }
    }
    
    // Eğer hiçbir item eklenemedi ise hata fırlat
    if (addedItems.length === 0 && items.length > 0) {
      throw new Error(`Hiçbir ürün eklenemedi. Başarısız: ${failedItems.join(', ')}`);
    }
    
    // Bazı itemlar başarısız olduysa konsola log at
    if (failedItems.length > 0) {
      console.warn(`${failedItems.length} ürün eklenemedi: ${failedItems.join(', ')}`);
    }
    
    return addedItems;
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

  // Full Profile & Public Profile
  getFullProfile: async (): Promise<User> => {
    return await fetchAuthAPI<User>(API_ENDPOINTS.USER_ME);
  },

  getPublicProfile: async (username: string): Promise<PublicProfile> => {
    return await fetchAPI<PublicProfile>(API_ENDPOINTS.USER_PUBLIC(username));
  },

  // Expert Dashboard
  getExpertDashboard: async (): Promise<ExpertDashboard> => {
    return await fetchAuthAPI<ExpertDashboard>(API_ENDPOINTS.EXPERT_DASHBOARD);
  },

  // Uzman public profil getir
  getExpertPublicProfile: async (username: string): Promise<ExpertPublicProfile> => {
    return await fetchAPI<ExpertPublicProfile>(API_ENDPOINTS.EXPERT_PUBLIC(username));
  },

  // Uzman listesini getir
  getExperts: async (): Promise<ExpertPublicProfile[]> => {
    return await fetchAPI<ExpertPublicProfile[]>(API_ENDPOINTS.EXPERTS_LIST);
  },

  // Avatar upload - Uses custom KG endpoint
  uploadAvatar: async (file: File): Promise<{ id: number; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Use custom KG endpoint (supports JWT)
    const response = await fetch(`${API_URL}${API_ENDPOINTS.USER_AVATAR}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Avatar yüklenemedi');
    }
    
    const data = await response.json();
    return {
      id: data.id,
      url: data.source_url || data.url,
    };
  },

  // Child Avatar Operations
  uploadChildAvatar: async (childId: string, file: File): Promise<{ avatar: { url: string } }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}${API_ENDPOINTS.CHILD_PROFILE_AVATAR(childId)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Avatar yüklenemedi');
    }
    
    return await response.json();
  },

  getChildAvatarUrl: async (childId: string): Promise<{ url: string; expires_in: number }> => {
    return await fetchAuthAPI<{ url: string; expires_in: number }>(
      API_ENDPOINTS.CHILD_PROFILE_AVATAR(childId)
    );
  },

  deleteChildAvatar: async (childId: string): Promise<void> => {
    await fetchAuthAPI<void>(API_ENDPOINTS.CHILD_PROFILE_AVATAR(childId), {
      method: 'DELETE',
    });
  },
};
