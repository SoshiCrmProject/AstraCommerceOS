import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { PageHeader } from "@/components/app/page-header";

type AdminPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const dict = await getAppDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.admin.title}
        subtitle={dict.admin.subtitle}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.admin.title },
        ]}
      />

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <p className="text-sm text-secondary">
          Plan usage, user management, and system status live here. (Mock UI.)
        </p>
      </div>
    </div>
  );
}
