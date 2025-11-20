"use client";

import { useEffect, useMemo, useState } from "react";
import { type ChannelsDictionary } from "@/i18n/getChannelsDictionary";
import { ChannelConnectionSummary, ChannelStatus, ChannelType } from "@/lib/services/channel-types";

type Filters = {
  status: ChannelStatus | "ALL";
  type: ChannelType | "ALL";
  region: string | "ALL";
  search: string;
};

type ChannelFiltersProps = {
  channels: ChannelConnectionSummary[];
  onFilter: (channels: ChannelConnectionSummary[]) => void;
  dict: ChannelsDictionary;
};

export function ChannelFilters({ channels, onFilter, dict }: ChannelFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    status: "ALL",
    type: "ALL",
    region: "ALL",
    search: "",
  });

  const regions = useMemo(() => {
    const set = new Set<string>();
    channels.forEach((c) => set.add(c.region));
    return Array.from(set);
  }, [channels]);

  const types = useMemo(() => {
    const set = new Set<ChannelType>();
    channels.forEach((c) => set.add(c.type));
    return Array.from(set);
  }, [channels]);

  useEffect(() => {
    const filtered = channels.filter((c) => {
      const statusOk = filters.status === "ALL" || c.status === filters.status;
      const typeOk = filters.type === "ALL" || c.type === filters.type;
      const regionOk = filters.region === "ALL" || c.region === filters.region;
      const text = filters.search.trim().toLowerCase();
      const searchOk =
        text.length === 0 ||
        c.name.toLowerCase().includes(text) ||
        c.tags.some((tag) => tag.toLowerCase().includes(text)) ||
        c.type.toLowerCase().includes(text);
      return statusOk && typeOk && regionOk && searchOk;
    });
    onFilter(filtered);
  }, [filters, channels, onFilter]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-panel border border-default bg-surface p-4 shadow-token-md">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          label={dict.filters.status}
          options={["ALL", "HEALTHY", "DEGRADED", "DISCONNECTED"] as const}
          value={filters.status}
          onChange={(val) => updateFilter("status", val)}
          optionLabel={(val) =>
            val === "ALL" ? dict.filters.all : dict.filters[val.toLowerCase() as keyof typeof dict.filters]
          }
        />
        <Segmented
          label={dict.filters.type}
          options={["ALL", ...types] as Array<ChannelType | "ALL">}
          value={filters.type}
          onChange={(val) => updateFilter("type", val)}
        />
        <Segmented
          label={dict.filters.region}
          options={["ALL", ...regions] as Array<string | "ALL">}
          value={filters.region}
          onChange={(val) => updateFilter("region", val)}
        />
        <div className="relative ml-auto flex-1 min-w-[200px]">
          <input
            type="search"
            className="w-full rounded-pill border border-default bg-surface-muted px-4 py-2 text-sm text-primary outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
            placeholder={dict.common.searchPlaceholder}
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary text-xs"
          onClick={() =>
            setFilters({
              status: "ALL",
              type: "ALL",
              region: "ALL",
              search: "",
            })
          }
        >
          {dict.filters.reset}
        </button>
      </div>
    </div>
  );
}

type SegmentedProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (val: T) => void;
  optionLabel?: (val: T) => string;
};

function Segmented<T extends string>({ label, options, value, onChange, optionLabel }: SegmentedProps<T>) {
  return (
    <div className="flex items-center gap-2 rounded-pill border border-default bg-surface-muted p-1 shadow-soft">
      <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <div className="inline-flex items-center gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            className={`rounded-pill px-3 py-1 text-xs font-semibold transition ${
              opt === value ? "bg-accent-primary text-white shadow-token-sm" : "text-secondary hover:bg-accent-primary-soft"
            }`}
            onClick={() => onChange(opt)}
            type="button"
          >
            {optionLabel ? optionLabel(opt) : opt}
          </button>
        ))}
      </div>
    </div>
  );
}
