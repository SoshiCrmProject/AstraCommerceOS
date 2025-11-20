import { type Metadata } from "next";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type DocsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — ドキュメント" : "AstraCommerce OS — Documentation",
    description: isJa
      ? "AstraCommerce OS のセットアップと開発のためのガイドとリファレンス。"
      : "Guides and references for setting up and building with AstraCommerce OS.",
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { locale } = await params;
  const siteDict = await getSiteDictionary(locale);
  const { docs } = siteDict;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Docs
          </p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
            {docs.title}
          </h1>
          <p className="text-lg text-secondary">{docs.subtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {docs.categories.map((category) => (
            <div
              key={category.title}
              className="rounded-card border border-default bg-surface p-6 shadow-soft"
            >
              <h2 className="text-lg font-semibold text-primary">{category.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-secondary">
                {category.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="font-semibold text-accent-primary transition hover:translate-x-0.5 inline-flex items-center gap-1"
                    >
                      {link.label}
                      <span aria-hidden>→</span>
                    </Link>
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
