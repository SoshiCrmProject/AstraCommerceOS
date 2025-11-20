"use client";

import { useMemo, useState } from "react";
import { DashboardRevenueTimeseriesPoint } from "@/lib/services/dashboard-types";

type SeriesKind = "revenue" | "orders" | "profit";

type RevenueChartProps = {
  data: DashboardRevenueTimeseriesPoint[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  const [kind, setKind] = useState<SeriesKind>("revenue");

  const scale = useMemo(() => {
    const max =
      kind === "revenue"
        ? Math.max(...data.map((d) => d.revenue))
        : kind === "orders"
          ? Math.max(...data.map((d) => d.orders))
          : Math.max(...data.map((d) => d.profit));
    return max || 1;
  }, [data, kind]);

  const points = useMemo(() => {
    return data.map((d, idx) => {
      const x = (idx / Math.max(1, data.length - 1)) * 100;
      const value =
        kind === "revenue" ? d.revenue : kind === "orders" ? d.orders : d.profit;
      const y = 100 - (value / scale) * 100;
      return { x, y };
    });
  }, [data, kind, scale]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {(["revenue", "orders", "profit"] as SeriesKind[]).map((option) => (
          <button
            key={option}
            onClick={() => setKind(option)}
            className={`rounded-pill px-3 py-1 text-xs font-semibold transition ${
              kind === option
                ? "bg-accent-primary text-white shadow-token-sm"
                : "border border-default bg-surface text-secondary hover:bg-accent-primary-soft"
            }`}
          >
            {option === "revenue"
              ? "Revenue"
              : option === "orders"
                ? "Orders"
                : "Profit"}
          </button>
        ))}
      </div>
      <div className="relative h-56 w-full rounded-card border border-default bg-white">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2f7bff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2f7bff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            fill="url(#chartFill)"
            stroke="none"
            points={`0,100 ${points.map((p) => `${p.x},${p.y}`).join(" ")} 100,100`}
          />
          <polyline
            fill="none"
            stroke="#2f7bff"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          />
          {points.map((p, idx) => (
            <circle key={idx} cx={p.x} cy={p.y} r="1.3" fill="#0ea5e9" />
          ))}
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-secondary">
        {data.map((d) => (
          <div key={d.date} className="flex items-center justify-between rounded-card bg-surface-muted px-2 py-1">
            <span className="font-semibold text-primary">{d.date.slice(5)}</span>
            <span>
              {kind === "revenue" ? `$${(d.revenue / 1000).toFixed(1)}k` : kind === "orders" ? d.orders : `$${(d.profit / 1000).toFixed(1)}k`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
