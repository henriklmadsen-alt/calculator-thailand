/**
 * Thai Home Inventory Value Calculator (คำนวณมูลค่าสินค้าทั้งหมดในบ้าน)
 *
 * Helps estimate total value of household belongings for insurance
 */

export interface HomeInventoryInput {
  electronics: number;          // เครื่องใช้ไฟฟ้า (THB)
  furniture: number;            // เฟอร์นิเจอร์ (THB)
  jewelry: number;              // เครื่องประดับ (THB)
  artwork: number;              // ศิลปะ/สะสม (THB)
  clothing: number;             // เสื้อผ้า (THB)
  kitchen: number;              // ห้องครัว (THB)
  other: number;                // อื่นๆ (THB)
}

export interface HomeInventoryResult {
  totalInventoryValue: number;
  categoryBreakdown: Record<string, number>;
  estimatedReplacementCost: number;
  recommendedInsuranceAmount: number;
  depreciationFactor: number;
}

const REPLACEMENT_MULTIPLIERS: Record<string, number> = {
  electronics: 1.2,   // New electronics cost more
  furniture: 1.15,
  jewelry: 1.05,      // Hard to replace exactly
  artwork: 1.0,       // Unique items
  clothing: 1.1,
  kitchen: 1.15,
  other: 1.1,
};

const DEPRECIATION_RATES: Record<string, number> = {
  electronics: 0.85,  // Depreciate 15%
  furniture: 0.90,    // Depreciate 10%
  jewelry: 0.98,      // Depreciate 2%
  artwork: 1.0,       // No depreciation
  clothing: 0.80,     // Depreciate 20%
  kitchen: 0.88,      // Depreciate 12%
  other: 0.85,        // Depreciate 15%
};

export function calculateHomeInventoryValue(input: HomeInventoryInput): HomeInventoryResult {
  const categories = {
    electronics: input.electronics,
    furniture: input.furniture,
    jewelry: input.jewelry,
    artwork: input.artwork,
    clothing: input.clothing,
    kitchen: input.kitchen,
    other: input.other,
  };

  let totalInventory = 0;
  let totalReplacement = 0;

  for (const [category, value] of Object.entries(categories)) {
    totalInventory += value;
    const replacement = value * (REPLACEMENT_MULTIPLIERS[category] || 1.1);
    totalReplacement += replacement;
  }

  const depreciationFactor = totalInventory > 0 ? 0.85 : 1; // Conservative depreciation
  const recommendedInsuranceAmount = Math.round(totalReplacement * 1.1); // 10% buffer

  return {
    totalInventoryValue: Math.round(totalInventory),
    categoryBreakdown: categories,
    estimatedReplacementCost: Math.round(totalReplacement),
    recommendedInsuranceAmount,
    depreciationFactor,
  };
}
