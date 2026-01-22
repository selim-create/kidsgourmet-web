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

  useEffect(() => {
    async function initializeAds() {
      try {
        setLoading(true);
        const adConfig = await fetchAdConfig();
        setConfig(adConfig);

        // Initialize ad manager
        await adManager.initialize(adConfig);

        setError(null);
      } catch (err) {
        console.error('Failed to initialize ads:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize ads'));
      } finally {
        setLoading(false);
      }
    }

    initializeAds();
  }, []);

  const getSlotsByPlacement = (placement: AdPlacement): AdSlot[] => {
    if (!config) return [];
    return config.slots.filter(
      (slot) => slot.placement === placement && slot.enabled
    );
  };

  const getSlotsByDevice = (device: DeviceType): AdSlot[] => {
    if (!config) return [];
    return config.slots.filter(
      (slot) => slot.devices.includes(device) && slot.enabled
    );
  };

  const getSlotById = (slotId: string): AdSlot | undefined => {
    if (!config) return undefined;
    return config.slots.find((slot) => slot.slot_id === slotId);
  };

  const value: AdContextValue = {
    config,
    slots: config?.slots || [],
    loading,
    error,
    getSlotsByPlacement,
    getSlotsByDevice,
    getSlotById,
    isDebugMode: config?.debug_mode || false,
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
