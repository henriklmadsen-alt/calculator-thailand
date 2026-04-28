export interface TableSetupInput {
  numberOfTables: number;
  tableUnitCost: number;
  numberOfChairs: number;
  chairUnitCost: number;
  linensCost: number;
  centerpiecesCost: number;
  laborCost: number;
}

export interface TableSetupResult {
  tableCost: number;
  chairCost: number;
  linensCost: number;
  centerpiecesCost: number;
  laborCost: number;
  totalTableSetupCost: number;
}

export function calculateTableSetup(input: TableSetupInput): TableSetupResult {
  const tableCost = Math.round(input.numberOfTables * input.tableUnitCost);
  const chairCost = Math.round(input.numberOfChairs * input.chairUnitCost);
  const totalTableSetupCost = Math.round(
    tableCost + chairCost + input.linensCost + input.centerpiecesCost + input.laborCost
  );

  return {
    tableCost,
    chairCost,
    linensCost: input.linensCost,
    centerpiecesCost: input.centerpiecesCost,
    laborCost: input.laborCost,
    totalTableSetupCost,
  };
}

export const EXAMPLE_1 = calculateTableSetup({
  numberOfTables: 10,
  tableUnitCost: 500,
  numberOfChairs: 40,
  chairUnitCost: 150,
  linensCost: 2000,
  centerpiecesCost: 3000,
  laborCost: 2000,
});

export const EXAMPLE_2 = calculateTableSetup({
  numberOfTables: 20,
  tableUnitCost: 600,
  numberOfChairs: 80,
  chairUnitCost: 200,
  linensCost: 4000,
  centerpiecesCost: 6000,
  laborCost: 4000,
});

export const EXAMPLE_3 = calculateTableSetup({
  numberOfTables: 30,
  tableUnitCost: 700,
  numberOfChairs: 120,
  chairUnitCost: 250,
  linensCost: 6000,
  centerpiecesCost: 9000,
  laborCost: 6000,
});
