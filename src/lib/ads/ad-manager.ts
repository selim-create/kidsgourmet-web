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
  private refreshIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private servicesEnabled = false;

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

        // Configure based on config - support both naming conventions
        const singleRequest = this.config?.single_request ?? this.config?.singleRequest ?? this.config?.enableSingleRequest;
        if (singleRequest) {
          pubads.enableSingleRequest();
        }

        const collapseEmpty = this.config?.collapse_empty ?? this.config?.collapseEmpty;
        if (collapseEmpty) {
          pubads.collapseEmptyDivs();
        }

        // Support both lazy_load and lazyLoadConfig
        const lazyLoadEnabled = this.config?.lazy_load?.enabled ?? this.config?.lazyLoadConfig?.enabled;
        if (lazyLoadEnabled) {
          pubads.enableLazyLoad({
            fetchMarginPercent: this.config?.lazy_load?.fetch_margin ?? this.config?.lazyLoadConfig?.fetchMarginPercent ?? 500,
            renderMarginPercent: this.config?.lazy_load?.render_margin ?? this.config?.lazyLoadConfig?.renderMarginPercent ?? 200,
            mobileScaling: this.config?.lazy_load?.mobile_scaling ?? this.config?.lazyLoadConfig?.mobileScaling ?? 2.0,
          });
        }

        // NOTE: enableServices() is NOT called here
        // It will be called in defineSlot() after the first slot is defined
        // This ensures proper GPT.js call sequencing: defineSlot → addService → enableServices → display
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
  defineSlot(slotConfig: AdSlot, containerId?: string): void {
    if (typeof window === 'undefined' || !window.googletag) {
      return;
    }

    window.googletag.cmd.push(() => {
      // Handle sizes - support both array [width, height] and object {width, height} formats
      const sizes = slotConfig.sizes.map((size) => {
        if (Array.isArray(size)) {
          return [size[0], size[1]] as [number, number];
        }
        return [size.width, size.height] as [number, number];
      });
      
      // Support both ad_unit_path and adUnitPath
      const adUnitPath = slotConfig.ad_unit_path || slotConfig.adUnitPath || '';
      // Support both slot_id, slotId and custom containerId
      const slotId = containerId || slotConfig.slot_id || slotConfig.slotId || '';

      const slot = window.googletag.defineSlot(
        adUnitPath,
        sizes,
        slotId
      );

      if (!slot) {
        console.error(`Failed to define slot: ${slotId}`);
        return;
      }

      // Add size mapping if configured
      const sizeMapping = slotConfig.size_mapping || slotConfig.sizeMappings;
      if (sizeMapping && sizeMapping.length > 0) {
        const mapping = window.googletag.sizeMapping();
        
        sizeMapping.forEach((map) => {
          const mappedSizes = map.sizes === 'fluid' 
            ? 'fluid' 
            : map.sizes.map((s) => {
                if (Array.isArray(s)) {
                  return [s[0], s[1]] as [number, number];
                }
                return [s.width, s.height] as [number, number];
              });
          mapping.addSize(map.viewport, mappedSizes);
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

      // Store slot reference using the actual slot ID used
      this.slots.set(slotId, slot);

      // Enable services after first slot is defined (only once)
      // This ensures proper GPT.js call sequencing
      if (!this.servicesEnabled) {
        const enableServices = this.config?.enable_services ?? this.config?.enableServices;
        if (enableServices !== false) {
          window.googletag.enableServices();
          this.servicesEnabled = true;
        }
      }
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
   * Display an ad slot (alias for displaySlot)
   */
  display(slotId: string): void {
    this.displaySlot(slotId);
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

      // Reset servicesEnabled flag if all slots are destroyed
      if (this.slots.size === 0) {
        this.servicesEnabled = false;
      }
    });
  }

  /**
   * Destroy a single slot (alias for destroySlots with single ID)
   */
  destroySlot(slotId: string): void {
    this.destroySlots([slotId]);
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
    return this.config?.debug_mode || this.config?.debugMode || this.config?.debug?.enabled || false;
  }
}

export default AdManager.getInstance();
