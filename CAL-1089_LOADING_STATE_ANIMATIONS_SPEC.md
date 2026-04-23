# CAL-1089: Loading State Animations Specification

**UX Phase 1: Skeleton Screens & Spinners**

## Business Reason

Users on mobile networks (4G, 3G) experience delayed page load, calculation execution, and feature rendering. Without clear loading states:
- **Perceived Performance Suffers**: Users see blank screens or delayed results and may assume the page is frozen or broken
- **Trust Decreases**: Unclear state leaves users uncertain whether their action worked
- **Mobile Experience Degrades**: Mobile users (80%+ of traffic) bounce on perceived slowness

**Loading state animations fix this by**:
- Signaling that work is happening (skeleton screens)
- Maintaining user engagement during waits (animated spinners)
- Reducing cognitive load (clear visual feedback)
- **Expected Impact**: +5-10% calculator completion rate on mobile (Phase A calculators); reduced bounce rate

---

## User Problem

### Current State (Before)
- User taps a calculator input
- Short delay while result calculates (100–500ms on slow networks)
- **No visual feedback**: user sees static page, uncertain if action registered
- User may re-tap, re-enter data, or close the page

### After Loading States
- User taps calculator input
- **Immediate visual feedback**: spinner shows near result area
- User waits confidently (clear state: "we're calculating")
- Result appears, spinner fades
- **User stays engaged, calculation completes**

---

## Scope: Target Pages & Templates (Phase 1)

### Phase 1 Priority Pages
1. **Calculator Pages** (950+ pages)
   - Input entry (skeleton for result card placeholder)
   - Calculation execution (spinner in result zone)
   - Result loading (skeleton before actual data)

2. **Homepage**
   - Category grid loading (skeleton cards)
   - Search results loading (skeleton calculator cards)
   - Favorite calculators (skeleton until localStorage loads)

3. **Key Widgets**
   - Related Calculators widget (skeleton cards)
   - Recent Calculations drawer (skeleton until data loads)
   - Category Navigation (skeleton if API-backed)

4. **Features with Async Behavior**
   - Save button feedback (spinner during save)
   - Share card generation (spinner while rendering OG image)
   - History restoration (skeleton while loading from localStorage)

---

## UX Specification

### 1. Skeleton Screens

**Purpose**: Placeholder while content is loading (content-aware loading indicator)

#### Result Card Skeleton
- **Mobile (375px width)**
  - Height: 280px
  - Background: `#f3f4f6` (light gray)
  - Shimmer animation: left-to-right sweep every 1.5s
  - Content placeholders:
    - Result title bar: 180px wide × 20px tall, `#e5e7eb` (gray)
    - Result number bar: 200px wide × 36px tall, `#e5e7eb` (gray, represents large number)
    - Subtitle bar: 160px wide × 14px tall, `#e5e7eb`
    - Action bar: 120px wide × 40px tall, `#d1d5db` (button placeholder)
  - Border radius: 12px
  - Padding: 16px

- **Desktop (1024px+)**
  - Height: 320px
  - Same structure, larger proportions
  - Padding: 20px
  - Result number: 48px tall (represents larger screen)

#### Calculator Card Skeleton (Homepage/Categories)
- **Mobile**
  - Height: 140px
  - Title skeleton: 80% width × 18px tall
  - Description skeleton: 90% width × 12px tall (2 lines)
  - Button skeleton: full width × 40px tall
  - Spacing: 12px between rows

- **Desktop**
  - Height: 160px
  - Proportionally larger

#### Spinner (Loading Indicator)

**When to use spinners**:
- During calculation (result card area)
- During save/export operations
- During history restoration
- During search filtering

**Design**:
- **Visual**: Animated circular spinner (Tailwind motion)
- **Colors**:
  - Light mode: `#3b82f6` (primary blue)
  - Dark mode: `#60a5fa` (bright blue)
- **Size**:
  - Mobile: 32px diameter
  - Desktop: 40px diameter
- **Position**: Centered in content area (e.g., middle of result card)
- **Animation**: 
  - 1.2s rotation cycle (smooth, not frantic)
  - Easing: linear
  - Continuous (runs until content appears)
- **Duration**: Remove spinner when content fully rendered (< 100ms delay after content ready)

---

### 2. Shimmer Animation

**Purpose**: Visual cue that content is loading (not static)

**CSS Implementation**:
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite;
}
```

**Mobile Consideration**: Reduced animation on `prefers-reduced-motion` (accessibility)

---

### 3. Loading State Zones (By Page Context)

#### Calculator Pages

**Zone 1: Input Section** (no loading state needed)
- User can always interact with inputs
- Inputs remain visible and responsive

**Zone 2: Result Card** (PRIMARY loading state)
- **Trigger**: User presses calculate button OR value changes (auto-calc)
- **Display**: Skeleton result card (280px height, shimmer)
- **Duration**: 100–500ms (depending on network/calculation time)
- **Transition**: Skeleton fades out (200ms), result fades in

**Zone 3: Related/Suggested Content** (SECONDARY loading state)
- Related calculators load asynchronously
- Skeleton cards (4 per row on desktop, stacked on mobile)
- Only show if > 500ms delay

#### Homepage

**Zone 1: Hero Section** (no loading state)
- Already loaded server-side

**Zone 2: Category Grid** (conditional loading state)
- If categories load via JavaScript (dynamically filtered):
  - Show skeleton grid (6-8 skeleton cards)
  - Each skeleton: 140px tall on mobile
- If server-rendered: no loading state needed

**Zone 3: Search Results** (PRIMARY loading state)
- User types in search box
- Results auto-filter (debounced 300ms)
- **After 300ms delay**: Show skeleton results
- Replace with actual filtered list when ready

---

### 4. Mobile-Specific Considerations

#### Thumb-Friendly Layout
- Result card skeleton minimum height: 240px (easy to see)
- Spinner centered and large enough (32px+) to be visible without close inspection
- No loading state should hide or obscure input fields (user might need to scroll)

#### Scroll Position Preservation
- When result card updates from skeleton to actual result:
  - Keep scroll position stable (no jump)
  - Use CSS `scroll-behavior: smooth` if result expands

#### Network-Aware Timing
- Mobile networks (3G/4G) may add 500–2000ms delay
- Skeleton display duration should feel natural (not too brief, not too long)
- If > 2s with no result: Show error state (not infinite skeleton)

#### Dark Mode
- Skeleton background: `#1f2937` (dark gray)
- Shimmer sweep: `#374151` to `#1f2937`
- Spinner: `#60a5fa` (bright blue, maintains contrast)

---

### 5. Desktop Considerations

#### Visual Balance
- Skeleton cards should match final card dimensions exactly (prevent layout shift)
- Spinner centered in card (not top-aligned or bottom-aligned)

#### Hover States
- Skeleton cards do NOT show hover states (no cursor: pointer)
- Once loaded, real cards show hover effect (subtle 2% scale)

#### Multiple Loading States
- If multiple widgets loading simultaneously (homepage):
  - Each zone has independent skeleton
  - Users see partial content load (not blank page)
  - Stagger timing slightly (30–50ms) to reduce visual jank

---

### 6. Accessibility & Contrast (WCAG AA)

#### Color Contrast
- **Skeleton background** (`#f3f4f6`) + **shimmer sweep** (`#e5e7eb`): ≥ 3:1 contrast (passes AA for graphics)
- **Dark mode**: `#1f2937` + `#374151`: ≥ 3:1 contrast
- **Spinner color** (`#3b82f6` / `#60a5fa`): ≥ 4.5:1 contrast on white/dark backgrounds

#### Motion & Vestibular Safety
- Respect `prefers-reduced-motion` CSS media query
  - When active: Stop shimmer animation, use static background instead
  - Spinner: Can continue rotating (motion, not flashing/pulsing)
  - Rationale: Users who request reduced motion typically tolerate smooth rotation, not strobing

```css
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: #e5e7eb; /* Static, no shimmer */
  }
  .spinner {
    animation: spin 2s linear infinite; /* Slower, smoother rotation */
  }
}
```

#### Screen Reader Announcements
- Skeletons should have `aria-label="Loading result..."` (brief, not repetitive)
- Spinners use `role="status" aria-live="polite"` with text: "Calculating result..."
- When content loads: Announce actual result (e.g., "Result: ฿50,000")
- **Avoid**: Announcing every animation frame; respect `aria-busy="true"` / `aria-busy="false"`

#### Focus Indicators
- If skeleton is interactive (rare): Include visible focus ring (4px solid `#3b82f6`)
- Spinners: Not interactive (no focus needed)

---

### 7. Implementation Notes for CTO

#### File Structure

**New Files to Create**:
1. `/app/src/components/LoadingSkeletons/ResultCardSkeleton.astro`
2. `/app/src/components/LoadingSkeletons/CalculatorCardSkeleton.astro`
3. `/app/src/components/LoadingStates/Spinner.astro`
4. `/app/src/styles/loading-states.css` (shimmer + spinner animations)

#### Component APIs

**ResultCardSkeleton.astro**
```astro
---
interface Props {
  height?: string; // "280px" (mobile) | "320px" (desktop), default: 280px
  variant?: "result" | "input" | "minimal"; // default: "result"
}
---
<div class="result-skeleton" style={`height: ${height}`}>
  <!-- Skeleton content -->
</div>
```

**Spinner.astro**
```astro
---
interface Props {
  size?: "sm" | "md" | "lg"; // 24px, 32px, 40px
  label?: string; // aria-label text
  color?: "primary" | "gray"; // color variant
}
---
<div class="spinner" aria-label={label} role="status">
  <!-- SVG or CSS spinner -->
</div>
```

#### Styling Approach
- Use Tailwind classes for base styling (`h-72`, `bg-gray-100`, `rounded-lg`)
- Use CSS animations (`@keyframes shimmer`) in `loading-states.css` for smooth shimmer
- Respect dark mode with `dark:` Tailwind utilities
- Use CSS custom properties (`:root --loading-duration: 1500ms`) for consistent timing

#### Integration Points
1. **Result Card** (existing `ResultCard.astro` or similar)
   - Add loading state prop: `isLoading?: boolean`
   - Render skeleton while `isLoading = true`
   - Render actual result when `isLoading = false`

2. **Calculator Page**
   - Detect calculation in progress (e.g., API call or JS computation)
   - Pass `isLoading` state to result card
   - Example: `<ResultCard result={calculationResult} isLoading={isCalculating} />`

3. **Homepage/Search**
   - Skeleton for search results
   - Trigger skeleton on search input (after 300ms debounce)
   - Replace with results when data ready

4. **Related Calculators Widget**
   - Show skeleton cards while async data loads
   - Replace with actual cards once data available

#### Performance Checklist
- [ ] Skeletons load synchronously (no layout shift)
- [ ] Animations use GPU acceleration (`transform`, `opacity`, not `width`/`height`)
- [ ] Spinner SVG or CSS (not image) for minimal bytes
- [ ] `prefers-reduced-motion` respected on all animations
- [ ] No cumulative layout shift (CLS penalty) from skeleton → result transition
- [ ] Animation frame rate ≥ 60fps on mobile (use Chrome DevTools performance tab)

---

### 8. Verification Checklist for Release QA

#### Visual Verification (All Devices)
- [ ] **Mobile (iPhone 12, Pixel 5)**
  - [ ] Result card skeleton displays correctly (280px, shimmer visible)
  - [ ] Spinner appears during calculation (centered, 32px)
  - [ ] Skeleton-to-result transition smooth (no jank, no jump)
  - [ ] Dark mode skeleton/spinner colors correct

- [ ] **Tablet (iPad, Samsung Tab)**
  - [ ] Layout adapts correctly (240px height on smaller tablets, 320px on larger)
  - [ ] Spinner proportional to screen size

- [ ] **Desktop (1920px, 1024px)**
  - [ ] Skeleton matches final card dimensions (no layout shift CLS penalty)
  - [ ] Spinner centered

#### Animation Performance
- [ ] Chrome DevTools: FCP (First Contentful Paint) < 1.5s (skeleton visible quickly)
- [ ] Chrome DevTools: No dropped frames during shimmer animation (60fps)
- [ ] No jank when transitioning from skeleton to result
- [ ] Animation stops immediately when result renders (no lingering spinner)

#### Accessibility
- [ ] **Screen Reader (NVDA, JAWS, VoiceOver)**
  - [ ] Skeleton labeled: "Loading result..." (announced once)
  - [ ] When result loads: "Result: ฿50,000" (or actual value) announced
  - [ ] Spinner status announced: "Calculating..."
  - [ ] No repeated announcements during animation

- [ ] **Color Contrast**
  - [ ] Skeleton shimmer sweep: ≥ 3:1 on light/dark background (use WebAIM Contrast Checker)
  - [ ] Spinner color: ≥ 4.5:1 contrast against background

- [ ] **Motion Sensitivity**
  - [ ] `prefers-reduced-motion: reduce` → skeleton static (no shimmer)
  - [ ] Spinner slows to 2s rotation cycle (no strobe effect)

#### Functional Verification
- [ ] **Calculation Scenarios**
  - [ ] APR calculator: skeleton → result (100–500ms typical)
  - [ ] Mortgage calculator: skeleton → result (200–800ms typical)
  - [ ] Tax calculator: skeleton → result (may be slower, 800–1500ms)

- [ ] **Network Conditions** (Chrome DevTools → Network throttling)
  - [ ] Fast 3G: skeleton displays < 200ms, result within 800ms
  - [ ] Slow 3G: skeleton displays < 500ms, result within 2s (error if > 2.5s)
  - [ ] Offline: skeleton displays, result shows error (if applicable)

- [ ] **Search Loading**
  - [ ] Type in search: 300ms delay, then skeleton appears
  - [ ] Results replace skeleton within 1.5s
  - [ ] Typing again: skeleton re-shows (not stale results)

#### Cross-Browser Verification
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (iOS 15+, macOS latest)
- [ ] **Edge** (latest)
- [ ] **Samsung Internet** (if applicable)

#### Dark Mode
- [ ] Background colors adjust correctly (`#1f2937` on dark)
- [ ] Spinner color bright enough (`#60a5fa` on dark)
- [ ] Shimmer sweep visible on dark background

#### Edge Cases
- [ ] Very fast calculation (< 100ms): spinner visible but brief (not jarring)
- [ ] Very slow calculation (> 3s): error message shown (not infinite skeleton)
- [ ] Multiple simultaneous loading states (homepage categories + search): all render independently
- [ ] Rapid recalculation: skeleton re-shows (state resets correctly)

---

## Before / After Comparison

### Before (Current State)
```
User taps "Calculate" on mortgage calculator
  ↓
[Static page for 300–500ms]
  ↓
Result appears suddenly
  ↓
User: "Did it work? Was it fast or did I wait?"
User may re-tap, close page, or feel low confidence
```

### After (With Loading States)
```
User taps "Calculate" on mortgage calculator
  ↓
[Skeleton card appears immediately with shimmer animation]
  ↓
User: "OK, it's calculating. I'll wait."
  ↓
[Spinner confirms ongoing work]
  ↓
[Result appears, skeleton fades out smoothly]
  ↓
User: "Fast and clear. I trust this page."
```

**Outcome**: +5–10% completion rate (Phase A); reduced bounce; higher trust

---

## Dependencies & Blockers

### Hard Dependencies
- None. This is a UI-only feature with no API/backend work.

### Soft Dependencies (Nice-to-Have)
- CAL-1087 (Result Card Visual Hierarchy): Defines result card dimensions → skeleton should match
- CAL-1046 (Image Optimization): Skeletons may include image placeholders
- CAL-1042 (Web Vitals Monitoring): Track impact of loading states on FCP/LCP post-launch

---

## Timeline & Effort Estimate

**CTO Effort**: ~8–12 hours (Phase 1 rollout: APR→Mortgage→Vehicle→Salary→BMI)
- Component creation: 3–4h
- Integration: 2–3h
- Testing & dark mode: 2–3h
- Refinement & perf tuning: 1–2h

**Release QA Effort**: ~4–5 hours
- Visual + accessibility spot-check: 2h
- Performance verification: 1.5h
- Cross-browser + dark mode: 1.5h

**Phase 1 Timeline**: 1 week (parallel with other Phase 1 tasks)

---

## Success Metrics

1. **User Engagement**: +5–10% calculator completion rate on Phase A calculators (measured vs. baseline)
2. **Perceived Performance**: User survey (if conducted): clarity of loading state rated ≥ 4/5
3. **No CLS Penalty**: Cumulative Layout Shift < 0.1 when skeleton → result transitions
4. **Accessibility**: 100% WCAG AA pass on loading states (color contrast, motion, ARIA)
5. **Performance**: FCP < 1.5s on slow 3G (Chrome DevTools throttled)

---

## Notes for CTO

- **Skeleton Dimensions Must Match Final Result Card**: This prevents layout shift (CLS penalty). Measure final result card height and width, then use exact dimensions for skeleton.
- **Shimmer Animation Performance**: Use `background-position` shift (GPU-accelerated), not `width` expansion. Prevents jank.
- **Spinner Timing**: 1.2s rotation is deliberate (not too fast = less "frantic", not too slow = feels responsive). Adjust only if user feedback indicates otherwise.
- **Dark Mode is Non-Negotiable**: Users toggle dark mode expecting full feature support. Test dark mode skeletons early.
- **`prefers-reduced-motion` Required**: Not optional for accessibility. Browsers enforce this; failing will upset accessible users.

---

## Sign-Off

**UXDesigner**: CAL-1089 specification complete and ready for CTO implementation review.
**Date**: 2026-04-23
**Status**: Ready for CTO 8–12 hour implementation sprint (Phase 1)

---
