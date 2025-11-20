import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type BlogArticleProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "ja"];
  const params: { locale: Locale; slug: string }[] = [];
  for (const locale of locales) {
    const dict = await getSiteDictionary(locale);
    dict.blog.posts.forEach((post) => params.push({ locale, slug: post.slug }));
  }
  return params;
}

export async function generateMetadata({
  params,
}: BlogArticleProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = await getSiteDictionary(locale);
  const post = dict.blog.posts.find((p) => p.slug === slug);
  if (!post) {
    return {};
  }
  return {
    title: `${post.title} | AstraCommerce OS`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { locale, slug } = await params;
  const dict = await getSiteDictionary(locale);
  const post = dict.blog.posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="section-shell">
      <div className="container-shell space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Blog
          </p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{post?.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
            <span>{dict.blog.article.author}</span>
            <span>•</span>
            <span>{dict.blog.article.readTime}</span>
            <span>•</span>
            <span>
              {dict.blog.article.updated}: {post?.date}
            </span>
          </div>
          <p className="text-lg text-secondary">{post?.excerpt}</p>
        </div>

        <article className="prose max-w-4xl rounded-card border border-default bg-surface p-6 shadow-soft prose-p:text-secondary">
          <p>
            {post?.excerpt} AstraCommerce OS combines automation guardrails, fee and routing
            transparency, and AI copilots so operators can react in minutes, not hours.
          </p>
          <p>
            Operators use trigger-condition-action flows with simulations to ensure every change is
            auditable. Pricing and listing adjustments can route through approvals while still
            recovering the buy box faster than manual playbooks.
          </p>
          <p>
            Connectors, webhooks, and GraphQL APIs make it easy to extend the platform to your ERP,
            WMS, and finance stack. With unified schemas and field-level encryption, governance stays
            intact while teams move quickly.
          </p>
        </article>
      </div>
    </div>
  );
}
