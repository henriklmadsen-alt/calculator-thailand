/**
 * Affiliate partner configuration.
 *
 * PLACEHOLDER — real partner URLs will be wired in when CMO delivers CAL-796 partner details.
 * To add a partner: append an entry here; the /go/[slug] redirect page is auto-generated at build.
 */

export type AffiliateCategory =
  | 'car-loan'
  | 'home-loan'
  | 'personal-loan'
  | 'credit-card'
  | 'insurance'
  | 'investment'
  | 'savings';

export interface AffiliatePartner {
  /** URL-safe slug used in /go/[slug] */
  slug: string;
  /** Display name shown in the CTA card */
  partnerName: string;
  /** The actual destination URL (affiliate link). Replace placeholder before going live. */
  targetUrl: string;
  /** AffiliateCard category — drives the icon and headline */
  category: AffiliateCategory;
  /** Primary CTA button text */
  ctaText: string;
  /** Optional sub-headline below the main headline */
  subtext?: string;
}

/**
 * All registered affiliate partners.
 * Keyed by slug for fast lookup.
 */
export const AFFILIATE_PARTNERS: Record<string, AffiliatePartner> = {
  'rabbit-care-loan': {
    slug: 'rabbit-care-loan',
    partnerName: 'Rabbit Care',
    targetUrl: 'https://www.rabbit.co.th/th/loan/personal-loan',
    category: 'personal-loan',
    ctaText: 'เปรียบเทียบสินเชื่อฟรี',
    subtext: 'เปรียบเทียบข้อเสนอจากหลายธนาคารใน 3 นาที',
  },
  'rabbit-care-car': {
    slug: 'rabbit-care-car',
    partnerName: 'Rabbit Care',
    targetUrl: 'https://www.rabbit.co.th/th/loan/car-loan',
    category: 'car-loan',
    ctaText: 'เปรียบเทียบสินเชื่อรถฟรี',
    subtext: 'ดูดอกเบี้ยและเงื่อนไขจากหลายบริษัทเช่าซื้อ',
  },
  'rabbit-care-home': {
    slug: 'rabbit-care-home',
    partnerName: 'Rabbit Care',
    targetUrl: 'https://www.rabbit.co.th/th/loan/home-loan',
    category: 'home-loan',
    ctaText: 'เปรียบเทียบสินเชื่อบ้านฟรี',
    subtext: 'ดูดอกเบี้ยจากหลายธนาคาร ไม่มีค่าใช้จ่าย',
  },
  'rabbit-care-insurance': {
    slug: 'rabbit-care-insurance',
    partnerName: 'Rabbit Care',
    targetUrl: 'https://www.rabbit.co.th/th/life-insurance',
    category: 'insurance',
    ctaText: 'เปรียบเทียบแผนประกันฟรี',
    subtext: 'ดูเบี้ยจากหลายบริษัทใน 2 นาที',
  },
  'kasikorn-savings': {
    slug: 'kasikorn-savings',
    partnerName: 'KBank',
    targetUrl: 'https://www.kasikornbank.com/th/personal/saving/pages/saving.aspx',
    category: 'investment',
    ctaText: 'ดูอัตราดอกเบี้ยประจำวันนี้',
    subtext: 'เปรียบเทียบเงินฝากประจำและออมทรัพย์',
  },

  // ─── ACCESSTRADE Thailand campaigns ───────────────────────────────────────
  // PLACEHOLDER: targetUrl will be replaced with real ACCESSTRADE tracking URLs
  // once Board completes signup + CMO delivers campaign links (CAL-897).
  // URL format: https://[at-tracking-domain]/[campaign-id]?sub_id=[page-slug]
  'ttb-cash2go': {
    slug: 'ttb-cash2go',
    partnerName: 'TTB Cash 2 Go',
    targetUrl: 'https://accesstrade.in.th', // PLACEHOLDER — replace with real ACCESSTRADE URL
    category: 'personal-loan',
    ctaText: 'สมัครสินเชื่อ TTB Cash 2 Go',
    subtext: 'วงเงินสูง อนุมัติเร็ว ดอกเบี้ยคงที่',
  },
  'ktc-brother-berm': {
    slug: 'ktc-brother-berm',
    partnerName: 'KTC Brother Berm',
    targetUrl: 'https://accesstrade.in.th', // PLACEHOLDER — replace with real ACCESSTRADE URL
    category: 'car-loan',
    ctaText: 'สมัครสินเชื่อรถ KTC Brother Berm',
    subtext: 'สินเชื่อรถใหม่และรถมือสอง ดอกเบี้ยพิเศษ',
  },
  'ngern-tid-lor': {
    slug: 'ngern-tid-lor',
    partnerName: 'เงินติดล้อ',
    targetUrl: 'https://accesstrade.in.th', // PLACEHOLDER — replace with real ACCESSTRADE URL
    category: 'car-loan',
    ctaText: 'สมัครสินเชื่อเงินติดล้อ',
    subtext: 'ใช้รถเป็นหลักประกัน ไม่ต้องโอนเล่มทะเบียน',
  },
  'tipinsure': {
    slug: 'tipinsure',
    partnerName: 'TIPINSURE',
    targetUrl: 'https://accesstrade.in.th', // PLACEHOLDER — replace with real ACCESSTRADE URL
    category: 'insurance',
    ctaText: 'เปรียบเทียบประกันรถผ่าน TIPINSURE',
    subtext: 'เปรียบเทียบแผนประกันรถจากหลายบริษัท',
  },
  'uob-tmrw': {
    slug: 'uob-tmrw',
    partnerName: 'UOB TMRW',
    targetUrl: 'https://accesstrade.in.th', // PLACEHOLDER — replace with real ACCESSTRADE URL
    category: 'credit-card',
    ctaText: 'สมัครบัตร UOB TMRW',
    subtext: 'บัตรเครดิตดิจิทัล สิทธิพิเศษมากมาย',
  },
  'krungsri-signature': {
    slug: 'krungsri-signature',
    partnerName: 'บัตร Krungsri',
    targetUrl: 'https://accesstrade.in.th', // PLACEHOLDER — replace with real ACCESSTRADE URL
    category: 'credit-card',
    ctaText: 'สมัครบัตรเครดิต Krungsri',
    subtext: 'สิทธิประโยชน์ครบ เงินคืนทุกการใช้จ่าย',
  },
  'kept-krungsri': {
    slug: 'kept-krungsri',
    partnerName: 'Kept by Krungsri',
    targetUrl: 'https://accesstrade.in.th', // PLACEHOLDER — replace with real ACCESSTRADE URL
    category: 'savings',
    ctaText: 'เปิดบัญชี Kept by Krungsri',
    subtext: 'ดอกเบี้ยสูงกว่าออมทรัพย์ทั่วไป ถอนได้ทุกวัน',
  },

  // ─── Involve Asia campaigns ────────────────────────────────────────────────
  // PLACEHOLDER: targetUrl will be replaced with real Involve Asia tracking URL
  // once Board completes signup + CMO delivers Rabbit Care CPL link (CAL-897).
  'rabbit-care-health-cpl': {
    slug: 'rabbit-care-health-cpl',
    partnerName: 'Rabbit Care',
    targetUrl: 'https://app.involve.asia', // PLACEHOLDER — replace with real Involve Asia URL
    category: 'insurance',
    ctaText: 'เปรียบเทียบประกันสุขภาพฟรี',
    subtext: 'รับใบเสนอราคาจากหลายบริษัทภายใน 2 นาที',
  },
};

/**
 * Maps calculator page paths to affiliate partner slugs.
 * Used to determine which affiliate card to show on each calculator page.
 */
export const CALCULATOR_AFFILIATE_MAP: Record<string, string> = {
  // Existing live partners
  '/คำนวณผ่อนกู้/': 'rabbit-care-loan',
  '/คำนวณผ่อนรถ/': 'rabbit-care-car',
  '/คำนวณผ่อนบ้าน/': 'rabbit-care-home',
  '/คำนวณประกันชีวิต/': 'rabbit-care-insurance',
  '/คำนวณดอกเบี้ยเงินฝาก/': 'kasikorn-savings',

  // ACCESSTRADE — personal loan (TTB Cash 2 Go)
  '/คำนวณผ่อนสินเชื่อส่วนบุคคล/': 'ttb-cash2go',
  '/คำนวณสินเชื่อฉุกเฉิน/': 'ttb-cash2go',
  '/คำนวณ-apr/': 'ttb-cash2go',

  // ACCESSTRADE — auto loan (KTC Brother Berm primary, Ngern Tid Lor secondary)
  '/คำนวณค่างวดสินเชื่อรถ/': 'ktc-brother-berm',

  // ACCESSTRADE — credit card (UOB TMRW primary)
  '/คำนวณดอกเบี้ยบัตรเครดิต/': 'uob-tmrw',
  '/คำนวณค่างวดบัตรเครดิต/': 'uob-tmrw',
  '/คำนวณอัตราการใช้วงเงินบัตรเครดิต/': 'uob-tmrw',

  // ACCESSTRADE — motor insurance (TIPINSURE)
  '/คำนวณเบี้ยประกันรถยนต์/': 'tipinsure',
  '/คำนวณค่าประกันรถยนต์/': 'tipinsure',
  '/คำนวณ-deductible-ประกันรถ/': 'tipinsure',
  '/คำนวณประกันรถพาณิชย์/': 'tipinsure',

  // Involve Asia — health/medical (Rabbit Care CPL)
  '/คำนวณเบี้ยประกันสุขภาพ/': 'rabbit-care-health-cpl',
  '/คำนวณเบี้ยประกันสุขภาพ-รายบุคคล/': 'rabbit-care-health-cpl',
  '/คำนวณเบี้ยประกันสุขภาพผู้สูงอายุ/': 'rabbit-care-health-cpl',
  '/คำนวณประกันสุขภาพครอบครัว/': 'rabbit-care-health-cpl',

  // ACCESSTRADE — savings (Kept by Krungsri)
  '/คำนวณดอกเบี้ยเงินฝากประจำ/': 'kept-krungsri',
};
