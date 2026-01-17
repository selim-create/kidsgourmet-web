import { API_ENDPOINTS } from '@/lib/constants';
import { fetchAPI, fetchAuthAPI } from '@/lib/api';
import {
  VaccineSchedule,
  VaccineMaster,
  MarkVaccineDoneRequest,
  UpdateVaccineStatusRequest,
  AddPrivateVaccineRequest,
  ReportSideEffectRequest,
  UpcomingVaccine,
  VaccineHistoryItem,
  NotificationPreferences,
  VaccineRecord,
} from '@/lib/types';
import { extractApiData, ensureArray, defaultVaccineStats } from '@/lib/api-utils';

export const vaccineService = {
  /**
   * Get all vaccine master data
   */
  async getVaccineMaster(): Promise<VaccineMaster[]> {
    return fetchAPI<VaccineMaster[]>(API_ENDPOINTS.VACCINES_MASTER);
  },

  /**
   * Get vaccine schedule for a specific child
   */
  async getVaccineSchedule(childId: string): Promise<VaccineSchedule> {
    const response = await fetchAuthAPI<unknown>(API_ENDPOINTS.VACCINES_BY_CHILD(childId));
    const data = extractApiData<VaccineSchedule>(response);
    
    // Provide fallbacks for stats and vaccines
    return {
      ...data,
      vaccines: ensureArray<VaccineRecord>(data?.vaccines),
      stats: data?.stats ?? defaultVaccineStats,
    };
  },

  /**
   * Mark a vaccine as done
   */
  async markVaccineDone(request: MarkVaccineDoneRequest): Promise<void> {
    await fetchAuthAPI<unknown>(API_ENDPOINTS.VACCINES_MARK_DONE, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Update vaccine status (skip, delay, etc.)
   */
  async updateVaccineStatus(request: UpdateVaccineStatusRequest): Promise<VaccineSchedule> {
    return fetchAuthAPI<VaccineSchedule>(API_ENDPOINTS.VACCINES_UPDATE_STATUS, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  /**
   * Add a private vaccine (Rotavirus, Meningococcal, etc.)
   */
  async addPrivateVaccine(request: AddPrivateVaccineRequest): Promise<void> {
    await fetchAuthAPI<unknown>(API_ENDPOINTS.VACCINES_ADD_PRIVATE, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Report side effects for a vaccine
   */
  async reportSideEffect(request: ReportSideEffectRequest): Promise<void> {
    return fetchAuthAPI<void>(API_ENDPOINTS.VACCINES_SIDE_EFFECTS, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Get upcoming vaccines for a child
   */
  async getUpcomingVaccines(childId: string): Promise<UpcomingVaccine[]> {
    const response = await fetchAuthAPI<unknown>(API_ENDPOINTS.VACCINES_UPCOMING(childId));
    const extracted = extractApiData<UpcomingVaccine[] | unknown>(response);
    return ensureArray<UpcomingVaccine>(extracted);
  },

  /**
   * Get vaccine history for a child
   */
  async getVaccineHistory(childId: string): Promise<VaccineHistoryItem[]> {
    const response = await fetchAuthAPI<unknown>(API_ENDPOINTS.VACCINES_HISTORY(childId));
    const extracted = extractApiData<VaccineHistoryItem[] | unknown>(response);
    return ensureArray<VaccineHistoryItem>(extracted);
  },

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return fetchAuthAPI<NotificationPreferences>(API_ENDPOINTS.NOTIFICATION_PREFERENCES);
  },

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return fetchAuthAPI<NotificationPreferences>(API_ENDPOINTS.NOTIFICATION_PREFERENCES, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },

  /**
   * Get available schedule versions
   */
  async getScheduleVersions(): Promise<{ version: string; name: string; description: string; is_default: boolean }[]> {
    return fetchAPI<{ version: string; name: string; description: string; is_default: boolean }[]>(API_ENDPOINTS.VACCINES_SCHEDULE_VERSIONS);
  },

  /**
   * Get overdue vaccines for a child
   */
  async getOverdueVaccines(childId: string): Promise<UpcomingVaccine[]> {
    const vaccines = await this.getUpcomingVaccines(childId);
    // getUpcomingVaccines guarantees array return after processing
    return vaccines.filter((v: UpcomingVaccine) => v?.is_overdue);
  },
};
