// Aquarium setup cost calculator (KLC-0633)
export interface AquariumSetupInput {
  tankSize: 'small' | 'medium' | 'large';
}
export interface AquariumSetupResult {
  tankCost: number;
  equipmentCost: number;
  decorationCost: number;
  totalSetupCost: number;
}
const SETUP_COSTS: Record<string, any> = {
  small: { tank: 2000, equipment: 3000, decoration: 1000 },
  medium: { tank: 5000, equipment: 8000, decoration: 3000 },
  large: { tank: 12000, equipment: 15000, decoration: 5000 },
};
export function calculateAquariumSetup(input: AquariumSetupInput): AquariumSetupResult {
  const costs = SETUP_COSTS[input.tankSize];
  return {
    tankCost: costs.tank,
    equipmentCost: costs.equipment,
    decorationCost: costs.decoration,
    totalSetupCost: costs.tank + costs.equipment + costs.decoration,
  };
}
