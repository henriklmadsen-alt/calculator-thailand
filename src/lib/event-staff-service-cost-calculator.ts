export interface EventStaffInput {
  coordinatorCount: number;
  waiterCount: number;
  securityCount: number;
  cleanerCount: number;
  hoursPerPerson: number;
  hourlyRate: number;
}

export interface EventStaffResult {
  totalStaff: number;
  totalStaffCost: number;
  coordinatorCost: number;
  waiterCost: number;
  securityCost: number;
  cleanerCost: number;
}

export function calculateEventStaff(input: EventStaffInput): EventStaffResult {
  const totalStaff = input.coordinatorCount + input.waiterCount + input.securityCount + input.cleanerCount;
  const totalStaffCost = Math.round(totalStaff * input.hoursPerPerson * input.hourlyRate);
  const coordinatorCost = Math.round(input.coordinatorCount * input.hoursPerPerson * input.hourlyRate);
  const waiterCost = Math.round(input.waiterCount * input.hoursPerPerson * input.hourlyRate);
  const securityCost = Math.round(input.securityCount * input.hoursPerPerson * input.hourlyRate);
  const cleanerCost = Math.round(input.cleanerCount * input.hoursPerPerson * input.hourlyRate);

  return {
    totalStaff,
    totalStaffCost,
    coordinatorCost,
    waiterCost,
    securityCost,
    cleanerCost,
  };
}

export const EXAMPLE_1 = calculateEventStaff({
  coordinatorCount: 1,
  waiterCount: 4,
  securityCount: 2,
  cleanerCount: 2,
  hoursPerPerson: 4,
  hourlyRate: 300,
});

export const EXAMPLE_2 = calculateEventStaff({
  coordinatorCount: 2,
  waiterCount: 8,
  securityCount: 3,
  cleanerCount: 3,
  hoursPerPerson: 6,
  hourlyRate: 350,
});

export const EXAMPLE_3 = calculateEventStaff({
  coordinatorCount: 3,
  waiterCount: 12,
  securityCount: 4,
  cleanerCount: 4,
  hoursPerPerson: 8,
  hourlyRate: 400,
});
