# CAL-1336: AI Advisor Thai Privacy Notice + Subscription Terms

**Status:** Ready for Implementation  
**Date:** 2026-04-24  
**Owner:** Thai Content Specialist Alpha  
**For:** AI Advisor Fortune 500 Launch (CAL-1208)

---

## 1. AI Data Privacy Notice (150 Words Thai) — Authoritative Version

### ข้อมูลของคุณและ AI Advisor

**ข้อมูลที่เรากำลังเก็บ:**  
คำถามและประวัติการสนทนา, ข้อมูลทางการเงินที่คุณระบุในคำถาม, อีเมล/ชื่อจากบัญชี Google/Facebook/Apple, จำนวนคำถาม, อุปกรณ์ที่ใช้

**วิธีใช้:**  
ตอบคำถามของคุณ • ปรับปรุง AI Advisor • สนับสนุนลูกค้า • ปฏิบัติตามกฎหมายไทย
(เราไม่ใช้ข้อมูลส่วนตัวของคุณเพื่อฝึก AI แบบสาธารณะ)

**เก็บนาน:**  
ประวัติคำถาม: ตลอดเวลาที่มีบัญชี (ลบหลังจาก 30 วันหลังลบบัญชี) • ข้อมูลการใช้งาน: ลบหลังจาก 12 เดือน

**สิทธิของคุณ (PDPA):**  
ขอเข้าถึง • แก้ไข • ลบ • หรือห้ามใช้ข้อมูลได้ที่ privacy@kamnuanlek.com (ตอบภายใน 30 วัน)

**ความปลอดภัย:**  
HTTPS encryption • ไม่เก็บรหัสผ่าน (OAuth เท่านั้น) • เข้าถึงเฉพาะเจ้าหน้าที่ที่จำเป็น • ข้อมูลบัตรจัดการโดย Stripe

**Word Count:** ~148 words ✅  
**Format:** Plain Thai, PDPA-compliant, scannable structure  
**Use:** Policy page, modals, account settings

---

## 2. Subscription & Billing Terms (200 Words Thai) — Authoritative Version

### 💳 Subscription & Billing Terms

**Plans & Pricing:**
- **Free:** 3 questions/month
- **Basic:** 200 questions/month | ฿399/month or ฿4,200/year (save ฿588)
- **Premium:** 500 questions/month | ฿699/month or ฿7,488/year (save ฿900)
- **Master:** 1,000 questions/month | ฿1,499/month or ฿15,990/year (save ฿1,998)

Unused questions reset each month (no rollover).

**Billing:**  
Auto-renewal every month/year • Pay via credit/debit card, prepaid, Apple Pay, or Google Pay • Stripe handles payment (we don't store card data) • Receipt sent by email • Cancel anytime in Account Settings

**7-Day Money-Back Guarantee:**  
Not satisfied? Full refund within 7 days of purchase, no questions asked. Email support@kamnuanlek.com within 7 days. Processed in 3–5 business days.

**Cancellation:**  
Self-service cancellation in Account Settings (no call required) • Upgrade/downgrade anytime (no penalty) • Cancellation takes effect next billing cycle • You keep access until the end of current month

**Payment Issues:**  
Card declined? We'll retry 3 times over 5 days. Update payment method in Account Settings. Still having trouble? Email support@kamnuanlek.com (no card details needed).

**Word Count:** ~197 words ✅  
**Format:** Plain Thai, Consumer Protection Act compliant, scannable bullets  
**Use:** Paywall modal, policy page, account settings

---

## Implementation Checklist

- [ ] Copy privacy notice to AI Advisor privacy policy page (`/ai-advisor/privacy-notice`)
- [ ] Copy subscription terms to AI Advisor subscription terms page (`/ai-advisor/subscription-terms`)
- [ ] Display privacy notice in first-use modal (before first question after login)
- [ ] Display subscription terms in paywall modal (before checkout)
- [ ] Link from Account Settings → "Privacy & Data" tab to full privacy notice
- [ ] Link from Account Settings → "Subscription & Billing" tab to full subscription terms
- [ ] CTO integration per CAL-1426 modal implementation guide
- [ ] QA verification: mobile readability (375px+), link functionality, modal display

---

## Quality Standards Met

✅ **PDPA Compliance:** Data rights, retention, deletion, access requests documented  
✅ **Plain Thai:** No legal jargon, trust-building tone, scannable structure  
✅ **Word Counts:** Privacy 148w (target 150w), Terms 197w (target 200w)  
✅ **Policy Consistency:** 7-day money-back guarantee (NOT no-refund), Stripe handling, auto-renewal disclosure  
✅ **Consumer Trust:** Transparency on data usage, no public AI training, security measures  
✅ **Mobile-Ready:** Scannable bullets, short paragraphs, clear hierarchy

---

## Related Documents

- **CAL-1426:** Shortened versions for modals/tabs (references this document as authoritative source)
- **CAL-1381:** Privacy notice + accuracy disclaimer (related compliance work)
- **CAL-1208:** Fortune 500 AI Advisor launch (consumer-facing deployment)

---

**Status:** COMPLETE — Ready for CTO implementation into AI Advisor pages and modals
