# HIP Ad Manager Frontend Integration

Complete frontend integration for Google Ad Manager (GPT) with HIP Ad Manager backend plugin.

## Features

- ✅ **Full GPT.js Integration** - Type-safe Google Publisher Tag implementation
- ✅ **CLS Prevention** - Minimum heights and placeholders to prevent layout shifts
- ✅ **Lazy Loading** - IntersectionObserver-based lazy loading for better performance
- ✅ **Auto Refresh** - Configurable auto-refresh intervals for ad slots
- ✅ **Debug Mode** - Visual debugging for AdOps testing
- ✅ **Responsive** - Device-based ad targeting (mobile, tablet, desktop)
- ✅ **Dynamic Targeting** - Support for custom targeting parameters
- ✅ **ads.txt Proxy** - Automatic ads.txt serving via Next.js route

## Architecture

### Core Files

```
src/lib/ads/
├── types.ts           # TypeScript type definitions
├── ad-manager.ts      # Singleton GPT.js manager
├── ad-config.ts       # API configuration utilities
└── constants.ts       # Text constants for i18n

src/contexts/
└── AdContext.tsx      # React context for ad state

src/hooks/
├── useAdSlot.ts       # Hook for managing individual slots
└── useDeviceType.ts   # Hook for device detection

src/components/ads/
├── AdSlot.tsx         # Basic ad slot component
├── AdPlaceholder.tsx  # CLS prevention placeholder
├── DebugAdSlot.tsx    # Debug mode visualization
├── ResponsiveAdSlot.tsx # Device-aware slot
├── StickyAd.tsx       # Sticky positioned ads
├── InContentAd.tsx    # In-content ads
├── AdZone.tsx         # Placement-based wrapper
└── index.ts           # Component exports

src/app/ads.txt/
└── route.ts           # ads.txt proxy route
```

## Usage

### Basic Ad Slot

```tsx
import { AdSlot } from '@/components/ads';

function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <AdSlot slotId="header-banner-728x90" />
    </div>
  );
}
```

### Responsive Ad Placement

```tsx
import { AdZone } from '@/components/ads';

function Article() {
  return (
    <article>
      <h1>Article Title</h1>
      {/* Automatically selects correct ad for device */}
      <AdZone placement="content-top" />
      <p>Article content...</p>
      <AdZone placement="content-bottom" />
    </article>
  );
}
```

### In-Content Ads with Lazy Loading

```tsx
import { InContentAd } from '@/components/ads';

function BlogPost() {
  return (
    <article>
      <p>Paragraph 1...</p>
      <p>Paragraph 2...</p>
      
      {/* Lazy loads when scrolled into view */}
      <InContentAd 
        slotId="article-inline-300x250" 
        lazyLoad={true}
      />
      
      <p>Paragraph 3...</p>
    </article>
  );
}
```

### Sticky Ads

```tsx
import { StickyAd } from '@/components/ads';

function Layout({ children }) {
  return (
    <div>
      {/* Sticky bottom ad */}
      <StickyAd 
        slotId="sticky-bottom-320x50"
        position="bottom"
        offset={0}
      />
      
      {children}
    </div>
  );
}
```

### Debug Mode

Enable debug mode to visualize ad slots without making actual ad requests:

```tsx
import { AdSlot } from '@/components/ads';

function TestPage() {
  return (
    <div>
      {/* Shows debug info instead of real ad */}
      <AdSlot slotId="test-banner" debug={true} />
    </div>
  );
}
```

Or enable globally via backend config:
```json
{
  "debug_mode": true
}
```

### Using the Context

Access ad configuration and utilities:

```tsx
import { useAds } from '@/contexts/AdContext';

function AdDebugPanel() {
  const { config, slots, getSlotsByPlacement, isDebugMode } = useAds();
  
  return (
    <div>
      <h2>Ad Configuration</h2>
      <p>Network Code: {config?.network_code}</p>
      <p>Total Slots: {slots.length}</p>
      <p>Debug Mode: {isDebugMode ? 'ON' : 'OFF'}</p>
      
      <h3>Header Ads</h3>
      <ul>
        {getSlotsByPlacement('header').map(slot => (
          <li key={slot.slot_id}>{slot.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Backend API

The integration expects the following endpoint:

```
GET https://api.kidsgourmet.com.tr/wp-json/hip-ads/v1/config
```

### Expected Response Format

```json
{
  "network_code": "12345678",
  "property_code": "kidsgourmet",
  "lazy_load": {
    "enabled": true,
    "fetch_margin": 500,
    "render_margin": 200,
    "mobile_scaling": 2.0
  },
  "collapse_empty": true,
  "single_request": true,
  "enable_services": true,
  "debug_mode": false,
  "slots": [
    {
      "id": "1",
      "slot_id": "header-banner-728x90",
      "name": "Header Banner 728x90",
      "ad_unit_path": "/12345678/kidsgourmet/header",
      "sizes": [
        { "width": 728, "height": 90 },
        { "width": 970, "height": 90 }
      ],
      "size_mapping": [
        {
          "viewport": [1024, 0],
          "sizes": [
            { "width": 728, "height": 90 },
            { "width": 970, "height": 90 }
          ]
        },
        {
          "viewport": [0, 0],
          "sizes": "fluid"
        }
      ],
      "placement": "header",
      "devices": ["desktop", "tablet"],
      "targeting": {
        "section": "home",
        "position": "top"
      },
      "lazy_load": false,
      "refresh_interval": 30,
      "min_height": 90,
      "enabled": true
    }
  ]
}
```

## Ad Placements

Available placement types:

- `header` - Top of page
- `sidebar` - Side columns
- `content-top` - Above main content
- `content-middle` - Middle of content
- `content-bottom` - Below main content
- `footer` - Bottom of page
- `sticky-bottom` - Fixed at bottom
- `sticky-top` - Fixed at top

## Device Types

- `mobile` - Width < 768px
- `tablet` - Width 768px - 1023px
- `desktop` - Width ≥ 1024px

## Configuration Options

### Slot Configuration

| Property | Type | Description |
|----------|------|-------------|
| `slot_id` | string | Unique identifier for the ad slot |
| `name` | string | Human-readable name |
| `ad_unit_path` | string | Google Ad Manager ad unit path |
| `sizes` | AdSize[] | Array of allowed sizes |
| `size_mapping` | SizeMapping[] | Responsive size configuration |
| `placement` | AdPlacement | Where the ad appears |
| `devices` | DeviceType[] | Supported devices |
| `targeting` | object | Custom targeting parameters |
| `lazy_load` | boolean | Enable lazy loading |
| `refresh_interval` | number | Auto-refresh interval in seconds |
| `min_height` | number | Minimum height for CLS prevention |
| `enabled` | boolean | Whether slot is active |

### Global Configuration

| Property | Type | Description |
|----------|------|-------------|
| `network_code` | string | Google Ad Manager network code |
| `property_code` | string | Property identifier |
| `lazy_load` | object | Lazy load configuration |
| `collapse_empty` | boolean | Collapse empty ad slots |
| `single_request` | boolean | Use single request mode |
| `enable_services` | boolean | Enable GPT services |
| `debug_mode` | boolean | Enable debug mode globally |

## Best Practices

1. **CLS Prevention**: Always set `min_height` on slots to prevent layout shifts
2. **Lazy Loading**: Enable for below-fold content to improve initial page load
3. **Refresh Intervals**: Use conservatively (30+ seconds) to avoid poor UX
4. **Device Targeting**: Create separate slots for different devices when needed
5. **Debug Mode**: Test thoroughly in debug mode before production
6. **Size Mapping**: Configure responsive sizes for better mobile experience

## Troubleshooting

### Ads not showing

1. Check if slot is enabled: `enabled: true`
2. Verify device matches: Check `devices` array
3. Check browser console for GPT errors
4. Enable debug mode to see slot configuration

### Layout shifts (CLS)

1. Set appropriate `min_height` on slots
2. Use `AdPlaceholder` component
3. Avoid ads in critical rendering path

### Performance issues

1. Enable lazy loading for below-fold ads
2. Use `single_request: true` in config
3. Limit number of slots per page
4. Set reasonable refresh intervals

## Development

### Testing

Enable debug mode in backend config or per-component:

```tsx
<AdSlot slotId="test" debug={true} />
```

### Adding New Placements

1. Add to `AdPlacement` type in `types.ts`
2. Create slots in backend with new placement
3. Use in components: `<AdZone placement="new-placement" />`

### Custom Text

Update `src/lib/ads/constants.ts`:

```typescript
export const AD_TEXT = {
  PLACEHOLDER: 'Ad Space',
  SPONSORED_CONTENT: 'Sponsored',
} as const;
```

## License

Part of KidsGourmet web application.
