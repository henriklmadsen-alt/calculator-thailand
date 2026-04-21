export interface BeverageServiceInput {
  guestCount: number;
  softDrinkPrice: number;
  softDrinkPercentage: number;
  alcoholicDrinkPrice: number;
  alcoholicDrinkPercentage: number;
  bartenderHours: number;
  bartenderHourlyRate: number;
}

export interface BeverageServiceResult {
  beverageCost: number;
  bartenderCost: number;
  totalBeverageCost: number;
  totalWithBartender: number;
}

export function calculateBeverageService(input: BeverageServiceInput): BeverageServiceResult {
  const softDrinkCost = Math.round((input.guestCount * input.softDrinkPrice * input.softDrinkPercentage) / 100);
  const alcoholicCost = Math.round((input.guestCount * input.alcoholicDrinkPrice * input.alcoholicDrinkPercentage) / 100);
  const beverageCost = Math.round(softDrinkCost + alcoholicCost);
  const bartenderCost = Math.round(input.bartenderHours * input.bartenderHourlyRate);
  const totalWithBartender = Math.round(beverageCost + bartenderCost);

  return {
    beverageCost,
    bartenderCost,
    totalBeverageCost: beverageCost,
    totalWithBartender,
  };
}

export const EXAMPLE_1 = calculateBeverageService({
  guestCount: 50,
  softDrinkPrice: 80,
  softDrinkPercentage: 60,
  alcoholicDrinkPrice: 150,
  alcoholicDrinkPercentage: 40,
  bartenderHours: 4,
  bartenderHourlyRate: 500,
});

export const EXAMPLE_2 = calculateBeverageService({
  guestCount: 100,
  softDrinkPrice: 100,
  softDrinkPercentage: 50,
  alcoholicDrinkPrice: 200,
  alcoholicDrinkPercentage: 50,
  bartenderHours: 6,
  bartenderHourlyRate: 600,
});

export const EXAMPLE_3 = calculateBeverageService({
  guestCount: 200,
  softDrinkPrice: 120,
  softDrinkPercentage: 40,
  alcoholicDrinkPrice: 250,
  alcoholicDrinkPercentage: 60,
  bartenderHours: 8,
  bartenderHourlyRate: 800,
});
