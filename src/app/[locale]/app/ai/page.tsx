import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { PageHeader } from "@/components/app/page-header";

type AIPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AIPage({ params }: AIPageProps) {
  const { locale } = await params;
  const dict = await getAppDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.ai.title}
        subtitle={dict.ai.subtitle}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.ai.title },
        ]}
        actions={<button className="btn btn-primary">Launch Copilot</button>}
      />

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <p className="text-sm text-secondary">
          Ask AstraCommerce Copilot about revenue changes, failing automations, or to draft
          localization for listings. (Mock UI for now.)
        </p>
        <div className="mt-4 rounded-card border border-default bg-surface-muted p-4">
          <p className="text-sm font-semibold text-primary">Examples</p>
          <ul className="mt-2 space-y-1 text-sm text-secondary">
            <li>• Why did TikTok Shop revenue dip this week?</li>
            <li>• Draft Japanese bullets for SKU-1002</li>
            <li>• Simulate repricing for Amazon JP electronics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
