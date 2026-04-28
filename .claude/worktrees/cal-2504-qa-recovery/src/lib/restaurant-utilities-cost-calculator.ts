export interface RestaurantUtilitiesInput {
  monthlyElectricity: number;
  monthlyWater: number;
  monthlyGas: number;
  monthlyInternet: number;
  monthlyPhone: number;
  monthlyWaste: number;
}

export interface RestaurantUtilitiesResult {
  monthlyElectricity: number;
  monthlyWater: number;
  monthlyGas: number;
  monthlyInternet: number;
  monthlyPhone: number;
  monthlyWaste: number;
  totalMonthlyUtilities: number;
  totalYearlyUtilities: number;
  costPerDay: number;
}

export function calculateRestaurantUtilities(input: RestaurantUtilitiesInput): RestaurantUtilitiesResult {
  const totalMonthlyUtilities = Math.round(
    input.monthlyElectricity +
    input.monthlyWater +
    input.monthlyGas +
    input.monthlyInternet +
    input.monthlyPhone +
    input.monthlyWaste
  );
  const totalYearlyUtilities = Math.round(totalMonthlyUtilities * 12);
  const costPerDay = Math.round(totalMonthlyUtilities / 30);

  return {
    monthlyElectricity: input.monthlyElectricity,
    monthlyWater: input.monthlyWater,
    monthlyGas: input.monthlyGas,
    monthlyInternet: input.monthlyInternet,
    monthlyPhone: input.monthlyPhone,
    monthlyWaste: input.monthlyWaste,
    totalMonthlyUtilities,
    totalYearlyUtilities,
    costPerDay,
  };
}

export const EXAMPLE_1 = calculateRestaurantUtilities({
  monthlyElectricity: 15000,
  monthlyWater: 5000,
  monthlyGas: 8000,
  monthlyInternet: 1500,
  monthlyPhone: 1000,
  monthlyWaste: 2000,
});

export const EXAMPLE_2 = calculateRestaurantUtilities({
  monthlyElectricity: 25000,
  monthlyWater: 8000,
  monthlyGas: 12000,
  monthlyInternet: 2000,
  monthlyPhone: 1500,
  monthlyWaste: 3000,
});

export const EXAMPLE_3 = calculateRestaurantUtilities({
  monthlyElectricity: 20000,
  monthlyWater: 6000,
  monthlyGas: 10000,
  monthlyInternet: 1500,
  monthlyPhone: 1000,
  monthlyWaste: 2500,
});
