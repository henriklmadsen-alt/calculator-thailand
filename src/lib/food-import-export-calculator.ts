export interface FoodImportExportInput {
  productValue: number;
  tariffRate: number;
  inspectionFee: number;
  shippingCost: number;
  insuranceCost: number;
  customsBrokerFee: number;
  documentationCost: number;
}

export interface FoodImportExportResult {
  productValueBHT: number;
  tariffDuties: number;
  inspectionAndShippingCost: number;
  insuranceCost: number;
  customsBrokerFee: number;
  documentationCost: number;
  totalImportExportCost: number;
  totalImportedCost: number;
  costMarkupPercentage: number;
}

export function calculateFoodImportExport(input: FoodImportExportInput): FoodImportExportResult {
  const productValueBHT = Math.round(input.productValue);
  const tariffDuties = Math.round(productValueBHT * (input.tariffRate / 100));
  const inspectionAndShippingCost = Math.round(input.inspectionFee + input.shippingCost);
  const insuranceCost = Math.round(input.insuranceCost);
  const customsBrokerFee = Math.round(input.customsBrokerFee);
  const documentationCost = Math.round(input.documentationCost);

  const totalImportExportCost = Math.round(
    tariffDuties + inspectionAndShippingCost + insuranceCost + customsBrokerFee + documentationCost
  );
  const totalImportedCost = Math.round(productValueBHT + totalImportExportCost);
  const costMarkupPercentage = Math.round((totalImportExportCost / productValueBHT) * 100);

  return {
    productValueBHT,
    tariffDuties,
    inspectionAndShippingCost,
    insuranceCost,
    customsBrokerFee,
    documentationCost,
    totalImportExportCost,
    totalImportedCost,
    costMarkupPercentage,
  };
}

export const EXAMPLE_1 = calculateFoodImportExport({
  productValue: 500000,
  tariffRate: 15,
  inspectionFee: 10000,
  shippingCost: 50000,
  insuranceCost: 15000,
  customsBrokerFee: 20000,
  documentationCost: 5000,
});

export const EXAMPLE_2 = calculateFoodImportExport({
  productValue: 1000000,
  tariffRate: 20,
  inspectionFee: 15000,
  shippingCost: 100000,
  insuranceCost: 30000,
  customsBrokerFee: 40000,
  documentationCost: 10000,
});

export const EXAMPLE_3 = calculateFoodImportExport({
  productValue: 750000,
  tariffRate: 18,
  inspectionFee: 12000,
  shippingCost: 75000,
  insuranceCost: 22000,
  customsBrokerFee: 30000,
  documentationCost: 7000,
});
