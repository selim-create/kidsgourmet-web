# Manual Testing Scenarios for Safety Alert System

## Test Setup

Before testing, ensure you have:
1. A development environment running (`npm run dev`)
2. Access to the backend API
3. Test child profiles with different ages
4. Test recipes with different age requirements

## Test Scenarios

### 1. Age Group Warning Tests

#### Test 1.1: Same Age Group (SUCCESS)
- **Setup**: Child is 8 months old, Recipe requires 6-9 months
- **Expected**: Green success banner with ✅
- **Message**: "Bu tarif [Child Name]'in yaş grubuna uygun."

#### Test 1.2: Child Older (INFO)
- **Setup**: Child is 24 months old, Recipe requires 6-9 months
- **Expected**: Blue info banner with ℹ️
- **Message**: "Bu tarif 6-9 Ay için hazırlanmıştır. [Child Name] (2-3 Yaş) için uygun görünüyor."

#### Test 1.3: One Level Higher (WARNING)
- **Setup**: Child is 8 months old, Recipe requires 9-12 months
- **Expected**: Amber warning banner with ⚠️
- **Message**: "Bu tarif 9-12 Ay için önerilmektedir. [Child Name] (6-9 Ay) için dikkatli kullanın..."

#### Test 1.4: Two+ Levels Higher (CRITICAL)
- **Setup**: Child is 6 months old, Recipe requires 18-24 months
- **Expected**: Red critical banner with 🛑
- **Message**: "⚠️ Bu tarif 18-24 Ay için tasarlanmıştır. [Child Name] (6-9 Ay) için henüz uygun değildir..."

### 2. Ingredient Safety Tests

#### Test 2.1: Honey for Infant (CRITICAL)
- **Setup**: Child is 8 months old, Ingredient: "bal" (honey)
- **Expected**: Red critical banner
- **Message**: "Botulizm riski nedeniyle 12 aydan küçük bebeklere verilmemelidir. [Child Name] şu an 8 aylık."

#### Test 2.2: Sugar for Toddler (WARNING)
- **Setup**: Child is 18 months old, Ingredient: "seker" (sugar)
- **Expected**: Amber warning banner
- **Message**: Contains age restriction message for sugar

#### Test 2.3: Whole Nuts for Young Child (CRITICAL)
- **Setup**: Child is 30 months old, Ingredient: "findik" (hazelnut)
- **Expected**: Red critical banner
- **Message**: "Boğulma riski nedeniyle tam fındık 4 yaşından küçük çocuklara verilmemelidir..."

#### Test 2.4: Safe Ingredient (SUCCESS)
- **Setup**: Child is 18 months old, Ingredient: "havuc" (carrot)
- **Expected**: Green success banner
- **Message**: "[Child Name] için Uygun Görünüyor"

### 3. Allergy Warning Tests

#### Test 3.1: Known Allergy (CRITICAL)
- **Setup**: Child allergic to "yumurta", Recipe contains eggs
- **Expected**: Red allergy warning
- **Message**: "[Child Name] bu malzemeye alerjik!"

#### Test 3.2: Multiple Allergies
- **Setup**: Child allergic to "sut" and "gluten"
- **Expected**: Multiple allergy warnings if both present

#### Test 3.3: No Allergies
- **Setup**: Child has no allergies, Recipe is safe
- **Expected**: Green success banner

### 4. API Error Handling Tests

#### Test 4.1: Network Error Simulation
- **Setup**: Turn off network or block API
- **Expected**: Blue error banner with:
  - "🌐 İnternet bağlantısı sorunu"
  - "İnternet bağlantınızı kontrol edin ve tekrar deneyin."
  - "Tekrar Dene" button visible

#### Test 4.2: Server Error (500)
- **Setup**: Mock 500 response from API
- **Expected**: Blue error banner with:
  - "🖥️ Sunucu hatası"
  - "Sunucu hatası oluştu. Lütfen birkaç dakika sonra tekrar deneyin."
  - "Tekrar Dene" button visible

#### Test 4.3: Authentication Error (401)
- **Setup**: Use invalid or expired token
- **Expected**: Blue error banner with:
  - "Oturum süresi doldu. Lütfen tekrar giriş yapın."
  - NO retry button (canRetry = false)

#### Test 4.4: Timeout Error
- **Setup**: Mock slow API response
- **Expected**: Blue error banner with:
  - "⏱️ Zaman aşımı"
  - "İstek zaman aşımına uğradı. Lütfen tekrar deneyin."
  - "Tekrar Dene" button visible

#### Test 4.5: CORS Error
- **Setup**: Test from different origin if possible
- **Expected**: Blue error banner with:
  - "🔒 Güvenlik hatası"
  - "Bağlantı hatası oluştu..."
  - "Tekrar Dene" button visible

#### Test 4.6: Retry Functionality
- **Setup**: Trigger network error, then fix network
- **Action**: Click "Tekrar Dene" button
- **Expected**: Loading state → Successful safety check

### 5. HTML Entity Decoding Tests

#### Test 5.1: Named Entities
- **Setup**: Mock API response with message containing `&amp;`, `&quot;`, `&rsquo;`
- **Expected**: Symbols display correctly: `&`, `"`, `'`

#### Test 5.2: Decimal Numeric Entities
- **Setup**: Message with `&#8217;` (right single quote)
- **Expected**: Displays as: `'`

#### Test 5.3: Hexadecimal Entities
- **Setup**: Message with `&#x1F60A;` (emoji)
- **Expected**: Displays as: 😊

#### Test 5.4: Multiple Entities
- **Setup**: Message: `Don&#8217;t use &amp; mix with &#x1F60A;`
- **Expected**: Displays as: `Don't use & mix with 😊`

### 6. UI Consistency Tests

#### Test 6.1: Color Consistency
- **Verify**: All CRITICAL alerts use red-50 background, red-500 border, red-800 text
- **Verify**: All WARNING alerts use amber-50 background, amber-500 border, amber-800 text
- **Verify**: All INFO alerts use blue-50 background, blue-500 border, blue-800 text
- **Verify**: All SUCCESS alerts use green-50 background, green-500 border, green-800 text

#### Test 6.2: Icon Consistency
- **Verify**: CRITICAL shows 🛑
- **Verify**: WARNING shows ⚠️
- **Verify**: INFO shows ℹ️
- **Verify**: SUCCESS shows ✅

#### Test 6.3: Component Consistency
- **Verify**: SafetyAlertBanner and IngredientSafetyAlert use same color scheme
- **Verify**: Both components decode HTML entities
- **Verify**: Both components use same severity determination logic

### 7. Edge Cases

#### Test 7.1: No Child Profile
- **Setup**: No child selected
- **Expected**: No alerts shown (components return null)

#### Test 7.2: Invalid Child Age
- **Setup**: Child with invalid birth_date
- **Expected**: Graceful handling, default age used

#### Test 7.3: Missing API Data
- **Setup**: API returns incomplete data (no alerts array)
- **Expected**: Safe default behavior, no crashes

#### Test 7.4: Empty Alerts Array
- **Setup**: API returns `alerts: []`
- **Expected**: Green success banner

#### Test 7.5: Multiple Alerts with Different Severities
- **Setup**: Recipe has both WARNING and CRITICAL alerts
- **Expected**: Shows CRITICAL styling (highest severity wins)

## Test Checklist

- [ ] All age group scenarios work correctly
- [ ] Ingredient restrictions are properly enforced
- [ ] Allergy warnings display for known allergens
- [ ] Network errors show retry button
- [ ] Server errors show retry button
- [ ] Auth errors don't show retry button
- [ ] Retry button actually retries the check
- [ ] HTML entities decode properly in all messages
- [ ] Colors are consistent across all severity levels
- [ ] Icons match severity levels
- [ ] Components handle missing data gracefully
- [ ] Loading states display correctly
- [ ] Success states are green and encouraging
- [ ] Error messages are in Turkish and user-friendly

## Regression Tests

After making changes, verify:
- [ ] Build completes successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Existing functionality still works
- [ ] No performance degradation

## Notes

- Test on different browsers (Chrome, Firefox, Safari)
- Test on mobile devices (responsive design)
- Test with screen readers (accessibility)
- Check console for any warnings or errors
- Verify network tab shows correct API calls
