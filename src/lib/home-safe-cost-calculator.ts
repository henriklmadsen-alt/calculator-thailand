/**
 * Thai Home Safe Cost Calculator (คำนวณค่าตู้เซฟบ้าน)
 *
 * Estimates cost of home safes based on size and security level
 */

export type SafeSize = 'small' | 'medium' | 'large' | 'xlarge';
export type SecurityLevel = 'basic' | 'standard' | 'premium' | 'commercial';

export interface HomeSafeInput {
  safeSize: SafeSize;
  securityLevel: SecurityLevel;
  numberOfSafes: number;
  lockType: 'mechanical' | 'digital' | 'biometric';
  installationRequired: boolean;
}

export interface HomeSafeResult {
  safeSize: string;
  securityLevel: string;
  numberOfSafes: number;
  lockType: string;
  costPerSafe: number;
  totalEquipmentCost: number;
  installationCostPerSafe: number;
  totalInstallationCost: number;
  totalCost: number;
  maintenanceAnnualCost: number;
}

const SAFE_COSTS: Record<SafeSize, Record<SecurityLevel, number>> = {
  small: {
    basic: 4500,
    standard: 7500,
    premium: 12000,
    commercial: 18000,
  },
  medium: {
    basic: 8000,
    standard: 13000,
    premium: 20000,
    commercial: 30000,
  },
  large: {
    basic: 12000,
    standard: 18000,
    premium: 28000,
    commercial: 45000,
  },
  xlarge: {
    basic: 18000,
    standard: 28000,
    premium: 42000,
    commercial: 65000,
  },
};

const LOCK_SURCHARGES: Record<string, number> = {
  mechanical: 0,
  digital: 2000,
  biometric: 5000,
};

const INSTALLATION_COSTS: Record<SafeSize, number> = {
  small: 2000,
  medium: 3500,
  large: 5000,
  xlarge: 7500,
};

const MAINTENANCE_RATE = 0.02; // 2% of equipment cost per year

export function calculateHomeSafeCost(input: HomeSafeInput): HomeSafeResult {
  const baseCost = SAFE_COSTS[input.safeSize][input.securityLevel];
  const lockSurcharge = LOCK_SURCHARGES[input.lockType];
  const costPerSafe = baseCost + lockSurcharge;

  const totalEquipmentCost = costPerSafe * input.numberOfSafes;

  const installationCostPerSafe = input.installationRequired ? INSTALLATION_COSTS[input.safeSize] : 0;
  const totalInstallationCost = installationCostPerSafe * input.numberOfSafes;

  const totalCost = totalEquipmentCost + totalInstallationCost;
  const maintenanceAnnualCost = Math.round(totalEquipmentCost * MAINTENANCE_RATE);

  return {
    safeSize: input.safeSize,
    securityLevel: input.securityLevel,
    numberOfSafes: input.numberOfSafes,
    lockType: input.lockType,
    costPerSafe,
    totalEquipmentCost,
    installationCostPerSafe,
    totalInstallationCost,
    totalCost,
    maintenanceAnnualCost,
  };
}
