export interface FoodBusinessVatInput {
  monthlyRevenue: number;
  vatRate: number;
  inputVat: number;
  exemptedRevenue: number;
}

export interface FoodBusinessVatResult {
  taxableRevenue: number;
  outputVat: number;
  inputVatDeductible: number;
  vatPayable: number;
  vatRefund: number;
  netVatObligaiton: number;
}

export function calculateFoodBusinessVat(input: FoodBusinessVatInput): FoodBusinessVatResult {
  const taxableRevenue = Math.round(input.monthlyRevenue - input.exemptedRevenue);
  const outputVat = Math.round(taxableRevenue * (input.vatRate / 100));
  const inputVatDeductible = Math.round(input.inputVat);

  let vatPayable = 0;
  let vatRefund = 0;

  if (outputVat >= inputVatDeductible) {
    vatPayable = Math.round(outputVat - inputVatDeductible);
  } else {
    vatRefund = Math.round(inputVatDeductible - outputVat);
  }

  const netVatObligaiton = vatPayable > 0 ? vatPayable : -vatRefund;

  return {
    taxableRevenue,
    outputVat,
    inputVatDeductible,
    vatPayable,
    vatRefund,
    netVatObligaiton,
  };
}

export const EXAMPLE_1 = calculateFoodBusinessVat({
  monthlyRevenue: 500000,
  vatRate: 7,
  inputVat: 25000,
  exemptedRevenue: 0,
});

export const EXAMPLE_2 = calculateFoodBusinessVat({
  monthlyRevenue: 1000000,
  vatRate: 7,
  inputVat: 50000,
  exemptedRevenue: 0,
});

export const EXAMPLE_3 = calculateFoodBusinessVat({
  monthlyRevenue: 750000,
  vatRate: 7,
  inputVat: 40000,
  exemptedRevenue: 0,
});
