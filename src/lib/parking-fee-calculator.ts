/**
 * Parking Fee Calculator
 */

export interface ParkingFeeInput {
  location: 'mall' | 'hospital' | 'street' | 'airport';
  hours: number;
}

export interface ParkingFeeResult {
  location: string;
  hours: number;
  hourlyRate: number;
  totalFee: number;
}

function getHourlyRate(location: string): number {
  const rates: Record<string, number> = {
    'mall': 40,
    'hospital': 30,
    'street': 10,
    'airport': 60,
  };
  return rates[location] || 20;
}

function getLocationName(location: string): string {
  const names: Record<string, string> = {
    'mall': 'Shopping Mall',
    'hospital': 'Hospital/Clinic',
    'street': 'Street Parking',
    'airport': 'Airport',
  };
  return names[location] || 'General Area';
}

export function calculateParkingFee(input: ParkingFeeInput): ParkingFeeResult {
  const hourlyRate = getHourlyRate(input.location);
  const totalFee = hourlyRate * input.hours;

  return {
    location: getLocationName(input.location),
    hours: input.hours,
    hourlyRate,
    totalFee,
  };
}

export const EXAMPLE_1 = calculateParkingFee({ location: 'mall', hours: 3 });
export const EXAMPLE_2 = calculateParkingFee({ location: 'hospital', hours: 2 });
export const EXAMPLE_3 = calculateParkingFee({ location: 'airport', hours: 8 });
