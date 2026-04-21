/**
 * Thai Home Security Monitoring Cost Calculator (คำนวณค่าบริการเฝ้าระวังบ้าน)
 *
 * Estimates monthly monitoring costs for security systems
 */

export type MonitoringService = '24hr-response' | '24hr-alert' | 'app-only' | 'none';
export type ResponseTime = '15min' | '30min' | '1hr' | 'app-only';

export interface HomeSecurityMonitoringInput {
  monitoringService: MonitoringService;
  responseTime: ResponseTime;
  numberOfZones: number;
  additionalCameras: number;
}

export interface HomeSecurityMonitoringResult {
  monitoringService: string;
  responseTime: string;
  baseMonthlyFee: number;
  zoneAdditionalFee: number;
  cameraAdditionalFee: number;
  totalMonthlyFee: number;
  estimatedAnnualCost: number;
  estimatedMonthly3YearCost: number;
}

const MONITORING_BASE_FEES: Record<MonitoringService, number> = {
  '24hr-response': 800,
  '24hr-alert': 500,
  'app-only': 150,
  'none': 0,
};

const ZONE_FEES: Record<MonitoringService, number> = {
  '24hr-response': 50,
  '24hr-alert': 30,
  'app-only': 0,
  'none': 0,
};

const CAMERA_FEES: Record<MonitoringService, number> = {
  '24hr-response': 100,
  '24hr-alert': 80,
  'app-only': 50,
  'none': 0,
};

export function calculateHomeSecurityMonitoring(input: HomeSecurityMonitoringInput): HomeSecurityMonitoringResult {
  const baseFee = MONITORING_BASE_FEES[input.monitoringService];
  const zoneFee = ZONE_FEES[input.monitoringService] * input.numberOfZones;
  const cameraFee = CAMERA_FEES[input.monitoringService] * input.additionalCameras;

  const totalMonthlyFee = baseFee + zoneFee + cameraFee;
  const estimatedAnnualCost = totalMonthlyFee * 12;
  const estimatedMonthly3YearCost = totalMonthlyFee * 36;

  return {
    monitoringService: input.monitoringService,
    responseTime: input.responseTime,
    baseMonthlyFee: baseFee,
    zoneAdditionalFee: zoneFee,
    cameraAdditionalFee: cameraFee,
    totalMonthlyFee,
    estimatedAnnualCost,
    estimatedMonthly3YearCost,
  };
}
