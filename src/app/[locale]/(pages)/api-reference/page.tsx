import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type ApiReferencePageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: ApiReferencePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — APIリファレンス" : "AstraCommerce OS — API Reference",
    description: isJa
      ? "AstraCommerce OSのREST・GraphQLエンドポイント仕様。"
      : "REST and GraphQL endpoint reference for AstraCommerce OS.",
  };
}

export default async function ApiReferencePage({ params }: ApiReferencePageProps) {
  const { locale } = await params;
  const dict = await getSiteDictionary(locale);
  const content = dict.support.apiReference;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-4">
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{content.title}</h1>
        <p className="text-lg text-secondary">{content.body}</p>
        <div className="rounded-card border border-default bg-surface p-6 shadow-soft">
          <p className="text-sm text-secondary">
            Example REST: <code className="rounded-card bg-surface-muted px-2 py-1">GET /api/listings</code>
          </p>
          <p className="text-sm text-secondary">
            Example GraphQL: <code className="rounded-card bg-surface-muted px-2 py-1">query Listings {`{ listings { id title status } }`}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
