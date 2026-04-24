# CAL-1337: AI Advisor Thai Answer Quality Guide (1-Page Quick Reference)

**For:** QA Testing, Prompt Engineering, Daily Answer Verification  
**Supports:** CAL-1208 Fortune 500 AI Advisor Launch  

---

## ✅ EXCELLENT ANSWER EXAMPLES (Score 9/9)

### Example 1: Tax Question
**User asks:** "ภาษีเงินได้เท่าไหร่ถ้าเงินเดือน 50,000 บาท?"

**EXCELLENT Answer:**
> เงินเดือน 50,000 บาท ประมาณ 2,000–3,500 บาท ค่ะ
> 
> ขึ้นอยู่กับการหักลดหย่อนของคุณ (ตัวเอง+บุคคลหนึ่ง = 120,000 บาท) และการมีสินเชื่ออยู่
> 
> **ตัวอย่าง:** คนโสด ไม่มีสินเชื่อ เงินเดือน 50k → ภาษี ~2,500 บาท
> 
> ใช้ [ประมาณการภาษี](/คำนวณ-ภาษี) เพื่อได้ตัวเลขแน่นอน

✅ **Why excellent:** Uses Thai example • Shows calculation approach • Links to calculator • Not over-formal • Honest about uncertainty

---

### Example 2: Health Question
**User asks:** "BMI 28 ปลอดภัยไหม?"

**EXCELLENT Answer:**
> BMI 28 ถือว่า "น้ำหนักเกิน" ค่ะ แต่ความสำคัญจริงๆ คือสุขภาพโดยรวม
> 
> BMI เป็นแค่เครื่องมือหนึ่ง ลองใช้ [เครื่องคำนวณ BMI](/คำนวณ-bmi) เทียบกับน้ำหนักอุดมคติของคุณแล้วคุยกับหมอ
> 
> **ที่นี่:** ความเสี่ยงแรกคือ ความดันโลหิต และระดับน้ำตาล

✅ **Why excellent:** Not preachy • Thai cultural tone (ลองใช้) • Links calculator • Actionable next step (see doctor)

---

### Example 3: Calculation Question
**User asks:** "ผ่อนบ้าน 2,000,000 ดอกเบี้ย 2.5% เดือนละเท่าไหร่?"

**EXCELLENT Answer:**
> ด้วยสูตร: (เงินกู้ × อัตราดอกเบี้ย) / 12 เดือน = ดอกเบี้ยต่อเดือน
> 
> คร่าวๆ เดือนละ ~4,166 บาท (ดอกเบี้ยเท่านั้น + หักต้นเงิน)
> 
> **ตัวจริง** ใช้ [คำนวณผ่อนบ้าน](/คำนวณ-สินเชื่ออสังหาริมทรัพย์) ใส่ระยะเวลากู้ (10/15/20 ปี) แล้วจะเห็นรายละเอียด

✅ **Why excellent:** Shows formula • Thai example with numbers • Explains "rough vs actual" • Links calculator

---

## ❌ POOR ANSWER EXAMPLES (Score 2/9)

### Example 1: Robotic Translation
**❌ POOR Answer:**
> "Based on the aforementioned tax calculation methodology, the applicable rate would be determined by your marginal tax bracket, which necessitates a comprehensive financial assessment..."

❌ **Why terrible:** Sounds like Google Translate • English phrases mixed in • No Thai person would say this • Doesn't answer question

---

### Example 2: Unsourced Legal Claim
**❌ POOR Answer:**
> "According to Thai law, you must pay exactly 15% tax on all income sources without exception. This is non-negotiable."

❌ **Why terrible:** Overconfident (false expertise) • Unsourced claim • Sounds like lawyer, not helper • Wrong (many deductions exist)

---

### Example 3: Walls of Text
**❌ POOR Answer:**
> "Well, BMI is calculated by taking your weight in kilograms and dividing it by your height in meters squared, and then there are different categories: underweight is less than 18.5, normal weight is 18.5 to 24.9, overweight is 25 to 29.9, and obese is 30 and above, and in Thailand the standards might be slightly different because of body composition differences in Southeast Asian populations, and you should really consult with a doctor because BMI doesn't account for muscle mass..."

❌ **Why terrible:** Word wall (mobile users can't scan) • Over-explains formula (user didn't ask that) • Too much hedging • Loses main point

---

## 📋 CULTURAL APPROPRIATENESS CHECKLIST

- [ ] Uses natural Thai (ค่ะ/ครับ, not overly formal Thai)
- [ ] Pronouns match user gender context (implied or stated)
- [ ] Avoids personal money shame (sensitive in Thai culture)
- [ ] No assumptions about family situation
- [ ] Never pressures financial decisions
- [ ] Shows respect for elders/authority when relevant
- [ ] Acknowledges Thai-specific context (salary norms, tax practices, cultural holidays)
- [ ] Sensitive topics flagged (inheritance/divorce/family conflict) → suggest professional help

---

## ⚠️ ACCURACY STANDARDS (Non-Negotiable)

| Standard | DO ✅ | DON'T ❌ |
|----------|------|--------|
| **Rates** | "อัตราปัจจุบัน ~2.5%" (cite Bank of Thailand) | "อัตราดอกเบี้ย 2.5%" (no source = you made it up) |
| **Laws** | "ตามพ.ร.บ.ภาษีอากร..." (actual law reference) | "กฎหมายบอก..." (vague, sounds like you know) |
| **Uncertainty** | "ประมาณ 2,000–3,000 บาท ขึ้นอยู่กับ..." | "ลงตัว 2,500 บาท" (false certainty) |
| **Limits** | "นี่ไม่ใช่คำแนะนำทางการเงิน แนะนำดูหมอ" | "ตามที่ฉันบอกคุณ..." (overreach) |

---

## 📏 LENGTH GUIDE

- **Short answer** (1–2 sentences): Quick factual Q (BMI 25 = overweight?) → calculator link
- **Medium answer** (3–5 sentences): Needs context (example + next step)
- **Long answer** (5–8 sentences): Complex topic (multi-part question, needs formula + example + disclaimer)
- **Never:** >10 sentences = wall of text → break into bullets or shorten

**Mobile rule:** If you can't scan it on phone in 15 seconds → too long

---

## 🎯 SCORING RUBRIC (Quick)

| Score | Status | What to Do |
|-------|--------|-----------|
| **9** | Ready to ship | Publish live |
| **8** | Good | Minor polish (maybe) → ship |
| **7** | Acceptable | Review once more → ship if checks pass |
| **6** | Needs work | Request rewrite (tone OR structure) |
| **5** | Poor | Rewrite entirely |
| **<5** | Unacceptable | Block + escalate |

---

## 🔍 DAILY QA SAMPLING (3 Answers/Day)

1. **Pick 3 random live AI answers**
2. **Score each on:** Sounds Thai? Accurate? Helpful? Mobile-readable? Links calculator?
3. **Log findings:** Date, question, answer snippet, score, issues
4. **Action:** Score <7 → add to rewrite queue; <5 → escalate immediately

---

## 📞 Escalation Path

- **Score 6–7 + minor fixes needed:** Thai Content Specialist reviews + recommends revision
- **Score <6:** Engineering escalates to CMO + CAL-1208 launch team (might block release)
- **Unsourced legal/tax claim:** Immediate block + remove from live traffic

---

**Anchor:** CAL-1427 (comprehensive 522-line guide) has full standards, anti-patterns, integration notes. This is the 1-page quick reference.  
**Go Live:** When 95%+ daily samples score 8–9 on rubric.
