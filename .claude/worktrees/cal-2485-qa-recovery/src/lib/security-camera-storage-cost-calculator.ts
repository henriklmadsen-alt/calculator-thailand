/**
 * Thai Security Camera Storage Cost Calculator (คำนวณต้นทุนเก็บข้อมูลกล้องวงจรปิด)
 *
 * Estimates cloud and local storage costs for CCTV systems
 */

export type StorageType = 'cloud' | 'local_nvr' | 'hybrid';
export type Resolution = '2mp' | '4mp' | '8mp';

export interface SecurityCameraStorageInput {
  numberOfCameras: number;
  resolution: Resolution;
  retentionDays: number;          // จำนวนวันที่ต้องเก็บ
  storageType: StorageType;
  numberOfMonths: number;          // คำนวณค่าใช้จ่ายกี่เดือน
}

export interface SecurityCameraStorageResult {
  numberOfCameras: number;
  resolution: string;
  retentionDays: number;
  storageType: string;
  dailyDataPerCamera: number;      // MB/day
  totalStorageNeeded: number;      // GB
  monthlyStorageCost: number;
  totalCostForPeriod: number;
  costPerCameraPerMonth: number;
}

const BITRATE_PER_CAMERA: Record<string, number> = {
  '2mp': 0.5,      // MB per second for 2MP
  '4mp': 1.0,      // MB per second for 4MP
  '8mp': 1.8,      // MB per second for 8MP
};

const CLOUD_STORAGE_RATES: Record<string, number> = {
  '2mp': 150,      // Per camera per month
  '4mp': 250,
  '8mp': 400,
};

const LOCAL_NVR_COST = 20000;  // One-time cost amortized
const LOCAL_NVR_MONTHLY = LOCAL_NVR_COST / 60; // 5-year amortization

const HYBRID_CLOUD_RATE = 100;  // Per camera per month (supplementary)

export function calculateSecurityCameraStorageCost(input: SecurityCameraStorageInput): SecurityCameraStorageResult {
  const bitrate = BITRATE_PER_CAMERA[input.resolution] || BITRATE_PER_CAMERA['4mp'];

  // Calculate daily data per camera in GB
  const secondsPerDay = 24 * 60 * 60;
  const dailyMBPerCamera = bitrate * secondsPerDay;
  const dailyGBPerCamera = dailyMBPerCamera / 1024;

  // Total storage needed
  const totalGB = dailyGBPerCamera * input.numberOfCameras * input.retentionDays;

  let monthlyStorageCost = 0;

  if (input.storageType === 'cloud') {
    monthlyStorageCost = CLOUD_STORAGE_RATES[input.resolution] * input.numberOfCameras;
  } else if (input.storageType === 'local_nvr') {
    monthlyStorageCost = LOCAL_NVR_MONTHLY;
  } else { // hybrid
    const hybridCost = HYBRID_CLOUD_RATE * input.numberOfCameras;
    monthlyStorageCost = LOCAL_NVR_MONTHLY + hybridCost;
  }

  const totalCostForPeriod = monthlyStorageCost * input.numberOfMonths;
  const costPerCameraPerMonth = Math.round(monthlyStorageCost / input.numberOfCameras);

  return {
    numberOfCameras: input.numberOfCameras,
    resolution: input.resolution,
    retentionDays: input.retentionDays,
    storageType: input.storageType,
    dailyDataPerCamera: Math.round(dailyGBPerCamera * 1000) / 1000,
    totalStorageNeeded: Math.round(totalGB),
    monthlyStorageCost: Math.round(monthlyStorageCost),
    totalCostForPeriod: Math.round(totalCostForPeriod),
    costPerCameraPerMonth,
  };
}
