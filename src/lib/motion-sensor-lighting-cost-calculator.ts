/**
 * Thai Motion Sensor & Lighting Cost Calculator (คำนวณต้นทุนเซนเซอร์การเคลื่อนไหวและไฟ)
 *
 * Estimates costs for motion-activated lighting and sensors
 */

export type LightType = 'led' | 'halogen' | 'solar';
export type SensorType = 'pir' | 'microwave' | 'dual_tech';

export interface MotionSensorLightingInput {
  numberOfFixtures: number;       // จำนวนจุดไฟ
  lightType: LightType;           // ประเภทหลอดไฟ
  sensorType: SensorType;         // ประเภทเซนเซอร์
  installationComplexity: 'simple' | 'moderate' | 'complex';
  wattagePerFixture: number;      // วัตต์ต่อจุด
}

export interface MotionSensorLightingResult {
  numberOfFixtures: number;
  lightType: string;
  sensorType: string;
  costPerFixture: number;
  sensorCostPerFixture: number;
  totalEquipmentCost: number;
  laborCostPerFixture: number;
  totalLaborCost: number;
  totalInstallationCost: number;
  estimatedMonthlyElectricCost: number;
  estimatedAnnualOperatingCost: number;
}

const LIGHT_COSTS: Record<LightType, number> = {
  led: 800,
  halogen: 400,
  solar: 1500,
};

const SENSOR_COSTS: Record<SensorType, number> = {
  pir: 300,           // Passive Infrared
  microwave: 500,     // Microwave sensor
  dual_tech: 800,     // Dual PIR + Microwave
};

const LABOR_COSTS: Record<string, number> = {
  simple: 2000,
  moderate: 4000,
  complex: 7000,
};

const ELECTRICITY_RATE = 6; // 6 THB per kWh

export function calculateMotionSensorLightingCost(input: MotionSensorLightingInput): MotionSensorLightingResult {
  const lightCost = LIGHT_COSTS[input.lightType];
  const sensorCost = SENSOR_COSTS[input.sensorType];
  const costPerFixture = lightCost + sensorCost;
  const totalEquipmentCost = costPerFixture * input.numberOfFixtures;

  const laborCostPerFixture = LABOR_COSTS[input.installationComplexity] / input.numberOfFixtures;
  const totalLaborCost = LABOR_COSTS[input.installationComplexity] * input.numberOfFixtures;

  const totalInstallationCost = totalEquipmentCost + totalLaborCost;

  // Estimate 4 hours per day usage (at night)
  const dailyHours = 4;
  const dailyKWh = (input.wattagePerFixture * input.numberOfFixtures * dailyHours) / 1000;
  const monthlyKWh = dailyKWh * 30;
  const estimatedMonthlyElectricCost = Math.round(monthlyKWh * ELECTRICITY_RATE);
  const estimatedAnnualOperatingCost = estimatedMonthlyElectricCost * 12;

  return {
    numberOfFixtures: input.numberOfFixtures,
    lightType: input.lightType,
    sensorType: input.sensorType,
    costPerFixture,
    sensorCostPerFixture: sensorCost,
    totalEquipmentCost,
    laborCostPerFixture: Math.round(laborCostPerFixture),
    totalLaborCost,
    totalInstallationCost,
    estimatedMonthlyElectricCost,
    estimatedAnnualOperatingCost,
  };
}
