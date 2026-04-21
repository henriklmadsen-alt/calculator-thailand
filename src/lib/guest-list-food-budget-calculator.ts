export interface GuestListFoodBudgetInput {
  confirmedGuests: number;
  potentialGuests: number;
  budgetPerPerson: number;
  totalAvailableBudget: number;
}

export interface GuestListFoodBudgetResult {
  confirmedGuestCost: number;
  potentialGuestCost: number;
  totalEstimatedCost: number;
  budgetStatus: string;
  budgetDifference: number;
}

export function calculateGuestListFoodBudget(input: GuestListFoodBudgetInput): GuestListFoodBudgetResult {
  const confirmedGuestCost = Math.round(input.confirmedGuests * input.budgetPerPerson);
  const potentialGuestCost = Math.round(input.potentialGuests * input.budgetPerPerson);
  const totalEstimatedCost = Math.round(confirmedGuestCost + potentialGuestCost);
  const budgetDifference = input.totalAvailableBudget - totalEstimatedCost;
  const budgetStatus = totalEstimatedCost <= input.totalAvailableBudget
    ? 'ภายในงบประมาณ'
    : `เกินงบประมาณ ${Math.abs(budgetDifference)} บาท`;

  return {
    confirmedGuestCost,
    potentialGuestCost,
    totalEstimatedCost,
    budgetStatus,
    budgetDifference,
  };
}

export const EXAMPLE_1 = calculateGuestListFoodBudget({
  confirmedGuests: 40,
  potentialGuests: 10,
  budgetPerPerson: 300,
  totalAvailableBudget: 20000,
});

export const EXAMPLE_2 = calculateGuestListFoodBudget({
  confirmedGuests: 80,
  potentialGuests: 20,
  budgetPerPerson: 400,
  totalAvailableBudget: 50000,
});

export const EXAMPLE_3 = calculateGuestListFoodBudget({
  confirmedGuests: 150,
  potentialGuests: 50,
  budgetPerPerson: 500,
  totalAvailableBudget: 120000,
});
