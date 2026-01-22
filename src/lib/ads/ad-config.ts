/**
 * Ad Configuration API
 */

import { API_URL } from '../constants';
import type { AdConfig, AdSlot, AdPlacement, DeviceType } from './types';

const HIP_ADS_API_NAMESPACE = '/hip-ads/v1';

/**
 * Normalize slot data to ensure consistent property access
 */
function normalizeSlot(slot: Record<string, unknown>): AdSlot {
  return {
    id: String(slot.id || slot.slot_id || slot.slotId || ''),
    slot_id: String(slot.slot_id || slot.slotId || slot.id || ''),
    slotId: String(slot.slotId || slot.slot_id || slot.id || ''),
    name: String(slot.name || ''),
    ad_unit_path: String(slot.ad_unit_path || slot.adUnitPath || ''),
    adUnitPath: String(slot.adUnitPath || slot.ad_unit_path || ''),
    sizes: Array.isArray(slot.sizes) ? slot.sizes : [],
    size_mapping: Array.isArray(slot.size_mapping || slot.sizeMappings) 
      ? (slot.size_mapping || slot.sizeMappings) as AdSlot['size_mapping']
      : undefined,
    placement: (slot.placement as AdPlacement) || 'in-content',
    devices: Array.isArray(slot.devices) 
      ? slot.devices as DeviceType[]
      : (slot.device && slot.device !== 'all' ? [slot.device as DeviceType] : ['desktop', 'tablet', 'mobile']),
    device: String(slot.device || 'all'),
    targeting: (slot.targeting as Record<string, string | string[]>) || {},
    lazy_load: Boolean(slot.lazy_load ?? slot.lazyLoad ?? true),
    lazyLoad: Boolean(slot.lazyLoad ?? slot.lazy_load ?? true),
    refresh_interval: Number(slot.refresh_interval || slot.refreshInterval || 0),
    min_height: Number(slot.min_height || slot.minHeight || 0),
    minHeight: Number(slot.minHeight || slot.min_height || 0),
    enabled: slot.enabled !== false && slot.status !== 'inactive',
    status: String(slot.status || 'active'),
    priority: Number(slot.priority || 10),
  };
}

/**
 * Normalize config data to ensure consistent property access
 */
function normalizeConfig(data: Record<string, unknown>): AdConfig {
  const slots = Array.isArray(data.slots) 
    ? data.slots.map((slot: Record<string, unknown>) => normalizeSlot(slot))
    : [];

  return {
    network_code: String(data.network_code || data.networkCode || ''),
    networkCode: String(data.networkCode || data.network_code || ''),
    property_code: String(data.property_code || data.propertyCode || data.site_name || data.siteName || 'default'),
    site_name: String(data.site_name || data.siteName || ''),
    siteName: String(data.siteName || data.site_name || ''),
    lazy_load: {
      enabled: Boolean(data.lazy_load?.enabled ?? data.lazyLoadConfig?.enabled ?? true),
      fetch_margin: Number(data.lazy_load?.fetch_margin ?? data.lazyLoadConfig?.fetchMarginPercent ?? 500),
      render_margin: Number(data.lazy_load?.render_margin ?? data.lazyLoadConfig?.renderMarginPercent ?? 200),
      mobile_scaling: Number(data.lazy_load?.mobile_scaling ?? data.lazyLoadConfig?.mobileScaling ?? 2.0),
    },
    collapse_empty: Boolean(data.collapse_empty ?? data.collapseEmpty ?? true),
    single_request: Boolean(data.single_request ?? data.singleRequest ?? data.enableSingleRequest ?? true),
    enable_services: Boolean(data.enable_services ?? data.enableServices ?? true),
    debug_mode: Boolean(data.debug_mode ?? data.debugMode ?? data.debug?.enabled ?? false),
    debug: data.debug as AdConfig['debug'],
    slots,
  };
}

/**
 * Fetch ad configuration from backend
 */
export async function fetchAdConfig(): Promise<AdConfig> {
  try {
    const response = await fetch(`${API_URL}${HIP_ADS_API_NAMESPACE}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'default',
    });

    if (!response.ok) {
      console.warn(`Ad config fetch failed: ${response.status} ${response.statusText}`);
      return getDefaultConfig();
    }

    const data = await response.json();
    return normalizeConfig(data);
  } catch (error) {
    console.warn('Error fetching ad config:', error);
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

    if (filters) {
      if (filters.placement) {
        slots = slots.filter((slot) => slot.placement === filters.placement);
      }

      if (filters.device) {
        const deviceType = filters.device;
        slots = slots.filter((slot) => {
          if (Array.isArray(slot.devices)) {
            return slot.devices.includes(deviceType);
          }
          return slot.device === deviceType || slot.device === 'all';
        });
      }

      if (filters.enabled !== undefined) {
        slots = slots.filter((slot) => slot.enabled === filters.enabled);
      }
    }

    return slots;
  } catch (error) {
    console.warn('Error fetching slots:', error);
    return [];
  }
}

/**
 * Fetch ads.txt content
 */
export async function fetchAdsTxt(): Promise<string> {
  try {
    const response = await fetch(`${API_URL}${HIP_ADS_API_NAMESPACE}/ads-txt`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (!response.ok) {
      return '';
    }

    return await response.text();
  } catch (error) {
    console.warn('Error fetching ads.txt:', error);
    return '';
  }
}

/**
 * Default configuration fallback
 */
function getDefaultConfig(): AdConfig {
  return {
    network_code: '',
    networkCode: '',
    property_code: 'default',
    site_name: '',
    siteName: '',
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
