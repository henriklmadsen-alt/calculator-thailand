# CAL-172 P0 Hotfix Evidence Pack

Timestamp: 2026-04-16 22:21:15 ICT

## 1) Root Cause
- Internal QA/editorial note content (Last updated + Methodology note) had previously been exposed in public page output because it was rendered in page templates without a permanent publish-time guard.

## 2) Permanent Guardrail
- Build pipeline now enforces verify-public-content after static build.
- Guardrail scans:
  - source templates (src/pages, src/components, src/layouts) for internal-note markers
  - built output (dist/*.html) for rendered leak markers
- Updated files:
  - package.json
  - scripts/verify-public-content.mjs

## 3) Production Deploy Metadata
- Railway service: calculator-thailand
- Deployment ID serving live checks: d831d782-87c6-41ba-996e-6f4ae6eb5943
- Deployment instance ID (kamnuanlek check): 833da762-5b9b-4e7f-856c-8c53b024e3d1
- Correlated request IDs:
  - www.kamnuanlek.com -> yimGPxYjQFm2u-_vVOLIQQ
  - calculator-thailand-production.up.railway.app -> bpPMVxPtRt6RRbOf0ubPiw

## 4) Before/After Proof
- Before (board-reported leak screenshot): reports/cal172-before-home-board.png
- After (kamnuanlek homepage): reports/cal172-after-home-kamnuanlek.png
- After (railway homepage): reports/cal172-after-home-railway.png

## 5) Live Verification Matrix
| Domain | Page | HTTP | H1 Present | Leak Marker Present |
|---|---|---:|---:|---:|
| https://www.kamnuanlek.com | homepage | 200 | True | False |
| https://www.kamnuanlek.com | calculator_credit_card_interest | 200 | True | False |
| https://www.kamnuanlek.com | article_credit_card_interest | 200 | True | False |
| https://www.kamnuanlek.com | calculator_vehicle | 200 | True | False |
| https://www.kamnuanlek.com | calculator_vat | 200 | True | False |
| https://www.kamnuanlek.com | calculator_pit | 200 | True | False |
| https://calculator-thailand-production.up.railway.app | homepage | 200 | True | False |
| https://calculator-thailand-production.up.railway.app | calculator_credit_card_interest | 200 | True | False |
| https://calculator-thailand-production.up.railway.app | article_credit_card_interest | 200 | True | False |
| https://calculator-thailand-production.up.railway.app | calculator_vehicle | 200 | True | False |
| https://calculator-thailand-production.up.railway.app | calculator_vat | 200 | True | False |
| https://calculator-thailand-production.up.railway.app | calculator_pit | 200 | True | False |

## 6) Canonical + OG Domain State
- kamnuanlek canonical: https://www.kamnuanlek.com/
- railway canonical: https://www.kamnuanlek.com/
- kamnuanlek og:url: https://www.kamnuanlek.com/
- railway og:url: https://www.kamnuanlek.com/

## 7) Regression Result
- Homepage template check: pass (200, no leak marker)
- Calculator template checks: pass (sampled multiple calculators, 200, no leak marker)
- Article template check: pass (sampled credit-card article route, 200, no leak marker)
