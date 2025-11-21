import { PageHeader } from '@/components/app/page-header';
import { TransfersContent } from './transfers-content';

export default async function InventoryTransfersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Stock Transfers"
        subtitle="Manage inventory transfers between locations and warehouses"
      />

      <TransfersContent locale={locale} />
    </div>
  );
}
