import { ReactNode } from "react";
import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getChannelsDictionary } from "@/i18n/getChannelsDictionary";
import { PageHeader } from "@/components/app/page-header";

type ChannelsLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ChannelsLayout({ children, params }: ChannelsLayoutProps) {
  const { locale } = await params;
  const appDict = await getAppDictionary(locale as Locale);
  const channelDict = await getChannelsDictionary(locale as Locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={channelDict.title}
        subtitle={channelDict.subtitle}
        breadcrumbs={[
          { label: appDict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: channelDict.title, href: `/${locale}/app/channels` },
        ]}
      />
      {children}
    </div>
  );
}
