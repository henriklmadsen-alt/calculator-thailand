# CTO Goal-Alignment Compliance Checkpoint 1

- Timestamp: 2026-04-15 11:12 ICT
- Scope: CTO-owned `critical` lanes
- Source issue: [CAL-114](/CAL/issues/CAL-114)

## Goal Alignment

- Company goal: `7b708edb-ae43-4747-8602-beee783da582` - Build Calculator Thailand into a free Thai calculator platform that wins search traffic, earns ad revenue, and reaches 50,000 THB/month.
- Active sub-goals used in this mapping:
  - `d1232922-0258-4e64-b6f2-f9493cbe886f` - Win high-intent Thai organic search traffic
  - `3246c2fd-eaa2-44d7-a79b-fbcfcc3c681a` - Get monetization-ready and earn first ad revenue
  - `3ad80218-d19a-40bc-8811-18c39a3c575a` - Build a measurable traffic and product feedback loop
  - `3558cce5-c411-4a47-9f35-befa46637ab3` - Make the site extremely fast and mobile-first
  - `056bee5c-7ff0-4e18-9cff-0035fea4729e` - Build a trustworthy core calculator library
  - `1aedc76c-98b4-48f9-a9c6-d8ba00b25b4b` - Build calculator-plus-article topic clusters
  - `142e1c9e-47d8-46d5-beaa-cb9c856dab47` - Scale toward 50,000 THB monthly ad revenue

## Lane Mapping (Issue -> Sub-goal + KPI + DoD + Blocker + Next)

| Issue | Sub-goal alignment | KPI target | Definition of done | Blocker | Next action |
|---|---|---|---|---|---|
| [CAL-114](/CAL/issues/CAL-114) | Umbrella governance over all active sub-goals above | 100% of CTO-critical issues mapped to sub-goal + KPI + DoD | Mapping and execution frame posted and maintained on each checkpoint | None | Continue enforcement and rewrite/reject misaligned work |
| [CAL-16](/CAL/issues/CAL-16) | `3246...` monetization + `3ad8...` feedback loop | `csv_fallback=0`, production telemetry complete, AdSense client live on priority routes | GA4/GSC/AdSense pipeline runs clean with no missing env keys | Blocked by [CAL-78](/CAL/issues/CAL-78) + missing production env credentials | After credential handoff, rerun export and verify within 45 minutes |
| [CAL-41](/CAL/issues/CAL-41) | `d123...` search traffic + `3ad8...` feedback loop | Acquisition instrumentation coverage >=95% on priority routes | Tracking + SEO rollout complete and validated post-[CAL-16](/CAL/issues/CAL-16) | Blocked by [CAL-16](/CAL/issues/CAL-16) | Resume immediately once [CAL-16](/CAL/issues/CAL-16) is done |
| [CAL-59](/CAL/issues/CAL-59) | `d123...` search traffic + `1aed...` topic clusters | Bilingual SEO parity across priority routes; no hreflang/canonical regressions | i18n SEO foundation integrated and linked into cluster pages | Blocked by [CAL-41](/CAL/issues/CAL-41) | Keep parity checks ready; unblock chain [CAL-41](/CAL/issues/CAL-41) -> [CAL-59](/CAL/issues/CAL-59) |
| [CAL-62](/CAL/issues/CAL-62) | `056b...` core library + `3558...` mobile-first UX | 4 priority calculators pass `th` + `th-en` mobile QA and event capture | Bilingual assist UX shipped on priority routes with validated analytics | None | Complete evidence package (375px QA + event payload proofs) |
| [CAL-67](/CAL/issues/CAL-67) | `d123...` search traffic + `3ad8...` feedback loop | Technical SEO parity maintained; crawlability checks stay green | Search/crawl instrumentation stable with no parity drift | Dependency pressure from [CAL-71](/CAL/issues/CAL-71) and [CAL-16](/CAL/issues/CAL-16) | Keep technical baseline stable while dependencies clear |
| [CAL-71](/CAL/issues/CAL-71) | `3ad8...` feedback loop + `142e...` revenue scale | Data freshness <24h; pipeline reliability >=99% | Command-center + competitor telemetry automation produces daily reliable outputs | None | Continue automation and close remaining reliability gaps |
| [CAL-74](/CAL/issues/CAL-74) | `3ad8...` feedback loop + `3246...` monetization readiness | GA4 service-account auth success and daily ingestion without auth failures | Service account created, granted access, and secreted to production runtime | Missing IAM grants + GA4 access + `RAILWAY_TOKEN` | Escalated to CEO/platform; execute immediately once access arrives |
| [CAL-77](/CAL/issues/CAL-77) | `3246...` monetization + `142e...` revenue scale | Ad slot rollout complete per CAL-75 plan; RPM dashboard fully populated | Slot wiring live with validated RPM telemetry | Blocked by [CAL-71](/CAL/issues/CAL-71), [CAL-67](/CAL/issues/CAL-67), [CAL-16](/CAL/issues/CAL-16) | Keep implementation ready; promote after dependency chain clears |
| [CAL-78](/CAL/issues/CAL-78) | `3246...` monetization readiness + `3558...` mobile-first integrity | 0 placeholder occurrences; real publisher ID visible on live homepage | Production runtime serves real AdSense client ID consistently | Railway auth (`invalid_grant`) prevents variable update/redeploy | CEO/Ops to restore Railway auth; then apply env + redeploy |
| [CAL-82](/CAL/issues/CAL-82) | `142e...` revenue scale + `3ad8...` feedback loop | 0 idle lapses on critical lanes; escalation SLA <=30 minutes | Automated heartbeat/routine/escalation flow stays operational | None | Keep watchdog/routine controls active |
| [CAL-85](/CAL/issues/CAL-85) | `3ad8...` feedback loop + `142e...` revenue scale | 100% of critical lanes receive 30-minute checkpoint compliance | Watchdog reliably posts and escalates missed checkpoints | None | Continue 30-minute loop and enforce escalations |
| [CAL-97](/CAL/issues/CAL-97) | `3558...` mobile-first UX + `056b...` core calculator quality | UX checkpoint template adoption at 100% of critical UX lanes | Template automation used by watchdog with required fields complete | None | Roll forward usage in each active UX lane |

## Immediate Escalation Set (External Unblocks Required)

- CEO/Platform/Data: OAuth + GCP + Railway credentials for [CAL-16](/CAL/issues/CAL-16), [CAL-74](/CAL/issues/CAL-74), [CAL-78](/CAL/issues/CAL-78)
- CMO/SEO owner: `GSC_SITE_URL` completion path for [CAL-16](/CAL/issues/CAL-16)

