'use client';

/**
 * Ad Context - Provides ad configuration and slots to the application
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AdConfig, AdSlot, AdPlacement, DeviceType } from '@/lib/ads/types';
import { fetchAdConfig } from '@/lib/ads/ad-config';
import adManager from '@/lib/ads/ad-manager';

interface AdContextValue {
  config: AdConfig | null;
  slots: AdSlot[];
  loading: boolean;
  error: Error | null;
  initialized: boolean;
  adsEnabled: boolean;
  getSlotsByPlacement: (placement: AdPlacement) => AdSlot[];
  getSlotsByDevice: (device: DeviceType) => AdSlot[];
  getSlotById: (slotId: string) => AdSlot | undefined;
  isDebugMode: boolean;
}

const AdContext = createContext<AdContextValue | undefined>(undefined);

interface AdProviderProps {
  children: ReactNode;
}

export function AdProvider({ children }: AdProviderProps) {
  const [config, setConfig] = useState<AdConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initializeAds() {
      try {
        setLoading(true);
        const adConfig = await fetchAdConfig();
        setConfig(adConfig);

        // Only initialize ad manager if ads are enabled and we have valid config
        const adsEnabled = adConfig?.ads_enabled ?? adConfig?.adsEnabled ?? true;
        const networkCode = adConfig?.network_code || adConfig?.networkCode;
        
        if (adsEnabled && networkCode && networkCode !== '0' && networkCode !== '') {
          await adManager.initialize(adConfig);
        }

        setError(null);
      } catch (err) {
        console.error('Failed to initialize ads:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize ads'));
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    initializeAds();
  }, []);

  // Check if ads are enabled
  const adsEnabled = config?.ads_enabled ?? config?.adsEnabled ?? true;

  // Safe getter with null checks
  const getSlotsByPlacement = (placement: AdPlacement): AdSlot[] => {
    if (!adsEnabled || !config?.slots || !Array.isArray(config.slots)) return [];
    return config.slots.filter(
      (slot) => slot?.placement === placement && slot?.enabled !== false
    );
  };

  // Safe getter with device filtering
  const getSlotsByDevice = (device: DeviceType): AdSlot[] => {
    if (!adsEnabled || !config?.slots || !Array.isArray(config.slots)) return [];
    return config.slots.filter((slot) => {
      if (!slot || slot.enabled === false) return false;
      if (Array.isArray(slot.devices)) {
        return slot.devices.includes(device);
      }
      if (slot.device) {
        return slot.device === device || slot.device === 'all';
      }
      return true;
    });
  };

  // Safe getter
  const getSlotById = (slotId: string): AdSlot | undefined => {
    if (!adsEnabled || !config?.slots || !Array.isArray(config.slots)) return undefined;
    return config.slots.find((slot) => slot?.slot_id === slotId || slot?.slotId === slotId);
  };

  const value: AdContextValue = {
    config,
    slots: (adsEnabled && config?.slots && Array.isArray(config.slots)) ? config.slots : [],
    loading,
    error,
    initialized,
    adsEnabled,
    getSlotsByPlacement,
    getSlotsByDevice,
    getSlotById,
    isDebugMode: config?.debug_mode || config?.debugMode || false,
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}

export function useAds(): AdContextValue {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
}
