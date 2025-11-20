export type MockAutomation = {
  name: string;
  trigger: string;
  status: "active" | "paused";
  lastRun: string;
  impact: string;
};

export const mockAutomations: MockAutomation[] = [
  {
    name: "Buy Box recovery",
    trigger: "Buy box lost",
    status: "active",
    lastRun: "6m ago",
    impact: "Recovered 82 listings past 24h"
  },
  {
    name: "Low stock reroute",
    trigger: "Stock < safety",
    status: "active",
    lastRun: "12m ago",
    impact: "Rerouted 240 orders to JP 3PL"
  },
  {
    name: "Review escalation",
    trigger: "Rating < 4.0",
    status: "paused",
    lastRun: "2h ago",
    impact: "Awaiting owner approval"
  }
];
