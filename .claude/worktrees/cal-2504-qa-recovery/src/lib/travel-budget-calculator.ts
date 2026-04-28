/**
 * Travel Budget Planner
 */

export interface TravelBudgetInput {
  days: number;
  accommodation: number; // daily
  food: number; // daily
  activities: number; // daily
  transport: number; // total trip
}

export interface TravelBudgetResult {
  days: number;
  accommodationTotal: number;
  foodTotal: number;
  activitiesTotal: number;
  transportTotal: number;
  subtotal: number;
  vat: number;
  total: number;
}

export function calculateTravelBudget(input: TravelBudgetInput): TravelBudgetResult {
  const accommodationTotal = input.accommodation * input.days;
  const foodTotal = input.food * input.days;
  const activitiesTotal = input.activities * input.days;
  const transportTotal = input.transport;

  const subtotal = accommodationTotal + foodTotal + activitiesTotal + transportTotal;
  const vat = Math.round(subtotal * 0.07);
  const total = subtotal + vat;

  return {
    days: input.days,
    accommodationTotal,
    foodTotal,
    activitiesTotal,
    transportTotal,
    subtotal,
    vat,
    total,
  };
}

export const EXAMPLE_1 = calculateTravelBudget({
  days: 3,
  accommodation: 2000,
  food: 1000,
  activities: 1500,
  transport: 2000,
});

export const EXAMPLE_2 = calculateTravelBudget({
  days: 7,
  accommodation: 1500,
  food: 800,
  activities: 2000,
  transport: 3000,
});

export const EXAMPLE_3 = calculateTravelBudget({
  days: 10,
  accommodation: 3000,
  food: 1200,
  activities: 2500,
  transport: 5000,
});
