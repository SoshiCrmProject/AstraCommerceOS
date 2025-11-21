import { getInventoryDictionary } from '@/i18n/getInventoryDictionary';
import { AdjustmentsContent } from './adjustments-content';

export default async function AdjustmentsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getInventoryDictionary(locale as 'en' | 'ja');

  return <AdjustmentsContent locale={locale} />;
}
