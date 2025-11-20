"use client";

import { useEffect, useState } from "react";
import { type ChannelsDictionary } from "@/i18n/getChannelsDictionary";
import { ChannelConnectionSummary } from "@/lib/services/channel-types";
import { ChannelCard } from "./channel-card";
import { ChannelFilters } from "./channel-filters";

type ChannelBoardProps = {
  channels: ChannelConnectionSummary[];
  locale: string;
  dict: ChannelsDictionary;
};

export function ChannelBoard({ channels, locale, dict }: ChannelBoardProps) {
  const [filtered, setFiltered] = useState<ChannelConnectionSummary[]>(channels);

  useEffect(() => {
    setFiltered(channels);
  }, [channels]);

  const statusCounters = ["HEALTHY", "DEGRADED", "DISCONNECTED"] as const;

  return (
    <div className="space-y-4">
      <ChannelFilters channels={channels} onFilter={setFiltered} dict={dict} />
      <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap">
        {statusCounters.map((status) => {
          const count = filtered.filter((c) => c.status === status).length;
          const total = channels.filter((c) => c.status === status).length;
          return (
            <div
              key={status}
              className="rounded-card border border-default bg-surface-muted px-3 py-2 shadow-token-sm sm:px-4 sm:py-3"
            >
              <p className="text-xs uppercase tracking-wide text-muted truncate">
                {dict.filters[status.toLowerCase() as keyof typeof dict.filters]}
              </p>
              <p className="text-sm font-semibold text-primary sm:text-lg">
                {count} / {total}
              </p>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <EmptyState dict={dict} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}

const EmptyState = ({ dict }: { dict: ChannelsDictionary }) => (
  <div className="rounded-panel border border-default bg-surface p-6 text-center shadow-token-lg sm:p-8">
    <p className="text-base font-semibold text-primary sm:text-lg">{dict.empty.title}</p>
    <p className="mt-2 text-sm text-secondary">{dict.empty.description}</p>
    <div className="mt-4 flex justify-center">
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById("add-channel-button");
          el?.dispatchEvent(new Event("click", { bubbles: true }));
        }}
        className="btn btn-primary text-sm"
      >
        {dict.empty.cta}
      </button>
    </div>
  </div>
);
