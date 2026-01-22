'use client';

/**
 * Device Type Detection Hook
 */

import { useState, useEffect } from 'react';
import type { DeviceType } from '@/lib/ads/types';

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (typeof window === 'undefined') {
      return 'desktop';
    }
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    function detectDevice(): DeviceType {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    }

    function handleResize() {
      setDeviceType(detectDevice());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceType;
}
