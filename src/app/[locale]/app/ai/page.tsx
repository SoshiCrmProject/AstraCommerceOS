import { getAIDictionary } from '@/i18n/getAIDictionary';
import { AICopilotPage } from '@/components/ai/ai-copilot-page';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AIPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getAIDictionary(locale);

  return <AICopilotPage dict={dict} />;
}
