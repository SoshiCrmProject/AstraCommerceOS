import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { PageHeader } from "@/components/app/page-header";
import { mockReviews } from "@/lib/mocks/mock-reviews";

type ReviewsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { locale } = await params;
  const dict = await getAppDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.reviews.title}
        subtitle={dict.reviews.subtitle}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.reviews.title },
        ]}
        actions={<button className="btn btn-primary">{dict.common.buttons.viewAll}</button>}
      />

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="space-y-3">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="flex items-start justify-between rounded-card border border-default bg-surface-muted p-4 shadow-soft"
            >
              <div>
                <p className="text-sm font-semibold text-primary">{review.title}</p>
                <p className="text-xs text-muted">
                  {review.channel} · {review.id}
                </p>
                <p className="mt-1 text-sm text-secondary">Rating: {review.rating}/5</p>
              </div>
              <span
                className={`rounded-pill px-3 py-1 text-xs font-semibold ${
                  review.sentiment === "positive"
                    ? "bg-green-100 text-green-700"
                    : review.sentiment === "neutral"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {review.sentiment}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
