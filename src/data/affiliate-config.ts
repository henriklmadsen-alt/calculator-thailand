/**
 * Affiliate partner configuration.
 *
 * AFFILIATE URLs ARE READ FROM ENVIRONMENT VARIABLES — see .env.example
 * This prevents accidental commits of partner URLs and allows board to update links without a code deploy.
 * To add a partner: append an entry here; the /go/[slug] redirect page is auto-generated at build.
 *
 * Environment variables (AFFILIATE_URL_*) are documented in .env.example and should be set in:
 * - Local dev: .env.local
 * - Railway production: Railway dashboard Variables section
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
  // Real ACCESSTRADE tracking URLs are read from AFFILIATE_URL_* environment variables.
  // See .env.example for configuration. Once Board completes signup + CMO delivers
  // campaign links (CAL-897), set these in Railway dashboard or .env.local.
  // URL format: https://[at-tracking-domain]/[campaign-id]?sub_id=[page-slug]
  'ttb-cash2go': {
    slug: 'ttb-cash2go',
    partnerName: 'TTB Cash 2 Go',
    targetUrl: import.meta.env.AFFILIATE_URL_TTB_CASH2GO || 'https://accesstrade.in.th',
    category: 'personal-loan',
    ctaText: 'สมัครสินเชื่อ TTB Cash 2 Go',
    subtext: 'วงเงินสูง อนุมัติเร็ว ดอกเบี้ยคงที่',
  },
  'ktc-brother-berm': {
    slug: 'ktc-brother-berm',
    partnerName: 'KTC Brother Berm',
    targetUrl: import.meta.env.AFFILIATE_URL_KTC_BROTHER_BERM || 'https://accesstrade.in.th',
    category: 'car-loan',
    ctaText: 'สมัครสินเชื่อรถ KTC Brother Berm',
    subtext: 'สินเชื่อรถใหม่และรถมือสอง ดอกเบี้ยพิเศษ',
  },
  'ngern-tid-lor': {
    slug: 'ngern-tid-lor',
    partnerName: 'เงินติดล้อ',
    targetUrl: import.meta.env.AFFILIATE_URL_NGERN_TID_LOR || 'https://accesstrade.in.th',
    category: 'car-loan',
    ctaText: 'สมัครสินเชื่อเงินติดล้อ',
    subtext: 'ใช้รถเป็นหลักประกัน ไม่ต้องโอนเล่มทะเบียน',
  },
  'tipinsure': {
    slug: 'tipinsure',
    partnerName: 'TIPINSURE',
    targetUrl: import.meta.env.AFFILIATE_URL_TIPINSURE || 'https://accesstrade.in.th',
    category: 'insurance',
    ctaText: 'เปรียบเทียบประกันรถผ่าน TIPINSURE',
    subtext: 'เปรียบเทียบแผนประกันรถจากหลายบริษัท',
  },
  'uob-tmrw': {
    slug: 'uob-tmrw',
    partnerName: 'UOB TMRW',
    targetUrl: import.meta.env.AFFILIATE_URL_UOB_TMRW || 'https://accesstrade.in.th',
    category: 'credit-card',
    ctaText: 'สมัครบัตร UOB TMRW',
    subtext: 'บัตรเครดิตดิจิทัล สิทธิพิเศษมากมาย',
  },
  'krungsri-signature': {
    slug: 'krungsri-signature',
    partnerName: 'บัตร Krungsri',
    targetUrl: import.meta.env.AFFILIATE_URL_KRUNGSRI_SIGNATURE || 'https://accesstrade.in.th',
    category: 'credit-card',
    ctaText: 'สมัครบัตรเครดิต Krungsri',
    subtext: 'สิทธิประโยชน์ครบ เงินคืนทุกการใช้จ่าย',
  },
  'kept-krungsri': {
    slug: 'kept-krungsri',
    partnerName: 'Kept by Krungsri',
    targetUrl: import.meta.env.AFFILIATE_URL_KEPT_KRUNGSRI || 'https://accesstrade.in.th',
    category: 'savings',
    ctaText: 'เปิดบัญชี Kept by Krungsri',
    subtext: 'ดอกเบี้ยสูงกว่าออมทรัพย์ทั่วไป ถอนได้ทุกวัน',
  },

  // ─── Involve Asia campaigns ────────────────────────────────────────────────
  // Real Involve Asia tracking URL is read from AFFILIATE_URL_RABBIT_CARE_HEALTH_CPL env var.
  // See .env.example for configuration. Once Board completes signup + CMO delivers
  // Rabbit Care CPL link (CAL-897), set this in Railway dashboard or .env.local.
  'rabbit-care-health-cpl': {
    slug: 'rabbit-care-health-cpl',
    partnerName: 'Rabbit Care',
    targetUrl: import.meta.env.AFFILIATE_URL_RABBIT_CARE_HEALTH_CPL || 'https://app.involve.asia',
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
