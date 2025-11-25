import { PageHeader } from '@/components/app/page-header';
import { SkuDetailContent } from './sku-detail-content';
import { InventoryService } from '@/lib/services/inventory-service';
import { notFound } from 'next/navigation';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export default async function SkuDetailPage({
  params,
}: {
  params: Promise<{ locale: string; skuId: string }>;
}) {
  const { locale, skuId } = await params;

  let skuDetail;
  try {
    skuDetail = await InventoryService.getInventorySkuDetail('org-1', skuId);
  } catch (error) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={skuDetail.sku.productName}
        subtitle={`SKU: ${skuDetail.sku.skuCode}`}
      />

      <SkuDetailContent skuDetail={skuDetail} locale={locale} />
    </div>
  );
}
