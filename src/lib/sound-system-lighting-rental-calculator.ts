export interface SoundSystemInput {
  basicSystemCost?: number;
  advancedSystemCost?: number;
  rentalHours: number;
  hourlyLaborRate: number;
  technicianLabor?: number;
}

export interface SoundSystemResult {
  systemCost: number;
  laborCost: number;
  technicianCost: number;
  totalSystemCost: number;
}

export function calculateSoundSystem(input: SoundSystemInput): SoundSystemResult {
  const systemCost = Math.round((input.basicSystemCost || 0) + (input.advancedSystemCost || 0));
  const laborCost = Math.round(input.rentalHours * input.hourlyLaborRate);
  const technicianCost = input.technicianLabor || 0;
  const totalSystemCost = Math.round(systemCost + laborCost + technicianCost);

  return {
    systemCost,
    laborCost,
    technicianCost,
    totalSystemCost,
  };
}

export const EXAMPLE_1 = calculateSoundSystem({
  basicSystemCost: 3000,
  rentalHours: 4,
  hourlyLaborRate: 500,
});

export const EXAMPLE_2 = calculateSoundSystem({
  basicSystemCost: 5000,
  advancedSystemCost: 3000,
  rentalHours: 6,
  hourlyLaborRate: 800,
  technicianLabor: 2000,
});

export const EXAMPLE_3 = calculateSoundSystem({
  advancedSystemCost: 8000,
  rentalHours: 8,
  hourlyLaborRate: 1000,
  technicianLabor: 3000,
});
