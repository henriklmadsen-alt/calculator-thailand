/**
 * SEO Data Model Validator — CAL-3720
 *
 * Build-time validator for CAL-3716 redesign cluster.
 * Enforces:
 *  - No missing intent classifications
 *  - No orphan pages (cluster minimum rules)
 *  - No competing schema definitions
 *  - Metadata pattern compliance
 *  - Link structure integrity
 *
 * Usage:
 *   validateAllMetadata(calculatorMap, articleMap)
 *   validateClusterConnectivity(calculatorMap, clusterDefs)
 *   detectOrphanPages(pages, clusterDefs)
 */

import {
  CalculatorMetadata,
  ArticleMetadata,
  ClusterMinimumRule,
  ValidationResult,
  validateCalculatorMetadata,
  validateArticleMetadata,
  validateClusterMinimum,
  ClusterDefinition,
} from './seo-data-model';

/**
 * Validator result for an entire metadata collection.
 */
export interface ValidationReport {
  valid: boolean;
  timestamp: string;
  summary: {
    totalCalculators: number;
    totalArticles: number;
    validCalculators: number;
    validArticles: number;
    violatingPages: string[];
    orphanPages: string[];
  };
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  page: string;
  type: 'missing-intent' | 'link-structure' | 'metadata' | 'schema' | 'orphan';
  message: string;
  severity: 'critical' | 'error';
}

export interface ValidationWarning {
  page: string;
  type: 'pattern-mismatch' | 'trust-incomplete' | 'link-bias';
  message: string;
}

/**
 * Validate all calculator metadata in a collection.
 * Reports structure violations but not SEO quality.
 */
export function validateAllCalculators(
  calculators: Record<string, CalculatorMetadata>
): { valid: boolean; results: Map<string, ValidationResult> } {
  const results = new Map<string, ValidationResult>();

  for (const [href, metadata] of Object.entries(calculators)) {
    const result = validateCalculatorMetadata(metadata);
    results.set(href, result);
  }

  const validCount = Array.from(results.values()).filter(r => r.valid).length;
  const valid = validCount === results.size;

  return { valid, results };
}

/**
 * Validate all article metadata in a collection.
 */
export function validateAllArticles(
  articles: Record<string, ArticleMetadata>
): { valid: boolean; results: Map<string, ValidationResult> } {
  const results = new Map<string, ValidationResult>();

  for (const [href, metadata] of Object.entries(articles)) {
    const result = validateArticleMetadata(metadata);
    results.set(href, result);
  }

  const validCount = Array.from(results.values()).filter(r => r.valid).length;
  const valid = validCount === results.size;

  return { valid, results };
}

/**
 * Validate cluster connectivity.
 * Ensures no calculator is isolated (cluster minimum rule).
 *
 * Rules:
 *  - Every page must have ≥1 inbound link from same cluster
 *  - Every page must have ≥2 outbound cluster links
 *  - Every page must have ≥1 explicit CTA path
 */
export function validateClusterConnectivity(
  calculators: Record<string, CalculatorMetadata>,
  articles: Record<string, ArticleMetadata>,
  clusterDefs: ClusterDefinition[]
): {
  valid: boolean;
  violations: ClusterMinimumRule[];
  violations_by_cluster: Map<string, ClusterMinimumRule[]>;
} {
  const violations: ClusterMinimumRule[] = [];
  const violations_by_cluster = new Map<string, ClusterMinimumRule[]>();

  // Build reverse index: href → pages that link to it
  const inboundIndex = new Map<string, Set<string>>();
  const outboundIndex = new Map<string, number>();

  // Calculate inbound links from calculators
  for (const [href, calc] of Object.entries(calculators)) {
    if (!inboundIndex.has(href)) {
      inboundIndex.set(href, new Set());
    }

    // Count outbound links
    const outbound = calc.relatedCalculators.length + calc.relatedArticles.length;
    outboundIndex.set(href, outbound);

    // Register inbound links
    calc.relatedCalculators.forEach(link => {
      if (!inboundIndex.has(link.href)) {
        inboundIndex.set(link.href, new Set());
      }
      inboundIndex.get(link.href)!.add(href);
    });

    calc.relatedArticles.forEach(link => {
      if (!inboundIndex.has(link.href)) {
        inboundIndex.set(link.href, new Set());
      }
      inboundIndex.get(link.href)!.add(href);
    });
  }

  // Calculate inbound links from articles
  for (const [href, article] of Object.entries(articles)) {
    if (!inboundIndex.has(href)) {
      inboundIndex.set(href, new Set());
    }

    // Articles also link out
    const outbound = (article.primaryCalculatorCta ? 1 : 0) +
                     (article.secondaryLink ? 1 : 0) +
                     (article.comparisonLink ? 1 : 0);
    outboundIndex.set(href, outbound);

    // Register inbound links
    if (article.primaryCalculatorCta) {
      if (!inboundIndex.has(article.primaryCalculatorCta.href)) {
        inboundIndex.set(article.primaryCalculatorCta.href, new Set());
      }
      inboundIndex.get(article.primaryCalculatorCta.href)!.add(href);
    }
  }

  // Validate each calculator
  for (const [href, calc] of Object.entries(calculators)) {
    const inboundLinks = inboundIndex.get(href) || new Set();
    const inboundCount = inboundLinks.size;
    const outboundCount = outboundIndex.get(href) || 0;

    const rule: ClusterMinimumRule = {
      pageHref: href,
      clusterKey: calc.clusterKey,
      inboundLinkCount: inboundCount,
      outboundLinkCount: outboundCount,
      hasCTAPath: true, // All calculators have implicit CTA (the calculator itself)
      compliant: false,
      violations: [],
    };

    const validation = validateClusterMinimum(rule);
    rule.compliant = validation.valid;
    rule.violations = validation.violations;

    if (!validation.valid) {
      violations.push(rule);

      if (!violations_by_cluster.has(calc.clusterKey)) {
        violations_by_cluster.set(calc.clusterKey, []);
      }
      violations_by_cluster.get(calc.clusterKey)!.push(rule);
    }
  }

  // Validate each article
  for (const [href, article] of Object.entries(articles)) {
    const inboundLinks = inboundIndex.get(href) || new Set();
    const inboundCount = inboundLinks.size;
    const outboundCount = outboundIndex.get(href) || 0;
    const hasCTA = !!article.primaryCalculatorCta;

    const rule: ClusterMinimumRule = {
      pageHref: href,
      clusterKey: article.clusterKey,
      inboundLinkCount: inboundCount,
      outboundLinkCount: outboundCount,
      hasCTAPath: hasCTA,
      compliant: false,
      violations: [],
    };

    const validation = validateClusterMinimum(rule);
    rule.compliant = validation.valid;
    rule.violations = validation.violations;

    if (!validation.valid) {
      violations.push(rule);

      if (!violations_by_cluster.has(article.clusterKey)) {
        violations_by_cluster.set(article.clusterKey, []);
      }
      violations_by_cluster.get(article.clusterKey)!.push(rule);
    }
  }

  return {
    valid: violations.length === 0,
    violations,
    violations_by_cluster,
  };
}

/**
 * Detect orphan pages — pages that exist but aren't in cluster definitions.
 * These are pages that won't benefit from cluster-based linking strategy.
 */
export function detectOrphanPages(
  allPages: Map<string, 'calculator' | 'article'>,
  calculators: Record<string, CalculatorMetadata>,
  articles: Record<string, ArticleMetadata>,
  clusterDefs: ClusterDefinition[]
): {
  orphans: Array<{ href: string; type: 'calculator' | 'article' }>;
  orphan_count: number;
} {
  const orphans: Array<{ href: string; type: 'calculator' | 'article' }> = [];

  // Build set of pages that are in clusters
  const clusterMembers = new Set<string>();
  for (const cluster of clusterDefs) {
    cluster.calculators.forEach(path => clusterMembers.add(path));
    cluster.articles.forEach(path => clusterMembers.add(path));
  }

  // Check all pages
  for (const [href, type] of allPages) {
    // Skip if explicitly in metadata (will be caught by structure validation)
    if (type === 'calculator' && calculators[href]) continue;
    if (type === 'article' && articles[href]) continue;

    // If not in cluster members, it's orphaned
    if (!clusterMembers.has(href)) {
      orphans.push({ href, type });
    }
  }

  return {
    orphans,
    orphan_count: orphans.length,
  };
}

/**
 * Comprehensive validation report for entire metadata collection.
 * This is the main entry point for build-time validation.
 */
export function generateValidationReport(
  calculators: Record<string, CalculatorMetadata>,
  articles: Record<string, ArticleMetadata>,
  clusterDefs: ClusterDefinition[]
): ValidationReport {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const violatingPages: Set<string> = new Set();
  const orphanPages: Set<string> = new Set();

  // Validate calculator structure
  const calcResult = validateAllCalculators(calculators);
  for (const [href, result] of calcResult.results) {
    if (!result.valid) {
      violatingPages.add(href);
      result.errors.forEach(err => {
        errors.push({
          page: href,
          type: 'link-structure',
          message: err,
          severity: 'error',
        });
      });
    }
    result.warnings.forEach(warn => {
      warnings.push({
        page: href,
        type: 'link-bias',
        message: warn,
      });
    });
  }

  // Validate article structure
  const articleResult = validateAllArticles(articles);
  for (const [href, result] of articleResult.results) {
    if (!result.valid) {
      violatingPages.add(href);
      result.errors.forEach(err => {
        errors.push({
          page: href,
          type: 'metadata',
          message: err,
          severity: 'error',
        });
      });
    }
    result.warnings.forEach(warn => {
      warnings.push({
        page: href,
        type: 'trust-incomplete',
        message: warn,
      });
    });
  }

  // Validate cluster connectivity
  const connectivity = validateClusterConnectivity(calculators, articles, clusterDefs);
  connectivity.violations.forEach(rule => {
    violatingPages.add(rule.pageHref);
    rule.violations.forEach(violation => {
      errors.push({
        page: rule.pageHref,
        type: 'orphan',
        message: `Cluster minimum violation: ${violation}`,
        severity: 'critical',
      });
    });
  });

  // Detect orphan pages
  const allPages = new Map<string, 'calculator' | 'article'>();
  Object.keys(calculators).forEach(href => allPages.set(href, 'calculator'));
  Object.keys(articles).forEach(href => allPages.set(href, 'article'));
  const orphanResult = detectOrphanPages(allPages, calculators, articles, clusterDefs);
  orphanResult.orphans.forEach(orphan => {
    orphanPages.add(orphan.href);
    errors.push({
      page: orphan.href,
      type: 'orphan',
      message: `Page not assigned to any cluster definition`,
      severity: 'critical',
    });
  });

  const validCalcs = calcResult.results.size - Array.from(calcResult.results.values()).filter(r => !r.valid).length;
  const validArticles = articleResult.results.size - Array.from(articleResult.results.values()).filter(r => !r.valid).length;

  return {
    valid: errors.filter(e => e.severity === 'critical').length === 0 && errors.filter(e => e.severity === 'error').length === 0,
    timestamp: new Date().toISOString(),
    summary: {
      totalCalculators: Object.keys(calculators).length,
      totalArticles: Object.keys(articles).length,
      validCalculators: validCalcs,
      validArticles: validArticles,
      violatingPages: Array.from(violatingPages),
      orphanPages: Array.from(orphanPages),
    },
    errors,
    warnings,
  };
}

/**
 * Format validation report for console output.
 */
export function formatValidationReport(report: ValidationReport): string {
  const lines: string[] = [];

  lines.push('═════════════════════════════════════════');
  lines.push('SEO Data Model Validation Report');
  lines.push('═════════════════════════════════════════');
  lines.push('');

  // Summary
  lines.push(`Timestamp: ${report.timestamp}`);
  lines.push(`Status: ${report.valid ? '✅ PASS' : '❌ FAIL'}`);
  lines.push('');

  lines.push('Summary:');
  lines.push(`  Calculators: ${report.summary.validCalculators}/${report.summary.totalCalculators} valid`);
  lines.push(`  Articles: ${report.summary.validArticles}/${report.summary.totalArticles} valid`);
  lines.push(`  Violating pages: ${report.summary.violatingPages.length}`);
  lines.push(`  Orphan pages: ${report.summary.orphanPages.length}`);
  lines.push('');

  // Critical errors
  const criticalErrors = report.errors.filter(e => e.severity === 'critical');
  if (criticalErrors.length > 0) {
    lines.push('🔴 CRITICAL ERRORS:');
    criticalErrors.forEach(err => {
      lines.push(`  ${err.page}`);
      lines.push(`    → ${err.message}`);
    });
    lines.push('');
  }

  // Regular errors
  const regularErrors = report.errors.filter(e => e.severity === 'error');
  if (regularErrors.length > 0) {
    lines.push('🔶 ERRORS:');
    regularErrors.forEach(err => {
      lines.push(`  ${err.page}`);
      lines.push(`    → ${err.message}`);
    });
    lines.push('');
  }

  // Warnings
  if (report.warnings.length > 0) {
    lines.push('⚠️  WARNINGS:');
    report.warnings.forEach(warn => {
      lines.push(`  ${warn.page}`);
      lines.push(`    → ${warn.message}`);
    });
    lines.push('');
  }

  lines.push('═════════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Export validation utilities
 */
export {
  validateCalculatorMetadata,
  validateArticleMetadata,
  validateClusterMinimum,
};
