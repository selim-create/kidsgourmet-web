import { fetchAuthAPI } from '@/lib/api';

export type ConsentType = 'terms' | 'marketing' | 'sensitive_data';

export interface ConsentRecord {
  id: number;
  consent_type: ConsentType;
  consented: boolean;
  consented_at: string | null;
  revoked_at: string | null;
  version: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsentStatus {
  terms: boolean;
  marketing: boolean;
  sensitive_data: boolean;
}

export const consentService = {
  async getConsents(): Promise<ConsentRecord[]> {
    const response = await fetchAuthAPI<{ success: boolean; data: ConsentRecord[] }>('/user/consents');
    return response.data;
  },

  async updateConsent(type: ConsentType, consented: boolean): Promise<boolean> {
    const response = await fetchAuthAPI<{ success: boolean }>(`/user/consents/${type}`, {
      method: 'PUT',
      body: JSON.stringify({ consented }),
    });
    return response.success;
  },

  async getConsentStatus(): Promise<ConsentStatus> {
    const consents = await this.getConsents();
    return {
      terms: consents.some(c => c.consent_type === 'terms' && c.consented),
      marketing: consents.some(c => c.consent_type === 'marketing' && c.consented),
      sensitive_data: consents.some(c => c.consent_type === 'sensitive_data' && c.consented),
    };
  }
};
