// Veterinary visit cost calculator (KLC-0628)
// Thai veterinary clinic prices 2569

export interface VetVisitInput {
  visitType: 'checkup' | 'treatment' | 'surgery' | 'vaccination';
  numVisits: number;
}

export interface VetVisitResult {
  avgCostPerVisit: number;
  totalCost: number;
  estimatedAnnual: number;
}

// Thai vet clinic prices (THB) — 2569
const VET_VISIT_COSTS: Record<string, number> = {
  checkup: 500,
  treatment: 1500,
  surgery: 8000,
  vaccination: 800,
};

export function calculateVetVisitCost(input: VetVisitInput): VetVisitResult {
  const { visitType, numVisits } = input;

  if (numVisits < 1 || numVisits > 52 || !Number.isInteger(numVisits)) {
    throw new Error('Visits must be 1–52');
  }

  const avgCostPerVisit = VET_VISIT_COSTS[visitType] || 1000;
  const totalCost = avgCostPerVisit * numVisits;
  const estimatedAnnual = (totalCost / numVisits) * 12;

  return {
    avgCostPerVisit,
    totalCost,
    estimatedAnnual,
  };
}
