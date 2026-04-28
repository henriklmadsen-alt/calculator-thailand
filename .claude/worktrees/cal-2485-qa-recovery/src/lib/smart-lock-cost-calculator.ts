/**
 * Thai Smart Lock Cost Comparison Calculator (คำนวณค่าล็อกสมาร์ท)
 *
 * Compares costs of different smart lock types and brands
 */

export type LockType = 'fingerprint' | 'keypad' | 'rfid' | 'wifi';
export type LockBrand = 'economy' | 'standard' | 'premium';

export interface SmartLockInput {
  lockType: LockType;
  lockBrand: LockBrand;
  numberOfLocks: number;
  installationRequired: boolean;
}

export interface SmartLockResult {
  lockType: string;
  lockBrand: string;
  numberOfLocks: number;
  costPerLock: number;
  totalEquipmentCost: number;
  installationCostPerLock: number;
  totalInstallationCost: number;
  totalCost: number;
  monthlyBatteryCost: number;
  estimatedAnnualOperatingCost: number;
}

const LOCK_COSTS: Record<LockType, Record<LockBrand, number>> = {
  fingerprint: {
    economy: 8000,
    standard: 12000,
    premium: 18000,
  },
  keypad: {
    economy: 5500,
    standard: 9000,
    premium: 15000,
  },
  rfid: {
    economy: 7000,
    standard: 11000,
    premium: 16000,
  },
  wifi: {
    economy: 10000,
    standard: 15000,
    premium: 22000,
  },
};

const INSTALLATION_COSTS: Record<string, number> = {
  economy: 1500,
  standard: 2500,
  premium: 3500,
};

const BATTERY_COSTS: Record<LockType, number> = {
  fingerprint: 200,  // Every 2 years
  keypad: 150,
  rfid: 100,
  wifi: 250,
};

export function calculateSmartLockCost(input: SmartLockInput): SmartLockResult {
  const costPerLock = LOCK_COSTS[input.lockType][input.lockBrand];
  const totalEquipmentCost = costPerLock * input.numberOfLocks;

  const installationCostPerLock = input.installationRequired ? INSTALLATION_COSTS[input.lockBrand] : 0;
  const totalInstallationCost = installationCostPerLock * input.numberOfLocks;

  const totalCost = totalEquipmentCost + totalInstallationCost;
  const monthlyBatteryCost = (BATTERY_COSTS[input.lockType] / 24) * input.numberOfLocks; // Amortized
  const estimatedAnnualOperatingCost = monthlyBatteryCost * 12;

  return {
    lockType: input.lockType,
    lockBrand: input.lockBrand,
    numberOfLocks: input.numberOfLocks,
    costPerLock,
    totalEquipmentCost,
    installationCostPerLock,
    totalInstallationCost,
    totalCost,
    monthlyBatteryCost: Math.round(monthlyBatteryCost),
    estimatedAnnualOperatingCost: Math.round(estimatedAnnualOperatingCost),
  };
}
