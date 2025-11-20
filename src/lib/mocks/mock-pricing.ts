export type MockPricingProfile = {
  name: string;
  channel: string;
  floor: string;
  ceiling: string;
  status: "active" | "draft";
};

export const mockPricingProfiles: MockPricingProfile[] = [
  { name: "Premium electronics", channel: "Amazon JP", floor: "$120", ceiling: "$240", status: "active" },
  { name: "D2C margin-first", channel: "Shopify", floor: "$40", ceiling: "$120", status: "active" },
  { name: "Seasonal sale", channel: "Rakuten", floor: "$18", ceiling: "$48", status: "draft" }
];
