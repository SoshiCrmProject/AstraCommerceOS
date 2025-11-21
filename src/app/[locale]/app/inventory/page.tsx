import { PageHeader } from '@/components/app/page-header';
import { InventoryContent } from './inventory-content';

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Inventory Management"
        subtitle="Monitor stock levels, locations, and replenishment needs"
      />

      <InventoryContent locale={locale} />
    </div>
  );
}

