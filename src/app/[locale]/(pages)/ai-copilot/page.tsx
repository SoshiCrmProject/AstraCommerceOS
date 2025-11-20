import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type AICopilotPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: AICopilotPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — AI Copilotガイド" : "AstraCommerce OS — AI Copilot Guide",
    description: isJa
      ? "リスティング強化やディスプート要約にAIコパイロットを設定する手順。"
      : "Configure AI copilots for listing enrichment, dispute summaries, and recovery playbooks.",
  };
}

export default async function AICopilotPage({ params }: AICopilotPageProps) {
  const { locale } = await params;
  const dict = await getSiteDictionary(locale);
  const content = dict.support.aiCopilot;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-4">
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{content.title}</h1>
        <p className="text-lg text-secondary">{content.body}</p>
        <div className="rounded-card border border-default bg-surface p-6 shadow-soft space-y-3">
          <p className="text-sm font-semibold text-primary">Setup checklist</p>
          <ul className="space-y-2 text-sm text-secondary">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-secondary" />
              Enable content quality guardrails and approvals.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-secondary" />
              Provide branded prompts and tone-of-voice instructions per locale.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-secondary" />
              Route outputs to staging before publishing to channels.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
