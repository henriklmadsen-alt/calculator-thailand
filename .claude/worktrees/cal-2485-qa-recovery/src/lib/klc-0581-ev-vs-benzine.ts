/**
 * EV vs Petrol Car TCO Comparison (KLC-0581)
 */

export interface VehicleComparisonInput {
  purchasePrice: number;
  yearlyKM: number;
  vehicleLifeYears: number;
  fuelCost: number; // per liter or kWh
}

export interface VehicleComparisonResult {
  purchasePrice: number;
  fuelCost: number;
  maintenanceCost: number;
  insuranceCost: number;
  totalTCO: number;
  costPerKM: number;
}

export function compareEVvsPetrol(input: VehicleComparisonInput): {
  ev: VehicleComparisonResult;
  petrol: VehicleComparisonResult;
  savings: number;
} {
  const totalKM = input.yearlyKM * input.vehicleLifeYears;

  // EV calculations
  const evFuelCost = (totalKM / 5) * input.fuelCost; // 5 km per kWh
  const evMaintenanceCost = totalKM * 0.5; // 0.5 baht per km
  const evInsurance = input.purchasePrice * 0.03 * input.vehicleLifeYears;
  const evTCO = input.purchasePrice + evFuelCost + evMaintenanceCost + evInsurance;

  // Petrol calculations
  const petrolFuelCost = (totalKM / 13) * input.fuelCost; // 13 km per liter
  const petrolMaintenanceCost = totalKM * 1.5; // 1.5 baht per km
  const petrolInsurance = input.purchasePrice * 0.035 * input.vehicleLifeYears;
  const petrolTCO = input.purchasePrice + petrolFuelCost + petrolMaintenanceCost + petrolInsurance;

  return {
    ev: {
      purchasePrice: input.purchasePrice,
      fuelCost: Math.round(evFuelCost),
      maintenanceCost: Math.round(evMaintenanceCost),
      insuranceCost: Math.round(evInsurance),
      totalTCO: Math.round(evTCO),
      costPerKM: Math.round((evTCO / totalKM) * 100) / 100,
    },
    petrol: {
      purchasePrice: input.purchasePrice * 0.8, // Petrol cars generally cheaper
      fuelCost: Math.round(petrolFuelCost),
      maintenanceCost: Math.round(petrolMaintenanceCost),
      insuranceCost: Math.round(petrolInsurance),
      totalTCO: Math.round((input.purchasePrice * 0.8) + petrolFuelCost + petrolMaintenanceCost + petrolInsurance),
      costPerKM: Math.round((((input.purchasePrice * 0.8) + petrolFuelCost + petrolMaintenanceCost + petrolInsurance) / totalKM) * 100) / 100,
    },
    savings: Math.round(petrolTCO - evTCO),
  };
}

export const EXAMPLE_1 = compareEVvsPetrol({
  purchasePrice: 1500000,
  yearlyKM: 15000,
  vehicleLifeYears: 10,
  fuelCost: 5,
});

export const EXAMPLE_2 = compareEVvsPetrol({
  purchasePrice: 1000000,
  yearlyKM: 10000,
  vehicleLifeYears: 8,
  fuelCost: 6,
});

export const EXAMPLE_3 = compareEVvsPetrol({
  purchasePrice: 2000000,
  yearlyKM: 20000,
  vehicleLifeYears: 10,
  fuelCost: 4.5,
});
