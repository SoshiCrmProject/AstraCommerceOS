export type MockProduct = {
  sku: string;
  title: string;
  channel: string;
  inventory: number;
  status: "active" | "low" | "paused";
};

export const mockProducts: MockProduct[] = [
  { sku: "SKU-1001", title: "Ergonomic Office Chair Pro", channel: "Amazon JP", inventory: 320, status: "active" },
  { sku: "SKU-1002", title: "Wireless ANC Headphones", channel: "Shopify D2C", inventory: 42, status: "low" },
  { sku: "SKU-1003", title: "Travel Backpack 28L", channel: "Rakuten", inventory: 180, status: "active" },
  { sku: "SKU-1004", title: "Smart Kettle Pro", channel: "TikTok Shop", inventory: 0, status: "paused" }
];
