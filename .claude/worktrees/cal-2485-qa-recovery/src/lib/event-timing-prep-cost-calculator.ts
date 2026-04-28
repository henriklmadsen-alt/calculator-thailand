export interface EventTimingPrepInput {
  setupHours: number;
  eventDurationHours: number;
  breakdownHours: number;
  laborHourlyRate: number;
  overheadCost?: number;
}

export interface EventTimingPrepResult {
  setupCost: number;
  eventDurationCost: number;
  breakdownCost: number;
  overheadCost: number;
  totalHours: number;
  totalTimingCost: number;
}

export function calculateEventTimingPrep(input: EventTimingPrepInput): EventTimingPrepResult {
  const totalHours = Math.round(input.setupHours + input.eventDurationHours + input.breakdownHours);
  const setupCost = Math.round(input.setupHours * input.laborHourlyRate);
  const eventDurationCost = Math.round(input.eventDurationHours * input.laborHourlyRate);
  const breakdownCost = Math.round(input.breakdownHours * input.laborHourlyRate);
  const overheadCost = input.overheadCost || 0;
  const totalTimingCost = Math.round(setupCost + eventDurationCost + breakdownCost + overheadCost);

  return {
    setupCost,
    eventDurationCost,
    breakdownCost,
    overheadCost,
    totalHours,
    totalTimingCost,
  };
}

export const EXAMPLE_1 = calculateEventTimingPrep({
  setupHours: 2,
  eventDurationHours: 4,
  breakdownHours: 1,
  laborHourlyRate: 400,
  overheadCost: 1000,
});

export const EXAMPLE_2 = calculateEventTimingPrep({
  setupHours: 4,
  eventDurationHours: 6,
  breakdownHours: 2,
  laborHourlyRate: 500,
  overheadCost: 2000,
});

export const EXAMPLE_3 = calculateEventTimingPrep({
  setupHours: 6,
  eventDurationHours: 8,
  breakdownHours: 3,
  laborHourlyRate: 600,
  overheadCost: 3000,
});
