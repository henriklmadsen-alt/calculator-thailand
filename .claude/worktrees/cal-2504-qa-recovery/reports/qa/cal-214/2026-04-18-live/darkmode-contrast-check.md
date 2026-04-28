# CAL-214 Dark Mode Contrast QA

Generated at: 2026-04-18T06:05:00.787Z
Base URL: https://calculator-thailand-production.up.railway.app
Theme mode: dark (forced by localStorage key `ct.theme-preference.v1`)

## Summary

- Routes checked: 3
- PASS: 0
- FAIL: 3

## Route Matrix

| Route | Desktop Overflow | Mobile Overflow | Desktop Contrast Failures | Mobile Contrast Failures | Verdict |
| --- | --- | --- | --- | --- | --- |
| / | pass | pass | 20 | 20 | FAIL |
| /คำนวณภาษีเงินได้บุคคลธรรมดา/ | pass | pass | 20 | 20 | FAIL |
| /บทความ/ | pass | pass | 20 | 20 | FAIL |

## /

- Desktop screenshot: `reports/qa/cal-214/2026-04-18-live/screenshots/home-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-214/2026-04-18-live/screenshots/home-mobile-dark.png`
- Desktop text nodes scanned: 164
- Mobile text nodes scanned: 163
- Contrast findings:
  - Desktop ratio 3.04 < 4.5 at `span.text-xs.text-gray-500`
  - Desktop ratio 1.14 < 4.5 at `main.flex-1.max-w-5xl`
  - Desktop ratio 1.14 < 4.5 at `section.mb-8.rounded-2xl`
  - Desktop ratio 1.14 < 3.0 at `h1.text-3xl.font-extrabold`
  - Desktop ratio 2.67 < 4.5 at `p.mt-3.text-base`
  - Desktop ratio 4.10 < 4.5 at `a.mt-4.inline-flex`
  - Desktop ratio 3.40 < 4.5 at `p.mt-1.text-xs`
  - Desktop ratio 2.66 < 4.5 at `div.mt-4.flex`
  - Desktop ratio 3.53 < 4.5 at `p.mt-2.text-xs`
  - Desktop ratio 1.14 < 4.5 at `section.mb-8`
  - Desktop ratio 1.95 < 4.5 at `p.mb-2.text-sm`
  - Desktop ratio 1.14 < 4.5 at `div.flex.gap-2`
  - Desktop ratio 1.14 < 4.5 at `section.mb-12.grid`
  - Desktop ratio 4.41 < 4.5 at `span.absolute.right-4`
  - Desktop ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Desktop ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Desktop ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Desktop ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Desktop ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Desktop ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Mobile ratio 3.04 < 4.5 at `span.text-xs.text-gray-500`
  - Mobile ratio 1.14 < 4.5 at `main.flex-1.max-w-5xl`
  - Mobile ratio 1.14 < 4.5 at `section.mb-8.rounded-2xl`
  - Mobile ratio 1.14 < 3.0 at `h1.text-3xl.font-extrabold`
  - Mobile ratio 2.67 < 4.5 at `p.mt-3.text-base`
  - Mobile ratio 4.10 < 4.5 at `a.mt-4.inline-flex`
  - Mobile ratio 3.40 < 4.5 at `p.mt-1.text-xs`
  - Mobile ratio 2.66 < 4.5 at `div.mt-4.flex`
  - Mobile ratio 3.53 < 4.5 at `p.mt-2.text-xs`
  - Mobile ratio 1.14 < 4.5 at `section.mb-8`
  - Mobile ratio 1.95 < 4.5 at `p.mb-2.text-sm`
  - Mobile ratio 1.14 < 4.5 at `div.flex.gap-2`
  - Mobile ratio 1.14 < 4.5 at `section.mb-12.grid`
  - Mobile ratio 4.41 < 4.5 at `span.absolute.right-4`
  - Mobile ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Mobile ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Mobile ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Mobile ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Mobile ratio 3.35 < 4.5 at `span.absolute.right-4`
  - Mobile ratio 3.35 < 4.5 at `span.absolute.right-4`

## /คำนวณภาษีเงินได้บุคคลธรรมดา/

- Desktop screenshot: `reports/qa/cal-214/2026-04-18-live/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-214/2026-04-18-live/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-mobile-dark.png`
- Desktop text nodes scanned: 191
- Mobile text nodes scanned: 190
- Contrast findings:
  - Desktop ratio 3.04 < 4.5 at `span.text-xs.text-gray-500`
  - Desktop ratio 1.14 < 4.5 at `main.flex-1.max-w-5xl`
  - Desktop ratio 1.14 < 4.5 at `article`
  - Desktop ratio 1.14 < 3.0 at `h1.text-2xl.sm:text-3xl`
  - Desktop ratio 2.67 < 4.5 at `p.text-gray-600.mb-6`
  - Desktop ratio 3.53 < 4.5 at `p.mt-2.text-xs`
  - Desktop ratio 4.41 < 4.5 at `span.lang-assist.block`
  - Desktop ratio 2.54 < 4.5 at `span.text-gray-400.font-normal`
  - Desktop ratio 4.10 < 4.5 at `#tax-submit-btn`
  - Desktop ratio 3.29 < 4.5 at `span.lang-assist.block`
  - Desktop ratio 4.10 < 4.5 at `a.inline-flex.min-h-11`
  - Desktop ratio 1.14 < 4.5 at `section.prose.prose-gray`
  - Desktop ratio 1.14 < 4.5 at `h2.text-xl.font-semibold`
  - Desktop ratio 1.14 < 4.5 at `p`
  - Desktop ratio 1.14 < 4.5 at `h3.text-lg.font-semibold`
  - Desktop ratio 1.96 < 4.5 at `ol.list-decimal.pl-6`
  - Desktop ratio 1.96 < 4.5 at `strong`
  - Desktop ratio 1.96 < 4.5 at `strong`
  - Desktop ratio 1.96 < 4.5 at `li`
  - Desktop ratio 1.96 < 4.5 at `strong`
  - Mobile ratio 3.04 < 4.5 at `span.text-xs.text-gray-500`
  - Mobile ratio 1.14 < 4.5 at `main.flex-1.max-w-5xl`
  - Mobile ratio 1.14 < 4.5 at `article`
  - Mobile ratio 1.14 < 3.0 at `h1.text-2xl.sm:text-3xl`
  - Mobile ratio 2.67 < 4.5 at `p.text-gray-600.mb-6`
  - Mobile ratio 3.53 < 4.5 at `p.mt-2.text-xs`
  - Mobile ratio 4.41 < 4.5 at `span.lang-assist.block`
  - Mobile ratio 2.54 < 4.5 at `span.text-gray-400.font-normal`
  - Mobile ratio 4.10 < 4.5 at `#tax-submit-btn`
  - Mobile ratio 3.29 < 4.5 at `span.lang-assist.block`
  - Mobile ratio 4.10 < 4.5 at `a.inline-flex.min-h-11`
  - Mobile ratio 1.14 < 4.5 at `section.prose.prose-gray`
  - Mobile ratio 1.14 < 4.5 at `h2.text-xl.font-semibold`
  - Mobile ratio 1.14 < 4.5 at `p`
  - Mobile ratio 1.14 < 4.5 at `h3.text-lg.font-semibold`
  - Mobile ratio 1.96 < 4.5 at `ol.list-decimal.pl-6`
  - Mobile ratio 1.96 < 4.5 at `strong`
  - Mobile ratio 1.96 < 4.5 at `strong`
  - Mobile ratio 1.96 < 4.5 at `li`
  - Mobile ratio 1.96 < 4.5 at `strong`

## /บทความ/

- Desktop screenshot: `reports/qa/cal-214/2026-04-18-live/screenshots/บทความ-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-214/2026-04-18-live/screenshots/บทความ-mobile-dark.png`
- Desktop text nodes scanned: 179
- Mobile text nodes scanned: 178
- Contrast findings:
  - Desktop ratio 3.04 < 4.5 at `span.text-xs.text-gray-500`
  - Desktop ratio 1.14 < 4.5 at `main.flex-1.max-w-5xl`
  - Desktop ratio 1.14 < 3.0 at `h1.mb-2.text-2xl`
  - Desktop ratio 2.67 < 4.5 at `p.mb-8.text-gray-600`
  - Desktop ratio 1.14 < 4.5 at `div.space-y-6`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Desktop ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 3.04 < 4.5 at `span.text-xs.text-gray-500`
  - Mobile ratio 1.14 < 4.5 at `main.flex-1.max-w-5xl`
  - Mobile ratio 1.14 < 3.0 at `h1.mb-2.text-2xl`
  - Mobile ratio 2.67 < 4.5 at `p.mb-8.text-gray-600`
  - Mobile ratio 1.14 < 4.5 at `div.space-y-6`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`
  - Mobile ratio 2.54 < 4.5 at `time.text-xs.text-gray-400`

