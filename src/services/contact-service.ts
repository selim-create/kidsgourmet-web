const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.kidsgourmet.com.tr').replace(/\/+$/, '');

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  requestType: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactService = {
  /**
   * İletişim formu gönder
   */
  submit: async (data: ContactFormData): Promise<ContactResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/wp-json/kg/v1/contact/submit`, {
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
      };
    }
  },
};

export default contactService;
