export type MockInventoryItem = {
  sku: string;
  location: string;
  available: number;
  status: "healthy" | "low" | "oos";
};

export const mockInventory: MockInventoryItem[] = [
  { sku: "SKU-1001", location: "JP-3PL", available: 320, status: "healthy" },
  { sku: "SKU-1002", location: "EC-WH1", available: 42, status: "low" },
  { sku: "SKU-1004", location: "JP-3PL", available: 0, status: "oos" }
];
