import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";

type IntegrationsStripProps = {
  integrations: MarketingDictionary["integrations"];
};

export function IntegrationsStrip({ integrations }: IntegrationsStripProps) {
  return (
    <section
      className="section-shell bg-surface"
      id="integrations"
      aria-labelledby="integrations-title"
    >
      <div className="container-shell space-y-6">
        <div className="max-w-3xl space-y-2">
          <h2
            id="integrations-title"
            className="text-3xl font-semibold text-primary sm:text-4xl"
          >
            {integrations.title}
          </h2>
          <p className="text-lg text-secondary">{integrations.subtitle}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {integrations.items.map((item) => (
            <button
              key={item}
              type="button"
              className="group flex items-center justify-between gap-2 rounded-pill border border-default bg-surface px-4 py-3 text-sm font-semibold text-primary shadow-soft transition hover:-translate-y-0.5 hover:border-accent-primary hover:shadow-token-md"
              aria-label={item}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-primary-soft text-accent-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M12 5v14" strokeLinecap="round" />
                    <path d="M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
                <span>{item}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-accent-primary"
                aria-hidden
              >
                <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
