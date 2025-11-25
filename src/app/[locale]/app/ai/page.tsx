import { getAIDictionary } from '@/i18n/getAIDictionary';
import { AICopilotPage } from '@/components/ai/ai-copilot-page';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AIPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getAIDictionary(locale);

  return <AICopilotPage dict={dict} />;
}
