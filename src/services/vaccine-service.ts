import { API_URL, API_ENDPOINTS } from '@/lib/constants';
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
} from '@/lib/types';

export const vaccineService = {
  /**
   * Get all vaccine master data
   */
  async getVaccineMaster(): Promise<VaccineMaster[]> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.VACCINES_MASTER}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vaccine master data');
    }

    return response.json();
  },

  /**
   * Get vaccine schedule for a specific child
   */
  async getVaccineSchedule(childId: string): Promise<VaccineSchedule> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.VACCINES_BY_CHILD(childId)}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vaccine schedule');
    }

    return response.json();
  },

  /**
   * Mark a vaccine as done
   */
  async markVaccineDone(request: MarkVaccineDoneRequest): Promise<VaccineSchedule> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.VACCINES_MARK_DONE}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to mark vaccine as done' }));
      throw new Error(error.message || 'Failed to mark vaccine as done');
    }

    return response.json();
  },

  /**
   * Update vaccine status (skip, delay, etc.)
   */
  async updateVaccineStatus(request: UpdateVaccineStatusRequest): Promise<VaccineSchedule> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.VACCINES_UPDATE_STATUS}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update vaccine status' }));
      throw new Error(error.message || 'Failed to update vaccine status');
    }

    return response.json();
  },

  /**
   * Add a private vaccine (Rotavirus, Meningococcal, etc.)
   */
  async addPrivateVaccine(request: AddPrivateVaccineRequest): Promise<VaccineSchedule> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.VACCINES_ADD_PRIVATE}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to add private vaccine' }));
      throw new Error(error.message || 'Failed to add private vaccine');
    }

    return response.json();
  },

  /**
   * Report side effects for a vaccine
   */
  async reportSideEffect(request: ReportSideEffectRequest): Promise<void> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.VACCINES_SIDE_EFFECTS}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to report side effect' }));
      throw new Error(error.message || 'Failed to report side effect');
    }
  },

  /**
   * Get upcoming vaccines for a child
   */
  async getUpcomingVaccines(childId: string): Promise<UpcomingVaccine[]> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.VACCINES_UPCOMING(childId)}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming vaccines');
    }

    return response.json();
  },

  /**
   * Get vaccine history for a child
   */
  async getVaccineHistory(childId: string): Promise<VaccineHistoryItem[]> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.VACCINES_HISTORY(childId)}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vaccine history');
    }

    return response.json();
  },

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.NOTIFICATION_PREFERENCES}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification preferences');
    }

    return response.json();
  },

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.NOTIFICATION_PREFERENCES}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update notification preferences' }));
      throw new Error(error.message || 'Failed to update notification preferences');
    }

    return response.json();
  },
};
