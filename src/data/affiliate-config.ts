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
  | 'insurance'
  | 'investment';

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
};

/**
 * Maps calculator page paths to affiliate partner slugs.
 * Used to determine which affiliate card to show on each calculator page.
 */
export const CALCULATOR_AFFILIATE_MAP: Record<string, string> = {
  '/คำนวณผ่อนกู้/': 'rabbit-care-loan',
  '/คำนวณผ่อนรถ/': 'rabbit-care-car',
  '/คำนวณผ่อนบ้าน/': 'rabbit-care-home',
  '/คำนวณประกันชีวิต/': 'rabbit-care-insurance',
  '/คำนวณดอกเบี้ยเงินฝาก/': 'kasikorn-savings',
};
