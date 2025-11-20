import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";

type AutomationSectionProps = {
  automation: MarketingDictionary["automation"];
  ui: MarketingDictionary["ui"];
};

const PillRow = ({
  label,
  items,
  tone = "primary",
}: {
  label: string;
  items: string[];
  tone?: "primary" | "secondary" | "success";
}) => {
  const toneClass =
    tone === "secondary"
      ? "bg-accent-primary-soft text-accent-primary"
      : tone === "success"
        ? "bg-accent-success/15 text-accent-success"
        : "bg-surface-muted text-primary";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-default bg-surface-muted p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-pill px-3 py-1 text-xs font-semibold transition ${toneClass}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export function AutomationSection({ automation, ui }: AutomationSectionProps) {
  return (
    <section
      className="section-shell bg-surface"
      id="automation"
      aria-labelledby="automation-title"
    >
      <div className="container-shell space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {automation.subtitle}
          </p>
          <h2
            id="automation-title"
            className="text-3xl font-semibold text-primary sm:text-4xl"
          >
            {automation.title}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {automation.workflows.map((workflow) => (
            <div
              key={workflow.name}
              className="flex flex-col gap-3 rounded-card border border-default bg-surface p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-token-lg"
              aria-label={workflow.name}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-primary">
                  {workflow.name}
                </h3>
                <span className="rounded-pill bg-accent-primary-soft px-3 py-1 text-xs font-semibold text-accent-primary">
                  {ui.live}
                </span>
              </div>
              <PillRow
                label={ui.triggers}
                items={workflow.triggers}
                tone="secondary"
              />
              <PillRow label={ui.conditions} items={workflow.conditions} />
              <PillRow label={ui.actions} items={workflow.actions} tone="success" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
