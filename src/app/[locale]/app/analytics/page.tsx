import { type Locale } from "@/i18n/config";
import { getAnalyticsDictionary } from "@/i18n/getAnalyticsDictionary";
import { PageHeader } from "@/components/app/page-header";
import { AnalyticsOverviewClient } from "@/components/analytics/analytics-overview-client";
import AnalyticsService from "@/lib/services/analytics-service";
import { Download, Sparkles } from "lucide-react";

type AnalyticsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { locale } = await params;
  const dict = await getAnalyticsDictionary(locale);

  // Fetch initial analytics data
  const snapshot = await AnalyticsService.getAnalyticsOverview('org-demo', {
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    granularity: 'DAY',
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={dict.title}
        subtitle={dict.subtitle}
        actions={
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              {dict.buttons.downloadReport}
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {dict.buttons.askCopilot}
            </button>
          </div>
        }
      />

      <AnalyticsOverviewClient initialSnapshot={snapshot} dict={dict} locale={locale} />
    </div>
  );
}
