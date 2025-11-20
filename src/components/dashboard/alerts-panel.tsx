import { DashboardAlert } from "@/lib/services/dashboard-types";
import Link from "next/link";

type AlertsPanelProps = {
  alerts: DashboardAlert[];
  locale: string;
  viewAllLabel: string;
};

const severityColor = (severity: DashboardAlert["severity"]) =>
  severity === "critical"
    ? "bg-red-100 text-red-700"
    : severity === "warning"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

export function AlertsPanel({ alerts, locale, viewAllLabel }: AlertsPanelProps) {
  return (
    <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-card border border-default bg-surface-muted p-4 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${severityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
                <p className="text-sm font-semibold text-primary">{alert.title}</p>
              </div>
              {alert.category ? (
                <span className="text-xs uppercase tracking-wide text-muted">{alert.category}</span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-secondary">{alert.description}</p>
            {alert.ctaHref && alert.ctaLabel ? (
              <Link
                href={`/${locale}${alert.ctaHref}`}
                className="mt-2 inline-flex text-sm font-semibold text-accent-primary transition hover:translate-x-0.5"
              >
                {alert.ctaLabel}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="text-sm font-semibold text-accent-primary hover:underline">
          {viewAllLabel}
        </button>
      </div>
    </div>
  );
}
