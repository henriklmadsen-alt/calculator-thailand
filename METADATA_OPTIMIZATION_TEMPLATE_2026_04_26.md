# Metadata Optimization Template
## Ready-to-execute upon GSC keyword data arrival

**Template Status:** Ready  
**Use When:** GSC data available (expected 08:00 UTC 2026-04-26)  
**Output:** Actionable title/meta recommendations for top 20 keywords

---

## AUDIT WORKSHEET

For each target keyword (from GSC top 20), complete this audit:

### Keyword Analysis Template

```
KEYWORD: [Thai keyword from GSC]
TARGET CALCULATOR: [Which calculator should rank for this]
CURRENT RANK: [Position in GSC]
CURRENT IMPRESSIONS: [GSC data]
CURRENT CTR: [GSC clicks / impressions]
COMMERCIAL VALUE: [High/Medium/Low]
EFFORT TO RANK: [Low/Medium/High]
OPTIMIZATION PRIORITY: [P1/P2/P3/P4]

---

TITLE AUDIT (Current State)
Current Title: [Existing title from HTML]
Character Count: [Length check]
Keyword Present: [Yes/No]
Thai Natural-ness: [✓ Natural / ⚠️ Awkward / ✗ Poor]
Issues: [List problems]

TITLE RECOMMENDATION
Recommended: [New title with keyword]
Character Count: [New length, target 50-60]
Why Better: [Explain improvement]
Thai Natural-ness: [✓ Natural / ⚠️ Needs refinement / ✗ Broken]

---

META DESCRIPTION AUDIT (Current State)
Current Description: [Existing from HTML]
Character Count: [Length check]
Keyword Present: [Yes/No]
CTA Present: [Yes/No]
Differentiator Clear: [Yes/No]
Thai Natural-ness: [✓ Natural / ⚠️ Awkward / ✗ Poor]
Issues: [List problems]

META DESCRIPTION RECOMMENDATION
Recommended: [New description]
Character Count: [New length, target 150-160]
Why Better: [Explain improvement]
Thai Natural-ness: [✓ Natural / ⚠️ Needs refinement / ✗ Broken]

---

H1 ALIGNMENT CHECK
Current H1: [H1 tag text]
Matches Title: [Yes/Partial/No]
Search Intent Match: [✓ Clear / ⚠️ Partial / ✗ Unclear]
Recommendation: [Keep/Update to match title]

---

EXPECTED CTR IMPACT
Current CTR: [GSC data]
Baseline Benchmark (Thai calculators): [Expected CTR range]
Improvement Potential: [X% → Y% estimated]
Ranking Impact: [Position movement estimate]

---
```

---

## BATCH PROCESSING WORKFLOW (Post-GSC)

### Step 1: Extract GSC Data (15 min)
```
- Pull top 100 keywords from GSC
- Filter to Thai language only
- Remove brand/navigational (keep commercial intent)
- Merge duplicates (e.g., "ผ่อนบ้าน" vs "คำนวณผ่อนบ้าน")
- Rank by impressions (proxy for search volume)
```

### Step 2: Assign to Calculators (30 min)
```
For each keyword:
- Map to most relevant calculator URL
- Note if calculator currently ranks for keyword
- Identify position gap (current rank vs #1)
- Flag as "owns keyword" (rank 1-3) vs "opportunity" (rank 4+)
```

### Step 3: Build Optimization Matrix (30 min)
```
Create ranked table:
| Rank | Keyword | Position | Impressions | Commercial Value | Priority | Action |
|---|---|---|---|---|---|---|
| 1 | [top keyword] | [pos] | [imp] | HIGH | P1 | Title+Meta |
| ... | ... | ... | ... | ... | ... | ... |
```

### Step 4: Title/Meta Audit (90 min for top 20)
```
For top 20 keywords in priority order:
- Audit current title & description
- Generate new recommendation
- Validate Thai language quality
- Note expected CTR improvement
- Estimate ranking impact
```

### Step 5: Internal Linking Plan (30 min)
```
For each calculator:
- Identify other calculators to cross-link
- Identify support articles to create links to
- Map link anchor text (use keywords where natural)
- Note bidirectional linking opportunities
```

### Step 6: Report to CEO (30 min)
```
- Top 20 optimization targets with current ranks
- Title/meta recommendations for P1 keywords
- Quick-win list (position 2-5 keywords)
- Internal linking strategy by cluster
- Expected traffic impact estimate
```

**Total Time for Steps 1-6: ~4 hours (08:00-12:00 UTC)**

---

## TITLE RECOMMENDATION QUALITY GATES

### Thai Language Quality Check
- ✅ Grammatically correct Thai
- ✅ Natural word order (not literal English translation)
- ✅ Uses common Thai search terminology
- ✅ Avoids awkward transliterations
- ✅ Respects Thai phonetic conventions

### SEO Quality Check
- ✅ Primary keyword in title
- ✅ Secondary keyword (optional, if natural)
- ✅ 50-60 characters (Thai counts as single char)
- ✅ Unique across all calculator titles
- ✅ Search-intent aligned
- ✅ User benefit clear

### CTR Impact Check
- ✅ Better than competitor titles
- ✅ Clearer than current title
- ✅ More specific than generic alternative
- ✅ Differentiator visible in search result

**Gate Rule:** If any gate fails, revise recommendation before delivery.

---

## META DESCRIPTION QUALITY GATES

### Thai Language Quality Check
- ✅ Grammatically correct Thai
- ✅ Natural phrasing (not keyword-stuffed)
- ✅ Reads naturally in search snippet
- ✅ No awkward punctuation
- ✅ Respects Thai writing conventions

### SEO Quality Check
- ✅ Keyword appears (preferably in first 60 chars)
- ✅ 150-160 characters
- ✅ No competitor-name mentions
- ✅ Clear value proposition
- ✅ Call-to-action present (implicit or explicit)

### Snippet Clarity Check
- ✅ Would stand out in SERP
- ✅ Clearly differentiates from competitors
- ✅ Sets accurate expectations
- ✅ Would earn clicks vs competitors

**Gate Rule:** If any gate fails, revise recommendation before delivery.

---

## EXPECTED OUTPUT FORMAT (For CEO Report)

### Example: Top 5 Recommendations

**Keyword 1: คำนวณผ่อนบ้าน (Mortgage Calculator)**
- Current Rank: #3
- Impressions: 8,500/month
- Current Title: "ผ่อนบ้าน คำนวณ"
- **New Title:** "คำนวณผ่อนบ้าน ดอกเบี้ย ค่างวด 2569" (53 chars)
- **New Description:** "คำนวณผ่อนบ้านแบบรายละเอียด ดูค่าดอกเบี้ย ค่างวด ลดต้น ได้ทันที พร้อมตัวอย่างจำนวนจริง"
- Expected CTR Impact: #3 → #1 (estimated 35% click increase)
- Effort: Low (metadata only)

---

## EXECUTION CHECKLIST (08:00-12:00 UTC)

- [ ] GSC data extracted and validated (08:15 UTC)
- [ ] Keywords assigned to calculators (08:45 UTC)
- [ ] Optimization matrix built (09:15 UTC)
- [ ] CEO first checkpoint (09:30 UTC)
- [ ] Title/meta audit for top 20 (10:30 UTC)
- [ ] Internal linking plan documented (11:00 UTC)
- [ ] CEO second checkpoint (11:15 UTC)
- [ ] Final report compiled (11:45 UTC)
- [ ] CEO final delivery (12:00 UTC)

---

**Template prepared:** 2026-04-26 07:55 UTC  
**Ready for execution:** Upon GSC data arrival (08:00 UTC+)