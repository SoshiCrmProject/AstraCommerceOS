import { getReviewsDictionary } from '@/i18n/getReviewsDictionary';
import { ReviewDetailView } from '@/components/reviews/review-detail-view';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; reviewId: string }>;
};

export default async function ReviewDetailPage({ params }: Props) {
  const { locale, reviewId } = await params;
  const dict = await getReviewsDictionary(locale);

  return <ReviewDetailView reviewId={reviewId} dict={dict} locale={locale} />;
}
