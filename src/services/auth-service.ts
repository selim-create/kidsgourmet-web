import { fetchAPI, setToken, removeToken } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/lib/types';

export const authService = {
  /**
   * Kullanıcı girişi
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetchAPI<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Token'ı kaydet
    setToken(response.token);
    
    return response;
  },

  /**
   * Kullanıcı kaydı
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetchAPI<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Token'ı kaydet
    setToken(response.token);
    
    return response;
  },

  /**
   * Çıkış yap
   */
  logout: (): void => {
    removeToken();
  },

  /**
   * Mevcut kullanıcı bilgisi
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      return await fetchAPI<User>(API_ENDPOINTS.AUTH_ME, {}, true);
    } catch (error) {
      return null;
    }
  },

  /**
   * Token geçerliliğini kontrol et
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('kg_token');
  },
};
