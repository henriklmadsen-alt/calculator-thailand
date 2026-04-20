export interface ProductivityInput {
  laborers: number;
  daysWorked: number;
  rai: number;
}

export interface ProductivityResult {
  totalLaborCost: number;
  costPerRai: number;
  costPerDay: number;
}

export function calculateProductivity(input: ProductivityInput): ProductivityResult {
  const dailyWage = 300;
  const totalLaborCost = input.laborers * input.daysWorked * dailyWage;
  const costPerRai = input.rai > 0 ? totalLaborCost / input.rai : 0;
  const costPerDay = totalLaborCost / input.daysWorked;

  return {
    totalLaborCost: Math.round(totalLaborCost),
    costPerRai: Math.round(costPerRai),
    costPerDay: Math.round(costPerDay),
  };
}

export const EXAMPLE_1 = calculateProductivity({ laborers: 5, daysWorked: 10, rai: 10 });
export const EXAMPLE_2 = calculateProductivity({ laborers: 10, daysWorked: 20, rai: 50 });
