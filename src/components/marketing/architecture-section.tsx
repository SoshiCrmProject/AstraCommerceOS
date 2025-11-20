import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";
import { HolographicPanel } from "../animations/holographic-panel";

type ArchitectureSectionProps = {
  architecture: MarketingDictionary["architecture"];
  ui: MarketingDictionary["ui"];
};

export function ArchitectureSection({ architecture, ui }: ArchitectureSectionProps) {
  return (
    <section
      className="section-shell bg-section"
      id="architecture"
      aria-labelledby="architecture-title"
    >
      <span id="docs" className="sr-only" aria-hidden />
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <h2
            id="architecture-title"
            className="text-3xl font-semibold text-primary sm:text-4xl"
          >
            {architecture.title}
          </h2>
          <p className="text-lg text-secondary">{architecture.subtitle}</p>
          <ul className="space-y-2 text-sm text-secondary">
            {architecture.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent-primary-soft text-accent-primary">
                  ▸
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <HolographicPanel
          title={architecture.panel.title}
          pills={architecture.panel.pills}
          signalLabel={ui.signal}
        />
      </div>
    </section>
  );
}
