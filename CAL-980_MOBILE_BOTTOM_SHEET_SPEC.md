# CAL-980: Mobile Bottom Sheet — Swipe-Up Result Panel for Small Screens

**Status:** UX Spec Complete (Ready for CTO Implementation)  
**Date:** 2026-04-23  
**Owner:** UXDesigner  
**Priority:** Medium  

## Executive Summary

Replace passive sticky result card (CAL-961) on mobile with an **interactive bottom sheet modal** for result display. This provides a richer, more touch-friendly interface that puts the result front-and-center when needed.

**Expected Impact:**
- ↑ Mobile completion +8-12%
- ↑ result_panel_opened 60%+ of mobile users
- ↑ result_action_taken 40%+ (save/share/export)
- ↑ Affiliate conversion +5-8%

## Problem Statement

### Current State (CAL-961 Sticky Card)
- Result sticks to bottom but is passive
- Takes 20-25% of viewport on small screens
- User doesn't know they can interact
- Save/share buttons buried below result summary
- Feels like passive overlay, not a focused interaction

### Why Bottom Sheet is Better
1. **Touch-familiar pattern** (native iOS/Android UX)
2. **Explicit modal state** (user understands it's a focused view)
3. **Reclaims space** (user can swipe down to dismiss)
4. **Prominent actions** (save, share, export buttons top-level)
5. **Expandable detail** (drag to full-screen for breakdown info)

## Design Specification

### 1. Trigger Behavior

**When:** Auto-open on calculation complete (instant show for fast calculations)
**Mobile:** Viewport width < 768px only
**Animation:** Slide up from bottom, 350ms easeOutCubic

### 2. Sheet Interaction

- **Initial height:** 45vh (about 40-50% of viewport)
- **Expandable:** Drag handle up to 85vh (full-screen expansion)
- **Snap points:** 45vh (collapsed), 70vh (expanded), 85vh (full)
- **Dismiss actions:** Swipe down, tap outside, tap X button, press Esc

### 3. Content Layout

```
┌──────────────────────────────┐
│ [Drag Handle] [  ] [X Button]│  ← Sticky top bar
├──────────────────────────────┤
│                              │
│ [PRIMARY RESULT]             │  ← Color-coded per CAL-974
│  Large Number ✅             │
│  Unit Label                  │
│                              │  ← Scrollable content
│ [ACTION BUTTONS]             │
│  [💾 Save] [🔗 Share]        │
│  [📥 Export] [🖨️ Print]      │
│                              │
│ [BREAKDOWN (Expandable)]     │
│  Formula & input values      │
│                              │
│ [RELATED CALCULATORS]        │
│  [Card 1] [Card 2] [Card 3]  │
│                              │
└──────────────────────────────┘
```

### 4. Mobile UX Considerations

- **Safe areas:** Respects notch and home indicator (iPhone)
- **Keyboard:** Sheet moves up if keyboard opens
- **Touch targets:** Minimum 44px height/width for buttons
- **Spacing:** 16px padding, 12px between sections

### 5. Accessibility

- **ARIA:** role="dialog", aria-modal="true", aria-label
- **Keyboard:** Tab navigation, Escape to close, Enter to activate
- **Contrast:** 4.5:1 WCAG AA (text on background)
- **Screen reader:** Announces result value, unit, status

### 6. Dark Mode

Full support via `html[data-theme='dark']` selector:
- Background: #1f2937
- Text: #f3f4f6
- Borders: #4b5563
- Drag handle: always subtle

### 7. Performance

- Use CSS transforms for drag (not margin changes)
- GPU acceleration via `transform: translateZ(0)`
- Throttle drag to 60fps
- Respect `prefers-reduced-motion` user setting

### 8. Component Integration

**With CAL-962 (Save Button):**
- Save button prominent (first action in sheet)
- Show toast confirmation: "✅ Saved!"

**With CAL-974 (Result Color Coding):**
- Result number color matches (green/yellow/red/blue)
- Status icon matches (✅ ⚠️ ❌ ℹ️)

**With CAL-978 (Related Calculators):**
- Embed RelatedCalculators component at bottom
- Show 3-4 cards, horizontal scroll
- Tap navigates away (sheet auto-closes)

**With CAL-1003 (Export):**
- "Download PNG" button (uses html2canvas)
- "Export PDF" button (uses jsPDF)
- Print button (uses print stylesheet)

**With CAL-1049 (GA4 Events):**
- `result_panel_opened` → when sheet shown
- `result_panel_expanded` → when dragged to full-screen
- `result_panel_dismissed` → when sheet closed
- `result_action_taken` → save/share/export/print

### 9. Responsive Breakpoints

| Screen | Height | Buttons | Related |
|--------|--------|---------|---------|
| 320px | 45vh | 1 col | 3 scroll |
| 414px | 45vh | 2 col | 3 scroll |
| 768px | N/A (desktop layout) | - | - |

### 10. QA Verification Checklist

- [ ] Sheet opens smoothly on calculation
- [ ] Drag handle responds to finger movement
- [ ] Release snaps to nearest snap point
- [ ] Swipe down closes sheet
- [ ] Tap outside closes sheet
- [ ] X button closes sheet
- [ ] Esc key closes sheet
- [ ] Result updates without closing sheet
- [ ] Save button works, shows confirmation
- [ ] Share button opens native share dialog
- [ ] Export buttons download correctly
- [ ] Related cards display and scroll
- [ ] Dark mode looks correct
- [ ] Keyboard doesn't overlap result
- [ ] Notch doesn't hide content
- [ ] Touch targets are ≥44px
- [ ] Tab order makes sense
- [ ] Screen reader announces result
- [ ] Animations are smooth 60fps

## Implementation Notes for CTO

### Component Files Needed

```
src/components/ResultBottomSheet.astro     (~200 lines)
src/styles/result-bottom-sheet.css         (~300 lines)
src/scripts/result-bottom-sheet.ts         (~250 lines)
```

### Integration Steps

1. Create `ResultBottomSheet.astro` component
2. Add to APR calculator page for reference
3. Test mobile (320px, 414px, 768px)
4. Batch rollout to all calculator pages
5. QA verification per checklist

### Key Questions for CTO

1. **Default open:** Auto-open after calc or require user tap?
2. **Drag feedback:** Custom pointer feedback or CSS cursor?
3. **Related calc placement:** Inside scroll or sticky at bottom?
4. **Keyboard:** Arrow keys for expand/collapse?
5. **Animation:** easeOutCubic vs easeOutQuad?

## Success Metrics

**GA4 Targets (CAL-1049):**
- result_panel_opened: 60%+ of mobile users
- result_panel_expanded: 30%+ (high engagement signal)
- result_panel_dismissed: <20% (good discoverability)
- result_action_taken: 40%+ (save/share/export)

**Business Metrics:**
- Mobile completion +8-12% from baseline
- Affiliate conversion +5-8%
- Bounce rate -3-5%
- Ad RPM neutral or +2%

## Files

| File | Status | Notes |
|------|--------|-------|
| CAL-980_MOBILE_BOTTOM_SHEET_SPEC.md | ✅ DONE | Full spec, ready |
| ResultBottomSheet.astro | 📋 TODO | CTO builds |
| result-bottom-sheet.css | 📋 TODO | CTO builds |
| result-bottom-sheet.ts | 📋 TODO | CTO builds |

## Related Work

- **CAL-961:** Sticky card (to be replaced on mobile)
- **CAL-962:** Save button (integrated into sheet)
- **CAL-974:** Result color coding (colors reused)
- **CAL-977:** Saved history drawer (separate modal)
- **CAL-978:** Related calculators (embedded in sheet)
- **CAL-1003:** Export utilities (buttons in sheet)
- **CAL-1049:** GA4 events (tracking integrated)
- **CAL-956:** UX audit (Win #5 Mobile optimization)

## Status

✅ **Ready for CTO Implementation** (5-7 day sprint)

---

**Document:** CAL-980_MOBILE_BOTTOM_SHEET_SPEC.md  
**Owner:** UXDesigner  
**Updated:** 2026-04-23
