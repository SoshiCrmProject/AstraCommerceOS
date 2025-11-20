type KpiCard = {
  label: string;
  value: string;
  change: string;
  direction: "up" | "down" | "flat";
};

type KpiStripProps = {
  kpis: KpiCard[];
};

const arrow = (dir: KpiCard["direction"]) => {
  if (dir === "up") return "▲";
  if (dir === "down") return "▼";
  return "■";
};

export function KpiStrip({ kpis }: KpiStripProps) {
  return (
    <div className="grid gap-3 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-card border border-default bg-surface p-3 shadow-token-md sm:p-4"
        >
          <p className="text-xs uppercase tracking-wide text-muted truncate">{kpi.label}</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-lg font-semibold text-primary sm:text-xl lg:text-2xl truncate">{kpi.value}</p>
            <span
              className={`rounded-pill px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap sm:px-2 sm:py-1 ${
                kpi.direction === "up"
                  ? "bg-green-100 text-green-700"
                  : kpi.direction === "down"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-secondary"
              }`}
            >
              {arrow(kpi.direction)} {kpi.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
