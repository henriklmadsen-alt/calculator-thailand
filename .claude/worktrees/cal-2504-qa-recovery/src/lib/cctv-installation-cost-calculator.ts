/**
 * Thai CCTV Installation Cost Calculator (คำนวณค่าติดตั้งกล้องวงจรปิด)
 *
 * Estimates installation costs for CCTV systems in Thailand
 */

export type CameraQuality = 'basic' | 'standard' | 'hd' | '4k';
export type StorageType = 'cloud' | 'local_nvr' | 'hybrid';

export interface CCTVInstallationInput {
  numberOfCameras: number;
  cameraQuality: CameraQuality;
  storageType: StorageType;
  installationDifficulty: 'easy' | 'moderate' | 'complex'; // based on wiring
}

export interface CCTVInstallationResult {
  numberOfCameras: number;
  cameraQuality: string;
  storageType: string;
  equipmentCost: number;
  installationLaborCost: number;
  storageMonthlyCost: number;
  totalSetupCost: number;
  estimatedMonthlyCost: number;
  estimatedAnnualCost: number;
}

const CAMERA_COSTS: Record<CameraQuality, number> = {
  basic: 3500,      // 3-5MP camera
  standard: 7500,   // 5-8MP camera
  hd: 12000,        // 8MP+ camera
  '4k': 18000,      // 4K camera
};

const STORAGE_COSTS: Record<StorageType, number> = {
  cloud: 500,       // Monthly cloud subscription
  local_nvr: 25000, // One-time NVR cost (amortized to monthly)
  hybrid: 1000,     // Hybrid system cost
};

const INSTALLATION_MULTIPLIERS: Record<string, number> = {
  easy: 1.0,
  moderate: 1.3,
  complex: 1.6,
};

const BASE_INSTALLATION_LABOR = 5000; // Per camera

export function calculateCCTVInstallation(input: CCTVInstallationInput): CCTVInstallationResult {
  const cameraCost = CAMERA_COSTS[input.cameraQuality];
  const equipmentCost = cameraCost * input.numberOfCameras;

  const laborMultiplier = INSTALLATION_MULTIPLIERS[input.installationDifficulty];
  const installationLaborCost = BASE_INSTALLATION_LABOR * input.numberOfCameras * laborMultiplier;

  const storageMonthlyCost = STORAGE_COSTS[input.storageType];

  const totalSetupCost = equipmentCost + installationLaborCost;
  const estimatedAnnualCost = storageMonthlyCost * 12;
  const estimatedMonthlyCost = storageMonthlyCost;

  return {
    numberOfCameras: input.numberOfCameras,
    cameraQuality: input.cameraQuality,
    storageType: input.storageType,
    equipmentCost,
    installationLaborCost,
    storageMonthlyCost,
    totalSetupCost: Math.round(totalSetupCost),
    estimatedMonthlyCost: Math.round(estimatedMonthlyCost),
    estimatedAnnualCost: Math.round(estimatedAnnualCost),
  };
}
