"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type ChannelsDictionary } from "@/i18n/getChannelsDictionary";
import { ChannelService } from "@/lib/services/channel-service";
import { ChannelConnectionSummary } from "@/lib/services/channel-types";

type ChannelCardProps = {
  channel: ChannelConnectionSummary;
  locale: string;
  dict: ChannelsDictionary;
};

const statusTone: Record<ChannelConnectionSummary["status"], string> = {
  HEALTHY: "bg-emerald-100 text-emerald-700 border-emerald-200",
  DEGRADED: "bg-amber-100 text-amber-800 border-amber-200",
  DISCONNECTED: "bg-rose-100 text-rose-700 border-rose-200",
};

export function ChannelCard({ channel, locale, dict }: ChannelCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const statusLabel = dict.statuses[channel.status.toLowerCase() as keyof typeof dict.statuses];
  const lastSyncLabel = useMemo(() => {
    if (!channel.lastSyncAt) return "—";
    const date = new Date(channel.lastSyncAt);
    return date.toLocaleString(locale);
  }, [channel.lastSyncAt, locale]);

  const nextSyncLabel = useMemo(() => {
    if (!channel.nextSyncAt) return "—";
    return new Date(channel.nextSyncAt).toLocaleString(locale);
  }, [channel.nextSyncAt, locale]);

  const runSync = async () => {
    setSyncing(true);
    const res = await ChannelService.triggerChannelSync("demo-org", channel.id, "ORDERS");
    setLastAction(res.accepted ? dict.actions.syncNow : dict.actions.healthCheck);
    setSyncing(false);
  };

  return (
    <div className="relative rounded-card border border-default bg-surface p-4 shadow-token-md transition hover:-translate-y-0.5 hover:shadow-token-lg">
      {channel.new ? (
        <span className="absolute right-3 top-3 rounded-pill bg-accent-secondary/15 px-3 py-1 text-xs font-semibold text-accent-secondary">
          {dict.board.badges.new}
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar symbol={channel.icon} name={channel.name} />
          <div>
            <p className="text-sm font-semibold text-primary">{channel.name}</p>
            <p className="text-xs text-muted">
              {channel.type} · {channel.region}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            title={statusLabel}
            className={`rounded-pill border px-3 py-1 text-xs font-semibold ${statusTone[channel.status]}`}
          >
            {statusLabel}
          </span>
          <Menu open={menuOpen} onToggle={setMenuOpen} dict={dict} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-secondary">
        <Stat label={dict.board.metrics.revenue7d} value={formatCurrency(channel.revenue7d, locale)} />
        <Stat label={dict.board.metrics.orders7d} value={channel.orders7d.toLocaleString(locale)} />
        <Stat label={dict.board.metrics.margin} value={`${channel.margin7d}%`} />
        <Stat label={dict.board.metrics.buyBox} value={`${channel.buyBoxShare}%`} />
      </div>

      <div className="mt-3 grid gap-2 rounded-card border border-default bg-surface-muted px-3 py-2 text-xs text-muted shadow-soft">
        <p>
          {dict.board.health.lastSync}: <span className="text-secondary">{lastSyncLabel}</span>
        </p>
        <p>
          {dict.board.health.nextSync}: <span className="text-secondary">{nextSyncLabel}</span>
        </p>
        {channel.accountType ? (
          <p>
            {channel.accountType} · {channel.accountId}
          </p>
        ) : null}
        {lastAction ? <p className="text-accent-primary">✓ {lastAction}</p> : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {channel.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-pill border border-default bg-surface px-3 py-1 text-xs font-semibold text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/${locale}/app/channels/${channel.id}`}
          className="rounded-pill border border-default px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
        >
          {dict.actions.openChannel}
        </Link>
        <button
          className="rounded-pill border border-default px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft disabled:cursor-not-allowed disabled:opacity-60"
          onClick={runSync}
          disabled={syncing}
        >
          {syncing ? `${dict.actions.syncNow}…` : dict.actions.syncNow}
        </button>
        <Link
          href={`/${locale}/app/channels/${channel.id}#logs`}
          className="text-xs font-semibold text-accent-primary hover:underline"
        >
          {dict.actions.viewLogs}
        </Link>
      </div>
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-card bg-surface-muted px-3 py-2">
    <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    <p className="text-sm font-semibold text-primary">{value}</p>
  </div>
);

const Avatar = ({ symbol, name }: { symbol: string; name: string }) => (
  <div className="grid h-10 w-10 place-items-center rounded-card border border-default bg-surface-muted text-sm font-semibold text-primary">
    {symbol?.[0]?.toUpperCase() ?? name[0]}
  </div>
);

const Menu = ({
  open,
  onToggle,
  dict,
}: {
  open: boolean;
  onToggle: (state: boolean) => void;
  dict: ChannelsDictionary;
}) => (
  <div className="relative">
    <button
      type="button"
      className="rounded-card border border-default bg-surface-muted px-2 py-1 text-secondary hover:text-primary"
      onClick={() => onToggle(!open)}
    >
      ⋮
    </button>
    {open ? (
      <div className="absolute right-0 z-10 mt-2 w-44 rounded-card border border-default bg-surface shadow-token-md">
        {[dict.actions.editSettings, dict.actions.pauseSync, dict.actions.disconnect].map((item) => (
          <button
            key={item}
            className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-secondary hover:bg-surface-muted"
            type="button"
            onClick={() => onToggle(false)}
          >
            {item}
          </button>
        ))}
      </div>
    ) : null}
  </div>
);

const formatCurrency = (value: number, locale: string) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "ja" ? "JPY" : "USD",
    maximumFractionDigits: 0,
  }).format(value);
};
