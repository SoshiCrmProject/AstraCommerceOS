import { Suspense } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { PricingContent } from './pricing-content';

export const metadata = {
  title: 'Pricing & Repricing',
};

type PricingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Pricing & Repricing"
        subtitle="Manage pricing strategies, repricing rules, and experiments"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div className="text-secondary">Loading...</div>}>
          <PricingContent locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
