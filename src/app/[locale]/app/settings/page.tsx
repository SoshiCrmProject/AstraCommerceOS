import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { PageHeader } from "@/components/app/page-header";

type SettingsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  const dict = await getAppDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.settings.title}
        subtitle={dict.settings.subtitle}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.settings.title },
        ]}
        actions={<button className="btn btn-primary">{dict.common.buttons.settings}</button>}
      />

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <p className="text-sm text-secondary">
          Workspace, branding, notifications, and credential settings will appear here. (Mock UI.)
        </p>
      </div>
    </div>
  );
}
