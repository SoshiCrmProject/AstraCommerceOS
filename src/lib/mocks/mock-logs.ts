export type MockLog = {
  id: string;
  module: string;
  severity: "info" | "warning" | "error";
  message: string;
  timestamp: string;
};

export const mockLogs: MockLog[] = [
  { id: "LG-1001", module: "Sync", severity: "info", message: "Amazon JP sync completed in 42s", timestamp: "2m ago" },
  { id: "LG-1002", module: "Automation", severity: "warning", message: "Buy Box recovery skipped for 5 listings", timestamp: "12m ago" },
  { id: "LG-1003", module: "Fulfillment", severity: "error", message: "Carrier API latency high for JP Post", timestamp: "24m ago" }
];
