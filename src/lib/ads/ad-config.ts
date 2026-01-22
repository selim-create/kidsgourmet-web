/**
 * Ad Configuration API
 */

import { API_URL } from '../constants';
import type { AdConfig, AdSlot, AdPlacement, DeviceType } from './types';

const HIP_ADS_API_NAMESPACE = '/hip-ads/v1';

/**
 * Fetch ad configuration from backend
 * Note: Uses standard fetch caching. For server-side usage, Next.js revalidate can be applied.
 */
export async function fetchAdConfig(): Promise<AdConfig> {
  try {
    const response = await fetch(`${API_URL}${HIP_ADS_API_NAMESPACE}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'default', // Use browser cache
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ad config: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ad config:', error);
    // Return default config as fallback
    return getDefaultConfig();
  }
}

/**
 * Fetch slots filtered by criteria
 */
export async function fetchSlots(filters?: {
  placement?: AdPlacement;
  device?: DeviceType;
  enabled?: boolean;
}): Promise<AdSlot[]> {
  try {
    const config = await fetchAdConfig();
    let slots = config.slots || [];

    // Apply filters
    if (filters) {
      if (filters.placement) {
        slots = slots.filter((slot) => slot.placement === filters.placement);
      }

      if (filters.device) {
        const deviceType = filters.device;
        slots = slots.filter((slot) => slot.devices.includes(deviceType));
      }

      if (filters.enabled !== undefined) {
        slots = slots.filter((slot) => slot.enabled === filters.enabled);
      }
    }

    return slots;
  } catch (error) {
    console.error('Error fetching slots:', error);
    return [];
  }
}

/**
 * Fetch ads.txt content
 * Note: This function is designed to be called from Server Components or API routes
 */
export async function fetchAdsTxt(): Promise<string> {
  try {
    const response = await fetch(`${API_URL}${HIP_ADS_API_NAMESPACE}/ads-txt`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain',
      },
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ads.txt: ${response.statusText}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error fetching ads.txt:', error);
    return '';
  }
}

/**
 * Default configuration fallback
 */
function getDefaultConfig(): AdConfig {
  return {
    network_code: '0',
    property_code: 'default',
    lazy_load: {
      enabled: true,
      fetch_margin: 500,
      render_margin: 200,
      mobile_scaling: 2.0,
    },
    collapse_empty: true,
    single_request: true,
    enable_services: true,
    debug_mode: false,
    slots: [],
  };
}
