/**
 * Thai Alarm System Cost Calculator (คำนวณค่าระบบสัญญาณเตือนภัย)
 *
 * Calculates installation and monthly monitoring costs for home alarm systems
 */

export type AlarmType = 'basic' | 'wireless' | 'smart' | 'advanced';

export interface AlarmSystemInput {
  numberOfZones: number;      // จำนวนโซน (doors/windows)
  alarmType: AlarmType;       // ประเภทระบบ
  monitoringService: boolean; // มีบริการตรวจสอบ
  installationDifficulty: 'easy' | 'complex';
}

export interface AlarmSystemResult {
  numberOfZones: number;
  alarmType: string;
  equipmentCost: number;
  installationCost: number;
  monthlyMonitoringCost: number;
  totalSetupCost: number;
  estimatedAnnualCost: number;
  estimatedMonthlyTotalCost: number;
}

const ALARM_BASE_COSTS: Record<AlarmType, number> = {
  basic: 8000,      // Wired door/window sensors
  wireless: 15000,  // Wireless system
  smart: 25000,     // Smart home integrated
  advanced: 40000,  // Advanced with video integration
};

const ZONE_COSTS: Record<AlarmType, number> = {
  basic: 1500,
  wireless: 2500,
  smart: 3500,
  advanced: 5000,
};

const MONITORING_COSTS: Record<AlarmType, number> = {
  basic: 300,
  wireless: 400,
  smart: 600,
  advanced: 900,
};

const INSTALLATION_COSTS: Record<string, number> = {
  easy: 3000,
  complex: 7500,
};

export function calculateAlarmSystemCost(input: AlarmSystemInput): AlarmSystemResult {
  const baseCost = ALARM_BASE_COSTS[input.alarmType];
  const zoneCost = ZONE_COSTS[input.alarmType] * input.numberOfZones;
  const equipmentCost = baseCost + zoneCost;

  const installationCost = INSTALLATION_COSTS[input.installationDifficulty];
  const monthlyMonitoring = input.monitoringService ? MONITORING_COSTS[input.alarmType] : 0;

  const totalSetupCost = equipmentCost + installationCost;
  const estimatedMonthlyTotal = monthlyMonitoring;
  const estimatedAnnualCost = monthlyMonitoring * 12;

  return {
    numberOfZones: input.numberOfZones,
    alarmType: input.alarmType,
    equipmentCost,
    installationCost,
    monthlyMonitoringCost: monthlyMonitoring,
    totalSetupCost,
    estimatedAnnualCost: Math.round(estimatedAnnualCost),
    estimatedMonthlyTotalCost: Math.round(estimatedMonthlyTotal),
  };
}
