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
  /** The actual destination URL (affiliate link). Empty means the campaign is not configured yet. */
  targetUrl: string;
  /** Optional environment variable that supplies a paid tracking URL. */
  envVar?: string;
  /** AffiliateCard category — drives the icon and headline */
  category: AffiliateCategory;
  /** Primary CTA button text */
  ctaText: string;
  /** Optional sub-headline below the main headline */
  subtext?: string;
}

const GENERIC_AFFILIATE_HOSTS = new Set(['accesstrade.in.th', 'app.involve.asia']);
export const ROOJAI_AFFILIATE_URL = 'https://portal.roojaipartners.com/#/23424769e701bcaa';
const ROOJAI_CTA_TEXT = 'ดูข้อเสนอจาก Roojai';
const ROOJAI_SUBTEXT = 'ลิงก์พาร์ทเนอร์หลักของ Kamnuanlek สำหรับติดตามคอมมิชชัน';

export function isAffiliatePartnerConfigured(partner: AffiliatePartner): boolean {
  if (!partner.targetUrl.trim()) return false;

  try {
    const url = new URL(partner.targetUrl);
    const isGenericHomepage =
      GENERIC_AFFILIATE_HOSTS.has(url.hostname) && (url.pathname === '' || url.pathname === '/') && !url.search && !url.hash;
    return ['http:', 'https:'].includes(url.protocol) && !isGenericHomepage;
  } catch {
    return false;
  }
}

/**
 * All registered affiliate partners.
 * Keyed by slug for fast lookup.
 */
export const AFFILIATE_PARTNERS: Record<string, AffiliatePartner> = {
  'roojai-partners': {
    slug: 'roojai-partners',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    category: 'insurance',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'rabbit-care-loan': {
    slug: 'rabbit-care-loan',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    category: 'personal-loan',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'rabbit-care-car': {
    slug: 'rabbit-care-car',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    category: 'car-loan',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'rabbit-care-home': {
    slug: 'rabbit-care-home',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    category: 'home-loan',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'rabbit-care-insurance': {
    slug: 'rabbit-care-insurance',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    category: 'insurance',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'kasikorn-savings': {
    slug: 'kasikorn-savings',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    category: 'investment',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },

  // ─── ACCESSTRADE Thailand campaigns ───────────────────────────────────────
  // Real ACCESSTRADE tracking URLs are read from AFFILIATE_URL_* environment variables.
  // See .env.example for configuration. Once Board completes signup + CMO delivers
  // campaign links (CAL-897), set these in Railway dashboard or .env.local.
  // URL format: https://[at-tracking-domain]/[campaign-id]?sub_id=[page-slug]
  'ttb-cash2go': {
    slug: 'ttb-cash2go',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    envVar: 'AFFILIATE_URL_TTB_CASH2GO',
    category: 'personal-loan',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'ktc-brother-berm': {
    slug: 'ktc-brother-berm',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    envVar: 'AFFILIATE_URL_KTC_BROTHER_BERM',
    category: 'car-loan',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'ngern-tid-lor': {
    slug: 'ngern-tid-lor',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    envVar: 'AFFILIATE_URL_NGERN_TID_LOR',
    category: 'car-loan',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'tipinsure': {
    slug: 'tipinsure',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    envVar: 'AFFILIATE_URL_TIPINSURE',
    category: 'insurance',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'uob-tmrw': {
    slug: 'uob-tmrw',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    envVar: 'AFFILIATE_URL_UOB_TMRW',
    category: 'credit-card',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'krungsri-signature': {
    slug: 'krungsri-signature',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    envVar: 'AFFILIATE_URL_KRUNGSRI_SIGNATURE',
    category: 'credit-card',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },
  'kept-krungsri': {
    slug: 'kept-krungsri',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    envVar: 'AFFILIATE_URL_KEPT_KRUNGSRI',
    category: 'savings',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
  },

  // ─── Involve Asia campaigns ────────────────────────────────────────────────
  // Real Involve Asia tracking URL is read from AFFILIATE_URL_RABBIT_CARE_HEALTH_CPL env var.
  // See .env.example for configuration. Once Board completes signup + CMO delivers
  // Rabbit Care CPL link (CAL-897), set this in Railway dashboard or .env.local.
  'rabbit-care-health-cpl': {
    slug: 'rabbit-care-health-cpl',
    partnerName: 'Roojai Partners',
    targetUrl: ROOJAI_AFFILIATE_URL,
    envVar: 'AFFILIATE_URL_RABBIT_CARE_HEALTH_CPL',
    category: 'insurance',
    ctaText: ROOJAI_CTA_TEXT,
    subtext: ROOJAI_SUBTEXT,
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
