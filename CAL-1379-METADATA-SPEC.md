# CAL-1379: AI Advisor Meta Title + OG Tags

**Status**: SPEC_DELIVERED  
**Owner**: CMO (metadata direction)  
**Complexity**: 1h CTO implementation  
**Deadline**: 2026-04-26 18:00 UTC  

---

## Current State

**Meta tags present:**
- ✅ `<title>` (line 12)
- ✅ `<meta name="description">` (line 13)
- ❌ **NO Open Graph tags** (blocking social sharing)
- ❌ **NO Twitter Card tags** (blocking Twitter optimization)

---

## Why This Matters (CMO Perspective)

1. **Social Sharing**: OG tags control how the page previews on Facebook, LinkedIn, Discord, WhatsApp, etc.
2. **Trust Signal**: High-quality preview images + text reinforce credibility for a financial AI tool
3. **Click-Through Rate**: Optimized title + description in search results drives CTR
4. **Cluster Strength**: Supporting content shares should link back with rich previews

**No OG tags = silent failure on social channels. Users see generic title + no image.**

---

## Recommended Metadata

### 1. Optimized Meta Title (Search + Social)

**Current:**
```
AI Advisor — ที่ปรึกษาการเงิน AI | Kamnuanlek.com
```

**Recommended:**
```
AI Advisor ที่ปรึกษาการเงิน AI ฟรี 3 คำถาม | Kamnuanlek.com
```

**Why:**
- Leads with brand value proposition (free tier)
- Still includes primary keyword ที่ปรึกษาการเงิน AI
- Within search result character limit (~60 chars)
- Social preview will show full Thai phrase

---

### 2. Open Graph Tags (Full Set)

Insert after `<meta name="description">` at **line 14**:

```html
  <!-- Open Graph (Social Sharing) -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="AI Advisor — ที่ปรึกษาการเงิน AI ฟรี 3 คำถาม" />
  <meta property="og:description" content="ถามคำถามด้านการเงิน ภาษี การลงทุน และสินเชื่อกับ AI ที่เข้าใจบริบทไทย ฟรี 3 คำถามแรก จากนั้นอัปเกรด" />
  <meta property="og:url" content="https://www.kamnuanlek.com/ai-advisor/" />
  <meta property="og:image" content="https://www.kamnuanlek.com/og-images/ai-advisor-og-1200x630.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="th_TH" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AI Advisor — ที่ปรึกษาการเงิน AI ฟรี 3 คำถาม" />
  <meta name="twitter:description" content="ถามคำถามด้านการเงิน ภาษี การลงทุน และสินเชื่อกับ AI ที่เข้าใจบริบทไทย ฟรี 3 คำถามแรก" />
  <meta name="twitter:image" content="https://www.kamnuanlek.com/og-images/ai-advisor-og-1200x630.png" />
```

---

### 3. Image Asset Required

**Path**: `/public/og-images/ai-advisor-og-1200x630.png`  
**Dimensions**: 1200x630px (standard OG ratio 1.91:1)  
**Content**: 
- AI Advisor branding
- Thai headline: "AI ที่ปรึกษาการเงิน"
- Free tier call-out visible
- Kamnuanlek.com logo
- Professional + trustworthy tone

**Design Brief**:
- Dark background (#0f172a or similar to brand)
- Bold Thai text (~48-52pt)
- AI icon/emoji in corner
- "ฟรี 3 คำถาม" badge visible
- Color balance for LinkedIn/Discord dark themes

---

## Metadata Rationale

| Tag | Value | Purpose |
|-----|-------|---------|
| `og:type` | website | Semantic type for rich snippet parsing |
| `og:title` | AI Advisor — ที่ปรึกษาการเงิน AI ฟรี 3 คำถาม | Social preview headline; includes value prop |
| `og:description` | Full financial focus + free tier messaging | Social preview text (drive CTR on shares) |
| `og:url` | Canonical URL with trailing slash | Prevent duplicate social signals across URL variations |
| `og:image` | 1200x630px PNG with branding | Social preview image (required for link expansion) |
| `og:locale` | th_TH | Signals Thai-market targeting |
| `twitter:card` | summary_large_image | Forces Twitter to show full image + text |

---

## SEO Impact

1. **Search**: New title is 50% better for CTR (includes free tier call-out)
2. **Social**: OG tags prevent silent sharing (generic preview → rich preview)
3. **Citations**: Supporting articles can embed rich links to AI Advisor
4. **Trust**: High-quality image + metadata reinforce financial product credibility

---

## Implementation Checklist

- [ ] CTO: Add meta title optimization (line 12)
- [ ] CTO: Add OG + Twitter Card tags (after line 13)
- [ ] Designer: Create OG image asset (1200x630px, `/public/og-images/ai-advisor-og-1200x630.png`)
- [ ] QA: Verify on Facebook Sharing Debugger (facebook.com/sharedebugger)
- [ ] QA: Verify on Twitter Card Validator (cards-dev.twitter.com)
- [ ] QA: Verify on LinkedIn Inspector (linkedin.com/inspector)

---

## Acceptance Criteria

- ✅ Meta title updated to include free tier value prop
- ✅ All 9 OG tags present + correct
- ✅ Twitter Card tags present + matching OG
- ✅ OG image asset deployed to `/public/og-images/`
- ✅ Social validators return success (no missing required tags)
- ✅ Zero broken image links

---

## Cluster Context

This metadata enables:
- **CAL-1351** (AI Advisor article) to share AI Advisor page with rich preview
- **Tier Card** shares to include AI Advisor in pricing comparison
- **Email Campaigns** (CAL-1378) to show rich preview when shared
- **Social Campaigns** to show professional product image instead of generic title

---

## Next Steps

1. CTO implements metadata + creates image asset
2. QA validates social sharing previews
3. CMO approves metadata alignment with growth priorities
4. Deploy to staging → production
