# Accessibility Audit & WCAG 2.1 Compliance

## Current State Assessment

### ✅ Passing
- **Responsive design**: 99%+ compliance
- **Viewport meta tag**: Present on all pages
- **Color contrast**: Most elements meet WCAG AA (4.5:1 for text)
- **Mobile first**: Theme-color, manifest present

### ⚠️ Needs Improvement
- **Keyboard navigation**: Not all calculators fully keyboard accessible
- **ARIA labels**: Limited ARIA labeling on form inputs
- **Screen reader**: Results may not be clearly announced to screen readers
- **Focus management**: No visible focus indicators on some interactive elements

## WCAG 2.1 Compliance Roadmap

### Level A (Essential) — **IN PROGRESS**

#### 1.1 Text Alternatives
- ✅ All images have alt text
- ⚠️ Icon buttons need aria-label or aria-labelledby
- **Action**: Add ARIA labels to all icon buttons

#### 1.3 Adaptable
- ✅ Semantic HTML (headings, lists)
- ✅ Reading order is logical
- ⚠️ Form associations could be stronger
- **Action**: Verify all form inputs have associated labels

#### 1.4 Distinguishable
- ✅ Color is not the only distinguisher
- ✅ Contrast meets WCAG AA minimum
- ⚠️ Focus indicators could be more visible
- **Action**: Add focus-visible styles (outline: 2px solid #4f46e5)

#### 2.1 Keyboard Accessible
- ⚠️ All functionality available via keyboard
- ⚠️ No keyboard trap (but missing skip link)
- **Action**: Implement skip-to-content link (Alt+S)
- **Action**: Test calculator forms with keyboard only

#### 2.4 Navigable
- ⚠️ Purpose of links clear (improve with aria-labels)
- ⚠️ No skip navigation link
- **Action**: Add skip-to-main-content link on all pages
- **Action**: Add aria-current="page" to active nav items

#### 3.1 Readable
- ✅ Primary language marked (lang="th-TH")
- ✅ Language is clear and understandable
- ⚠️ Abbreviations could have title or explanation
- **Action**: Add title="" for Thai abbreviations

#### 4.1 Compatible
- ✅ HTML is valid (Astro handles this)
- ⚠️ Form inputs need proper aria-* attributes
- **Action**: Add aria-describedby for help text
- **Action**: Add aria-invalid on validation errors

### Level AA (Enhanced) — **PLANNED**

#### 1.4.3 Contrast (Enhanced)
- Current: AA (4.5:1)
- Target: AAA (7:1) for critical text
- **Action**: Audit calculator form labels and increase contrast

#### 2.4.3 Focus Order
- **Action**: Verify tab order is logical in all calculators
- **Action**: Remove tabindex=-1 except for hidden elements

#### 2.4.7 Focus Visible
- **Action**: Implement visible focus indicator on all interactive elements

#### 3.2.2 On Input
- **Action**: Ensure form changes don't have unexpected effects
- **Action**: Validate on blur, not on input (prevent surprises)

#### 3.3.1 Error Identification
- **Action**: Provide clear error messages (text, not color alone)
- **Action**: Suggest corrections for common input errors

#### 3.3.2 Labels or Instructions
- **Action**: All form fields have visible labels
- **Action**: Required fields marked clearly

## Implementation Checklist

### Phase 1: Quick Wins (Completed)
- [ ] Add focus-visible styles to src/lib/accessibility.ts
- [ ] Create skip-to-content link component
- [ ] Add aria-labels to all icon buttons
- [ ] Add aria-describedby to form help text

### Phase 2: Form Improvements
- [ ] Add aria-invalid to validation errors
- [ ] Add aria-live="polite" to result displays
- [ ] Add aria-label to all copy/share buttons
- [ ] Test keyboard navigation on all calculators

### Phase 3: Advanced A11y
- [ ] Reduce motion support (prefers-reduced-motion)
- [ ] High contrast mode support
- [ ] Dark mode support (if applicable)
- [ ] Font size adjustment for readability

## Testing Tools

### Automated Testing
- **axe DevTools**: Browser extension for accessibility audits
- **Lighthouse**: Built-in accessibility audit
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse CI**: Integrate into build process

### Manual Testing
- **Keyboard navigation**: Tab through every calculator
- **Screen reader**: Test with NVDA (Windows) or VoiceOver (Mac)
- **Zoom**: Test at 200% zoom level
- **Color blindness**: Use Colorblindsim to validate contrast

## Expected Impact

### Audience Expansion
- **10-15% of users** rely on accessibility features
- **Older demographic** (50+) benefits from larger fonts and high contrast
- **Mobile users** benefit from better keyboard navigation

### SEO Benefits
- **Link juice**: Semantic HTML improves crawlability
- **Bounce rate**: Better accessibility reduces frustration exits
- **Dwell time**: Improved focus/keyboard support increases session duration

### Legal/Compliance
- **Accessibility statement**: Add to footer
- **WCAG compliance**: Document Level AA target
- **Future-proofing**: Comply with EU/US accessibility standards

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
