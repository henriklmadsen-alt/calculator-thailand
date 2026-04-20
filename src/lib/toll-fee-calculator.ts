/**
 * Toll Road Fee Calculator
 * Calculate highway/expressway toll fees
 */

export interface TollFeeInput {
  route: 'bangkok-pattaya' | 'bangkok-prachuab' | 'bangkok-lopburi' | 'other';
  vehicleType: 'car' | 'motorcycle' | 'truck';
  trips: number;
}

export interface TollFeeResult {
  route: string;
  vehicleType: string;
  feePerTrip: number;
  trips: number;
  totalFee: number;
}

function getRouteInfo(route: string, vehicleType: string): number {
  const rates: Record<string, Record<string, number>> = {
    'bangkok-pattaya': { car: 150, motorcycle: 75, truck: 300 },
    'bangkok-prachuab': { car: 200, motorcycle: 100, truck: 400 },
    'bangkok-lopburi': { car: 100, motorcycle: 50, truck: 200 },
    'other': { car: 120, motorcycle: 60, truck: 240 },
  };
  return rates[route]?.[vehicleType] || 100;
}

function getRouteName(route: string): string {
  const names: Record<string, string> = {
    'bangkok-pattaya': 'Bangkok - Pattaya Expressway',
    'bangkok-prachuab': 'Bangkok - Prachuab Expressway',
    'bangkok-lopburi': 'Bangkok - Lopburi Expressway',
    'other': 'Other Routes (Average)',
  };
  return names[route] || 'Other Routes';
}

export function calculateTollFee(input: TollFeeInput): TollFeeResult {
  const feePerTrip = getRouteInfo(input.route, input.vehicleType);
  const totalFee = feePerTrip * input.trips;

  return {
    route: getRouteName(input.route),
    vehicleType: input.vehicleType,
    feePerTrip,
    trips: input.trips,
    totalFee,
  };
}

export const EXAMPLE_1 = calculateTollFee({
  route: 'bangkok-pattaya',
  vehicleType: 'car',
  trips: 1,
});

export const EXAMPLE_2 = calculateTollFee({
  route: 'bangkok-prachuab',
  vehicleType: 'car',
  trips: 10,
});

export const EXAMPLE_3 = calculateTollFee({
  route: 'bangkok-lopburi',
  vehicleType: 'truck',
  trips: 5,
});
