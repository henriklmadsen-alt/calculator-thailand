# CAL-977 UX Spec: Saved Calculations Drawer

**Issue:** CAL-977  
**Title:** Design: Saved Calculations Drawer — persistent history panel  
**Status:** Design Ready for CTO Implementation  
**Priority:** High (unlocks Phase 2 retention feature #3)  
**Linked to:** CAL-962 (Save Button implementation)

---

## 1. Business Reason

**Objective:** Unlock Phase 2 user retention feature—enable users to easily view, compare, and restore their saved calculation history.

**User Need:** After saving a calculation, users need a low-friction way to:
- See all saved calculations (max 5, FIFO)
- Quickly restore a previous calculation without re-entering inputs
- Compare results side-by-side across saved calculations
- Delete or clear saved history
- Navigate between calculator pages while maintaining history visibility

**Expected Outcome:** Reduce calculator abandonment rate and increase repeat visits by making previous work instantly accessible.

---

## 2. Design Principles

### Mobile-First (Default Environment)
- Bottom sheet: gesture-driven, thumb-reachable, dismissible via swipe-down
- Full-width layout on screens <600px
- Clear tap targets (min 44px height)
- Scrollable content area with sticky header/footer
- Fast open/close animations (200ms)

### Desktop Enhancement
- Right-side drawer: persistent option, doesn't interrupt layout
- Takes 30-35% of viewport width (max 400px)
- Smooth slide-in/slide-out (300ms)
- Optional: toggle pinning for persistent access

### Trust & Clarity
- Each saved calculation shows: calculator name, result, time saved, restore button
- Empty state is clear and actionable
- Restore is one-tap; delete requires confirmation (for mobile)
- Timestamp uses Thai relative time ("1 ชั่วโมงที่แล้ว", etc.)

### Consistency
- Matches existing calculator page aesthetic (theme.css colors, spacing)
- Uses same success/feedback patterns as Save Button (CAL-962)
- Accessible keyboard navigation (Tab, Enter, Escape)
- Dark mode support built-in

---

## 3. Target Pages & Templates

**Applies to:** All 950 calculator pages (KLC-0001 and beyond)

**Integration points:**
- Calculator result section (below sticky result card)
- Keyboard-accessible entry point (maybe floating button on mobile)
- Optional: accessible from main navigation

---

## 4. Component Specifications

### 4.1 Mobile Layout: Bottom Sheet (Primary)

#### Trigger
- **Trigger element:** Floating action button (FAB) OR button in result section header  
- **Icon:** 📋 (clipboard) or 💾 (history/drawer icon)
- **Label:** "ประวัติการคำนวณ" (Calculation History)
- **Position:** Bottom-right corner, 16px margin (mobile), above any sticky elements

#### Sheet Structure
```
╔════════════════════════╗
║  (handle bar: gray)    │ ← 8px gray bar, tap/swipe to open/close
╠════════════════════════╣
║ ประวัติการคำนวณ   ✕   │ ← Header: title + close (X) button
╠════════════════════════╣
║ ┌────────────────────┐ │
║ │ คำนวณ APR          │ ← Calculator name (bold, left-aligned)
║ │ ผล: 6.50%          │ ← Result (green/yellow/red per CAL-974 color scheme)
║ │ บันทึก: 1h ago     │ ← Timestamp (gray text, Thai relative time)
║ │ [Restore] [✕]      │ ← Action buttons (restore=primary, delete=secondary)
║ └────────────────────┘ │
║                        │
║ ┌────────────────────┐ │
║ │ [second item...]   │
║ └────────────────────┘ │
║                        │
║ ┌────────────────────┐ │
║ │ [Clear All]        │ ← Footer: "Clear history" button (optional)
║ └────────────────────┘ │
╚════════════════════════╝
```

**Dimensions:**
- Height: 50vh (half-screen) on first open; expands to 90vh if scrollable content
- Width: 100% (full width on mobile)
- Padding: 16px all sides
- Rounded top corners (24px border-radius)
- Backdrop: semi-transparent dark (rgba(0,0,0,0.4))

**Behavior:**
- Swipe down = dismiss (100px threshold)
- Tap outside (backdrop) = dismiss
- Tap X button = dismiss
- Esc key = dismiss
- Opens from bottom with 300ms easeOutCubic animation
- Handles safe area (notches) on newer phones

---

### 4.2 Desktop Layout: Right-Side Drawer (Secondary)

#### Trigger
- **Trigger element:** Link in result section header OR persistent sidebar toggle
- **Label:** "View History" or "Show Saved"
- **Icon:** 📋 or 🔍

#### Drawer Structure
```
┌─────────────────────────────────────────────────┐
│ Main Calculator        │ Saved Calculations    │
│                        │                       │
│ [inputs]              │ ประวัติการคำนวณ   ✕  │ ← Header
│                       │                       │
│ ┌──────────────┐      │ ┌─────────────────┐  │
│ │ [Calculate]  │      │ │ คำนวณ APR       │  │
│ └──────────────┘      │ │ ผล: 6.50%       │  │
│                       │ │ 1h ago          │  │
│ ┌──────────────────┐  │ │ [Restore][✕]    │  │
│ │ ✅ Results:      │  │ └─────────────────┘  │
│ │ 6.50% APR        │  │                       │
│ │ 💾 [Save]        │  │ ┌─────────────────┐  │
│ └──────────────────┘  │ │ [second item]   │  │
│                       │ │ [Restore][✕]    │  │
│                       │ └─────────────────┘  │
│                       │                       │
│                       │ ┌─────────────────┐  │
│                       │ │ [Clear All]     │  │
│                       │ └─────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Dimensions:**
- Width: 30-35% of viewport (300-400px max)
- Height: Full viewport height (minus top bar)
- Padding: 16px all sides
- Fixed position: right: 0, top: 0
- Scrollable content area

**Behavior:**
- Slides in from right (300ms easeOutCubic)
- Closes on swipe-right (gesture-enabled)
- Optional: pin icon to keep drawer permanently visible
- Closes via X button or Esc key
- No backdrop (desktop convention)

---

### 4.3 Data Structure (from CAL-962)

Each saved calculation shows:
```typescript
{
  id: "calc_1713797000000_abc123def",
  calculatorName: "คำนวณ APR",
  calculatorPath: "/คำนวณ-apr/",
  inputs: { principal: 500000, monthlyPayment: 11000, ... },
  result: "6.50%",
  timestamp: 1713797000000
}
```

Display mapping:
- **Name:** `calculatorName` (bold, 14-16px)
- **Result:** `result` (formatted with color per CAL-974 scheme, 18px, bold)
- **Time:** `formatTimeDiff(timestamp)` from saved-calcs.ts (gray, 13px)
- **Path:** `calculatorPath` (for navigation on restore)

---

### 4.4 Empty State

When no saved calculations exist:

```
╔════════════════════════════════╗
║ ประวัติการคำนวณ          ✕   │
╠════════════════════════════════╣
║                                │
║         (📋 icon)              │
║                                │
║   ไม่มีการคำนวณที่บันทึก    │
║   (No saved calculations)      │
║                                │
║   บันทึกการคำนวณเพื่อดู      │
║   ประวัติของคุณที่นี่         │
║   (Save calculations to see    │
║    your history here)          │
║                                │
║   [Close] or [← กลับ]         │
║                                │
╚════════════════════════════════╝
```

**Empty State Text (Thai):**
- Heading: "ไม่มีการคำนวณที่บันทึก"
- Subtext: "บันทึกการคำนวณของคุณเพื่อดูประวัติที่นี่"
- Icon: 📋 (48px, gray #999)
- Button: Close drawer or "กลับไป" (Back)

---

### 4.5 States & Transitions

| State | Trigger | Appearance | CTA |
|-------|---------|-----------|-----|
| **Closed** | Initial / Dismiss | FAB visible | Tap FAB to open |
| **Opening** | Tap FAB | Drawer slides in, backdrop fades | - |
| **Open (Empty)** | No saved calcs | Empty state message | Close drawer |
| **Open (Items)** | ≥1 saved calc | List of items + actions | Restore / Delete / Close |
| **Deleting** | Tap delete button | Item scales out 150ms | Confirm? (optional on mobile) |
| **Restoring** | Tap restore button | Navigate + close drawer | Show restored inputs in form |
| **Closing** | Tap X / Esc / Swipe | Drawer slides out | Closed state |

---

## 5. Interaction Flows

### 5.1 View Saved Calculations (Mobile)

```
User calculates
    ↓
User taps [Save] button (CAL-962)
    ↓
✅ Toast: "บันทึกการคำนวณเรียบร้อย"
    ↓
User taps 📋 FAB (bottom-right)
    ↓
Bottom sheet opens (slide-up, 300ms)
    ↓
Shows list of 5 most recent saved calcs
    ↓
User can:
  - Tap [Restore] → populate form + close sheet
  - Tap [✕] → delete (no confirm on mobile) + update list
  - Swipe down → close sheet
  - Tap outside → close sheet
```

### 5.2 Restore a Calculation (Mobile)

```
Drawer open, user sees saved calc
    ↓
User taps [Restore]
    ↓
Form fields populate with saved inputs
    ↓
Drawer auto-closes (200ms fade-out)
    ↓
Calculator result shows
    ↓
User sees toast: "✅ โหลดการคำนวณที่บันทึกเรียบร้อย"
```

### 5.3 Clear All (Optional)

```
Drawer open
    ↓
User taps "Clear All" at footer
    ↓
Confirmation dialog (mobile) or inline confirmation (desktop)
  "ลบประวัติการคำนวณทั้งหมด?" (Delete all history?)
  [Cancel] [Delete]
    ↓
On confirm: all items removed + empty state shown
    ↓
Toast: "✅ ลบประวัติเรียบร้อย"
```

---

## 6. Mobile Design Details

### 6.1 Touch Targets
- **Restore button:** 44px height × 90px width (min)
- **Delete button:** 44px height × 40px width
- **Item card:** 64px min height (clickable)
- **Close (X):** 44px × 44px

### 6.2 Gestures
- **Swipe down (>100px):** Dismiss
- **Swipe right:** Dismiss (optional)
- **Tap outside:** Dismiss
- **Long-press item:** Optional context menu (Delete / Copy result)

### 6.3 Safe Area
- Drawer respects viewport notches (top + bottom safe areas)
- FAB positioned above home indicator on iOS

### 6.4 Scrolling
- Content area scrollable if >5 items displayed
- Sticky header (title + close button)
- Sticky footer (Clear All button, if present)

---

## 7. Desktop Design Details

### 7.1 Dimensions & Positioning
- **Width:** 35% of viewport (300-400px max, min 280px)
- **Height:** 100vh - top-nav height
- **Position:** `position: fixed; right: 0; top: 0`
- **Scroll:** Internal scrolling if content exceeds height

### 7.2 Keyboard Navigation
- **Tab:** Cycle through [Restore], [Delete], [Close], [Clear All]
- **Enter:** Activate focused button
- **Escape:** Close drawer
- **Arrow Down/Up:** Focus next/previous item (optional)

### 7.3 Visual Indicators
- **Focus state:** Blue outline (2px, #3b82f6)
- **Hover state:** Item background 0.05 opacity black
- **Active state:** Item border-left 4px green (on restore)

---

## 8. Accessibility

### 8.1 ARIA Labels & Attributes
```html
<div role="dialog" aria-label="Saved calculations" aria-modal="true">
  <button aria-label="Close saved calculations drawer">✕</button>
  <button aria-label="Restore this calculation">Restore</button>
  <button aria-label="Delete this calculation">✕</button>
  <div role="status" aria-live="polite">
    <!-- Empty state or item count -->
  </div>
</div>
```

### 8.2 Color Contrast
- Text on white: #333 (4.5:1 WCAG AA)
- Buttons: Green (#10b981) on white (4.3:1 WCAG AA)
- Result color scheme: Per CAL-974 spec (all ≥4.5:1)
- Timestamp: #666 on white (7:1 WCAG AAA)

### 8.3 Focus Management
- Focus trap while drawer open (Tab cycles within drawer only)
- Restore focus to FAB when drawer closes
- Announce changes via `aria-live="polite"` (item deleted, saved, etc.)

### 8.4 Keyboard-Only Users
- All interactions available via keyboard
- No mouse-only features
- Esc key must close drawer
- Tab order: Header → Items → Footer → Close button

---

## 9. Dark Mode Support

Apply to `.saved-calcs-drawer`:
```css
html[data-theme='dark'] .saved-calcs-drawer {
  background-color: #1f2937;
  color: #f3f4f6;
  border: 1px solid #374151;
}

html[data-theme='dark'] .saved-calcs-item {
  background-color: #374151;
  border: 1px solid #4b5563;
}

html[data-theme='dark'] .saved-calcs-item:hover {
  background-color: #4b5563;
}
```

---

## 10. Result Color Scheme Integration

Use color coding from [CAL-974 Result Card Colors](./CAL-974_RESULT_CARD_COLORS.md):

- **Green (✅ Safe/Good):** `#10b981` for passing results
- **Yellow (⚠️ Warning):** `#f59e0b` for borderline results
- **Red (❌ Alert):** `#ef4444` for risky/high results
- **Blue (ℹ️ Info):** `#3b82f6` for informational results

**Example:**
```html
<div class="saved-calcs-result saved-calcs-result--success">
  ผล: 6.50% ✅
</div>
```

---

## 11. Implementation Notes for CTO

### 11.1 Component Structure
Create `SavedCalculationsDrawer.astro` (Astro component) with:

1. **Props:**
   - `calculatorPath` (string): current calculator page path
   - `isOpen` (boolean): drawer visibility state
   - `onClose` (function): callback to close drawer

2. **Internal state:**
   - `savedCalcs` (array): fetched from localStorage via `getSavedCalculations()`
   - `isMobile` (boolean): computed from window width or media query

3. **Methods:**
   - `handleRestore(id)`: populate form + close drawer + GA4 event
   - `handleDelete(id)`: remove calc + update list
   - `handleClearAll()`: show confirmation + clear + update list
   - `handleClose()`: animation + state update

### 11.2 Integration Steps

1. **Create component file:**
   ```
   src/components/SavedCalculationsDrawer.astro
   ```

2. **Import saved-calcs utilities:**
   ```typescript
   import { 
     getSavedCalculations, 
     removeSavedCalculation,
     clearAllSavedCalculations,
     formatTimeDiff 
   } from '../lib/saved-calcs';
   ```

3. **Add to all calculator pages:**
   ```astro
   ---
   import SavedCalculationsDrawer from '../components/SavedCalculationsDrawer.astro';
   const calculatorPath = Astro.url.pathname;
   ---
   
   <SavedCalculationsDrawer calculatorPath={calculatorPath} />
   ```

4. **Add CSS** (new file or extend theme.css):
   ```
   src/styles/saved-calcs-drawer.css
   ```
   Include animations, responsive breakpoints, dark mode

5. **GA4 Events** (use CAL-1049 event types):
   - `calculation_restored` (when user taps Restore)
   - `calculation_deleted` (when user taps Delete)
   - `calculation_history_cleared` (when Clear All confirmed)

### 11.3 Mobile-First CSS Breakpoints

```css
/* Mobile (default) */
.saved-calcs-drawer {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-height: 90vh;
  border-radius: 24px 24px 0 0;
}

/* Tablet & Desktop (≥768px) */
@media (min-width: 768px) {
  .saved-calcs-drawer {
    bottom: auto;
    top: 0;
    right: 0;
    width: 35%;
    max-width: 400px;
    height: 100vh;
    border-radius: 0;
  }
}
```

### 11.4 Animation Specs

**Mobile (bottom sheet):**
- Open: `transform: translateY(0)` from `translateY(100%)`, 300ms easeOutCubic
- Close: reverse, 200ms easeInCubic

**Desktop (right drawer):**
- Open: `transform: translateX(0)` from `translateX(100%)`, 300ms easeOutCubic
- Close: reverse, 200ms easeInCubic

**Items (delete/add):**
- Fade out: 150ms fade
- Scale in (new): 200ms scale from 0.9 to 1

### 11.5 localStorage Interaction

```typescript
// Get saved calcs (from saved-calcs.ts)
const calcs = getSavedCalculations(); // All 5 max

// Filter for current calculator (optional, for "recent on this page")
const thisPageCalcs = getSavedCalculationsForCalculator(calculatorPath);

// Restore: populate inputs
const calc = calcs.find(c => c.id === id);
if (calc) {
  Object.entries(calc.inputs).forEach(([key, value]) => {
    const input = document.getElementById(key);
    if (input) input.value = value;
  });
  triggerCalculation(); // Run calculator with restored inputs
}

// Delete
removeSavedCalculation(id);

// Clear all
clearAllSavedCalculations();
```

### 11.6 Performance Considerations

- **Initial load:** Lazy-load drawer content until user opens (not on page init)
- **localStorage reads:** Cached in component state; don't call on every render
- **Animation:** Use CSS transforms (GPU-accelerated), not position/left/right
- **Bundle size:** Component ~3KB, CSS ~2KB (gzipped)

---

## 12. Verification Checklist for Release QA

### 12.1 Mobile Testing (<600px width)

- [ ] FAB (📋) appears bottom-right, above keyboard
- [ ] Tapping FAB opens bottom sheet with slide-up animation
- [ ] Empty state shows when no saved calcs
- [ ] Saved items display: name, result (colored), time, [Restore][✕] buttons
- [ ] Swiping down closes drawer
- [ ] Tapping backdrop closes drawer
- [ ] Tapping X button closes drawer
- [ ] Pressing Esc key closes drawer
- [ ] Restore button populates form fields correctly
- [ ] Restore button closes drawer and shows success toast
- [ ] Delete button removes item from list (no confirm on mobile)
- [ ] Delete button updates count/empty state
- [ ] Tap targets ≥44px (all buttons)
- [ ] Dark mode renders correctly
- [ ] Safe area respected (notches, home indicator)
- [ ] No horizontal scrolling at any width ≥320px
- [ ] Scrollbar appears if >5 items (5+ items won't fit)

### 12.2 Desktop Testing (≥768px)

- [ ] Trigger button/link visible in result header
- [ ] Tapping trigger opens right drawer with slide-in animation
- [ ] Drawer width 30-35% of viewport (≤400px max)
- [ ] Drawer doesn't overlap calculator inputs
- [ ] All mobile functionality works (restore, delete, scroll, close)
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Esc) works
- [ ] Focus outline visible on all interactive elements
- [ ] Pin icon (optional) toggles persistent state
- [ ] Clicking X button closes drawer
- [ ] Pressing Esc key closes drawer

### 12.3 Data Integrity

- [ ] Saving new calculation adds to drawer list (no page refresh needed)
- [ ] FIFO eviction works: 6th save removes oldest
- [ ] Page refresh: saved calcs persist
- [ ] Private/incognito mode: graceful fallback (no error)
- [ ] Data survives browser restart
- [ ] Delete removes item from localStorage
- [ ] Clear All removes all items from localStorage

### 12.4 Accessibility

- [ ] ARIA labels present (`dialog`, `modal`, button labels)
- [ ] Color contrast ≥4.5:1 (all text/buttons)
- [ ] Keyboard-only navigation works (no mouse required)
- [ ] Tab order logical (header → items → footer → close)
- [ ] Focus trap active while drawer open
- [ ] Screen reader announces: drawer title, item count, empty state
- [ ] Screen reader announces changes: "item deleted", "history cleared"

### 12.5 Visual/UX

- [ ] Result color scheme applied (green/yellow/red/blue per CAL-974)
- [ ] Time format correct Thai relative time ("1ชั่วโมงที่แล้ว")
- [ ] Typography: calculator name bold, result larger/bolder
- [ ] Spacing consistent (16px padding, 8px gaps)
- [ ] Animations smooth (no jank, 60fps)
- [ ] Dark mode text contrast sufficient
- [ ] Empty state icon visible, message clear
- [ ] No layout shift when drawer opens/closes
- [ ] Drawer doesn't flash or flicker on page load

### 12.6 GA4 Events

- [ ] `calculation_restored` fires when restore tapped (with calculator path)
- [ ] `calculation_deleted` fires when delete tapped
- [ ] `calculation_history_cleared` fires on Clear All confirm
- [ ] All events include `language` context (from CAL-1049)

### 12.7 Edge Cases

- [ ] Very long calculator names truncate + ellipsis (no overflow)
- [ ] Very long results (e.g., "123,456,789.12 บาท") fit in card
- [ ] 1 saved calc → 5 saved calcs → back to empty (all work)
- [ ] Drawer opening during form input (inputs stay intact)
- [ ] Restoring calc from different calculator page (navigation works)
- [ ] localStorage full/quota exceeded: graceful fallback

---

## 13. Success Metrics (Post-Launch)

Track via GA4 (CAL-1049 events):

- **Engagement:** % of users who open history drawer after save
- **Completion:** % of restore clicks → calculation result shown
- **Retention:** repeat visitor increase in 2-week cohort
- **Device split:** mobile vs desktop usage patterns
- **Empty state:** % of users hitting empty state vs seeing items

Target:
- ≥40% of users who save also restore ≥1 calc within 30 days
- 25%+ increase in repeat visits (week-over-week)
- <2% error rate on restore/delete operations

---

## 14. Files to Create/Modify

| File | Type | Notes |
|------|------|-------|
| `src/components/SavedCalculationsDrawer.astro` | ✨ NEW | Main component |
| `src/styles/saved-calcs-drawer.css` | ✨ NEW | Styles, animations, responsive |
| `src/pages/*/index.astro` | 📝 MODIFY | Add drawer import (all 950 pages) |
| `src/lib/saved-calcs.ts` | ✓ READY | Already built (CAL-962) |

---

## 15. Design Decision Log

| Decision | Rationale |
|----------|-----------|
| **Bottom sheet on mobile** | Thumb-reachable, gesture-native, reduces layout shift |
| **Right drawer on desktop** | Preserves calculator layout, follows modern web patterns |
| **5 items max (FIFO)** | Matches CAL-962 localStorage limit, fast list, clear history |
| **No restore confirmation** | User can re-run calculator, low cost to undo |
| **Delete ≠ undo** | Prevents accidental loss; deletion is final |
| **Relative time format** | Improves scannability ("1h ago" vs "2026-04-23 14:32") |
| **Color per result type** | Reuses CAL-974 scheme, improves glanceability |
| **Keyboard Esc to close** | Standard web convention, accessible |
| **Auto-close on restore** | Reduces clicks, improves flow (calculate → save → restore) |

---

## 16. Questions & Clarifications Needed

Before CTO implementation, clarify:

1. **Trigger placement:** FAB, header button, both, or navigation sidebar?
2. **Clear All:** Include this feature or remove for MVP?
3. **Restore behavior:** Auto-calculate or just populate form?
4. **Pin drawer:** Optional persistent state on desktop?
5. **Confirmation dialogs:** Desktop only (for Clear All) or mobile too?
6. **Search/filter:** Future phase or out of scope?

---

## 17. Next Steps

1. **CTO review** → implementation readiness check
2. **Create component** → SavedCalculationsDrawer.astro + CSS
3. **Reference implementation** → APR calculator page (like CAL-962)
4. **Rollout** → 50-page batches across calculator categories
5. **QA verification** → Checklist section 12
6. **GA4 tracking** → Validate CAL-1049 events fire correctly
7. **User feedback** → Monitor metrics section 13

---

## Appendix: CSS Skeleton

```css
/* Mobile: Bottom sheet (default) */
.saved-calcs-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 90vh;
  background: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  animation: slideUp 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.saved-calcs-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.saved-calcs-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.saved-calcs-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.saved-calcs-item-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.saved-calcs-item-result {
  font-size: 18px;
  font-weight: 700;
  /* color varies: green/yellow/red/blue */
}

.saved-calcs-item-time {
  font-size: 13px;
  color: #6b7280;
}

.saved-calcs-actions {
  display: flex;
  gap: 8px;
}

.saved-calcs-btn-restore {
  flex: 1;
  padding: 8px 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.saved-calcs-btn-delete {
  width: 40px;
  padding: 8px;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
}

.saved-calcs-empty {
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
}

.saved-calcs-empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* Desktop: Right drawer (≥768px) */
@media (min-width: 768px) {
  .saved-calcs-drawer {
    position: fixed;
    top: 0;
    right: 0;
    left: auto;
    bottom: auto;
    width: 35%;
    max-width: 400px;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    box-shadow: -4px 0 16px rgba(0,0,0,0.1);
    animation: slideInRight 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

/* Dark mode */
html[data-theme='dark'] .saved-calcs-drawer {
  background: #1f2937;
  color: #f3f4f6;
}

html[data-theme='dark'] .saved-calcs-item {
  background: #374151;
  border-color: #4b5563;
}

html[data-theme='dark'] .saved-calcs-item-name,
html[data-theme='dark'] .saved-calcs-item-result {
  color: #f3f4f6;
}

html[data-theme='dark'] .saved-calcs-item-time {
  color: #9ca3af;
}

/* Animations */
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 0; }
}

@keyframes slideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}
```

---

## Document Info

**Created:** 2026-04-23  
**Version:** 1.0  
**Status:** Ready for CTO Implementation  
**Owner:** UXDesigner (CAL-977)  
**Reviewers Needed:** CTO (feasibility), Release QA (testing plan)
