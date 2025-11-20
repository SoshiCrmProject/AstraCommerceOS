import Link from "next/link";
import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";
import { StatPanel } from "./stat-panel";

type HeroSectionProps = {
  hero: MarketingDictionary["hero"];
  ui: MarketingDictionary["ui"];
};

export function HeroSection({ hero, ui }: HeroSectionProps) {
  return (
    <section className="section-shell" id="hero" aria-labelledby="hero-title">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-6">
          <div className="inline-flex max-w-fit items-center gap-2 rounded-pill border border-default bg-surface px-3 py-1 text-sm font-medium text-secondary shadow-soft">
            <span className="h-2 w-2 rounded-full bg-accent-primary" />
            {hero.eyebrow}
          </div>
          <div className="space-y-4">
            <h1
              id="hero-title"
              className="text-4xl font-semibold leading-[1.05] text-primary sm:text-5xl"
            >
              {hero.title}
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-secondary">
              {hero.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#start-trial"
                className="rounded-pill bg-accent-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
              >
                {hero.primaryCta}
              </Link>
              <Link
                href="#book-demo"
                className="rounded-pill border border-default bg-surface px-6 py-3 text-sm font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
              >
                {hero.secondaryCta}
              </Link>
            </div>
            <p className="text-sm text-muted">{hero.secondaryNote}</p>
            <div className="flex flex-wrap gap-2">
              {hero.reassurance.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-pill bg-surface-muted px-3 py-1.5 text-xs font-medium text-secondary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute right-6 top-6 h-32 w-32 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, color-mix(in srgb, var(--accent-primary) 35%, transparent) 0%, transparent 65%)",
            }}
          />
          <StatPanel
            title={hero.statCard.title}
            metrics={hero.statCard.metrics}
            liveLabel={ui.live}
          />
        </div>
      </div>
    </section>
  );
}
