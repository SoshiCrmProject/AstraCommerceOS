export type MockChannel = {
  id: string;
  name: string;
  region: string;
  status: "operational" | "degraded" | "action";
  revenue24h: string;
  orders24h: number;
  lastSync: string;
};

export const mockChannels: MockChannel[] = [
  {
    id: "amazon-jp",
    name: "Amazon Japan",
    region: "JP",
    status: "operational",
    revenue24h: "$182,000",
    orders24h: 5400,
    lastSync: "3m ago",
  },
  {
    id: "shopify-main",
    name: "Shopify D2C",
    region: "Global",
    status: "operational",
    revenue24h: "$92,400",
    orders24h: 2100,
    lastSync: "2m ago",
  },
  {
    id: "rakuten",
    name: "Rakuten",
    region: "JP",
    status: "degraded",
    revenue24h: "$46,200",
    orders24h: 1280,
    lastSync: "12m ago",
  },
  {
    id: "tiktok-shop",
    name: "TikTok Shop",
    region: "SEA",
    status: "operational",
    revenue24h: "$72,100",
    orders24h: 1980,
    lastSync: "4m ago",
  }
];
