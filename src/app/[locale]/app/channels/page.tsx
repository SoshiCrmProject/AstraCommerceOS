import { type Locale } from "@/i18n/config";
import { AddChannelWizard } from "@/components/channels/add-channel-wizard";
import { ChannelBoard } from "@/components/channels/channel-board";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getChannelsDictionary } from "@/i18n/getChannelsDictionary";
import { ChannelService } from "@/lib/services/channel-service";
import { revalidatePath } from "next/cache";


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

type ChannelsPageProps = {
  params: Promise<{ locale: Locale }>;
};

async function healthCheckAction(locale: Locale) {
  "use server";
  await ChannelService.runOrgHealthCheck("demo-org");
  revalidatePath(`/${locale}/app/channels`);
}

export default async function ChannelsPage({ params }: ChannelsPageProps) {
  const { locale } = await params;
  const commonDict = await getAppDictionary(locale);
  const dict = await getChannelsDictionary(locale);
  const channels = await ChannelService.getChannelList("demo-org");
  const totalRevenue = channels.reduce((acc, c) => acc + c.revenue7d, 0);
  const totalOrders = channels.reduce((acc, c) => acc + c.orders7d, 0);
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "ja" ? "JPY" : "USD",
    maximumFractionDigits: 0,
  });
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <div className="space-y-6">
      <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary sm:text-base">{dict.title}</p>
            <p className="text-xs text-secondary">{dict.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <form action={healthCheckAction.bind(null, locale)}>
              <button className="btn btn-secondary text-xs sm:text-sm" type="submit">
                <span className="hidden sm:inline">{dict.actions.healthCheck}</span>
                <span className="sm:hidden">Health Check</span>
              </button>
            </form>
            <AddChannelWizard locale={locale} triggerLabel={dict.actions.add} dict={dict} />
          </div>
        </div>
        <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-card border border-default bg-surface-muted p-3">
            <p className="text-xs uppercase tracking-wide text-muted truncate">{dict.filters.status}</p>
            <p className="text-lg font-semibold text-primary sm:text-xl">{channels.length}</p>
            <p className="text-xs text-secondary truncate">{dict.subtitle}</p>
          </div>
          <div className="rounded-card border border-default bg-surface-muted p-3">
            <p className="text-xs uppercase tracking-wide text-muted truncate">{dict.board.metrics.revenue7d}</p>
            <p className="text-lg font-semibold text-primary sm:text-xl">{currencyFormatter.format(totalRevenue)}</p>
            <p className="text-xs text-secondary truncate">{commonDict.common.buttons.viewAll}</p>
          </div>
          <div className="rounded-card border border-default bg-surface-muted p-3">
            <p className="text-xs uppercase tracking-wide text-muted truncate">{dict.board.metrics.orders7d}</p>
            <p className="text-lg font-semibold text-primary sm:text-xl">{numberFormatter.format(totalOrders)}</p>
            <p className="text-xs text-secondary truncate">{dict.actions.syncNow}</p>
          </div>
        </div>
      </div>

      <ChannelBoard channels={channels} locale={locale} dict={dict} />
    </div>
  );
}
