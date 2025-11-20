import Link from "next/link";
import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";
type CommandCenterProps = {
  commandCenter: MarketingDictionary["commandCenter"];
  statCard: MarketingDictionary["hero"]["statCard"];
  ui: MarketingDictionary["ui"];
};

export function CommandCenterSection({
  commandCenter,
  statCard,
  ui,
}: CommandCenterProps) {
  return (
    <section
      className="section-shell bg-surface"
      id="command-center"
      aria-labelledby="command-center-title"
    >
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-pill border border-default bg-surface-muted px-3 py-1 text-sm font-medium text-secondary">
            <span className="h-2 w-2 rounded-full bg-accent-secondary" />
            {commandCenter.eyebrow}
          </div>
          <div className="space-y-3">
            <h2
              id="command-center-title"
              className="text-3xl font-semibold text-primary sm:text-4xl"
            >
              {commandCenter.title}
            </h2>
            <p className="max-w-2xl text-lg text-secondary">
              {commandCenter.body}
            </p>
          </div>
          <ul className="space-y-2 text-sm text-secondary">
            {commandCenter.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent-primary-soft text-accent-primary">
                  ✓
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <Link
            href="#docs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary transition hover:translate-x-0.5"
          >
            {commandCenter.linkLabel}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M5 12h14" strokeLinecap="round" />
              <path d="m13 6 6 6-6 6" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
        <div className="rounded-card border border-default bg-surface p-6 shadow-token-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">{statCard.title}</p>
            <span className="rounded-pill bg-accent-primary-soft px-3 py-1 text-xs font-semibold text-accent-primary">
              {ui.live}
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {statCard.metrics.map((metric) => (
              <div key={metric.label} className="rounded-card border border-default bg-surface-muted p-3 shadow-soft">
                <p className="text-xs uppercase tracking-wide text-muted">{metric.label}</p>
                <p className="text-xl font-semibold text-primary">{metric.value}</p>
                <p className="text-xs text-accent-success">{metric.change}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-card border border-default bg-gradient-to-r from-accent-primary-soft to-accent-secondary/10 p-4">
            <p className="text-sm font-semibold text-primary">
              {commandCenter.linkLabel}
            </p>
            <p className="text-xs text-secondary">
              {commandCenter.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
