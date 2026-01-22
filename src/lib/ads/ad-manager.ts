/**
 * Ad Manager - Singleton GPT.js Management
 */

import type { AdConfig, AdSlot, Slot } from './types';

class AdManager {
  private static instance: AdManager;
  private config: AdConfig | null = null;
  private slots: Map<string, Slot> = new Map();
  private scriptLoaded = false;
  private scriptLoading = false;
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  /**
   * Initialize Ad Manager with configuration
   */
  async initialize(config: AdConfig): Promise<void> {
    this.config = config;

    // Load GPT script
    await this.loadGPTScript();

    // Configure GPT
    if (typeof window !== 'undefined' && window.googletag) {
      window.googletag.cmd.push(() => {
        const pubads = window.googletag.pubads();

        // Configure based on config
        if (this.config?.single_request) {
          pubads.enableSingleRequest();
        }

        if (this.config?.collapse_empty) {
          pubads.collapseEmptyDivs();
        }

        if (this.config?.lazy_load?.enabled) {
          pubads.enableLazyLoad({
            fetchMarginPercent: this.config.lazy_load.fetch_margin,
            renderMarginPercent: this.config.lazy_load.render_margin,
            mobileScaling: this.config.lazy_load.mobile_scaling,
          });
        }

        if (this.config?.enable_services) {
          window.googletag.enableServices();
        }
      });
    }
  }

  /**
   * Load GPT script dynamically
   */
  private loadGPTScript(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.scriptLoading) {
      return new Promise((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.scriptLoaded) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);
      });
    }

    this.scriptLoading = true;

    return new Promise((resolve, reject) => {
      // Initialize googletag queue
      window.googletag = window.googletag || { cmd: [] };

      const script = document.createElement('script');
      script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
      script.async = true;

      script.onload = () => {
        this.scriptLoaded = true;
        this.scriptLoading = false;
        resolve();
      };

      script.onerror = () => {
        this.scriptLoading = false;
        reject(new Error('Failed to load GPT script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Define an ad slot
   */
  defineSlot(slotConfig: AdSlot): void {
    if (typeof window === 'undefined' || !window.googletag) {
      return;
    }

    window.googletag.cmd.push(() => {
      const sizes = slotConfig.sizes.map((size) => [size.width, size.height] as [number, number]);

      const slot = window.googletag.defineSlot(
        slotConfig.ad_unit_path,
        sizes,
        slotConfig.slot_id
      );

      if (!slot) {
        console.error(`Failed to define slot: ${slotConfig.slot_id}`);
        return;
      }

      // Add size mapping if configured
      if (slotConfig.size_mapping && slotConfig.size_mapping.length > 0) {
        const mapping = window.googletag.sizeMapping();
        
        slotConfig.size_mapping.forEach((map) => {
          const sizes = map.sizes === 'fluid' 
            ? 'fluid' 
            : map.sizes.map((s) => [s.width, s.height] as [number, number]);
          mapping.addSize(map.viewport, sizes);
        });

        slot.defineSizeMapping(mapping.build());
      }

      // Set targeting
      if (slotConfig.targeting) {
        Object.entries(slotConfig.targeting).forEach(([key, value]) => {
          slot.setTargeting(key, value);
        });
      }

      slot.addService(window.googletag.pubads());

      // Store slot reference
      this.slots.set(slotConfig.slot_id, slot);
    });
  }

  /**
   * Display an ad slot
   */
  displaySlot(slotId: string): void {
    if (typeof window === 'undefined' || !window.googletag) {
      return;
    }

    window.googletag.cmd.push(() => {
      window.googletag.display(slotId);
    });
  }

  /**
   * Refresh an ad slot
   */
  refreshSlot(slotId: string): void {
    if (typeof window === 'undefined' || !window.googletag) {
      return;
    }

    const slot = this.slots.get(slotId);
    if (!slot) {
      console.warn(`Slot not found for refresh: ${slotId}`);
      return;
    }

    window.googletag.cmd.push(() => {
      window.googletag.pubads().refresh([slot]);
    });
  }

  /**
   * Start auto-refresh for a slot
   */
  startAutoRefresh(slotId: string, intervalSeconds: number): void {
    if (intervalSeconds <= 0) {
      return;
    }

    // Clear existing interval if any
    this.stopAutoRefresh(slotId);

    const interval = setInterval(() => {
      this.refreshSlot(slotId);
    }, intervalSeconds * 1000);

    this.refreshIntervals.set(slotId, interval);
  }

  /**
   * Stop auto-refresh for a slot
   */
  stopAutoRefresh(slotId: string): void {
    const interval = this.refreshIntervals.get(slotId);
    if (interval) {
      clearInterval(interval);
      this.refreshIntervals.delete(slotId);
    }
  }

  /**
   * Destroy slots
   */
  destroySlots(slotIds?: string[]): void {
    if (typeof window === 'undefined' || !window.googletag) {
      return;
    }

    window.googletag.cmd.push(() => {
      if (slotIds && slotIds.length > 0) {
        const slotsToDestroy = slotIds
          .map((id) => this.slots.get(id))
          .filter((slot): slot is Slot => slot !== undefined);

        if (slotsToDestroy.length > 0) {
          window.googletag.destroySlots(slotsToDestroy);
          slotIds.forEach((id) => {
            this.slots.delete(id);
            this.stopAutoRefresh(id);
          });
        }
      } else {
        // Destroy all slots
        window.googletag.destroySlots();
        this.slots.clear();
        this.refreshIntervals.forEach((interval) => clearInterval(interval));
        this.refreshIntervals.clear();
      }
    });
  }

  /**
   * Get configuration
   */
  getConfig(): AdConfig | null {
    return this.config;
  }

  /**
   * Check if debug mode is enabled
   */
  isDebugMode(): boolean {
    return this.config?.debug_mode || false;
  }
}

export default AdManager.getInstance();
