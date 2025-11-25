import { getAIDictionary } from '@/i18n/getAIDictionary';
import { PlaybooksPage } from '@/components/ai/playbooks-page';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Playbooks({ params }: Props) {
  const { locale } = await params;
  const dict = await getAIDictionary(locale);

  return <PlaybooksPage dict={dict} />;
}
