import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { PageHeader } from "@/components/app/page-header";
import { mockInventory } from "@/lib/mocks/mock-inventory";

type InventoryPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function InventoryPage({ params }: InventoryPageProps) {
  const { locale } = await params;
  const dict = await getAppDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.inventory.title}
        subtitle={dict.inventory.subtitle}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.inventory.title },
        ]}
        actions={<button className="btn btn-primary">{dict.common.buttons.viewAll}</button>}
      />

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="grid gap-3 md:grid-cols-3">
          {mockInventory.map((item) => (
            <div
              key={`${item.sku}-${item.location}`}
              className="rounded-card border border-default bg-surface-muted p-4 shadow-soft"
            >
              <p className="text-sm font-semibold text-primary">{item.sku}</p>
              <p className="text-xs text-muted">{item.location}</p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-secondary">Available</span>
                <span className="font-semibold text-primary">{item.available}</span>
              </div>
              <div className="mt-2">
                <span
                  className={`rounded-pill px-3 py-1 text-xs font-semibold ${
                    item.status === "healthy"
                      ? "bg-green-100 text-green-700"
                      : item.status === "low"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
