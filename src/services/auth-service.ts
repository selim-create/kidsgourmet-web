import { fetchAPI, setToken, removeToken } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/lib/types';

export const authService = {
  /**
   * User login
   * Backend accepts both email and username in the email field
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetchAPI<{
      token: string;
      user_id: number;
      email: string;
      name: string;
    }>(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.username,  // Backend expects 'email' parameter
        password: credentials.password,
      }),
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    // Transform response to AuthResponse format
    return {
      token: response.token,
      user: {
        id: response.user_id,
        email: response.email,
        name: response.name,
        display_name: response.name,
        children: [],
        created_at: new Date().toISOString(),
      },
    };
  },

  /**
   * Kullanıcı kaydı
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetchAPI<{
      token: string;
      user_id: number;
      email: string;
      name: string;
    }>(API_ENDPOINTS.AUTH_REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    // Transform response to AuthResponse format
    return {
      token: response.token,
      user: {
        id: response.user_id,
        email: response.email,
        name: response.name,
        display_name: response.name,
        children: [],
        created_at: new Date().toISOString(),
      },
    };
  },

  /**
   * Google ile giriş
   */
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await fetchAPI<{
      success: boolean;
      token: string;
      user: User;
      message: string;
    }>(API_ENDPOINTS.AUTH_GOOGLE, {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    return {
      token: response.token,
      user: response.user,
    };
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
      const response = await fetchAPI<{
        user_id: number;
        email: string;
        name: string;
      }>(API_ENDPOINTS.AUTH_ME, {}, true);
      
      // Transform response to User format
      return {
        id: response.user_id,
        email: response.email,
        name: response.name,
        display_name: response.name,
        children: [],
        created_at: new Date().toISOString(),
      };
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
