export interface TransportationInput {
  vehicleType: 'van' | 'truck' | 'bus';
  vehicleQuantity: number;
  vehicleHourlyRate: number;
  hoursRequired: number;
  fuelCost: number;
  driverHourlyRate: number;
}

export interface TransportationResult {
  vehicleRentalCost: number;
  driverCost: number;
  fuelCost: number;
  totalTransportationCost: number;
}

export function calculateTransportation(input: TransportationInput): TransportationResult {
  const vehicleRentalCost = Math.round(input.vehicleQuantity * input.vehicleHourlyRate * input.hoursRequired);
  const driverCost = Math.round(input.driverHourlyRate * input.hoursRequired);
  const totalTransportationCost = Math.round(vehicleRentalCost + input.fuelCost + driverCost);

  return {
    vehicleRentalCost,
    driverCost,
    fuelCost: input.fuelCost,
    totalTransportationCost,
  };
}

export const EXAMPLE_1 = calculateTransportation({
  vehicleType: 'van',
  vehicleQuantity: 1,
  vehicleHourlyRate: 800,
  hoursRequired: 4,
  fuelCost: 1000,
  driverHourlyRate: 400,
});

export const EXAMPLE_2 = calculateTransportation({
  vehicleType: 'bus',
  vehicleQuantity: 1,
  vehicleHourlyRate: 1200,
  hoursRequired: 6,
  fuelCost: 2000,
  driverHourlyRate: 500,
});

export const EXAMPLE_3 = calculateTransportation({
  vehicleType: 'truck',
  vehicleQuantity: 2,
  vehicleHourlyRate: 1000,
  hoursRequired: 8,
  fuelCost: 3000,
  driverHourlyRate: 600,
});
