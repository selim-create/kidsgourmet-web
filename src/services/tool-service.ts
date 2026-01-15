import { fetchAPI, fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { 
  Tool, 
  BLWTestConfig, 
  BLWTestResult,
  BLWTestAnswer,
  RegisterData
} from '@/lib/types';

export const toolService = {
  /**
   * Tüm araçları getir
   */
  getTools: async (): Promise<Tool[]> => {
    return fetchAPI<Tool[]>(API_ENDPOINTS.TOOLS);
  },

  /**
   * Tek araç getir (slug ile)
   */
  getToolBySlug: async (slug: string): Promise<Tool> => {
    return fetchAPI<Tool>(API_ENDPOINTS.TOOL_BY_SLUG(slug));
  },

  /**
   * BLW Test konfigürasyonunu getir
   */
  getBLWTestConfig: async (): Promise<BLWTestConfig> => {
    return fetchAPI<BLWTestConfig>(API_ENDPOINTS.BLW_TEST_CONFIG);
  },

  /**
   * BLW Test sonucunu kaydet (kayıtlı kullanıcı)
   */
  submitBLWTest: async (
    answers: BLWTestAnswer[],
    childId?: string
  ): Promise<BLWTestResult> => {
    return fetchAuthAPI<BLWTestResult>(API_ENDPOINTS.BLW_TEST_SUBMIT, {
      method: 'POST',
      body: JSON.stringify({ answers, child_id: childId }),
    });
  },

  /**
   * BLW Test sonucunu kaydet ve kayıt ol (yeni kullanıcı)
   */
  submitBLWTestWithRegistration: async (
    answers: BLWTestAnswer[],
    registrationData: RegisterData & { child_name?: string; child_birth_date?: string }
  ): Promise<{ result: BLWTestResult; token: string }> => {
    return fetchAPI<{ result: BLWTestResult; token: string }>(
      `${API_ENDPOINTS.BLW_TEST_SUBMIT}?register=true`,
      {
        method: 'POST',
        body: JSON.stringify({ answers, registration: registrationData }),
      }
    );
  },

  /**
   * Kullanıcının BLW test sonuçlarını getir
   */
  getUserBLWResults: async (): Promise<BLWTestResult[]> => {
    return fetchAuthAPI<BLWTestResult[]>(API_ENDPOINTS.USER_BLW_RESULTS);
  },

  /**
   * Çocuğun BLW test sonuçlarını getir
   */
  getChildBLWResults: async (childId: string): Promise<BLWTestResult[]> => {
    return fetchAuthAPI<BLWTestResult[]>(API_ENDPOINTS.CHILD_BLW_RESULTS(childId));
  },
};
