export interface TentCanopyInput {
  tentQuantity: number;
  tentSizeCategory: 'small' | 'medium' | 'large';
  tentDailyRate: number;
  flooringCost: number;
  heatingCoolingCost?: number;
  setupLaborHours: number;
  laborHourlyRate: number;
}

export interface TentCanopyResult {
  tentCost: number;
  flooringCost: number;
  heatingCoolingCost: number;
  laborCost: number;
  totalTentCanopyCost: number;
}

export function calculateTentCanopy(input: TentCanopyInput): TentCanopyResult {
  const tentCost = Math.round(input.tentQuantity * input.tentDailyRate);
  const heatingCoolingCost = input.heatingCoolingCost || 0;
  const laborCost = Math.round(input.setupLaborHours * input.laborHourlyRate);
  const totalTentCanopyCost = Math.round(tentCost + input.flooringCost + heatingCoolingCost + laborCost);

  return {
    tentCost,
    flooringCost: input.flooringCost,
    heatingCoolingCost,
    laborCost,
    totalTentCanopyCost,
  };
}

export const EXAMPLE_1 = calculateTentCanopy({
  tentQuantity: 1,
  tentSizeCategory: 'medium',
  tentDailyRate: 5000,
  flooringCost: 2000,
  heatingCoolingCost: 1000,
  setupLaborHours: 4,
  laborHourlyRate: 500,
});

export const EXAMPLE_2 = calculateTentCanopy({
  tentQuantity: 2,
  tentSizeCategory: 'large',
  tentDailyRate: 8000,
  flooringCost: 4000,
  heatingCoolingCost: 2000,
  setupLaborHours: 6,
  laborHourlyRate: 600,
});

export const EXAMPLE_3 = calculateTentCanopy({
  tentQuantity: 3,
  tentSizeCategory: 'large',
  tentDailyRate: 10000,
  flooringCost: 6000,
  heatingCoolingCost: 3000,
  setupLaborHours: 8,
  laborHourlyRate: 700,
});
