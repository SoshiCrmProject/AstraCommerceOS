export type MockReview = {
  id: string;
  channel: string;
  rating: number;
  title: string;
  sentiment: "positive" | "neutral" | "negative";
};

export const mockReviews: MockReview[] = [
  { id: "RV-1001", channel: "Amazon JP", rating: 5, title: "Fast shipping and great quality", sentiment: "positive" },
  { id: "RV-1002", channel: "TikTok Shop", rating: 2, title: "Packaging damaged", sentiment: "negative" },
  { id: "RV-1003", channel: "Rakuten", rating: 4, title: "Good value, will reorder", sentiment: "positive" }
];
