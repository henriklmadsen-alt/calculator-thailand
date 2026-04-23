export interface FoodFranchiseCostInput {
  franchiseFeeOneTime: number;
  monthlyRoyaltyPercentage: number;
  monthlyMarketingFee: number;
  initialSetupCost: number;
  workingCapitalRequired: number;
  monthlyRevenue: number;
}

export interface FoodFranchiseCostResult {
  initialFranchiseFee: number;
  monthlyRoyalty: number;
  monthlyMarketingFee: number;
  totalMonthlyFranchiseCost: number;
  totalFirstYearCost: number;
  totalAnnualFranchiseCost: number;
  franchiseCostPercentageOfRevenue: number;
  breakEvenMonths: number;
}

export function calculateFoodFranchiseCost(input: FoodFranchiseCostInput): FoodFranchiseCostResult {
  const initialFranchiseFee = Math.round(input.franchiseFeeOneTime);
  const monthlyRoyalty = Math.round(input.monthlyRevenue * (input.monthlyRoyaltyPercentage / 100));
  const monthlyMarketingFee = Math.round(input.monthlyMarketingFee);

  const totalMonthlyFranchiseCost = Math.round(monthlyRoyalty + monthlyMarketingFee);
  const totalAnnualFranchiseCost = Math.round(totalMonthlyFranchiseCost * 12);
  const totalFirstYearCost = Math.round(
    initialFranchiseFee + input.initialSetupCost + input.workingCapitalRequired + totalAnnualFranchiseCost
  );

  const franchiseCostPercentageOfRevenue = input.monthlyRevenue > 0
    ? Math.round((totalMonthlyFranchiseCost / input.monthlyRevenue) * 100)
    : 0;

  const initialTotalInvestment = Math.round(initialFranchiseFee + input.initialSetupCost + input.workingCapitalRequired);
  const breakEvenMonths = totalMonthlyFranchiseCost > 0
    ? Math.round(initialTotalInvestment / totalMonthlyFranchiseCost)
    : 0;

  return {
    initialFranchiseFee,
    monthlyRoyalty,
    monthlyMarketingFee,
    totalMonthlyFranchiseCost,
    totalFirstYearCost,
    totalAnnualFranchiseCost,
    franchiseCostPercentageOfRevenue,
    breakEvenMonths,
  };
}

export const EXAMPLE_1 = calculateFoodFranchiseCost({
  franchiseFeeOneTime: 500000,
  monthlyRoyaltyPercentage: 5,
  monthlyMarketingFee: 10000,
  initialSetupCost: 1000000,
  workingCapitalRequired: 200000,
  monthlyRevenue: 800000,
});

export const EXAMPLE_2 = calculateFoodFranchiseCost({
  franchiseFeeOneTime: 750000,
  monthlyRoyaltyPercentage: 6,
  monthlyMarketingFee: 15000,
  initialSetupCost: 1500000,
  workingCapitalRequired: 300000,
  monthlyRevenue: 1200000,
});

export const EXAMPLE_3 = calculateFoodFranchiseCost({
  franchiseFeeOneTime: 600000,
  monthlyRoyaltyPercentage: 5.5,
  monthlyMarketingFee: 12000,
  initialSetupCost: 1200000,
  workingCapitalRequired: 250000,
  monthlyRevenue: 1000000,
});
