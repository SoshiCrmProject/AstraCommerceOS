import { Suspense } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { ExperimentsContent } from './experiments-content';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pricing Experiments',
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ExperimentsPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Pricing Experiments"
        subtitle="A/B testing for optimal pricing strategies"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div className="text-secondary">Loading...</div>}>
          <ExperimentsContent locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
