export type PipelineKpiCard = {
  label: string;
  value: string | number;
  change?: string;
  direction?: "up" | "down" | "flat";
  variant?: "default" | "success" | "warning" | "danger";
};

type PipelineKpiBarProps = {
  kpis: PipelineKpiCard[];
};

export function PipelineKpiBar({ kpis }: PipelineKpiBarProps) {
  const getVariantStyles = (variant?: string) => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "danger":
        return "bg-red-50 border-red-200";
      default:
        return "bg-surface border-default";
    }
  };

  const arrow = (dir?: "up" | "down" | "flat") => {
    if (dir === "up") return "▲";
    if (dir === "down") return "▼";
    return "■";
  };

  return (
    <div className="grid gap-3 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={`rounded-card border p-3 shadow-token-md sm:p-4 ${getVariantStyles(kpi.variant)}`}
        >
          <p className="text-xs uppercase tracking-wide text-muted truncate">{kpi.label}</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-lg font-semibold text-primary sm:text-xl lg:text-2xl truncate">
              {kpi.value}
            </p>
            {kpi.change && kpi.direction && (
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
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
