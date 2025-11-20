export type DashboardKPI = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
};

export type HealthCard = {
  title: string;
  status: "operational" | "degraded" | "action";
  details: string;
};

export type AlertItem = {
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  cta?: string;
};

export const dashboardKpis: DashboardKPI[] = [
  { label: "Revenue (24h)", value: "$482,900", change: "+6.1%", trend: "up" },
  { label: "Orders (24h)", value: "12,842", change: "+4.3%", trend: "up" },
  { label: "Net profit", value: "$118,400", change: "+3.8%", trend: "up" },
  { label: "At-risk SKUs", value: "42", change: "-9.4%", trend: "down" },
];

export const healthCards: HealthCard[] = [
  { title: "Channels", status: "operational", details: "All connectors healthy" },
  { title: "Sync jobs", status: "operational", details: "Last sync 4m ago" },
  { title: "Automations", status: "degraded", details: "2 rules paused" },
  { title: "Fulfillment SLAs", status: "action", details: "3 orders nearing SLA" },
];

export const alerts: AlertItem[] = [
  {
    title: "Low stock on 18 SKUs",
    description: "Reorder recommended for JP-3PL and East Coast FC.",
    severity: "warning",
    cta: "Review inventory",
  },
  {
    title: "New negative reviews detected",
    description: "5 critical reviews on TikTok Shop · sentiment trending down.",
    severity: "critical",
    cta: "Open reviews",
  },
  {
    title: "Automation paused",
    description: "Buy Box recovery rule disabled after 3 failed attempts.",
    severity: "info",
    cta: "View automations",
  },
];
