import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 300;

type MaintenancePageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: MaintenancePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ja" ? "メンテナンス中 | AstraCommerce OS" : "Maintenance | AstraCommerce OS",
  };
}

export default async function MaintenancePage({ params }: MaintenancePageProps) {
  const { locale } = await params;
  const dict = await getSiteDictionary(locale);
  const maintenance = dict.maintenance;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
          {maintenance.title}
        </h1>
        <p className="text-lg text-secondary">{maintenance.body}</p>
        <p className="text-sm text-muted">{maintenance.window}</p>
      </div>
    </div>
  );
}
