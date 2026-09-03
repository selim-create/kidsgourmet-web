/**
 * Ad Configuration API
 */

import { API_URL } from '../constants';
import type { AdConfig, AdSlot, AdPlacement, DeviceType, AdSize } from './types';

const HIP_ADS_API_NAMESPACE = '/hip-ads/v1';

/**
 * Normalize ad sizes to AdSize[] format
 */
function normalizeAdSizes(rawSizes: unknown): AdSize[] {
  if (!Array.isArray(rawSizes)) return [];
  return rawSizes.map(size => {
    // Handle array format [width, height]
    if (Array.isArray(size) && size.length >= 2) {
      return { width: Number(size[0]), height: Number(size[1]) };
    }
    // Handle object format {width, height}
    if (typeof size === 'object' && size !== null && 'width' in size && 'height' in size) {
      return { width: Number((size as { width: unknown }).width), height: Number((size as { height: unknown }).height) };
    }
    return { width: 0, height: 0 };
  }).filter(s => s.width > 0 && s.height > 0);
}

/**
 * Normalize size mapping to SizeMapping[] format
 */
function normalizeSizeMapping(rawMapping: unknown): AdSlot['size_mapping'] {
  if (!Array.isArray(rawMapping)) return undefined;
  const mappings = rawMapping.map(mapping => {
    if (typeof mapping !== 'object' || mapping === null) {
      return null;
    }
    
    const viewport = Array.isArray((mapping as { viewport?: unknown }).viewport) 
      ? [Number((mapping as { viewport: unknown[] }).viewport[0]), Number((mapping as { viewport: unknown[] }).viewport[1])] as [number, number]
      : [0, 0] as [number, number];
    
    const rawSizes = (mapping as { sizes?: unknown }).sizes;
    const sizes = rawSizes === 'fluid' 
      ? 'fluid' as const
      : normalizeAdSizes(rawSizes);
    
    return { viewport, sizes };
  }).filter((m): m is { viewport: [number, number]; sizes: AdSize[] | 'fluid' } => m !== null);
  
  return mappings.length > 0 ? mappings : undefined;
}

/**
 * Normalize slot data to ensure consistent property access
 */
function normalizeSlot(slot: Record<string, unknown>): AdSlot {
  // Normalize sizes
  const rawSizes = slot.sizes || [];
  const sizes = normalizeAdSizes(rawSizes);
  
  // Normalize size mapping
  const rawSizeMapping = slot.size_mapping || slot.sizeMappings;
  const sizeMapping = normalizeSizeMapping(rawSizeMapping);
  
  return {
    id: String(slot.id || slot.slot_id || slot.slotId || ''),
    slot_id: String(slot.slot_id || slot.slotId || slot.id || ''),
    slotId: String(slot.slotId || slot.slot_id || slot.id || ''),
    name: String(slot.name || ''),
    ad_unit_path: String(slot.ad_unit_path || slot.adUnitPath || ''),
    adUnitPath: String(slot.adUnitPath || slot.ad_unit_path || ''),
    sizes,
    size_mapping: sizeMapping,
    sizeMappings: sizeMapping,
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

  const lazyLoad = data.lazy_load as Record<string, unknown> | undefined;
  const lazyLoadConfig = data.lazyLoadConfig as Record<string, unknown> | undefined;
  const debug = data.debug as Record<string, unknown> | undefined;

  // Get ads_enabled value - default to true
  const adsEnabled = data.ads_enabled ?? data.adsEnabled ?? true;

  return {
    network_code: String(data.network_code || data.networkCode || ''),
    networkCode: String(data.networkCode || data.network_code || ''),
    property_code: String(data.property_code || data.propertyCode || data.site_name || data.siteName || 'default'),
    site_name: String(data.site_name || data.siteName || ''),
    siteName: String(data.siteName || data.site_name || ''),
    lazy_load: {
      enabled: Boolean(lazyLoad?.enabled ?? lazyLoadConfig?.enabled ?? true),
      fetch_margin: Number(lazyLoad?.fetch_margin ?? lazyLoadConfig?.fetchMarginPercent ?? 500),
      render_margin: Number(lazyLoad?.render_margin ?? lazyLoadConfig?.renderMarginPercent ?? 200),
      mobile_scaling: Number(lazyLoad?.mobile_scaling ?? lazyLoadConfig?.mobileScaling ?? 2.0),
    },
    collapse_empty: Boolean(data.collapse_empty ?? data.collapseEmpty ?? true),
    single_request: Boolean(data.single_request ?? data.singleRequest ?? true),
    enable_services: Boolean(data.enable_services ?? data.enableServices ?? true),
    debug_mode: Boolean(data.debug_mode ?? data.debugMode ?? debug?.enabled ?? false),
    debug: debug as AdConfig['debug'],
    // Support both formats: ads_enabled and adsEnabled
    ads_enabled: Boolean(adsEnabled),
    adsEnabled: Boolean(adsEnabled),
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
    ads_enabled: true,
    adsEnabled: true,
    slots: [],
  };
}
