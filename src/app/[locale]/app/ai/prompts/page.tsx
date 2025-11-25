import { getAIDictionary } from '@/i18n/getAIDictionary';
import { PromptsPage } from '@/components/ai/prompts-page';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Prompts({ params }: Props) {
  const { locale } = await params;
  const dict = await getAIDictionary(locale);

  return <PromptsPage dict={dict} />;
}
