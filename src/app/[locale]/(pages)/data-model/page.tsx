import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type DataModelPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: DataModelPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — データモデル" : "AstraCommerce OS — Data Model",
    description: isJa
      ? "商品・注文・在庫・料金・自動化の正規化スキーマ概要。"
      : "Normalized schemas for products, orders, inventory, fees, and automations.",
  };
}

export default async function DataModelPage({ params }: DataModelPageProps) {
  const { locale } = await params;
  const dict = await getSiteDictionary(locale);
  const content = dict.support.dataModel;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-4">
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{content.title}</h1>
        <p className="text-lg text-secondary">{content.body}</p>
        <div className="grid gap-3 md:grid-cols-3">
          {["Products", "Listings", "Orders", "Shipments", "Fees", "Automations"].map((entity) => (
            <div
              key={entity}
              className="rounded-card border border-default bg-surface p-4 text-sm text-secondary shadow-soft"
            >
              <p className="text-sm font-semibold text-primary">{entity}</p>
              <p className="mt-2 text-xs text-muted">ID, status, audit fields, relationships included.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
