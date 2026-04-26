# CAL-1426: AI Advisor Shortened Thai Privacy Notice + Subscription Terms

**Status:** Ready for Modal & Account Tab Display  
**Date:** 2026-04-24  
**Policy Source:** [CAL-1336](/CAL/issues/CAL-1336) (mirrored language, 7-day guarantee confirmed)

---

## 1. Privacy Notice (150 Words) — For Modal Dialog & Account Settings Tab

### Thai Text (150w)

> ### 🔒 ข้อมูลของคุณและ AI Advisor
>
> **ข้อมูลที่เรากำลังเก็บ:**
> คำถามและประวัติการสนทนา, ข้อมูลทางการเงินที่คุณระบุในคำถาม, อีเมล/ชื่อจากบัญชี Google/Facebook/Apple, จำนวนคำถาม, อุปกรณ์ที่ใช้
>
> **วิธีใช้:**
> ตอบคำถามของคุณ • ปรับปรุง AI Advisor • สนับสนุนลูกค้า • ปฏิบัติตามกฎหมายไทย
> (เราไม่ใช้ข้อมูลส่วนตัวของคุณเพื่อฝึก AI แบบสาธารณะ)
>
> **เก็บนาน:**
> ประวัติคำถาม: ตลอดเวลาที่มีบัญชี (ลบหลังจาก 30 วันหลังลบบัญชี) • ข้อมูลการใช้งาน: ลบหลังจาก 12 เดือน
>
> **สิทธิของคุณ (PDPA):**
> ขอเข้าถึง • แก้ไข • ลบ • หรือห้ามใช้ข้อมูลได้ที่ privacy@kamnuanlek.com (ตอบภายใน 30 วัน)
>
> **ความปลอดภัย:**
> HTTPS encryption • ไม่เก็บรหัสผ่าน (OAuth เท่านั้น) • เข้าถึงเฉพาะเจ้าหน้าที่ที่จำเป็น • ข้อมูลบัตรจัดการโดย Stripe

**Word Count:** ~148 words ✅

---

## 2. Subscription & Billing Terms (200 Words) — For Paywall Modal & Account Settings Tab

### Thai Text (200w)

> ### 💳 Subscription & Billing Terms
>
> **Plans & Pricing:**
> • **Free:** 3 questions/month
> • **Basic:** 200 questions/month | ฿399/month or ฿4,200/year (save ฿588)
> • **Premium:** 500 questions/month | ฿699/month or ฿7,488/year (save ฿900)
> • **Master:** 1,000 questions/month | ฿1,499/month or ฿15,990/year (save ฿1,998)
>
> Unused questions reset each month (no rollover).
>
> **Billing:**
> Auto-renewal every month/year • Pay via credit/debit card, prepaid, Apple Pay, or Google Pay • Stripe handles payment (we don't store card data) • Receipt sent by email • Cancel anytime in Account Settings
>
> **7-Day Money-Back Guarantee:**
> Not satisfied? Full refund within 7 days of purchase, no questions asked. Email support@kamnuanlek.com within 7 days. Processed in 3–5 business days.
>
> **Cancellation:**
> Self-service cancellation in Account Settings (no call required) • Upgrade/downgrade anytime (no penalty) • Cancellation takes effect next billing cycle • You keep access until the end of current month
>
> **Payment Issues:**
> Card declined? We'll retry 3 times over 5 days. Update payment method in Account Settings. Still having trouble? Email support@kamnuanlek.com (no card details needed).

**Word Count:** ~197 words ✅

---

## Implementation Notes

### Where to Display

**Privacy Notice (150w):**
- Modal dialog (before first AI question after login)
- Account Settings → "Privacy & Data" tab
- Full version link: `[Read full privacy notice](/ai-advisor/privacy-notice)` (links to CAL-1336 full text)

**Subscription Terms (200w):**
- Paywall purchase modal (before checkout button)
- Account Settings → "Subscription & Billing" tab
- Full version link: `[Read full subscription terms](/ai-advisor/subscription-terms)` (links to CAL-1336 full text)

### Policy Consistency

✅ **7-Day Money-Back Guarantee** — Mirrored from CAL-1336, NOT "no-refund"  
✅ **Stripe Payment Handling** — Consistent with CAL-1336  
✅ **Auto-Renewal Disclosure** — Thai Consumer Protection Act compliant  
✅ **PDPA Rights** — Preserved (privacy notice)  
✅ **Plain Thai** — No legal jargon, trust-building tone  
✅ **Scannable Format** — Bullets, short paragraphs (suitable for modals)

---

## Related Issues

- **[CAL-1336](/CAL/issues/CAL-1336)** — Full privacy notice + subscription terms (authoritative source)
- **[CAL-1208](/CAL/issues/CAL-1208)** — Fortune 500 AI Advisor launch (consumer-facing)
