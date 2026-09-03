export interface NewsletterSubscriptionRequest {
  email: string;
  source: string;
  newsletters: string[];
  consent: boolean;
  website?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  status?: string;
  deliveryAvailable?: boolean;
  count?: number;
  code?: string;
}

export const newsletterService = {
  subscribe: async (data: NewsletterSubscriptionRequest): Promise<NewsletterResponse> => {
    try {
      const response = await fetch('/api/newsletters/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({})) as NewsletterResponse;
      return {
        success: response.ok && result.success === true,
        message: result.message || (response.ok ? 'Seçimin kaydedildi.' : 'Bir hata oluştu. Lütfen tekrar deneyin.'),
        status: result.status,
        deliveryAvailable: result.deliveryAvailable,
        count: result.count,
        code: result.code,
      };
    } catch {
      return {
        success: false,
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        code: 'network_error',
      };
    }
  },
};

export default newsletterService;
