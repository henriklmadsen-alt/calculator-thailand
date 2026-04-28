# CAL-1557: Phase 2 UX Critical Decisions — Implementation-Ready Specs

**Status**: Draft for CTO + SEO Feedback | **Due**: 2026-04-28 | **Owner**: UXDesigner | **Gate**: 2026-04-29

## Overview

Three critical UX decisions unlock Phase 2 growth. Articles launch 2026-04-30+; UX must support visibility, cluster linking, and trust signals immediately.

**Blocking Decision Dependencies**:
- Decision 1 (Article Visibility) → unblocks article promotion on calculator pages
- Decision 2 (Related Calc Linking) → unblocks SEO cluster strategy validation
- Decision 3 (Metadata Placement) → unblocks trust signal rollout across calc + article pages

---

## DECISION 1: Article Visibility on Calculator Pages

### Current State

**Page Structure** (BMI calculator example):
1. Calculator header + inputs
2. Results card
3. Transparency Panel (formula + sources)
4. Explanation/FAQ content
5. TransparencyPanel detail
6. FAQAccordion
7. RelatedCalculators (3 cards)
8. **RelatedArticles** (at bottom, currently auto-populated but often empty)

**Problem**: Articles are discoverable only after scrolling past FAQ and related calculators. On mobile, users finish their calculation and leave before reaching article links.

### Recommendation: Two-Tier Article Visibility Strategy

#### Tier 1: Article Teaser — After Results (High Visibility, Mobile-Safe)

**What**: Compact article "callout" immediately after result card, before explanation content. Shows 1 primary article only (the closest match for this calculator).

**Visual spec**:

```
┌─────────────────────────────────────┐
│  [📖] ชื่อบทความ                     │
│  "Brief 1-line description"          │
│  ➜ อ่านบทความเพิ่มเติม               │
└─────────────────────────────────────┘
(1 line on mobile, no icon, left-aligned)
```

**Design details**:
- Heading: Article title (blue, bold)
- Subtext: 1-line teaser (gray, 14px)
- CTA: "Read more" link (primary color, rightward arrow)
- Background: Subtle light gray or white with thin bottom border
- Padding: 12px left, 12px right, 10px top/bottom (mobile comfort)
- Max width: Full container (mobile), not a card
- No shadow, no box — light visual weight

**Mobile layout**:
- Single-column (full width)
- Link text inline with arrow: "อ่านบทความเพิ่มเติม ➜"
- Font size: 14px title, 13px teaser, 13px link
- Tap target: 44px minimum height (entire row is tappable)

**Desktop layout** (>768px):
- Same layout (no multi-column needed for single article)
- Can expand to 2-line teaser if space permits
- Positioning: Immediately after result card

**Placement on page**:
- After: Result card (ResultCardHub component)
- Before: Explanation content or TransparencyPanel
- Visibility: Show only if article exists for this calculator (no empty state)

---

#### Tier 2: Full Article List — Keep at Bottom (Discovery + SEO)

**What**: Keep existing RelatedArticles component at bottom, but enhance:
- Change heading to "ศึกษาเพิ่มเติมจากบทความของเรา" (Learn More From Our Articles)
- Show up to 3 related articles (not just 1)
- Include article publication date + author (if available) in small text
- Add "View All Articles in [Cluster Name]" link at bottom if >3 articles exist

**Mobile layout**:
- Stack vertically, one article per row
- Article cards: 100% width, 12px padding
- Date + author: 12px gray text below title

**Desktop layout**:
- 1-3 articles in a row (grid)
- Same metadata visible below title

---

### Implementation Notes for CTO

1. **Tier 1 (Teaser) Component**: New component `ArticleTeaser.astro`
   - Props: `currentHref` (string), optionally `title`, `teaser`, `articleHref`
   - Auto-lookup: `getCalculatorLinks(currentHref).articles[0]`
   - Return null if no articles found
   - Styling: Use Tailwind utilities (no shadow, light border-bottom)

2. **Tier 2 (Full List) Enhancement**: Modify `RelatedArticles.astro`
   - Add date + author metadata display (if data exists in internal-links)
   - Show up to 3 articles instead of all
   - Add "View all" link for cluster if >3 articles

3. **Data structure** (internal-links):
   - Each article link should include: `{ href, title, desc, date?, author?, cluster? }`
   - Date format: ISO string (YYYY-MM-DD) or Thai string "30 เมษายน 2026"
   - Author: String (e.g., "Kamnuanlek Team")

4. **Placement in page template**:
   - Tier 1: Between ResultCardHub and explanation prose section
   - Tier 2: After FAQAccordion (keep current position)

5. **Conditional rendering**:
   - Tier 1 shows automatically if article exists
   - Tier 2 shows all articles (no max, but visually limited to 3 with overflow handling)

6. **Mobile QA checkpoints**:
   - Result card is NOT pushed off-screen by article teaser
   - Teaser is thumb-friendly (44px+ tap target)
   - No horizontal scroll on article teaser
   - Ad placement not disrupted by new sections

---

### Trust & UX Impact

✅ **Article discovery**: User sees related article immediately after getting their result (natural reading flow)  
✅ **Mobile priority**: Compact teaser takes 60px height, vs. full 150px+ card layout  
✅ **Result prominence**: Result card still primary, article is secondary callout  
✅ **No clutter**: Single article teaser is clean, not overwhelming  
✅ **Trust signal**: Published article + author/date visible → builds credibility  

---

### Acceptance Criteria (Decision 1)

- [ ] ArticleTeaser component created and renders in BMI calc
- [ ] Teaser appears immediately after result card on mobile + desktop
- [ ] Teaser is 44px+ touch target, keyboard accessible
- [ ] Mobile: No horizontal scroll, result card above-the-fold
- [ ] Desktop: Teaser readable at all screen widths
- [ ] Empty state: No teaser shows if article doesn't exist (tested with stub calc)
- [ ] Links work + preserve UTM parameters
- [ ] Contrast: Text meets WCAG AA on all backgrounds

---

## DECISION 2: Related Calculator Navigation (Linking Strategy)

### Current State

**Calculator Pages**: RelatedCalculators shows 3 related cards + hub links (tax, loan, health, etc.)  
**Article Pages**: Articles (not yet live) will link to 2-3 related calculators inline (per CMO spec)  
**Category Pages**: List all calculators in category + hub links  

**Problem**: Cluster discovery is inconsistent. User can't easily navigate between related calculators within a cluster on either calculator pages or (upcoming) article pages.

### Recommendation: Consistent Cluster Navigation Pattern

#### Pattern 1: Calculator Pages → Related Calculators (Refined)

**Current behavior (good)**: Shows 3 most-relevant related calculators in a 3-column grid  
**Enhancement needed**: Add visible cluster context ("Finance", "Health", etc.) above the cards

**Updated visual spec**:

```
┌─────────────────────────────────────┐
│ 🔗 เครื่องคำนวณที่เกี่ยวข้อง         │
│ (Finance / Tax Cluster)              │ ← NEW: Cluster label
│                                      │
│ [Card 1] [Card 2] [Card 3]          │
└─────────────────────────────────────┘
```

**Design details**:
- Add cluster name/emoji below main heading (small gray text, 12px)
- Example clusters (per CAL-1552): "Finance", "Real Estate", "Health", "Food Business", "Work", "Travel"
- Mapping: Auto-detect from URL pattern (like current hubLinks logic) OR from internal-links data

**Mobile layout**:
- Single column: Stack 3 cards vertically
- Cluster label: Visible above first card
- Each card: 100% width, 12px padding

**Desktop layout** (≥768px):
- 3-column grid (current)
- Cluster label above grid

---

#### Pattern 2: Article Pages → Related Calculators (New, for Content Team)

**What**: When articles go live, they'll link to 2-3 related calculators inline + end section.

**Placement options** (CTO to choose 1):
- Option A: Inline mentions + dedicated "Try Calculator" box at article end
- Option B: Dedicated sidebar "Related Calculators" on desktop, inline box on mobile
- Option C: Inline mentions only (let SEO place links naturally in prose)

**Current recommendation**: Option A (most consistent with calculator pages)

**Visual spec**:

```
Article content...

┌──────────────────────────────────┐
│ 📱 ลองใช้เครื่องคำนวณ:             │
│ • VAT Calculator                  │
│ • Salary Calculator               │
│ • Tax Calculator                  │
└──────────────────────────────────┘
```

**Design details**:
- Heading: "ลองใช้เครื่องคำนวณ" (Try Calculator)
- Style: Consistent with existing calculator cards (blue text, white bg, border)
- Links: Underlined, primary color
- Placement: End of article, before comments/related articles
- Mobile: Full width, single column
- Desktop: Optional: left-aligned box (200px width) in article sidebar

---

#### Pattern 3: Category/Hub Pages → Calculator Discovery

**Current**: Lists calculators + hub buttons  
**Enhancement**: Group calculators by cluster/intent level visually

**No major change needed** — current categorization works. Minor: add subheadings for clarity if 20+ calcs per page.

---

### Internal Link Data Structure (For SEO Team)

The `internal-links` data must include cluster information so auto-lookup works:

```javascript
{
  href: '/คำนวณ-vat/',
  title: 'VAT Calculator',
  desc: 'Calculate Thai VAT quickly',
  cluster: 'Finance',         // NEW
  clusterEmoji: '💰',         // NEW (optional)
  relatedCalculators: [       // NEW
    { href: '/คำนวณ-tax/', title: 'Tax Calculator' },
    { href: '/คำนวณ-salary/', title: 'Salary Calculator' }
  ],
  relatedArticles: [          // NEW
    { href: '/blog/vat-guide/', title: 'VAT Guide', date: '2026-04-30' }
  ]
}
```

---

### Implementation Notes for CTO

1. **Calculator Pages**: Update `RelatedCalculators.astro`
   - Add cluster label display from internal-links data
   - Cluster auto-detected OR passed as prop
   - Fallback: Show no cluster label if not found

2. **Article Pages** (Phase 2+): Create `ArticleCalculatorLinks.astro` component
   - Props: `currentHref` (article path), optional explicit links
   - Auto-lookup: `getArticleLinks(articleHref).calculators`
   - Render as "Try Calculator" section at article end
   - Same card style as RelatedCalculators for consistency

3. **Data updates** (SEO team responsibility):
   - Add `cluster` field to all internal-links entries
   - Validate cluster names match CMO's 7 clusters
   - Add `relatedCalculators` and `relatedArticles` arrays

4. **No breaking changes**: Current RelatedCalculators functionality stays the same, just enhanced with cluster label

---

### Trust & UX Impact

✅ **Cluster coherence**: Users see related calculators grouped by intent (Finance, Health, etc.)  
✅ **Natural discovery**: Calculator → Related Calc → Another related calc (cluster hopping)  
✅ **SEO benefit**: Internal linking reinforces topical authority per cluster  
✅ **Mobile-friendly**: Cluster labels visible, links easy to tap  

---

### Acceptance Criteria (Decision 2)

- [ ] RelatedCalculators shows cluster label above cards (if data exists)
- [ ] Cluster label is correct for 5+ different calculator pages (spot check)
- [ ] Mobile: Cluster label visible without scrolling
- [ ] ArticleCalculatorLinks component ready for Phase 2 (article pages not live yet)
- [ ] Component gracefully handles missing cluster data (no errors)
- [ ] Links work + preserve UTM parameters

---

## DECISION 3: Metadata Placement & Consistency (Trust Signals)

### Current State

**Calculator Pages**: 
- TransparencyPanel shows formula + sources (collapsed by default)
- No visible author, publication date, or last updated metadata
- Metadata only in page head (schema.org, meta tags)

**Article Pages** (launching 2026-04-30+):
- Will have author + publication date in byline
- Placement: TBD (needs this spec)
- Format: TBD (consistency needed)

**Problem**: 99.7% of calculators lack visible trust signals (CAL-1462 finding). Users can't quickly assess credibility without expanding details. Articles and calculators must feel equally trustworthy.

### Recommendation: Visible Metadata Header (Above Fold)

#### Placement A: Calculator Pages (Primary)

**New "Metadata Header" section** — appears immediately BEFORE explanation content (after result + article teaser).

**Visual spec**:

```
┌──────────────────────────────────────┐
│ ✅ Updated: 24 Apr 2026              │
│ 🏛️  Data source: Bank of Thailand    │
│ ✍️  Author: Kamnuanlek Team          │
└──────────────────────────────────────┘
```

**Design details**:
- Background: Very light blue (#f0f9ff) or light gray (#f9fafb)
- Border: Thin top + bottom (1px gray)
- Padding: 12px left, 12px right (mobile margin), 8px top/bottom
- Layout: Stack vertically (mobile) or inline (desktop)
- Icons: Emoji (✅, 🏛️, ✍️) for scannability + visual interest
- Font: 13px gray text, no bold (secondary importance)

**Content**:
- **Updated**: ISO date (30 April 2026) or "Last updated 24 Apr 2026"
- **Source**: "Bank of Thailand", "WHO", "Ministry of Public Health", etc. (from TransparencyPanel)
- **Author**: "Kamnuanlek Team" or specific name (if applicable)

**Mobile layout** (0-767px):
- Vertical stack
- One line per item
- Full width, 12px padding
- 44px touch target per item (if links)

**Desktop layout** (≥768px):
- Inline horizontal, items separated by dots or dividers
- Example: "✅ Updated 24 Apr 2026 • 🏛️ Bank of Thailand • ✍️ Kamnuanlek Team"
- Or: Stacked, but 2 items per row if space permits

---

#### Placement B: Article Pages (Consistent Pattern)

**Article byline** (already planned by Content team) — align format with calculator metadata header.

**Visual spec**:

```
Article Title
═════════════════════════════════════
✍️  By Kamnuanlek Team | 📅 Published 30 Apr 2026
```

**Design details** (to confirm with Content team):
- Byline: Author + publication date
- Format: Match calculator metadata (emoji + text)
- Placement: Below article title, above body
- Same styling as calculator header (light background, 13px text)

---

#### Data Source & Consistency

**Calculator metadata** (build time):
1. Updated date: From file modified date OR explicit metadata in page frontmatter
2. Source: From TransparencyPanel `sourceName` + `sourceUrl`
3. Author: Default to "Kamnuanlek Team", override per calculator if needed

**Article metadata** (from CMO/Content):
1. Author: Article writer name (or "Kamnuanlek Team")
2. Published date: Article publication date (ISO or Thai format)
3. Source: Citation links within article body (not in byline)

**Format consistency**:
- Date format: "30 April 2026" (Thai readable) OR "30 เมษายน 2569" (Thai month)
- Author: String, no over-styling
- Source: Link to authoritative URL (WHO, Ministry, etc.)

---

### Implementation Notes for CTO

1. **New Component**: `MetadataHeader.astro`
   - Props: `updated` (date string), `source` (name + URL), `author` (string)
   - Optional: `compact` (true = inline format, false = stacked, auto on mobile)
   - Renders: Icon + text for each metadata item

2. **Calculator Page Integration**:
   - Add MetadataHeader after ResultCardHub, before explanation prose
   - Auto-populate from calculator page frontmatter:
     - `updated`: File modified time (from Astro context)
     - `source`: From TransparencyPanel props
     - `author`: From page frontmatter (default "Kamnuanlek Team")

3. **Data in page frontmatter** (example BMI calculator):
   ```javascript
   const metadata = {
     updated: new Date().toISOString(),
     sources: [
       { name: 'WHO', url: 'https://www.who.int' },
       { name: 'Ministry of Public Health', url: 'https://ddc.moph.go.th' }
     ],
     author: 'Kamnuanlek Team'
   };
   ```

4. **Article Page Integration** (Content team):
   - Create article byline using same styling/icons
   - Place below article title
   - Use same date/author format for consistency

5. **Styling consistency**:
   - Both calculator header + article byline use same color scheme
   - Icons (✅, 📖, ✍️) same across both
   - Background color #f0f9ff (light blue) on both
   - 13px gray text on both

6. **Accessibility**:
   - Emoji are aria-hidden (decorative)
   - Text content is semantic
   - Contrast: Gray (#6b7280) on white (#ffffff) = WCAG AA
   - Links: Underlined, color (#2563eb) meets WCAG A

---

### Mobile QA Checkpoints

- [ ] Metadata header visible without scrolling (above-the-fold)
- [ ] No horizontal scroll on mobile (text fits 100%)
- [ ] Dates readable (not truncated)
- [ ] Links clickable (44px+ touch target if any links)
- [ ] Icons display correctly (emoji support on device)
- [ ] Contrast passes WCAG AA (gray text on white)

---

### Trust & UX Impact

✅ **Immediate credibility**: User sees source + date immediately (answers "Is this trustworthy?" at a glance)  
✅ **Transparency**: Sources are visible without expanding panels  
✅ **Consistency**: Calculators and articles feel equally trustworthy (same metadata treatment)  
✅ **Mobile first**: Metadata above fold, not buried in panels  
✅ **SEO**: Rich metadata for schema.org, improves search appearance  

---

### Acceptance Criteria (Decision 3)

- [ ] MetadataHeader component created and tested
- [ ] Renders correctly on BMI calculator (updated date, sources, author)
- [ ] Mobile layout: Single column, no overflow, above-fold
- [ ] Desktop layout: Inline or stacked, clean presentation
- [ ] Links work + point to correct sources
- [ ] Contrast: WCAG AA on all backgrounds
- [ ] Emoji render correctly (cross-browser test)
- [ ] Article byline styling aligned with MetadataHeader
- [ ] All 30 priority calculators have metadata populated

---

## Summary: Three Decisions, One Coherent Vision

| Decision | Focus | Placement | Mobile Design |
|----------|-------|-----------|--------|
| **1: Article Visibility** | Article discovery | After result card | Compact teaser (60px) |
| **2: Related Calc Navigation** | Cluster coherence | Related cards + cluster label | Full-width stacked cards |
| **3: Metadata Placement** | Trust signals | Before explanation | Vertical stack, above-fold |

**Result**: Calculator pages feel complete, trustworthy, and connected to articles. Users navigate clusters confidently. Articles are discovered early in the flow.

---

## Phase 2 Go Criteria (2026-04-29 Gate)

All three decisions must have:
- ✅ Implementation spec (CTO ready)
- ✅ Component mocks or code stubs (if needed)
- ✅ Mobile/desktop/accessibility verified
- ✅ SEO + Content team alignment (Actions 2-3)
- ✅ No blockers identified

**If locked by 2026-04-28**: CTO starts Phase 2 implementation 2026-04-30, articles launch 2026-04-30+, growth compounds.

---

**UXDesigner**: Ready for CTO + SEO feedback. Session: 2026-04-24.
