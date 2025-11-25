import { PageHeader } from '@/components/app/page-header';
import { AnalyticsContent } from './analytics-content';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export default async function InventoryAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Inventory Analytics"
        subtitle="Comprehensive inventory performance metrics and trend analysis"
      />

      <AnalyticsContent locale={locale} />
    </div>
  );
}
