import { fetchAuthAPI, fetchAPI, getToken } from '@/lib/api';
import { API_ENDPOINTS, API_URL, KG_API_NAMESPACE } from '@/lib/constants';
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
  CollectionItem,
  ExpertPublicProfile,
  SocialLinks
} from '@/lib/types';

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
    return await fetchAuthAPI<ShoppingListItem[]>(API_ENDPOINTS.USER_SHOPPING_LIST);
  },

  addToShoppingList: async (items: Omit<ShoppingListItem, 'id'>[]): Promise<ShoppingListItem[]> => {
    // Backend tek item kabul ediyor ve 'item' ile 'quantity' parametreleri bekliyor
    // Her item için ayrı ayrı API çağrısı yap
    const addedItems: ShoppingListItem[] = [];
    const failedItems: string[] = [];
    
    for (const item of items) {
      try {
        const response = await fetchAuthAPI<ShoppingListItem>(API_ENDPOINTS.USER_SHOPPING_LIST, {
          method: 'POST',
          body: JSON.stringify({
            item: item.ingredient,      // 'ingredient' -> 'item'
            quantity: item.amount || '1 adet',  // 'amount' -> 'quantity'
          }),
        });
        addedItems.push(response);
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
    return await fetchAPI<ExpertPublicProfile[]>(`${KG_API_NAMESPACE}/experts`);
  },

  // Avatar yükleme
  uploadAvatar: async (file: File): Promise<{ id: number; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // WordPress media endpoint kullan
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Avatar yüklenemedi');
    }
    
    const data = await response.json();
    return {
      id: data.id,
      url: data.source_url,
    };
  },
};
