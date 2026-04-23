export interface ApplianceUpgradeRoiInput {
  currentAppliance: number;
  newAppliance: number;
  yearsOfUse: number;
  energySavingsPercent: number;
}

export interface ApplianceUpgradeRoiResult {
  currentAppliance: number;
  newAppliance: number;
  yearsOfUse: number;
  energySavingsPercent: number;
  result: number;
}

export function calculateApplianceUpgradeRoi(input: ApplianceUpgradeRoiInput): ApplianceUpgradeRoiResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    currentAppliance: input.currentAppliance,
    newAppliance: input.newAppliance,
    yearsOfUse: input.yearsOfUse,
    energySavingsPercent: input.energySavingsPercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateApplianceUpgradeRoi({
  currentAppliance: 15000, newAppliance: 50000, yearsOfUse: 10, energySavingsPercent: 30,
});

export const EXAMPLE_2 = calculateApplianceUpgradeRoi({
  currentAppliance: 25000, newAppliance: 80000, yearsOfUse: 12, energySavingsPercent: 35,
});

export const EXAMPLE_3 = calculateApplianceUpgradeRoi({
  currentAppliance: 20000, newAppliance: 65000, yearsOfUse: 10, energySavingsPercent: 32,
});

