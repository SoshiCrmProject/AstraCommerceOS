export type MockOrder = {
  id: string;
  channel: string;
  amount: string;
  status: "pending" | "fulfilled" | "delayed";
  eta: string;
};

export const mockOrders: MockOrder[] = [
  { id: "ORD-8451", channel: "Amazon JP", amount: "$182.20", status: "pending", eta: "Arrives in 2d" },
  { id: "ORD-8452", channel: "Shopify D2C", amount: "$64.80", status: "fulfilled", eta: "Delivered" },
  { id: "ORD-8453", channel: "Rakuten", amount: "$128.40", status: "delayed", eta: "Delayed 1d" },
  { id: "ORD-8454", channel: "TikTok Shop", amount: "$46.10", status: "pending", eta: "Arrives tomorrow" }
];
