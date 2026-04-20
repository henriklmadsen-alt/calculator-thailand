/**
 * Thai Irrigation System Cost Calculator
 * Sources: Department of Irrigation, Thai Agricultural Engineering Standards
 */

export type IrrigationSystemType = 'drip' | 'sprinkler' | 'canal';

export interface IrrigationSystemInput {
  raiSize: number;
  systemType: IrrigationSystemType;
  wellRequired: boolean;
}

export interface IrrigationSystemResult {
  raiSize: number;
  systemType: IrrigationSystemType;
  systemTypeName: string;
  wellRequired: boolean;

  wellCost: number;
  pipelineCost: number;
  equipmentCost: number;
  laborCost: number;
  totalInstallationCost: number;

  annualMaintenanceCost: number;
  annualWaterCost: number;
  annualElectricityCost: number;
  totalAnnualCost: number;

  paybackPeriod: number; // years
}

const SYSTEM_NAMES: Record<IrrigationSystemType, string> = {
  drip: 'ระบบน้ำหยด',
  sprinkler: 'ระบบสปรินเคลอร์',
  canal: 'ระบบสุขภาคจาก',
};

export function calculateIrrigationSystemCost(input: IrrigationSystemInput): IrrigationSystemResult {
  const wellCost = input.wellRequired ? 40000 : 0;

  const costPerRai: Record<IrrigationSystemType, number> = {
    drip: 15000,
    sprinkler: 12000,
    canal: 8000,
  };

  const pipelineCost = input.raiSize * costPerRai[input.systemType];
  const equipmentCost = 5000 + input.raiSize * 2000;
  const laborCost = input.raiSize * 3000;

  const totalInstall = wellCost + pipelineCost + equipmentCost + laborCost;

  const annualMaint = input.raiSize * 1500;
  const annualWater = input.raiSize * 2000;
  const annualElec = input.raiSize * 3000;
  const totalAnnual = annualMaint + annualWater + annualElec;

  // Assuming 500-1000 THB/rai annual yield increase from irrigation
  const yearlyBenefit = input.raiSize * 750;
  const payback = totalInstall / yearlyBenefit;

  return {
    raiSize: input.raiSize,
    systemType: input.systemType,
    systemTypeName: SYSTEM_NAMES[input.systemType],
    wellRequired: input.wellRequired,
    wellCost: Math.round(wellCost),
    pipelineCost: Math.round(pipelineCost),
    equipmentCost: Math.round(equipmentCost),
    laborCost: Math.round(laborCost),
    totalInstallationCost: Math.round(totalInstall),
    annualMaintenanceCost: Math.round(annualMaint),
    annualWaterCost: Math.round(annualWater),
    annualElectricityCost: Math.round(annualElec),
    totalAnnualCost: Math.round(totalAnnual),
    paybackPeriod: Math.round(payback * 10) / 10,
  };
}

export const EXAMPLE_1 = calculateIrrigationSystemCost({
  raiSize: 10,
  systemType: 'drip',
  wellRequired: true,
});

export const EXAMPLE_2 = calculateIrrigationSystemCost({
  raiSize: 20,
  systemType: 'sprinkler',
  wellRequired: true,
});

export const EXAMPLE_3 = calculateIrrigationSystemCost({
  raiSize: 30,
  systemType: 'canal',
  wellRequired: false,
});
