/**
 * Google Publisher Tag (GPT) Type Definitions
 */

// Global GPT types
declare global {
  interface Window {
    googletag: typeof googletag;
    dataLayer: Array<Record<string, unknown>>;
  }
}

export interface GoogleTag {
  cmd: Array<() => void>;
  pubads(): PubAdsService;
  defineSlot(adUnitPath: string, size: GeneralSize, divId: string): Slot | null;
  display(divId: string): void;
  enableServices(): void;
  destroySlots(slots?: Slot[]): boolean;
}

export interface PubAdsService {
  enableSingleRequest(): void;
  collapseEmptyDivs(): void;
  disableInitialLoad(): void;
  enableLazyLoad(config?: LazyLoadConfig): void;
  setTargeting(key: string, value: string | string[]): PubAdsService;
  refresh(slots?: Slot[] | null, options?: RefreshOptions): void;
}

export interface Slot {
  addService(service: PubAdsService): Slot;
  defineSizeMapping(sizeMapping: SizeMappingArray): Slot;
  setTargeting(key: string, value: string | string[]): Slot;
  getSlotElementId(): string;
}

export interface SizeMappingBuilder {
  addSize(viewportSize: [number, number], slotSize: GeneralSize): SizeMappingBuilder;
  build(): SizeMappingArray;
}

export interface SizeMappingArray {
  // Opaque type from GPT - represents an internal GPT structure
  _brand: 'SizeMappingArray';
}

export interface LazyLoadConfig {
  fetchMarginPercent?: number;
  renderMarginPercent?: number;
  mobileScaling?: number;
}

export interface RefreshOptions {
  changeCorrelator?: boolean;
}

export type GeneralSize = SingleSize | MultiSize;
export type SingleSize = [number, number] | 'fluid';
export type MultiSize = SingleSize[];

export type GoogleTagInstance = GoogleTag & {
  sizeMapping(): SizeMappingBuilder;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const googletag: GoogleTagInstance;

/**
 * Application Ad Types
 */

export type AdPlacement = 
  | 'header'
  | 'sidebar'
  | 'content-top'
  | 'content-middle'
  | 'content-bottom'
  | 'footer'
  | 'sticky-bottom'
  | 'sticky-top';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface AdSize {
  width: number;
  height: number;
}

export interface SizeMapping {
  viewport: [number, number];
  sizes: AdSize[] | 'fluid';
}

export interface AdSlot {
  id: string;
  slot_id: string;
  name: string;
  ad_unit_path: string;
  sizes: AdSize[];
  size_mapping?: SizeMapping[];
  placement: AdPlacement;
  devices: DeviceType[];
  targeting?: Record<string, string | string[]>;
  lazy_load?: boolean;
  refresh_interval?: number;
  min_height?: number;
  enabled: boolean;
}

export interface AdConfig {
  network_code: string;
  property_code: string;
  lazy_load: {
    enabled: boolean;
    fetch_margin: number;
    render_margin: number;
    mobile_scaling: number;
  };
  collapse_empty: boolean;
  single_request: boolean;
  enable_services: boolean;
  debug_mode: boolean;
  slots: AdSlot[];
}

export interface AdSlotProps {
  slotId: string;
  className?: string;
  style?: React.CSSProperties;
  debug?: boolean;
}

export interface AdZoneProps {
  placement: AdPlacement;
  deviceType?: DeviceType;
  className?: string;
  style?: React.CSSProperties;
  debug?: boolean;
}
