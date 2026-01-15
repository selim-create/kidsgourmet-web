import { fetchAPI, fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { 
  Tool, 
  BLWTestConfig, 
  BLWTestResult,
  BLWTestAnswer,
  RegisterData,
  PercentileMeasurement,
  PercentileResult
} from '@/lib/types';

/**
 * Frontend answer array'ini backend'in beklediği formata dönüştür
 * Frontend: [{ question_id: 'q1', option_id: 'q1_a', score: 100 }, ...]
 * Backend:  { 'q1': 'q1_a', 'q2': 'q2_a', ... }
 */
const transformAnswersForBackend = (answers: BLWTestAnswer[]): Record<string, string> => {
  const transformed: Record<string, string> = {};
  answers.forEach(answer => {
    transformed[answer.question_id] = answer.option_id;
  });
  return transformed;
};

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
    // Transform answers to backend format
    const transformedAnswers = transformAnswersForBackend(answers);
    
    return fetchAuthAPI<BLWTestResult>(API_ENDPOINTS.BLW_TEST_SUBMIT, {
      method: 'POST',
      body: JSON.stringify({ 
        answers: transformedAnswers, 
        child_id: childId 
      }),
    });
  },

  /**
   * BLW Test sonucunu kaydet ve kayıt ol (yeni kullanıcı)
   */
  submitBLWTestWithRegistration: async (
    answers: BLWTestAnswer[],
    registrationData: RegisterData & { child_name?: string; child_birth_date?: string }
  ): Promise<{ result: BLWTestResult; token: string }> => {
    // Transform answers to backend format
    const transformedAnswers = transformAnswersForBackend(answers);
    
    return fetchAPI<{ result: BLWTestResult; token: string }>(
      `${API_ENDPOINTS.BLW_TEST_SUBMIT}?register=true`,
      {
        method: 'POST',
        body: JSON.stringify({ 
          answers: transformedAnswers, 
          email: registrationData.email,
          password: registrationData.password,
          name: registrationData.name,
          child_name: registrationData.child_name,
          child_birth_date: registrationData.child_birth_date,
        }),
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

  // ===============================
  // PERSENTİL HESAPLAYICI METODLARI
  // ===============================

  /**
   * Persentil hesapla
   */
  calculatePercentile: async (
    measurement: PercentileMeasurement
  ): Promise<PercentileResult> => {
    return fetchAPI<PercentileResult>(API_ENDPOINTS.PERCENTILE_CALCULATE, {
      method: 'POST',
      body: JSON.stringify(measurement),
    });
  },

  /**
   * Persentil sonucunu kaydet (kayıtlı kullanıcı)
   */
  savePercentileResult: async (
    result: PercentileResult,
    childId?: string
  ): Promise<PercentileResult> => {
    return fetchAuthAPI<PercentileResult>(API_ENDPOINTS.PERCENTILE_SAVE, {
      method: 'POST',
      body: JSON.stringify({ ...result, child_id: childId }),
    });
  },

  /**
   * Persentil sonucunu kaydet ve kayıt ol (yeni kullanıcı)
   */
  savePercentileWithRegistration: async (
    result: PercentileResult,
    registrationData: RegisterData & { child_name?: string; child_birth_date?: string }
  ): Promise<{ result: PercentileResult; token: string }> => {
    return fetchAPI<{ result: PercentileResult; token: string }>(
      API_ENDPOINTS.PERCENTILE_SAVE,
      {
        method: 'POST',
        body: JSON.stringify({
          ...result,
          register: true,
          email: registrationData.email,
          password: registrationData.password,
          name: registrationData.name,
          child_name: registrationData.child_name,
          child_birth_date: registrationData.child_birth_date,
        }),
      }
    );
  },

  /**
   * Çocuğun persentil geçmişini getir
   */
  getChildPercentileHistory: async (childId: string): Promise<PercentileResult[]> => {
    return fetchAuthAPI<PercentileResult[]>(API_ENDPOINTS.CHILD_PERCENTILE_RESULTS(childId));
  },

  /**
   * Kullanıcının persentil sonuçlarını getir
   */
  getUserPercentileResults: async (): Promise<PercentileResult[]> => {
    return fetchAuthAPI<PercentileResult[]>(API_ENDPOINTS.USER_PERCENTILE_RESULTS);
  },
};
