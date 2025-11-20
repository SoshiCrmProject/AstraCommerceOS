import { type Metadata } from "next";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type BlogPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — ブログ" : "AstraCommerce OS — Blog",
    description: isJa
      ? "オペレーションプレイブックやプラットフォームの最新情報をお届けします。"
      : "Operational playbooks and platform updates from AstraCommerce OS.",
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const siteDict = await getSiteDictionary(locale);
  const { blog } = siteDict;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Blog
          </p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
            {blog.title}
          </h1>
          <p className="text-lg text-secondary">{blog.subtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {blog.posts.map((post) => (
            <article
              key={post.slug}
              className="flex h-full flex-col gap-3 rounded-card border border-default bg-surface p-5 shadow-soft"
            >
              <p className="text-xs text-muted">{post.date}</p>
              <h2 className="text-lg font-semibold text-primary">{post.title}</h2>
              <p className="text-sm text-secondary">{post.excerpt}</p>
              <div className="mt-auto flex items-center justify-between text-sm text-muted">
                <span>{post.readTime}</span>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="font-semibold text-accent-primary transition hover:translate-x-0.5 inline-flex items-center gap-1"
                >
                  Read more <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
