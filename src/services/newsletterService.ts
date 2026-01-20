const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.kidsgourmet.com.tr').replace(/\/+$/, '');

export interface NewsletterSubscriptionRequest {
  email: string;
  name?: string;
  source: string; // 'footer', 'blog', 'category', 'tag', 'popup'
  interests?: string[];
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: {
    email?: string;
    status?: string;
  };
  code?: string;
}

export const newsletterService = {
  /**
   * Bültene abone ol
   */
  subscribe: async (data: NewsletterSubscriptionRequest): Promise<NewsletterResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/wp-json/kg/v1/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        code: 'network_error'
      };
    }
  },

  /**
   * Abonelikten çık
   */
  unsubscribe: async (email: string): Promise<NewsletterResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/wp-json/kg/v1/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        code: 'network_error'
      };
    }
  },
};

export default newsletterService;
