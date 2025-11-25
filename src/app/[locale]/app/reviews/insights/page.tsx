import { getReviewsDictionary } from '@/i18n/getReviewsDictionary';
import { PageHeader } from '@/components/app/page-header';
import { InsightsView } from '@/components/reviews/insights-view';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getReviewsDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.insights.title}
        subtitle={dict.insights.subtitle}
      />

      <InsightsView dict={dict} locale={locale} />
    </div>
  );
}
