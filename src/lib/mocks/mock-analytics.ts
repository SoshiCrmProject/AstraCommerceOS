export type MockAnalyticsCard = {
  title: string;
  value: string;
  change: string;
};

export const mockAnalyticsCards: MockAnalyticsCard[] = [
  { title: "Revenue (7d)", value: "$3.2M", change: "+5.2%" },
  { title: "Gross margin", value: "34.8%", change: "+0.8%" },
  { title: "Automation impact", value: "+$182k", change: "+11%" }
];
