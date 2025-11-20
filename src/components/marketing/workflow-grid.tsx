import Link from "next/link";
import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";

type WorkflowGridProps = {
  workflowGrid: MarketingDictionary["workflowGrid"];
};

export function WorkflowGrid({ workflowGrid }: WorkflowGridProps) {
  return (
    <section
      className="section-shell bg-section"
      id="workflow-grid"
      aria-labelledby="workflow-grid-title"
    >
      <div className="container-shell space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {workflowGrid.subtitle}
          </p>
          <h2
            id="workflow-grid-title"
            className="text-3xl font-semibold text-primary sm:text-4xl"
          >
            {workflowGrid.title}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflowGrid.items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-card border border-default bg-surface p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-token-lg"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent-success" />
                <h3 className="text-lg font-semibold text-primary">
                  {item.title}
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-secondary">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-0.5 text-accent-primary">✅</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="#automation"
                className="text-sm font-semibold text-accent-primary transition hover:translate-x-0.5"
              >
                {item.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
