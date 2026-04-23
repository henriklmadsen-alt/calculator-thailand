export interface FoodBusinessInsuranceInput {
  generalLiabilityPremium: number;
  productLiabilityPremium: number;
  propertyInsurancePremium: number;
  workersCompensationRate: number;
  totalPayrollMonthly: number;
  vehicleInsurancePremium: number;
}

export interface FoodBusinessInsuranceResult {
  generalLiabilityAnnual: number;
  productLiabilityAnnual: number;
  propertyInsuranceAnnual: number;
  workersCompensationAnnual: number;
  vehicleInsuranceAnnual: number;
  totalInsuranceCostAnnual: number;
  totalInsuranceCostMonthly: number;
  insuranceCostPercentageOfPayroll: number;
}

export function calculateFoodBusinessInsurance(input: FoodBusinessInsuranceInput): FoodBusinessInsuranceResult {
  const generalLiabilityAnnual = Math.round(input.generalLiabilityPremium * 12);
  const productLiabilityAnnual = Math.round(input.productLiabilityPremium * 12);
  const propertyInsuranceAnnual = Math.round(input.propertyInsurancePremium * 12);
  const workersCompensationAnnual = Math.round(input.totalPayrollMonthly * (input.workersCompensationRate / 100) * 12);
  const vehicleInsuranceAnnual = Math.round(input.vehicleInsurancePremium * 12);

  const totalInsuranceCostAnnual = Math.round(
    generalLiabilityAnnual + productLiabilityAnnual + propertyInsuranceAnnual + workersCompensationAnnual + vehicleInsuranceAnnual
  );
  const totalInsuranceCostMonthly = Math.round(totalInsuranceCostAnnual / 12);

  const annualPayroll = Math.round(input.totalPayrollMonthly * 12);
  const insuranceCostPercentageOfPayroll = annualPayroll > 0
    ? Math.round((totalInsuranceCostAnnual / annualPayroll) * 100)
    : 0;

  return {
    generalLiabilityAnnual,
    productLiabilityAnnual,
    propertyInsuranceAnnual,
    workersCompensationAnnual,
    vehicleInsuranceAnnual,
    totalInsuranceCostAnnual,
    totalInsuranceCostMonthly,
    insuranceCostPercentageOfPayroll,
  };
}

export const EXAMPLE_1 = calculateFoodBusinessInsurance({
  generalLiabilityPremium: 2000,
  productLiabilityPremium: 1500,
  propertyInsurancePremium: 1000,
  workersCompensationRate: 2,
  totalPayrollMonthly: 100000,
  vehicleInsurancePremium: 500,
});

export const EXAMPLE_2 = calculateFoodBusinessInsurance({
  generalLiabilityPremium: 3000,
  productLiabilityPremium: 2500,
  propertyInsurancePremium: 2000,
  workersCompensationRate: 2.5,
  totalPayrollMonthly: 200000,
  vehicleInsurancePremium: 800,
});

export const EXAMPLE_3 = calculateFoodBusinessInsurance({
  generalLiabilityPremium: 2500,
  productLiabilityPremium: 2000,
  propertyInsurancePremium: 1500,
  workersCompensationRate: 2.2,
  totalPayrollMonthly: 150000,
  vehicleInsurancePremium: 600,
});
