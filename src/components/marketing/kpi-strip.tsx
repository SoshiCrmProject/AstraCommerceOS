import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";

type KPIProps = {
  kpis: MarketingDictionary["kpis"];
};

const icons = {
  marketplaces: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M5 4h14v7H5z" strokeLinecap="round" />
      <path d="M3 11h18v9H3z" strokeLinecap="round" />
      <path d="M9 15h6" strokeLinecap="round" />
    </svg>
  ),
  products: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M4 7h16v10H4z" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
      <path d="M9 7v10m6-10v10" strokeLinecap="round" />
    </svg>
  ),
  orders: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M5 5h14v14H5z" strokeLinecap="round" />
      <path d="M5 10h14" strokeLinecap="round" />
      <path d="M10 5v5" strokeLinecap="round" />
    </svg>
  ),
  hours: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-6 w-6"
      aria-hidden
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12 9 9m3 3 3 4" strokeLinecap="round" />
    </svg>
  ),
};

export function KPIStrip({ kpis }: KPIProps) {
  const items = [
    { key: "marketplaces", ...kpis.marketplaces },
    { key: "products", ...kpis.products },
    { key: "orders", ...kpis.orders },
    { key: "hours", ...kpis.hours },
  ] as const;

  return (
    <section className="section-shell bg-section" aria-label="Key performance indicators">
      <div className="container-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="rounded-card border border-default bg-surface p-4 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent-primary-soft text-accent-primary">
                {icons[item.key as keyof typeof icons]}
              </div>
              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-wide text-muted">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold text-primary">
                  {item.value}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-secondary">{item.helper}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
