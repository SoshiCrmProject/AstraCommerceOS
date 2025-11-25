import { Suspense } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { SkuDetailContent } from './sku-detail-content';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'SKU Pricing Detail',
};

type Props = {
  params: Promise<{ locale: string; skuId: string }>;
};

export default async function SkuDetailPage({ params }: Props) {
  const { locale, skuId } = await params;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="SKU Pricing Detail"
        subtitle={`Detailed pricing view for SKU: ${skuId}`}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div className="text-secondary">Loading...</div>}>
          <SkuDetailContent locale={locale} skuId={skuId} />
        </Suspense>
      </div>
    </div>
  );
}
