export interface RestaurantLaborInput {
  headChefMonthly: number;
  headsPerMonth: number;
  cooksPerMonth: number;
  serversPerMonth: number;
  dishwashersPerMonth: number;
  managerMonthly: number;
}

export interface RestaurantLaborResult {
  headChefCost: number;
  headsCost: number;
  cooksCost: number;
  serversCost: number;
  dishwashersCost: number;
  managerCost: number;
  totalMonthlyLabor: number;
  totalYearlyLabor: number;
}

export function calculateRestaurantLabor(input: RestaurantLaborInput): RestaurantLaborResult {
  const headChefCost = input.headChefMonthly;
  const headsCost = input.headsPerMonth;
  const cooksCost = input.cooksPerMonth;
  const serversCost = input.serversPerMonth;
  const dishwashersCost = input.dishwashersPerMonth;
  const managerCost = input.managerMonthly;

  const totalMonthlyLabor = Math.round(
    headChefCost + headsCost + cooksCost + serversCost + dishwashersCost + managerCost
  );
  const totalYearlyLabor = Math.round(totalMonthlyLabor * 12);

  return {
    headChefCost,
    headsCost,
    cooksCost,
    serversCost,
    dishwashersCost,
    managerCost,
    totalMonthlyLabor,
    totalYearlyLabor,
  };
}

export const EXAMPLE_1 = calculateRestaurantLabor({
  headChefMonthly: 50000,
  headsPerMonth: 40000,
  cooksPerMonth: 80000,
  serversPerMonth: 60000,
  dishwashersPerMonth: 30000,
  managerMonthly: 40000,
});

export const EXAMPLE_2 = calculateRestaurantLabor({
  headChefMonthly: 60000,
  headsPerMonth: 50000,
  cooksPerMonth: 120000,
  serversPerMonth: 90000,
  dishwashersPerMonth: 40000,
  managerMonthly: 50000,
});

export const EXAMPLE_3 = calculateRestaurantLabor({
  headChefMonthly: 45000,
  headsPerMonth: 35000,
  cooksPerMonth: 70000,
  serversPerMonth: 50000,
  dishwashersPerMonth: 25000,
  managerMonthly: 35000,
});
