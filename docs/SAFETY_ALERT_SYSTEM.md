# Safety Alert System Documentation

## Overview

The safety alert system provides centralized age group safety compliance checking and user-friendly error handling for the KidsGourmet platform.

## Architecture

### 1. Centralized Safety Mapping (`utils/safetyMapping.ts`)

This module serves as the single source of truth for:
- Age group thresholds and definitions
- Alert severity determination logic
- UI configuration (colors, icons, borders)
- Ingredient age restrictions

#### Age Group Thresholds

```typescript
AGE_GROUP_THRESHOLDS = {
  INFANT_0_6: { min: 0, max: 5, name: '0-6 Ay' },
  INFANT_6_9: { min: 6, max: 8, name: '6-9 Ay' },
  INFANT_9_12: { min: 9, max: 11, name: '9-12 Ay' },
  TODDLER_12_18: { min: 12, max: 17, name: '12-18 Ay' },
  TODDLER_18_24: { min: 18, max: 23, name: '18-24 Ay' },
  CHILD_2_3: { min: 24, max: 35, name: '2-3 Yaş' },
  CHILD_3_4: { min: 36, max: 47, name: '3-4 Yaş' },
  CHILD_4_PLUS: { min: 48, max: 999, name: '4+ Yaş' },
}
```

#### Severity Determination Rules

1. **SUCCESS** (✅): Child's age group matches recipe's age group
2. **INFO** (ℹ️): Child is older than recipe's minimum age (recipe is easy/suitable)
3. **WARNING** (⚠️): Recipe is 1 age group level higher than child's
4. **CRITICAL** (🛑): Recipe is 2+ age group levels higher than child's

#### Alert UI Configuration

Each severity level has a consistent UI configuration:

```typescript
ALERT_UI_CONFIG = {
  critical: {
    icon: '🛑',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    iconColor: 'text-red-500',
  },
  warning: { /* ... */ },
  info: { /* ... */ },
  success: { /* ... */ },
}
```

### 2. Enhanced API Error Handling (`lib/api.ts`)

#### Error Types

The system detects and categorizes errors:

- **network**: Internet connection issues
- **timeout**: Request timeout
- **cors**: Cross-origin/security errors
- **auth**: Authentication failures (401)
- **server**: Server errors (5xx)
- **unknown**: Other errors

#### Error Info Structure

```typescript
interface FetchErrorInfo {
  type: 'network' | 'timeout' | 'cors' | 'auth' | 'server' | 'unknown';
  message: string;
  userMessage: string;  // Turkish user-friendly message
  canRetry: boolean;    // Whether retry makes sense
  statusCode?: number;
}
```

#### User Messages (Turkish)

- Network: "İnternet bağlantınızı kontrol edin ve tekrar deneyin."
- Timeout: "İstek zaman aşımına uğradı. Lütfen tekrar deneyin."
- CORS: "Bağlantı hatası oluştu. Lütfen sayfayı yenileyip tekrar deneyin."
- Auth: "Oturum süresi doldu. Lütfen tekrar giriş yapın."
- Server: "Sunucu hatası oluştu. Lütfen birkaç dakika sonra tekrar deneyin."

### 3. HTML Entity Decoding (`utils/textHelpers.ts`)

All alert messages are decoded using `decodeEntities()` to ensure proper display of:
- Named entities (`&amp;`, `&quot;`, `&rsquo;`, etc.)
- Decimal numeric entities (`&#8217;`, `&#60;`)
- Hexadecimal numeric entities (`&#x1F60A;`, `&#x27;`)

## Component Usage

### SafetyAlertBanner

Displays recipe safety alerts with:
- Loading state with spinner
- Error state with retry button (when applicable)
- Age warnings with appropriate severity
- Success state for safe recipes
- Detailed alerts with alternatives

```tsx
<SafetyAlertBanner recipeId={123} childId="child-uuid" />
```

### IngredientSafetyAlert

Displays ingredient-specific safety alerts:
- Age restrictions (honey, salt, sugar, nuts)
- Allergy warnings
- Centralized UI configuration
- HTML-decoded messages

```tsx
<IngredientSafetyAlert 
  ingredientSlug="bal" 
  ingredientData={{ min_age_months: 12 }}
/>
```

## Key Functions

### `determineAgeSafetySeverity(childAge, recipeMinAge): AlertSeverity`

Determines alert severity based on age comparison.

### `getAlertUIConfig(severity): AlertUIConfig`

Returns UI configuration for a given severity level.

### `checkIngredientAgeRestriction(slug, childAge)`

Checks if an ingredient has age restrictions for the child.

### `analyzeError(error, statusCode): FetchErrorInfo`

Analyzes an error and returns user-friendly info.

## Testing Scenarios

### Age Group Scenarios

1. **Same Age Group** → SUCCESS (green)
2. **Child Older** → INFO (blue)
3. **1 Level Higher** → WARNING (amber)
4. **2+ Levels Higher** → CRITICAL (red)

### Error Scenarios

1. **Network Error** → Show retry button with network icon
2. **Timeout** → Show retry button with timeout message
3. **Auth Error** → No retry button (requires login)
4. **Server Error** → Show retry button

### HTML Decoding

Test messages containing:
- `&#8217;` (right single quote)
- `&amp;` (ampersand)
- `&#x1F60A;` (emoji)
- `&rsquo;` (right single quote)

## Best Practices

1. **Always use centralized functions**: Don't hardcode severity logic in components
2. **Decode all user-facing messages**: Use `decodeEntities()` for any text from API
3. **Provide retry when appropriate**: Check `canRetry` before showing retry button
4. **Show error type**: Help users understand what went wrong
5. **Consistent UI**: Always use `getAlertUIConfig()` for colors/icons

## Backend Integration

The backend should return alerts in this format:

```typescript
{
  is_safe: boolean,
  safety_score: number,
  alerts: [
    {
      type: 'allergy' | 'age' | 'forbidden' | 'nutrition',
      severity: 'critical' | 'warning' | 'info',
      message: string,
      ingredient?: string,
      alternative?: string
    }
  ],
  alternatives?: RecipeCard[]
}
```

## Future Enhancements

1. Auto-retry with exponential backoff for network errors
2. Offline mode detection and messaging
3. More granular age group logic based on backend data
4. Localization support for multiple languages
5. Analytics tracking for error types and frequency
