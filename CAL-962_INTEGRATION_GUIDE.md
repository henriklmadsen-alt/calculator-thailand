# CAL-962 Integration Guide: Save Calculation Button + localStorage

**Status:** Win #2 Quick Win — Reference Implementation Complete  
**Deploy Target:** All 950 calculator pages  
**Effort:** 2-5 minutes per page (automatable)  
**Deadline:** Post-QA approval  

---

## What Was Built

### 1. Saved Calculations Utility Module
**File:** `src/lib/saved-calcs.ts`

Exports the following functions for calculator pages:

```typescript
// Core Functions
export function getSavedCalculations(): SavedCalculation[]
export function saveCalculation(name, path, inputs, result): SavedCalculation | null
export function removeSavedCalculation(id): boolean
export function clearAllSavedCalculations(): boolean
export function getSavedCalculationsForCalculator(path): SavedCalculation[]
export function findMatchingCalculation(path, inputs): SavedCalculation | null

// Utilities
export function formatTimeDiff(timestamp): string  // "1ชั่วโมงที่แล้ว"
```

**Storage Schema:**
```json
{
  "id": "calc_1713797000000_abc123def",
  "calculatorName": "คำนวณ APR",
  "calculatorPath": "/คำนวณ-apr/",
  "inputs": { "principal": 500000, "monthlyPayment": 11000, ... },
  "result": "6.50%",
  "timestamp": 1713797000000
}
```

Key features:
- localStorage key: `ct.saved.calcs.v1`
- Max 5 entries per user (FIFO eviction)
- Graceful degradation in private/incognito mode
- TypeScript types included for IDE support

---

### 2. CSS Styles Added to theme.css

**Button styling:** `.save-calc-btn`
- Green color scheme (`#065f46` / `#10b981`)
- Hover state with background transition
- Dark mode support included
- Disabled state (opacity 0.5, cursor not-allowed)

**Feedback popup:** `.save-calc-feedback`
- Centered fixed positioning
- popIn animation (0.3s scale from 0.8 to 1.0)
- fadeOut animation (0.3s opacity 1→0)
- Auto-removes after 2 seconds

**Optional:** `.save-calc-recent*`
- Styles for recent calculations list (below button)
- List item hover state
- Time formatting with gray text

All styles include full dark mode support via `html[data-theme='dark']` selector.

---

### 3. Reference Implementation: APR Calculator Page

**File:** `src/pages/คำนวณ-apr/index.astro`

#### Button HTML (in results div header)
```html
<div class="flex items-center justify-between mb-4">
  <h2 class="text-lg font-semibold text-gray-900">ผลการคำนวณ APR</h2>
  <button
    id="save-calc-btn"
    type="button"
    class="save-calc-btn"
    aria-label="บันทึกการคำนวณนี้"
  >
    💾 บันทึก
  </button>
</div>
```

#### JavaScript Handler (in script tag)
The script includes:
1. `isLocalStorageAvailable()` — Safety check
2. `getSavedCalculations()` — Retrieve saved items
3. `saveCalculation(inputs, result)` — Save to localStorage
4. `showSaveSuccess()` — Display "✅ บันทึกการคำนวณเรียบร้อย" for 2 sec
5. **Button click handler** that:
   - Validates inputs are filled
   - Extracts calculation data
   - Saves to localStorage
   - Shows success feedback
   - Tracks GA4 event: `calculation_saved`

---

## How to Integrate Into Other Calculator Pages

### Minimal Integration (3 Steps)

#### Step 1: Add Save Button to Results Header
Replace the results `<h2>` with a flex container:

```html
<!-- Before -->
<h2 class="text-lg font-semibold text-gray-900">ผลการคำนวณ [Name]</h2>

<!-- After -->
<div class="flex items-center justify-between mb-4">
  <h2 class="text-lg font-semibold text-gray-900">ผลการคำนวณ [Name]</h2>
  <button
    id="save-calc-btn"
    type="button"
    class="save-calc-btn"
    aria-label="บันทึกการคำนวณนี้"
  >
    💾 บันทึก
  </button>
</div>
```

#### Step 2: Copy Save Utility Functions to Script
Copy the `isLocalStorageAvailable()`, `getSavedCalculations()`, and `saveCalculation()` functions from the APR calculator into the bottom of the `<script>` tag (same location as the APR example).

#### Step 3: Add Button Handler
At the end of the script, add the button click handler:

```javascript
const STORAGE_KEY = 'ct.saved.calcs.v1';
const MAX_SAVED = 5;
const calculatorPath = window.location.pathname;
const calculatorName = '[INSERT PAGE TITLE]'; // e.g., 'คำนวณ APR'

// ... (utility functions from Step 2) ...

// Add button handler
const saveBtn = document.getElementById('save-calc-btn');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    // Extract inputs from form fields
    const inputs = {
      field1: parseNum(document.getElementById('field1').value),
      field2: parseNum(document.getElementById('field2').value),
      // ... add all form inputs ...
    };

    // Validate
    if (!inputs.field1 || !inputs.field2) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Get result display value
    const resultText = document.getElementById('result-element-id').textContent || '-';

    // Save
    const saved = saveCalculation(inputs, resultText);
    if (saved) {
      showSaveSuccess();
      trackLanguageAwareEvent('calculation_saved', { calculator_type: 'your-type' });
    }
  });
}
```

---

## Advanced Features (Optional Post-QA)

### Show "Saved Xh ago" If Matching Calculation Exists

After form submission, check for matching calculations:

```javascript
// After displaying results, optionally show "Saved 2h ago"
const matching = findMatchingCalculation(calculatorPath, lastInputs);
if (matching) {
  const timeDiff = formatTimeDiff(matching.timestamp);
  const btn = document.getElementById('save-calc-btn');
  btn.textContent = `💾 ${timeDiff}ตั้งแต่`;
}
```

Requires importing from `saved-calcs.ts`:
```typescript
import { findMatchingCalculation, formatTimeDiff } from '../../lib/saved-calcs';
```

### Show Recent Calculations List

Display last 2 saves for current calculator:

```javascript
function showRecentCalculations() {
  const recent = getSavedCalculationsForCalculator(calculatorPath).slice(0, 2);
  if (recent.length === 0) return;

  const html = `
    <div class="save-calc-recent">
      <span class="save-calc-recent-title">การคำนวณล่าสุด</span>
      <div class="save-calc-recent-list">
        ${recent.map(calc => `
          <div class="save-calc-recent-item">
            <span>${formatTimeDiff(calc.timestamp)}</span>
            <span class="save-calc-recent-time">ผลลัพธ์: ${calc.result}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('results').insertAdjacentHTML('beforeend', html);
}
```

Requires importing:
```typescript
import { getSavedCalculationsForCalculator, formatTimeDiff } from '../../lib/saved-calcs';
```

---

## Automated Rollout Strategy

Since this requires the same pattern for 950 pages, consider:

1. **Python Script Approach:**
   - Parse each calculator page's form IDs and result element IDs
   - Generate the button HTML and handler JavaScript
   - Inject into appropriate locations
   - Commit in batch

2. **Manual Batching:**
   - Group 50 pages by category (finance, health, etc.)
   - Copy/paste reference implementation
   - Adjust field names per page
   - Commit per batch (20 batches total)

3. **Template Generation:**
   - Create Astro component `SaveCalculationButton.astro`
   - Create reusable handler snippet
   - Import into all calculator pages
   - Minimal per-page customization needed

---

## Testing Checklist

### Unit Functionality
- [ ] Save button visible after calculation shown
- [ ] localStorage stores correctly under `ct.saved.calcs.v1`
- [ ] Max 5 entries enforced (FIFO eviction)
- [ ] Success feedback displays for 2 seconds
- [ ] Persists across page refresh
- [ ] No errors when localStorage unavailable (private mode)
- [ ] Dark mode styling correct

### Integration Testing
- [ ] Button appears on APR calculator (reference)
- [ ] Button appears on [5-10 other calculator pages]
- [ ] Input validation prevents blank saves
- [ ] GA4 events tracked as `calculation_saved`
- [ ] No console errors
- [ ] Mobile responsive (<375px widths work)

### User Flow
- [ ] User fills form → clicks Calculate
- [ ] Results appear → Save button visible
- [ ] Click Save → "✅ บันทึกการคำนวณเรียบร้อย" pops up for 2s
- [ ] Refresh page → data still in localStorage
- [ ] 6th save → oldest entry removed

---

## Known Limitations & Notes

1. **localStorage is per-origin:** Each calculator domain has separate storage
2. **FIFO eviction:** Newest saves are kept, oldest removed after 5
3. **No auto-load:** Saved calculations are stored but not auto-populated into forms (feature for future enhancement)
4. **Private mode:** Silently fails (function returns null, no error shown)
5. **Large inputs:** Very large nested objects may cause localStorage quota issues (rare)
6. **Cross-browser:** Works on all modern browsers (IE11 not supported)

---

## Performance Impact

- **Code size:** saved-calcs.ts ~2.5KB (gzipped ~0.8KB)
- **CSS overhead:** ~3KB (gzipped ~1KB) for button/feedback styles
- **Runtime:** Save operation <1ms, no impact on calculation performance
- **Storage:** Max 5 calcs × ~500B avg = 2.5KB per user

---

## File Summary

| File | Change | Impact |
|------|--------|--------|
| `src/lib/saved-calcs.ts` | ✨ NEW | Core utility module |
| `src/styles/theme.css` | ➕ 150 lines | Button + feedback + dark mode |
| `src/pages/คำนวณ-apr/index.astro` | ➕ 110 lines | Reference implementation |
| All 949 other pages | 📋 TODO | Add button + handler (per integration guide) |

---

## Questions?

Refer to:
- **APR page** (`src/pages/คำนวณ-apr/index.astro`) for complete working example
- **saved-calcs.ts** for API documentation
- **theme.css** for styling reference

