export interface FoodBusinessIncomeTaxInput {
  monthlyRevenue: number;
  monthlyExpenses: number;
  personalDeductions: number;
  taxYear: number;
}

export interface FoodBusinessIncomeTaxResult {
  monthlyProfit: number;
  yearlyRevenue: number;
  yearlyExpenses: number;
  yearlyProfit: number;
  taxableIncome: number;
  incomeTax: number;
  monthlyTaxObligaiton: number;
}

export function calculateFoodBusinessIncomeTax(input: FoodBusinessIncomeTaxInput): FoodBusinessIncomeTaxResult {
  const monthlyProfit = Math.round(input.monthlyRevenue - input.monthlyExpenses);
  const yearlyRevenue = Math.round(input.monthlyRevenue * 12);
  const yearlyExpenses = Math.round(input.monthlyExpenses * 12);
  const yearlyProfit = Math.round(monthlyProfit * 12);

  const taxableIncome = Math.round(Math.max(0, yearlyProfit - input.personalDeductions));

  // Thailand progressive tax brackets (2024)
  let incomeTax = 0;
  if (taxableIncome <= 150000) {
    incomeTax = 0;
  } else if (taxableIncome <= 300000) {
    incomeTax = Math.round((taxableIncome - 150000) * 0.05);
  } else if (taxableIncome <= 500000) {
    incomeTax = Math.round(7500 + (taxableIncome - 300000) * 0.1);
  } else if (taxableIncome <= 750000) {
    incomeTax = Math.round(27500 + (taxableIncome - 500000) * 0.15);
  } else if (taxableIncome <= 1000000) {
    incomeTax = Math.round(65000 + (taxableIncome - 750000) * 0.2);
  } else {
    incomeTax = Math.round(115000 + (taxableIncome - 1000000) * 0.25);
  }

  const monthlyTaxObligaiton = Math.round(incomeTax / 12);

  return {
    monthlyProfit,
    yearlyRevenue,
    yearlyExpenses,
    yearlyProfit,
    taxableIncome,
    incomeTax,
    monthlyTaxObligaiton,
  };
}

export const EXAMPLE_1 = calculateFoodBusinessIncomeTax({
  monthlyRevenue: 500000,
  monthlyExpenses: 350000,
  personalDeductions: 60000,
  taxYear: 2024,
});

export const EXAMPLE_2 = calculateFoodBusinessIncomeTax({
  monthlyRevenue: 1000000,
  monthlyExpenses: 700000,
  personalDeductions: 60000,
  taxYear: 2024,
});

export const EXAMPLE_3 = calculateFoodBusinessIncomeTax({
  monthlyRevenue: 750000,
  monthlyExpenses: 500000,
  personalDeductions: 60000,
  taxYear: 2024,
});
