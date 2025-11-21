import { getReviewsDictionary } from '@/i18n/getReviewsDictionary';
import { PageHeader } from '@/components/app/page-header';
import { ReviewsOverview } from '@/components/reviews/reviews-overview';
import { Sparkles, BarChart3, FileText } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getReviewsDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.title}
        subtitle={dict.subtitle}
        actions={
          <div className="flex gap-3">
            <Link
              href={`/${locale}/app/reviews/templates`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {dict.buttons.replyTemplates}
            </Link>
            <Link
              href={`/${locale}/app/reviews/insights`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {dict.buttons.openInsights}
            </Link>
            <Link
              href={`/${locale}/app/ai`}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {dict.buttons.askCopilot}
            </Link>
          </div>
        }
      />

      <ReviewsOverview dict={dict} locale={locale} />
    </div>
  );
}
