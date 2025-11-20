import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type WebhooksPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: WebhooksPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — Webhooks" : "AstraCommerce OS — Webhooks",
    description: isJa
      ? "イベント購読、リトライ、署名、リプレイに対応したWebhookガイド。"
      : "Webhook guide covering subscriptions, retries, signatures, and replay.",
  };
}

export default async function WebhooksPage({ params }: WebhooksPageProps) {
  const { locale } = await params;
  const dict = await getSiteDictionary(locale);
  const content = dict.support.webhooks;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-4">
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{content.title}</h1>
        <p className="text-lg text-secondary">{content.body}</p>
        <div className="rounded-card border border-default bg-surface p-6 shadow-soft space-y-3">
          <p className="text-sm font-semibold text-primary">Sample payload</p>
          <code className="block rounded-card bg-surface-muted px-3 py-2 text-sm text-primary">
            {`{\n  "event": "order.created",\n  "data": { "id": "ord_123", "status": "ready" },\n  "signature": "hmac_sha256..."\n}`}
          </code>
        </div>
      </div>
    </div>
  );
}
