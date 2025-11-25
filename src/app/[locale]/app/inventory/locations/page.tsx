import { PageHeader } from '@/components/app/page-header';
import { LocationsContent } from './locations-content';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Inventory Locations"
        subtitle="Manage and compare inventory across all warehouses, FBA, and 3PL partners"
      />

      <LocationsContent locale={locale} />
    </div>
  );
}
