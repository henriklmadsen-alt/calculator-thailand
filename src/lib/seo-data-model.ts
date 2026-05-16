/**
 * SEO Data Model — CAL-3720 Implementation
 *
 * Supports CAL-3716 redesign cluster with enhanced metadata, schema, and internal-linking strategy.
 * Formalizes intent classes, cluster mapping, link priority tiers, and validation rules.
 *
 * This model is the single source of truth for:
 * - Search intent classification (4 intent classes)
 * - Internal link priority (primary, secondary) and cluster assignment
 * - Metadata/title/description standardization by intent
 * - Validation of cluster minimum rules (1 inbound + 2 outbound + 1 CTA)
 */

/**
 * Search intent classes — non-negotiable for redesign strategy.
 * Each calculator or article page must declare ONE primary intent.
 */
export type IntentClass =
  | 'calculate-now'       // User wants immediate calculation result (primary intent: calculators)
  | 'compare-options'     // User wants to compare alternatives or make selection (compare calcs + articles)
  | 'learn-before-action' // User wants to understand before deciding (educational articles leading to calc)
  | 'example-check';      // User wants worked example to verify their own calculation (example articles)

/**
 * Link priority tier — enforces structure.
 * Each calculator/article must have:
 *  - 1 primary link (same-intent, highest relevance)
 *  - 2 secondary links (supporting-intent, planning/decision intent)
 */
export type LinkPriority = 'primary' | 'secondary';

/**
 * Link role — categorizes why this link exists in the relationship graph.
 * Used for semantic validation and display strategy.
 */
export type LinkRole =
  | 'same-intent'          // Same intent family (e.g., tax > income tax > deduction calc)
  | 'upstream-planning'    // Planning intent before this action (e.g., loan calc -> affordability planning)
  | 'downstream-decision'  // Decision outcome after this action (e.g., tax calc -> filing guide)
  | 'comparison'           // Comparison/alternative option
  | 'prerequisite'         // Must understand before using this tool
  | 'example-support';     // Worked example for this tool

/**
 * Enhanced link structure with cluster and intent metadata.
 * Extends the basic RelatedLink to support cluster mapping and validation.
 */
export interface EnhancedLink {
  /** Page URL path */
  href: string;
  /** Display title (Thai, user-facing) */
  title: string;
  /** Brief description (Thai, 5-10 words) */
  desc: string;
  /** Cluster identifier (e.g., 'tax-income', 'loan-mortgage') */
  clusterKey: string;
  /** Intent class of linked page */
  intentClass: IntentClass;
  /** Why this link exists in the relationship */
  linkRole: LinkRole;
  /** Priority tier (primary or secondary) */
  priority: LinkPriority;
  /** Publication date (ISO or human-readable) */
  date?: string;
  /** Article author name */
  author?: string;
}

/**
 * Calculator page structure — metadata + intent + links.
 * Every calculator in the site must have one of these defined.
 */
export interface CalculatorMetadata {
  /** Canonical URL path */
  href: string;
  /** Display title in Thai */
  title: string;
  /** Primary intent of this calculator */
  intentClass: IntentClass;
  /** Which cluster this calculator belongs to */
  clusterKey: string;
  /** Meta description for SERP (5-10 words, includes year if relevant) */
  description: string;
  /** H1 text (follows CAL-3719 microcopy pattern for this intent) */
  h1: string;
  /** Support text under H1 ("ทำอะไรได้ในหน้านี้") */
  supportText: string;
  /** Related calculators (must have 1 primary + 2 secondary) */
  relatedCalculators: EnhancedLink[];
  /** Supporting articles (up to 2, at least 1 primary) */
  relatedArticles: EnhancedLink[];
  /** Trust metadata */
  trust: {
    /** Last updated date */
    updatedDate: string;
    /** Source authority (Thai agency name) */
    source?: string;
    /** Author name */
    author?: string;
  };
}

/**
 * Article page structure — metadata + intent + calculator CTA.
 * Every article must lead to at least one calculator action.
 */
export interface ArticleMetadata {
  /** Canonical URL path */
  href: string;
  /** Display title in Thai */
  title: string;
  /** Primary intent of this article */
  intentClass: IntentClass;
  /** Which cluster this article supports */
  clusterKey: string;
  /** Meta description for SERP */
  description: string;
  /** H1 text (follows CAL-3719 microcopy pattern for this intent) */
  h1: string;
  /** Primary calculator CTA (same-topic, exact-match) */
  primaryCalculatorCta: EnhancedLink;
  /** Secondary article link (follow-up intent in same cluster) */
  secondaryLink?: EnhancedLink;
  /** Comparison link (optional, only if intent contains comparison) */
  comparisonLink?: EnhancedLink;
  /** Trust metadata */
  trust: {
    updatedDate: string;
    source?: string;
    author: string;
  };
}

/**
 * Page validation result.
 * Used by validator functions to report compliance status.
 */
export interface ValidationResult {
  /** Is page valid per cluster minimum rules? */
  valid: boolean;
  /** Errors (empty if valid) */
  errors: string[];
  /** Warnings (non-blocking, for review) */
  warnings: string[];
}

/**
 * Cluster definition — groups pages by semantic intent.
 * Mirrors existing related-calculators.ts but adds intent mapping.
 */
export interface ClusterDefinition {
  /** Machine-readable cluster key */
  clusterId: string;
  /** Human-readable topic name (Thai) */
  topic: string;
  /** Pillar page URL for this cluster */
  pillarPage: string;
  /** All calculator paths in this cluster */
  calculators: string[];
  /** All article paths in this cluster */
  articles: string[];
  /** Primary intent class for this cluster */
  primaryIntent: IntentClass;
  /** Supporting intent classes (for comparison/planning pages) */
  supportingIntents?: IntentClass[];
}

/**
 * Cluster minimum rule — enforced for all published pages.
 * No page can be published without:
 *  1. At least 1 inbound internal link from same cluster
 *  2. At least 2 outbound cluster links (calculator/article combined)
 *  3. At least 1 explicit CTA path to next action
 */
export interface ClusterMinimumRule {
  /** Calculator/article path */
  pageHref: string;
  /** Cluster this page belongs to */
  clusterKey: string;
  /** Inbound links from same cluster (count) */
  inboundLinkCount: number;
  /** Outbound cluster links (count) */
  outboundLinkCount: number;
  /** Has explicit CTA path? */
  hasCTAPath: boolean;
  /** Overall compliance status */
  compliant: boolean;
  /** Specific violations if non-compliant */
  violations: string[];
}

/**
 * Metadata patterns by intent class.
 * Defines how titles, descriptions, and H1s should be formatted for each intent.
 * Implements CAL-3719 Thai microcopy patterns.
 */
export const METADATA_PATTERNS: Record<IntentClass, {
  titlePattern: string;
  descriptionPattern: string;
  h1Pattern: string;
  calloutPattern: string;
}> = {
  'calculate-now': {
    titlePattern: 'คำนวณ{หัวข้อ} {ปี} — รู้ผลทันที',
    descriptionPattern: 'คำนวณ{หัวข้อ} {ปี} ฟรี รู้ผลทันที พร้อมคำอธิบาย',
    h1Pattern: 'คำนวณ{หัวข้อ} {ปี} — รู้ผลทันที',
    calloutPattern: 'ทำอะไรได้: คำนวณ{หัวข้อ}ของคุณตามข้อมูลจริง',
  },
  'compare-options': {
    titlePattern: 'คำนวณ{หัวข้อ} {ปี} — เทียบ{ตัวเลือก A} vs {ตัวเลือก B}',
    descriptionPattern: 'เทียบ{หัวข้อ} {ปี} ให้เห็นข้อแตกต่างชัด พร้อมวิธีเลือกที่คุ้ม',
    h1Pattern: 'เทียบ{หัวข้อ} {ปี} — {ตัวเลือก A} vs {ตัวเลือก B}',
    calloutPattern: 'ทำอะไรได้: เทียบตัวเลือกแล้วเลือกอันที่คุ้มที่สุด',
  },
  'learn-before-action': {
    titlePattern: '{หัวข้อ} {ปี}: วิธีคิดทีละขั้น + ข้อควรระวัง',
    descriptionPattern: 'อธิบาย{หัวข้อ} {ปี} แบบเข้าใจง่าย พร้อมตัวอย่างและ{action}',
    h1Pattern: '{หัวข้อ} {ปี}: วิธีคิดทีละขั้น + ข้อควรระวัง',
    calloutPattern: 'ทำอะไรได้: เข้าใจ{หัวข้อ}แล้วพร้อมคำนวณได้เองหรือใช้เครื่องมือ',
  },
  'example-check': {
    titlePattern: '{หัวข้อ} {ปี}: ตัวอย่างจริง + วิธีเช็กผลด้วยตัวเอง',
    descriptionPattern: 'ตัวอย่างและวิธีเช็ก{หัวข้อ} {ปี} ด้วยตัวเอง พร้อมเครื่องคำนวณ',
    h1Pattern: '{หัวข้อ} {ปี}: ตัวอย่างจริง + วิธีเช็กผลด้วยตัวเอง',
    calloutPattern: 'ทำอะไรได้: ศึกษาตัวอย่างจากจริงแล้วทดลองคำนวณด้วยตัวเอง',
  },
};

/**
 * Link role guidelines — explains when to use each role.
 * Helps implementers choose the right linkRole for their relationships.
 */
export const LINK_ROLE_GUIDELINES: Record<LinkRole, {
  description: string;
  examples: string[];
  recommendedPriority: LinkPriority;
}> = {
  'same-intent': {
    description: 'Same intent family, highest relevance',
    examples: ['Income tax → Net salary calculator', 'VAT single → VAT multi-item', 'Tax filing → Refund check'],
    recommendedPriority: 'primary',
  },
  'upstream-planning': {
    description: 'Planning/preparation intent before this action',
    examples: ['Affordability check → Loan calculator', 'Budget planning → Tax planning', 'Financial goal → Investment return'],
    recommendedPriority: 'secondary',
  },
  'downstream-decision': {
    description: 'Decision or next-step intent after this action',
    examples: ['Tax calc → Filing guide', 'Loan calc → Comparison guide', 'Expense calc → Budget article'],
    recommendedPriority: 'secondary',
  },
  'comparison': {
    description: 'Alternative option or comparison point',
    examples: ['Income tax → Estimated tax', 'Fixed loan → Floating loan', 'Lease → Buy comparison'],
    recommendedPriority: 'secondary',
  },
  'prerequisite': {
    description: 'Foundational concept before using this tool',
    examples: ['Tax calculator → How to calculate tax', 'Loan → Understanding interest', 'Investment → Risk basics'],
    recommendedPriority: 'primary',
  },
  'example-support': {
    description: 'Worked example for understanding this tool',
    examples: ['VAT calculator → VAT explanation article', 'Mortgage → Home buying guide', 'Insurance → Claim examples'],
    recommendedPriority: 'primary',
  },
};

/**
 * Validator functions for cluster minimum rules.
 */

/**
 * Validate calculator metadata against CAL-3719 structure requirements.
 * Returns errors if required fields are missing or invalid.
 */
export function validateCalculatorMetadata(calc: CalculatorMetadata): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate related calculators
  const primaryCalcs = calc.relatedCalculators.filter(c => c.priority === 'primary');
  const secondaryCalcs = calc.relatedCalculators.filter(c => c.priority === 'secondary');

  if (primaryCalcs.length !== 1) {
    errors.push(`Must have exactly 1 primary related calculator, found ${primaryCalcs.length}`);
  }
  if (secondaryCalcs.length !== 2) {
    errors.push(`Must have exactly 2 secondary related calculators, found ${secondaryCalcs.length}`);
  }

  // Validate related articles
  const primaryArticles = calc.relatedArticles.filter(a => a.priority === 'primary');
  if (primaryArticles.length < 1) {
    errors.push('Must have at least 1 primary article link');
  }
  if (calc.relatedArticles.length > 2) {
    warnings.push(`Has ${calc.relatedArticles.length} article links; recommend max 2`);
  }

  // Validate trust metadata
  if (!calc.trust.updatedDate) {
    errors.push('Missing trust.updatedDate');
  }

  // Validate H1 matches microcopy pattern
  const pattern = METADATA_PATTERNS[calc.intentClass];
  if (!pattern) {
    errors.push(`Unknown intent class: ${calc.intentClass}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate article metadata against CAL-3719 structure requirements.
 */
export function validateArticleMetadata(article: ArticleMetadata): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate primary CTA
  if (!article.primaryCalculatorCta) {
    errors.push('Missing primaryCalculatorCta');
  }

  // Validate trust metadata
  if (!article.trust.updatedDate || !article.trust.author) {
    errors.push('Missing required trust.updatedDate or trust.author');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if page meets cluster minimum rules.
 * Requires: 1 inbound + 2 outbound + 1 CTA path
 */
export function validateClusterMinimum(
  rule: ClusterMinimumRule
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  if (rule.inboundLinkCount < 1) {
    violations.push(`No inbound links from cluster "${rule.clusterKey}"`);
  }
  if (rule.outboundLinkCount < 2) {
    violations.push(`Only ${rule.outboundLinkCount} outbound cluster links; need 2`);
  }
  if (!rule.hasCTAPath) {
    violations.push('No explicit CTA path to next action');
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Export all required type definitions for component/template usage.
 */
export type {
  CalculatorMetadata,
  ArticleMetadata,
  EnhancedLink,
  ClusterDefinition,
  ClusterMinimumRule,
  ValidationResult,
};
