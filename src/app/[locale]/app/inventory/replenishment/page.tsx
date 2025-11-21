import { PageHeader } from '@/components/app/page-header';
import { ReplenishmentContent } from './replenishment-content';

export default async function ReplenishmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Replenishment Planner"
        subtitle="AI-powered stock replenishment recommendations to prevent stockouts"
      />

      <ReplenishmentContent locale={locale} />
    </div>
  );
}
