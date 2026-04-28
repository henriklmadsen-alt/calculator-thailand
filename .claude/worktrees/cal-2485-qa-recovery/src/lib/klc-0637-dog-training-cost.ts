// Dog training cost calculator (KLC-0637)
export type TrainingType = 'basic' | 'obedience' | 'advanced' | 'agility';
export interface DogTrainingInput {
  trainingType: TrainingType;
  sessions: number;
}
export interface DogTrainingResult {
  costPerSession: number;
  totalCost: number;
}
const TRAINING_COSTS: Record<TrainingType, number> = {
  basic: 500,
  obedience: 800,
  advanced: 1200,
  agility: 1500,
};
export function calculateDogTraining(input: DogTrainingInput): DogTrainingResult {
  const { trainingType, sessions } = input;
  const costPerSession = TRAINING_COSTS[trainingType];
  return { costPerSession, totalCost: costPerSession * sessions };
}
