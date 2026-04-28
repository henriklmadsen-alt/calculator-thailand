// Pet adoption vs purchase cost calculator (KLC-0636)
export interface PetCostComparison {
  purchasePrice: number;
  adoptionFee: number;
  firstYearCost: number;
}
export interface PetAdoptionVsPurchaseResult {
  adoptionTotal: number;
  purchaseTotal: number;
  savings: number;
}
export function calculateAdoptionVsPurchase(input: PetCostComparison): PetAdoptionVsPurchaseResult {
  const adoptionFee = input.adoptionFee || 500;
  const adoptionTotal = adoptionFee + input.firstYearCost;
  const purchaseTotal = input.purchasePrice + input.firstYearCost;
  return {
    adoptionTotal,
    purchaseTotal,
    savings: purchaseTotal - adoptionTotal,
  };
}
