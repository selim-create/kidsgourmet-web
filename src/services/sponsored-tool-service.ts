import { fetchAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  BathPlannerConfig,
  BathPlannerResult,
  HygieneCalculatorResult,
  DiaperCalculatorResult,
  RashRiskResult,
  AirQualityResult,
  StainGuide,
} from '@/lib/types';

export const sponsoredToolService = {
  // ===============================
  // BANYO PLANLAYICI
  // ===============================

  /**
   * Banyo planlayıcı konfigürasyonunu getir
   */
  getBathPlannerConfig: async (): Promise<BathPlannerConfig> => {
    return fetchAPI<BathPlannerConfig>(API_ENDPOINTS.BATH_PLANNER_CONFIG);
  },

  /**
   * Banyo planı oluştur
   */
  generateBathPlan: async (data: {
    baby_age_months: number;
    skin_type: string;
    season: string;
    has_eczema: boolean;
  }): Promise<BathPlannerResult> => {
    return fetchAPI<BathPlannerResult>(API_ENDPOINTS.BATH_PLANNER_GENERATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ===============================
  // HİJYEN HESAPLAYICI
  // ===============================

  /**
   * Günlük hijyen ihtiyacını hesapla
   */
  calculateHygieneNeeds: async (data: {
    baby_age_months: number;
    daily_diaper_changes: number;
    outdoor_hours: number;
    meal_count: number;
  }): Promise<HygieneCalculatorResult> => {
    return fetchAPI<HygieneCalculatorResult>(API_ENDPOINTS.HYGIENE_CALCULATOR, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ===============================
  // BEZ HESAPLAYICI
  // ===============================

  /**
   * Bez ihtiyacını hesapla
   */
  calculateDiaperNeeds: async (data: {
    baby_weight_kg: number;
    baby_age_months: number;
    daily_changes: number;
  }): Promise<DiaperCalculatorResult> => {
    return fetchAPI<DiaperCalculatorResult>(API_ENDPOINTS.DIAPER_CALCULATOR, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Pişik riskini analiz et
   */
  analyzeRashRisk: async (data: {
    change_frequency: number;
    night_diaper_hours: number;
    humidity_level: string;
    has_diarrhea: boolean;
  }): Promise<RashRiskResult> => {
    return fetchAPI<RashRiskResult>(API_ENDPOINTS.DIAPER_RASH_RISK, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ===============================
  // HAVA KALİTESİ REHBERİ
  // ===============================

  /**
   * Hava kalitesini analiz et
   */
  analyzeAirQuality: async (data: {
    home_type: string;
    has_pets: boolean;
    has_smoker: boolean;
    heating_type: string;
    season: string;
    child_age_months?: number;
    respiratory_issues?: boolean;
    ventilation_frequency?: string;
    cooking_frequency?: string;
  }): Promise<AirQualityResult> => {
    return fetchAPI<AirQualityResult>(API_ENDPOINTS.AIR_QUALITY_ANALYZE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ===============================
  // LEKE ANSİKLOPEDİSİ
  // ===============================

  /**
   * Leke ara
   */
  searchStains: async (query: string): Promise<StainGuide[]> => {
    return fetchAPI<StainGuide[]>(`${API_ENDPOINTS.STAIN_SEARCH}?q=${encodeURIComponent(query)}`);
  },

  /**
   * Leke detayını getir
   */
  getStainBySlug: async (slug: string): Promise<StainGuide> => {
    return fetchAPI<StainGuide>(API_ENDPOINTS.STAIN_BY_SLUG(slug));
  },
};
