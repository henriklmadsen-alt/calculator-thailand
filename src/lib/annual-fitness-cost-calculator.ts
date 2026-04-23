/**
 * Annual Fitness Cost Calculator (ค่าใช้จ่ายออกกำลังกายรายปี)
 *
 * Calculates total fitness expenses:
 * - Gym membership
 * - Equipment
 * - Personal training
 * - Other fitness services
 *
 * Sources:
 * - Thai fitness industry standard costs
 */

export interface AnnualFitnessCostInput {
  monthlyGymFeeTHB?: number; // Monthly gym membership
  equipmentCostTHB?: number; // Annual equipment purchase
  personalTrainerSessionsTHB?: number; // Annual personal trainer cost
  otherCostsTHB?: number; // Other fitness-related costs
}

export interface AnnualFitnessCostResult {
  gymCostAnnual: number;
  equipmentCostAnnual: number;
  personalTrainerCostAnnual: number;
  otherCostsAnnual: number;
  totalAnnualCost: number;
  totalMonthlyCost: number;
  totalDailyCost: number;
  costBreakdown: {
    gym: number;
    equipment: number;
    personalTrainer: number;
    other: number;
  };
}

export function calculateAnnualFitnessCost(input: AnnualFitnessCostInput): AnnualFitnessCostResult {
  const monthlyGym = input.monthlyGymFeeTHB || 0;
  const equipment = input.equipmentCostTHB || 0;
  const trainer = input.personalTrainerSessionsTHB || 0;
  const other = input.otherCostsTHB || 0;

  // Calculate annual costs
  const gymCostAnnual = monthlyGym * 12;
  const totalAnnualCost = gymCostAnnual + equipment + trainer + other;
  const totalMonthlyCost = Math.round(totalAnnualCost / 12);
  const totalDailyCost = Math.round(totalAnnualCost / 365);

  return {
    gymCostAnnual,
    equipmentCostAnnual: equipment,
    personalTrainerCostAnnual: trainer,
    otherCostsAnnual: other,
    totalAnnualCost,
    totalMonthlyCost,
    totalDailyCost,
    costBreakdown: {
      gym: gymCostAnnual,
      equipment,
      personalTrainer: trainer,
      other,
    },
  };
}

// Worked examples
export const EXAMPLE_1 = calculateAnnualFitnessCost({
  monthlyGymFeeTHB: 2500,
  equipmentCostTHB: 5000,
  personalTrainerSessionsTHB: 10000,
  otherCostsTHB: 2000,
});

export const EXAMPLE_2 = calculateAnnualFitnessCost({
  monthlyGymFeeTHB: 1500,
  equipmentCostTHB: 2000,
  personalTrainerSessionsTHB: 0,
  otherCostsTHB: 0,
});

export const EXAMPLE_3 = calculateAnnualFitnessCost({
  monthlyGymFeeTHB: 3000,
  equipmentCostTHB: 8000,
  personalTrainerSessionsTHB: 15000,
  otherCostsTHB: 3000,
});
