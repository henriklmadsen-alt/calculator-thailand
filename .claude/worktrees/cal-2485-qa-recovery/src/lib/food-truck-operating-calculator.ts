export interface FoodTruckOperatingInput {
  vehicleMaintenanceCost: number;
  fuelCostPerDay: number;
  foodInventoryCost: number;
  permitsLicensesPerMonth: number;
  insurancePerMonth: number;
  operatingDaysPerMonth: number;
}

export interface FoodTruckOperatingResult {
  monthlyMaintenance: number;
  monthlyFuel: number;
  monthlyInventory: number;
  monthlyPermits: number;
  monthlyInsurance: number;
  totalMonthlyOperatingCost: number;
  totalYearlyOperatingCost: number;
  costPerOperatingDay: number;
}

export function calculateFoodTruckOperating(input: FoodTruckOperatingInput): FoodTruckOperatingResult {
  const monthlyMaintenance = Math.round(input.vehicleMaintenanceCost);
  const monthlyFuel = Math.round(input.fuelCostPerDay * input.operatingDaysPerMonth);
  const monthlyInventory = Math.round(input.foodInventoryCost);
  const monthlyPermits = Math.round(input.permitsLicensesPerMonth);
  const monthlyInsurance = Math.round(input.insurancePerMonth);

  const totalMonthlyOperatingCost = Math.round(
    monthlyMaintenance + monthlyFuel + monthlyInventory + monthlyPermits + monthlyInsurance
  );
  const totalYearlyOperatingCost = Math.round(totalMonthlyOperatingCost * 12);
  const costPerOperatingDay = Math.round(totalMonthlyOperatingCost / input.operatingDaysPerMonth);

  return {
    monthlyMaintenance,
    monthlyFuel,
    monthlyInventory,
    monthlyPermits,
    monthlyInsurance,
    totalMonthlyOperatingCost,
    totalYearlyOperatingCost,
    costPerOperatingDay,
  };
}

export const EXAMPLE_1 = calculateFoodTruckOperating({
  vehicleMaintenanceCost: 8000,
  fuelCostPerDay: 1000,
  foodInventoryCost: 30000,
  permitsLicensesPerMonth: 5000,
  insurancePerMonth: 3000,
  operatingDaysPerMonth: 25,
});

export const EXAMPLE_2 = calculateFoodTruckOperating({
  vehicleMaintenanceCost: 10000,
  fuelCostPerDay: 1500,
  foodInventoryCost: 40000,
  permitsLicensesPerMonth: 6000,
  insurancePerMonth: 4000,
  operatingDaysPerMonth: 26,
});

export const EXAMPLE_3 = calculateFoodTruckOperating({
  vehicleMaintenanceCost: 9000,
  fuelCostPerDay: 1200,
  foodInventoryCost: 35000,
  permitsLicensesPerMonth: 5500,
  insurancePerMonth: 3500,
  operatingDaysPerMonth: 25,
});
