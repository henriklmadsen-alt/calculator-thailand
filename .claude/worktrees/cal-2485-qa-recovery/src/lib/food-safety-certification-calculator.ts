export interface FoodSafetyCertificationInput {
  initialInspectionFee: number;
  certificationFee: number;
  trainingCostPerEmployee: number;
  numberOfEmployees: number;
  equipmentUpgradeCost: number;
  documentationSystemCost: number;
  annualRenewalFee: number;
}

export interface FoodSafetyCertificationResult {
  initialCertificationCost: number;
  staffTrainingCost: number;
  equipmentUpgradeCost: number;
  documentationCost: number;
  totalInitialCost: number;
  annualRenewalFee: number;
  firstYearTotalCost: number;
}

export function calculateFoodSafetyCertification(input: FoodSafetyCertificationInput): FoodSafetyCertificationResult {
  const initialCertificationCost = Math.round(input.initialInspectionFee + input.certificationFee);
  const staffTrainingCost = Math.round(input.trainingCostPerEmployee * input.numberOfEmployees);
  const equipmentUpgradeCost = Math.round(input.equipmentUpgradeCost);
  const documentationCost = Math.round(input.documentationSystemCost);

  const totalInitialCost = Math.round(
    initialCertificationCost + staffTrainingCost + equipmentUpgradeCost + documentationCost
  );
  const annualRenewalFee = Math.round(input.annualRenewalFee);
  const firstYearTotalCost = Math.round(totalInitialCost + annualRenewalFee);

  return {
    initialCertificationCost,
    staffTrainingCost,
    equipmentUpgradeCost,
    documentationCost,
    totalInitialCost,
    annualRenewalFee,
    firstYearTotalCost,
  };
}

export const EXAMPLE_1 = calculateFoodSafetyCertification({
  initialInspectionFee: 10000,
  certificationFee: 20000,
  trainingCostPerEmployee: 5000,
  numberOfEmployees: 10,
  equipmentUpgradeCost: 50000,
  documentationSystemCost: 15000,
  annualRenewalFee: 15000,
});

export const EXAMPLE_2 = calculateFoodSafetyCertification({
  initialInspectionFee: 15000,
  certificationFee: 30000,
  trainingCostPerEmployee: 6000,
  numberOfEmployees: 20,
  equipmentUpgradeCost: 80000,
  documentationSystemCost: 25000,
  annualRenewalFee: 20000,
});

export const EXAMPLE_3 = calculateFoodSafetyCertification({
  initialInspectionFee: 12000,
  certificationFee: 25000,
  trainingCostPerEmployee: 5500,
  numberOfEmployees: 15,
  equipmentUpgradeCost: 60000,
  documentationSystemCost: 20000,
  annualRenewalFee: 18000,
});
