import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type SdkSetupPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: SdkSetupPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — SDKセットアップ" : "AstraCommerce OS — SDK Setup",
    description: isJa
      ? "Node/TypeScript向け型付きクライアントの初期設定ガイド。"
      : "Typed client setup for Node/TypeScript with retries, webhooks, and pagination helpers.",
  };
}

export default async function SdkSetupPage({ params }: SdkSetupPageProps) {
  const { locale } = await params;
  const dict = await getSiteDictionary(locale);
  const content = dict.support.sdkSetup;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-4">
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{content.title}</h1>
        <p className="text-lg text-secondary">{content.body}</p>
        <div className="rounded-card border border-default bg-surface p-6 shadow-soft space-y-3">
          <p className="text-sm font-semibold text-primary">Install</p>
          <code className="block rounded-card bg-surface-muted px-3 py-2 text-sm text-primary">
            npm install @astracommerce/sdk
          </code>
          <p className="text-sm font-semibold text-primary">Initialize</p>
          <code className="block rounded-card bg-surface-muted px-3 py-2 text-sm text-primary">
            {`import { createClient } from "@astracommerce/sdk";\nconst client = createClient({ apiKey: process.env.ASTRA_API_KEY });`}
          </code>
        </div>
      </div>
    </div>
  );
}
