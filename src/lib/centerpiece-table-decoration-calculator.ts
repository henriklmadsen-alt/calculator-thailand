export interface CenterpieceDecoratiInput {
  numberOfTables: number;
  floralArrangementQuantity: number;
  floralArrangementPrice: number;
  candleQuantity: number;
  candleUnitPrice: number;
  placeSettingQuantity: number;
  placeSettingUnitPrice: number;
  tableRunnerQuantity: number;
  tableRunnerUnitPrice: number;
}

export interface CenterpieceDecorationResult {
  floralArrangementCost: number;
  candleCost: number;
  placeSettingCost: number;
  tableRunnerCost: number;
  totalTableDecorationCost: number;
  costPerTable: number;
}

export function calculateCenterpieceDecoration(input: CenterpieceDecoratiInput): CenterpieceDecorationResult {
  const floralArrangementCost = Math.round(input.floralArrangementQuantity * input.floralArrangementPrice);
  const candleCost = Math.round(input.candleQuantity * input.candleUnitPrice);
  const placeSettingCost = Math.round(input.placeSettingQuantity * input.placeSettingUnitPrice);
  const tableRunnerCost = Math.round(input.tableRunnerQuantity * input.tableRunnerUnitPrice);
  const totalTableDecorationCost = Math.round(
    floralArrangementCost + candleCost + placeSettingCost + tableRunnerCost
  );
  const costPerTable = Math.round(totalTableDecorationCost / input.numberOfTables);

  return {
    floralArrangementCost,
    candleCost,
    placeSettingCost,
    tableRunnerCost,
    totalTableDecorationCost,
    costPerTable,
  };
}

export const EXAMPLE_1 = calculateCenterpieceDecoration({
  numberOfTables: 10,
  floralArrangementQuantity: 10,
  floralArrangementPrice: 500,
  candleQuantity: 20,
  candleUnitPrice: 50,
  placeSettingQuantity: 40,
  placeSettingUnitPrice: 100,
  tableRunnerQuantity: 10,
  tableRunnerUnitPrice: 300,
});

export const EXAMPLE_2 = calculateCenterpieceDecoration({
  numberOfTables: 15,
  floralArrangementQuantity: 15,
  floralArrangementPrice: 600,
  candleQuantity: 30,
  candleUnitPrice: 60,
  placeSettingQuantity: 60,
  placeSettingUnitPrice: 120,
  tableRunnerQuantity: 15,
  tableRunnerUnitPrice: 350,
});

export const EXAMPLE_3 = calculateCenterpieceDecoration({
  numberOfTables: 20,
  floralArrangementQuantity: 20,
  floralArrangementPrice: 700,
  candleQuantity: 40,
  candleUnitPrice: 70,
  placeSettingQuantity: 80,
  placeSettingUnitPrice: 150,
  tableRunnerQuantity: 20,
  tableRunnerUnitPrice: 400,
});
