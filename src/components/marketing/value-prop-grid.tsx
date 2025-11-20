import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";

type ValuePropGridProps = {
  valueProps: MarketingDictionary["valueProps"];
};

const valueIcons = [
  (
    <svg
      key="unified"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M4 7h16v10H4z" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
      <path d="M9 7v10m6-10v10" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg
      key="listing"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M5 5h14v14H5z" strokeLinecap="round" />
      <path d="M5 10h14" strokeLinecap="round" />
      <path d="M10 5v5" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg
      key="routing"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h8" strokeLinecap="round" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  ),
  (
    <svg
      key="profit"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M6 17 18 7m0 0h-7m7 0v7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg
      key="protection"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M4 12c3 0 3 4 6 4s3-4 6-4 3 4 6 4" strokeLinecap="round" />
      <circle cx="6" cy="10" r="2" />
      <circle cx="12" cy="8" r="2" />
      <circle cx="18" cy="10" r="2" />
    </svg>
  ),
  (
    <svg
      key="automation"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden
    >
      <rect x="4" y="4" width="6" height="6" rx="2" />
      <rect x="14" y="4" width="6" height="6" rx="2" />
      <rect x="4" y="14" width="6" height="6" rx="2" />
      <path d="M14 14h6v6h-6z" />
    </svg>
  ),
];

export function ValuePropGrid({ valueProps }: ValuePropGridProps) {
  return (
    <section
      id="features"
      className="section-shell bg-section"
      aria-labelledby="value-props-title"
    >
      <div className="container-shell space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {valueProps.subtitle}
          </p>
          <h2
            id="value-props-title"
            className="text-3xl font-semibold text-primary sm:text-4xl"
          >
            {valueProps.title}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {valueProps.items.map((item, idx) => (
            <div
              key={item.label}
              className="flex flex-col gap-3 rounded-card border border-default bg-surface p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-token-lg"
            >
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-primary-soft text-accent-primary">
                  {valueIcons[idx]}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-primary">
                    {item.label}
                  </p>
                  <p className="text-sm text-secondary">{item.headline}</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-secondary">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-secondary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
