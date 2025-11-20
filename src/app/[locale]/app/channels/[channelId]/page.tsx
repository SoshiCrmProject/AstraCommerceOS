import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { PageHeader } from "@/components/app/page-header";
import { ChannelService } from "@/lib/services/channel-service";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getChannelsDictionary } from "@/i18n/getChannelsDictionary";
import { ChannelDetailTabs } from "@/components/channels/channel-detail-tabs";

type ChannelDetailPageProps = {
  params: Promise<{ locale: Locale; channelId: string }>;
};

export default async function ChannelDetailPage({ params }: ChannelDetailPageProps) {
  const { locale, channelId } = await params;
  const dict = await getAppDictionary(locale);
  const channelDict = await getChannelsDictionary(locale);
  const detail = await ChannelService.getChannelDetail("demo-org", channelId).catch(() => null);

  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={detail.channel.name}
        subtitle={`${detail.channel.type} · ${detail.channel.region}`}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: channelDict.title, href: `/${locale}/app/channels` },
          { label: detail.channel.name },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/${locale}/app/channels`} className="btn btn-secondary text-sm">
              {channelDict.title}
            </Link>
            <button className="btn btn-primary text-sm">
              {channelDict.actions.syncAll}
            </button>
          </div>
        }
      />
      <ChannelDetailTabs data={detail} locale={locale} dict={channelDict} />
    </div>
  );
}
