export interface RestaurantSeatingCapacityInput {
  totalSeatingCapacity: number;
  averageMealPrice: number;
  turnoversPerDay: number;
  occupancyRate: number;
  operatingDaysPerMonth: number;
}

export interface RestaurantSeatingCapacityResult {
  effectiveSeatingPerTurnover: number;
  mealsPerTurnover: number;
  mealsPerDay: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export function calculateRestaurantSeatingCapacity(input: RestaurantSeatingCapacityInput): RestaurantSeatingCapacityResult {
  const effectiveSeatingPerTurnover = Math.round(input.totalSeatingCapacity * (input.occupancyRate / 100));
  const mealsPerTurnover = effectiveSeatingPerTurnover;
  const mealsPerDay = Math.round(mealsPerTurnover * input.turnoversPerDay);
  const dailyRevenue = Math.round(mealsPerDay * input.averageMealPrice);
  const monthlyRevenue = Math.round(dailyRevenue * input.operatingDaysPerMonth);
  const yearlyRevenue = Math.round(monthlyRevenue * 12);

  return {
    effectiveSeatingPerTurnover,
    mealsPerTurnover,
    mealsPerDay,
    dailyRevenue,
    monthlyRevenue,
    yearlyRevenue,
  };
}

export const EXAMPLE_1 = calculateRestaurantSeatingCapacity({
  totalSeatingCapacity: 50,
  averageMealPrice: 250,
  turnoversPerDay: 2,
  occupancyRate: 80,
  operatingDaysPerMonth: 25,
});

export const EXAMPLE_2 = calculateRestaurantSeatingCapacity({
  totalSeatingCapacity: 100,
  averageMealPrice: 300,
  turnoversPerDay: 2.5,
  occupancyRate: 85,
  operatingDaysPerMonth: 26,
});

export const EXAMPLE_3 = calculateRestaurantSeatingCapacity({
  totalSeatingCapacity: 75,
  averageMealPrice: 280,
  turnoversPerDay: 2,
  occupancyRate: 80,
  operatingDaysPerMonth: 25,
});
