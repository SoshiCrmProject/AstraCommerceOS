import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { PageHeader } from "@/components/app/page-header";
import { mockPricingProfiles } from "@/lib/mocks/mock-pricing";

type PricingPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  const dict = await getAppDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.pricing.title}
        subtitle={dict.pricing.subtitle}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.pricing.title },
        ]}
        actions={<button className="btn btn-primary">New profile</button>}
      />

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="grid gap-3 md:grid-cols-3">
          {mockPricingProfiles.map((profile) => (
            <div
              key={profile.name}
              className="rounded-card border border-default bg-surface-muted p-4 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">{profile.name}</p>
                  <p className="text-xs text-muted">{profile.channel}</p>
                </div>
                <span
                  className={`rounded-pill px-3 py-1 text-xs font-semibold ${
                    profile.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {profile.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-secondary">
                <span>{dict.pricing.table.floor}</span>
                <span className="font-semibold text-primary">{profile.floor}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-secondary">
                <span>{dict.pricing.table.ceiling}</span>
                <span className="font-semibold text-primary">{profile.ceiling}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
