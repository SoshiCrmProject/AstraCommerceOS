import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { PageHeader } from "@/components/app/page-header";
import { mockAutomations } from "@/lib/mocks/mock-automation";

type AutomationPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AutomationPage({ params }: AutomationPageProps) {
  const { locale } = await params;
  const dict = await getAppDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.automation.title}
        subtitle={dict.automation.subtitle}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.automation.title },
        ]}
        actions={<button className="btn btn-primary">{dict.common.buttons.addNew}</button>}
      />

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="grid gap-3 md:grid-cols-3">
          {mockAutomations.map((rule) => (
            <div
              key={rule.name}
              className="rounded-card border border-default bg-surface-muted p-4 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary">{rule.name}</p>
                <span
                  className={`rounded-pill px-3 py-1 text-xs font-semibold ${
                    rule.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {rule.status}
                </span>
              </div>
              <p className="text-xs text-muted">
                {dict.automation.table.trigger}: {rule.trigger}
              </p>
              <p className="mt-2 text-sm text-secondary">{rule.impact}</p>
              <p className="mt-1 text-xs text-muted">
                {dict.automation.table.lastRun}: {rule.lastRun}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
