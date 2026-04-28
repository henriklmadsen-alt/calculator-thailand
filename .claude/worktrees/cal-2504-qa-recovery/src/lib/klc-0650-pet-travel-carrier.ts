// Pet travel carrier and transport cost calculator (KLC-0650)
export type CarrierType = 'standard' | 'airline-approved' | 'luxury';
export type TransportMode = 'car' | 'train' | 'plane';
export interface PetTravelInput {
  carrierType: CarrierType;
  transportMode: TransportMode;
  distance: number;
}
export interface PetTravelResult {
  carrierCost: number;
  transportCost: number;
  totalCost: number;
}
const CARRIER_COSTS: Record<CarrierType, number> = {
  standard: 500,
  'airline-approved': 2000,
  luxury: 5000,
};
const TRANSPORT_COSTS: Record<TransportMode, number> = {
  car: 10,
  train: 50,
  plane: 500,
};
export function calculatePetTravel(input: PetTravelInput): PetTravelResult {
  const carrierCost = CARRIER_COSTS[input.carrierType];
  const transportCost = (TRANSPORT_COSTS[input.transportMode] || 10) * input.distance;
  return {
    carrierCost,
    transportCost,
    totalCost: carrierCost + transportCost,
  };
}
