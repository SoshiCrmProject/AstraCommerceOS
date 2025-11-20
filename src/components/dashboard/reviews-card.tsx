import Link from "next/link";
import { DashboardReviewSummary } from "@/lib/services/dashboard-types";

type ReviewsCardProps = {
  reviews: DashboardReviewSummary;
  locale: string;
  ctaLabel: string;
};

export function ReviewsCard({ reviews, locale, ctaLabel }: ReviewsCardProps) {
  return (
    <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Avg rating (30d)</p>
          <p className="text-2xl font-semibold text-primary">{reviews.avgRating30d.toFixed(2)}</p>
        </div>
        <Link href={`/${locale}/app/reviews?range=30d&sentiment=negative`} className="text-sm font-semibold text-accent-primary hover:underline">
          {ctaLabel}
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-card border border-default bg-surface-muted p-3 shadow-token-sm">
          <p className="text-xs uppercase tracking-wide text-muted">Positive</p>
          <p className="text-lg font-semibold text-primary">{reviews.positiveCount30d}</p>
        </div>
        <div className="rounded-card border border-default bg-surface-muted p-3 shadow-token-sm">
          <p className="text-xs uppercase tracking-wide text-muted">Negative</p>
          <p className="text-lg font-semibold text-primary">{reviews.negativeCount30d}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {reviews.topIssueKeywords.map((kw) => (
          <span key={kw} className="rounded-pill border border-default bg-surface px-3 py-1 text-xs font-semibold text-secondary">
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
