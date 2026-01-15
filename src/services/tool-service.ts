import { fetchAPI, fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { 
  Tool, 
  BLWTestConfig, 
  BLWTestResult,
  BLWTestAnswer,
  RegisterData,
  PercentileMeasurement,
  PercentileResult,
  WaterNeedResult,
  SolidFoodReadinessConfig,
  SolidFoodReadinessResult,
  Allergen,
  AllergenTrialPlan,
  FoodTrial,
  FoodTrialInput,
  FoodTrialSummary
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

  // ===============================
  // SU İHTİYACI HESAPLAYICI
  // ===============================

  /**
   * Su ihtiyacını hesapla (frontend'de)
   * 
   * WHO (Dünya Sağlık Örgütü) önerilerine göre bebeğin günlük sıvı ihtiyacını hesaplar.
   * 
   * Formüller:
   * - 6 aydan küçük: Su önerilmez (anne sütü/formula yeterlidir)
   * - 6-12 ay: 30ml x kilo (kg) - Ek gıdaya yeni başlayan bebekler
   * - 12+ ay: 40ml x kilo (kg) - Aktif toddler'lar için artırılmış ihtiyaç
   * 
   * @param weightKg - Bebeğin kilosu (kg cinsinden)
   * @param ageMonths - Bebeğin yaşı (ay cinsinden)
   * @returns WaterNeedResult - Hesaplanan günlük su ihtiyacı ve öneriler
   */
  calculateWaterNeed: async (weightKg: number, ageMonths: number): Promise<WaterNeedResult> => {
    // Basit hesaplama frontend'de yapılabilir
    let dailyWaterMl = 0;
    let formula = '';
    const recommendations: string[] = [];
    const warnings: string[] = [];

    if (ageMonths < 6) {
      warnings.push('6 aydan küçük bebekler için ek su önerilmez. Anne sütü veya formula yeterlidir.');
      formula = 'N/A';
    } else if (ageMonths >= 6 && ageMonths < 12) {
      dailyWaterMl = Math.round(weightKg * 30);
      formula = '30ml x kilo (kg)';
      recommendations.push('Ek gıdaya yeni başlayan bebeklerde su ihtiyacı düşüktür');
      recommendations.push('Anne sütü veya formula ana sıvı kaynağıdır');
      recommendations.push('Yemeklerle birlikte küçük yudumlarda su sunun');
    } else {
      dailyWaterMl = Math.round(weightKg * 40);
      formula = '40ml x kilo (kg)';
      recommendations.push('Gün boyunca düzenli aralıklarla su sunun');
      recommendations.push('Yemeklerle birlikte mutlaka su verin');
      recommendations.push('Sıcak havalarda ve fiziksel aktivite sonrası ihtiyaç artar');
    }

    return {
      daily_water_ml: dailyWaterMl,
      age_months: ageMonths,
      weight_kg: weightKg,
      formula,
      recommendations,
      warnings,
    };
  },

  // ===============================
  // EK GIDAYA BAŞLAMA KONTROLÜ
  // ===============================

  /**
   * Ek gıdaya başlama hazırlık testi konfigürasyonunu getir
   */
  getSolidFoodReadinessConfig: async (): Promise<SolidFoodReadinessConfig> => {
    return fetchAPI<SolidFoodReadinessConfig>(API_ENDPOINTS.SOLID_FOOD_CONFIG);
  },

  /**
   * Ek gıdaya başlama testi sonucunu kaydet
   */
  submitSolidFoodReadinessTest: async (
    answers: Record<string, string>,
    childId?: string
  ): Promise<SolidFoodReadinessResult> => {
    return fetchAuthAPI<SolidFoodReadinessResult>(API_ENDPOINTS.SOLID_FOOD_SUBMIT, {
      method: 'POST',
      body: JSON.stringify({ answers, child_id: childId }),
    });
  },

  // ===============================
  // ALERJEN PLANLAYICI
  // ===============================

  /**
   * Alerjen listesini getir
   */
  getAllergenList: async (): Promise<Allergen[]> => {
    return fetchAPI<Allergen[]>(API_ENDPOINTS.ALLERGEN_LIST);
  },

  /**
   * Belirli bir alerjen için deneme planı getir
   */
  getAllergenTrialPlan: async (allergenId: string): Promise<AllergenTrialPlan> => {
    return fetchAPI<AllergenTrialPlan>(API_ENDPOINTS.ALLERGEN_PLAN(allergenId));
  },

  // ===============================
  // BESİN DENEME TAKVİMİ
  // ===============================

  /**
   * Besin denemelerini getir
   */
  getFoodTrials: async (
    childId: string,
    startDate: string,
    endDate: string
  ): Promise<FoodTrial[]> => {
    const response = await fetchAuthAPI<{ trials: FoodTrial[]; total: number }>(
      `${API_ENDPOINTS.FOOD_TRIALS}?child_id=${childId}&start_date=${startDate}&end_date=${endDate}`
    );
    return response.trials || [];
  },

  /**
   * Yeni besin denemesi ekle
   */
  addFoodTrial: async (trial: FoodTrialInput): Promise<FoodTrial> => {
    // Backend FoodTrialController expects: child_id, ingredient_id, trial_date, result
    // Frontend sends: child_id, ingredient_name, trial_date, form, reaction, etc.
    
    // Reaction mapping: Frontend reaction -> Backend result
    const mapReactionToResult = (reaction?: string): string => {
      switch (reaction) {
        case 'none': return 'success';
        case 'mild': return 'mild_reaction';
        case 'moderate': return 'reaction';
        case 'severe': return 'severe_reaction';
        default: return 'success';
      }
    };
    
    return fetchAuthAPI<FoodTrial>(API_ENDPOINTS.FOOD_TRIALS, {
      method: 'POST',
      body: JSON.stringify({
        child_id: trial.child_id,
        ingredient_name: trial.ingredient_name,
        ...(trial.ingredient_id && { ingredient_id: trial.ingredient_id }),
        trial_date: trial.trial_date,
        result: mapReactionToResult(trial.reaction),
        reaction_notes: trial.reaction_notes || '',
        amount: trial.rating ? trial.rating.toString() : '',
        form: trial.form || '',
      }),
    });
  },

  /**
   * Besin deneme özetini getir
   */
  getFoodTrialSummary: async (
    childId: string,
    startDate: string,
    endDate: string
  ): Promise<FoodTrialSummary> => {
    return fetchAuthAPI<FoodTrialSummary>(
      API_ENDPOINTS.FOOD_TRIAL_SUMMARY(childId, startDate, endDate)
    );
  },
};
