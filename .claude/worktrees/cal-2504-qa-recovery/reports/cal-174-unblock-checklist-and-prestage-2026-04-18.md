# CAL-174 Unblock Checklist + Pre-Staged Execution Pack (2026-04-18)

Issue: [CAL-174](/CAL/issues/CAL-174)  
Dependency reference: [CAL-172](/CAL/issues/CAL-172)

## A) CAL-172 Evidence-Gate Checklist (Single Source)

Required gate fields and currently known source references:

1. **Before leak proof**  
Status: `available`  
Source: [CAL-172 comment 642d293e](/CAL/issues/CAL-172#comment-642d293e-b932-431f-b7e5-435a7ed6637d), attachment `069eeb7c-48ba-46ee-bc1b-dd641a70a754` (`cal172-before-home-board.png`)

2. **After hotfix proof (same surfaces)**  
Status: `available`  
Source attachments on [CAL-172](/CAL/issues/CAL-172):  
- `64947c7b-725e-4a10-aab8-36c0bfc8bfa1` (`cal172-after-home-kamnuanlek.png`)  
- `4ba1d765-3f15-4816-9433-95251a4be9e8` (`cal172-after-home-railway.png`)

3. **Hotfix evidence report artifact**  
Status: `available`  
Source attachment: `71acfa79-1dca-4b4d-a68f-4f908c1d4bb6` (`cal172-hotfix-evidence-2026-04-16-ict.md`)

4. **Incident affected URL scope (5 URLs)**  
Status: `available`  
Source: [CAL-174 evidence thread](/CAL/issues/CAL-174#comment-c01dcf6b-ba8a-46c6-bf10-c8a38216135b)

5. **Leak marker scope (`Last updated:`, `Methodology note:`)**  
Status: `available`  
Source: [CAL-172 comment 642d293e](/CAL/issues/CAL-172#comment-642d293e-b932-431f-b7e5-435a7ed6637d)

## B) Pre-Staged Action Pack (Execute Immediately on Evidence Receipt)

### B1) Removal/deindex submission packet

| Target URL | Removal Request ID | Submitted At (ICT) | Status | Error Payload |
|---|---|---|---|---|
| URL #1 (homepage) | `pending` | `pending` | `pending` | `n/a` |
| URL #2 (car-loan calc) | `pending` | `pending` | `pending` | `n/a` |
| URL #3 (mortgage calc) | `pending` | `pending` | `pending` | `n/a` |
| URL #4 (VAT calc) | `pending` | `pending` | `pending` | `n/a` |
| URL #5 (PIT calc) | `pending` | `pending` | `pending` | `n/a` |

### B2) Query mapping packet

| Query / Snippet Signature | Mapped URL | Request ID | Submitted At (ICT) | Status |
|---|---|---|---|---|
| `site:... "Methodology note"` | `pending` | `pending` | `pending` | `pending` |
| `site:... "Last updated" "2026-04-15"` | `pending` | `pending` | `pending` | `pending` |

### B3) Recrawl + verification packet

| Action | Target | Request ID / Ref | Submitted At (ICT) | Status |
|---|---|---|---|---|
| Sitemap resubmission | affected property sitemap | `pending` | `pending` | `pending` |
| URL Inspection recrawl | same 5 URLs | `pending` | `pending` | `pending` |
| SERP verification check | before/after query screenshots | `pending` | `pending` | `pending` |
| Cache verification check | cache URL proofs | `pending` | `pending` | `pending` |

## C) 30-Minute Reconciliation Checkpoint Template

1. IDs received: `yes/no`
2. Mapping completeness: `x/y requests mapped`
3. Failed requests: `count + error payloads`
4. SERP/cache delta: `before vs after summary`
5. Residual risk list: `open/closed`

## D) Current Blocker

Still missing from board/founder:
- Authenticated GSC request IDs
- ICT timestamps
- URL/query mapping and any rejection/error payloads
