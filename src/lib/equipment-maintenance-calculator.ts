export interface EquipmentMaintenanceInput {
  purchasePrice: number;
  months: number;
}

export interface EquipmentMaintenanceResult {
  monthlyMaintenance: number;
  totalMaintenance: number;
  annualDepreciation: number;
  remainingValue: number;
}

export function calculateMaintenance(input: EquipmentMaintenanceInput): EquipmentMaintenanceResult {
  const maintenanceRate = 0.05;
  const monthlyMaintenance = input.purchasePrice * maintenanceRate / 12;
  const totalMaintenance = monthlyMaintenance * input.months;
  const annualDepreciation = input.purchasePrice * 0.1;
  const years = input.months / 12;
  const remainingValue = input.purchasePrice - (annualDepreciation * years);

  return {
    monthlyMaintenance: Math.round(monthlyMaintenance),
    totalMaintenance: Math.round(totalMaintenance),
    annualDepreciation: Math.round(annualDepreciation),
    remainingValue: Math.round(remainingValue),
  };
}

export const EXAMPLE_1 = calculateMaintenance({ purchasePrice: 500000, months: 12 });
export const EXAMPLE_2 = calculateMaintenance({ purchasePrice: 1000000, months: 24 });
