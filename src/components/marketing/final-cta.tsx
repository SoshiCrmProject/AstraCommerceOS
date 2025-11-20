import Link from "next/link";
import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";

type FinalCtaProps = {
  finalCta: MarketingDictionary["finalCta"];
};

export function FinalCta({ finalCta }: FinalCtaProps) {
  return (
    <section className="section-shell bg-section" id="pricing">
      <div className="container-shell">
        <div className="grid items-center gap-10 rounded-card border border-default bg-surface p-8 shadow-token-lg md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">
              {finalCta.title}
            </h2>
            <p className="text-lg text-secondary">{finalCta.subtitle}</p>
            <ul className="space-y-2 text-sm text-secondary">
              {finalCta.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent-primary-soft text-accent-primary">
                    ✓
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#start-trial"
                className="rounded-pill bg-accent-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
              >
                {finalCta.primaryCta}
              </Link>
              <Link
                href="#book-demo"
                className="rounded-pill border border-default bg-surface px-6 py-3 text-sm font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
              >
                {finalCta.secondaryCta}
              </Link>
            </div>
            <p className="text-sm text-muted">{finalCta.helper}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
