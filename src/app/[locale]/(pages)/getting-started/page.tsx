import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type GettingStartedPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: GettingStartedPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — はじめに" : "AstraCommerce OS — Getting Started",
    description: isJa
      ? "ワークスペース作成からチャネル接続、ガードレール設定までの初期セットアップ。"
      : "Workspace creation, channel connections, and guardrails for your first setup.",
  };
}

export default async function GettingStartedPage({ params }: GettingStartedPageProps) {
  const { locale } = await params;
  const dict = await getSiteDictionary(locale);
  const content = dict.support.gettingStarted;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Docs
          </p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
            {content.title}
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {content.sections.map((section) => (
            <div
              key={section.title}
              className="rounded-card border border-default bg-surface p-6 shadow-soft"
            >
              <h2 className="text-lg font-semibold text-primary">{section.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-secondary">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
