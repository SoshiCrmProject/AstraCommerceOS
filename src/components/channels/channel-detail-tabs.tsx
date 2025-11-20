"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type Locale } from "@/i18n/config";
import { type ChannelsDictionary } from "@/i18n/getChannelsDictionary";
import { ChannelService } from "@/lib/services/channel-service";
import {
  type ChannelDetailSnapshot,
  type ChannelListingSummary,
  type ChannelOrderSummary,
  type ChannelSyncLog,
} from "@/lib/services/channel-types";

type Tab = "overview" | "listings" | "orders" | "pricing" | "health" | "settings";

type ChannelDetailTabsProps = {
  data: ChannelDetailSnapshot;
  locale: Locale;
  dict: ChannelsDictionary;
};

export function ChannelDetailTabs({ data, locale, dict }: ChannelDetailTabsProps) {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs = useMemo(
    () => [
      { key: "overview" as const, label: dict.tabs.overview },
      { key: "listings" as const, label: dict.tabs.listings },
      { key: "orders" as const, label: dict.tabs.orders },
      { key: "pricing" as const, label: dict.tabs.pricing },
      { key: "health" as const, label: dict.tabs.health },
      { key: "settings" as const, label: dict.tabs.settings },
    ],
    [dict.tabs],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-pill px-3 py-2 text-sm font-semibold transition ${
              tab === t.key
                ? "bg-accent-primary text-white shadow-token-sm"
                : "border border-default bg-surface text-secondary hover:bg-accent-primary-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview data={data} locale={locale} dict={dict} />}
      {tab === "listings" && <Listings data={data.topListings} locale={locale} dict={dict} />}
      {tab === "orders" && <Orders data={data.orders} locale={locale} dict={dict} />}
      {tab === "pricing" && <Pricing data={data} locale={locale} dict={dict} />}
      {tab === "health" && <Health data={data} locale={locale} dict={dict} />}
      {tab === "settings" && <Settings data={data} locale={locale} dict={dict} />}
    </div>
  );
}

const Overview = ({
  data,
  locale,
  dict,
}: {
  data: ChannelDetailSnapshot;
  locale: Locale;
  dict: ChannelsDictionary;
}) => {
  const kpis = [
    { label: dict.detail.kpis.revenue7d, value: formatCurrency(data.financials.revenue7d, locale) },
    { label: dict.detail.kpis.revenue30d, value: formatCurrency(data.financials.revenue30d, locale) },
    { label: dict.detail.kpis.orders7d, value: data.financials.orders7d.toLocaleString(locale) },
    { label: dict.detail.kpis.orders30d, value: data.financials.orders30d.toLocaleString(locale) },
    { label: dict.detail.kpis.profit7d, value: formatCurrency(data.financials.profit7d, locale) },
    { label: dict.detail.kpis.profit30d, value: formatCurrency(data.financials.profit30d, locale) },
  ];

  const healthList = [
    {
      label: dict.detail.health.latency,
      value: `${data.health.apiLatencyMs} ms`,
    },
    {
      label: dict.detail.health.success,
      value: `${data.health.syncSuccessRate30d}%`,
    },
    {
      label: dict.detail.health.uptime,
      value: `${data.health.uptime30dPercent}%`,
    },
    {
      label: dict.detail.health.pending,
      value: `${data.health.pendingJobs}`,
    },
    {
      label: dict.detail.health.incidents,
      value: `${data.health.incidentCount24h ?? 0}`,
    },
    {
      label: dict.detail.overview.nextSync,
      value: data.channel.nextSyncAt ? new Date(data.channel.nextSyncAt).toLocaleString(locale) : "—",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {kpis.map((kpi) => (
            <StatCard key={kpi.label} label={kpi.label} value={kpi.value} />
          ))}
          <StatCard label={dict.detail.overview.aov} value={formatCurrency(data.financials.avgOrderValue, locale)} />
        </div>
        <div className="rounded-card border border-default bg-surface-muted p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-primary">{dict.detail.overview.chartTitle}</p>
            <div className="flex items-center gap-2 text-xs text-secondary">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-accent-primary" />
                {dict.common.legendRevenue}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {dict.common.legendOrders}
              </span>
            </div>
          </div>
          <PerformanceChart points={data.timeline} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-card border border-default bg-surface-muted p-4 shadow-soft">
            <p className="text-sm font-semibold text-primary">{dict.detail.overview.health}</p>
            <div className="mt-2 grid gap-2">
              {healthList.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm text-secondary">
                  <span>{item.label}</span>
                  <span className="font-semibold text-primary">{item.value}</span>
                </div>
              ))}
              {data.health.lastErrorMessage ? (
                <div className="rounded-card border border-default bg-rose-50 p-3 text-sm text-rose-700">
                  {dict.detail.overview.lastError}: {data.health.lastErrorMessage}
                </div>
              ) : null}
            </div>
          </div>
          <div className="rounded-card border border-default bg-surface-muted p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">{dict.detail.overview.topSkus}</p>
              <Link href={`/${locale}/app/products`} className="text-xs font-semibold text-accent-primary hover:underline">
                {dict.actions.openChannel}
              </Link>
            </div>
            <div className="mt-2 space-y-2">
              {data.topListings.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between rounded-card border border-default bg-surface px-3 py-2 text-sm shadow-soft"
                >
                  <div>
                    <p className="font-semibold text-primary">{l.productName}</p>
                    <p className="text-xs text-muted">{l.sku}</p>
                  </div>
                  <div className="text-right text-xs text-secondary">
                    <p>{dict.detail.listings.columns.orders7d}: {l.orders7d}</p>
                    <p>{dict.detail.listings.columns.stock}: {l.stock}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Link href={`/${locale}/app/listings`} className="rounded-pill border border-default px-3 py-1 font-semibold text-primary hover:border-accent-primary">
                {dict.tabs.listings}
              </Link>
              <Link href={`/${locale}/app/orders`} className="rounded-pill border border-default px-3 py-1 font-semibold text-primary hover:border-accent-primary">
                {dict.tabs.orders}
              </Link>
              <Link href={`/${locale}/app/pricing`} className="rounded-pill border border-default px-3 py-1 font-semibold text-primary hover:border-accent-primary">
                {dict.tabs.pricing}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-3">
        <p className="text-sm font-semibold text-primary">{dict.detail.health.logs}</p>
        <div className="space-y-2">
          {data.recentSyncs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-card border border-default bg-surface-muted px-3 py-2 text-sm shadow-soft"
            >
              <span className="font-semibold text-primary">{log.kind}</span>
              <span className={statusColor(log.status)}>{log.status}</span>
              <span className="text-xs text-muted">
                {new Date(log.startedAt).toLocaleTimeString(locale)}
              </span>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary text-xs" type="button">
          {dict.actions.viewLogs}
        </button>
      </div>
    </div>
  );
};

const Listings = ({
  data,
  locale,
  dict,
}: {
  data: ChannelListingSummary[];
  locale: Locale;
  dict: ChannelsDictionary;
}) => {
  const [status, setStatus] = useState<string>("ALL");
  const [stock, setStock] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [priceDraft, setPriceDraft] = useState<ChannelListingSummary | null>(null);
  const [draftPrice, setDraftPrice] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const statusOk = status === "ALL" || item.status === status;
        const stockOk =
          stock === "ALL" ||
          (stock === "LOW" && item.stock < 50) ||
          (stock === "OOS" && item.stock === 0);
        const priceOk = item.price >= priceRange[0] && item.price <= priceRange[1];
        return statusOk && stockOk && priceOk;
      }),
    [data, priceRange, status, stock],
  );

  const openAdjust = (listing: ChannelListingSummary) => {
    setPriceDraft(listing);
    setDraftPrice(listing.price);
  };

  const saveDraftPrice = () => {
    setPriceDraft(null);
  };

  return (
    <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <LabelPill
          label={dict.detail.listings.filters.status}
          options={["ALL", "ACTIVE", "PAUSED", "OUT_OF_STOCK", "PENDING", "ERROR"]}
          active={status}
          onChange={setStatus}
        />
        <LabelPill
          label={dict.detail.listings.filters.stock}
          options={["ALL", "LOW", "OOS"]}
          optionLabel={(opt) => (opt === "LOW" ? dict.common.low : opt === "OOS" ? dict.common.oos : dict.filters.all)}
          active={stock}
          onChange={setStock}
        />
        <div className="flex items-center gap-2 text-xs text-secondary">
          <span>{dict.detail.listings.filters.price}</span>
          <input
            type="number"
            value={priceRange[0]}
            className="w-20 rounded-card border border-default bg-surface-muted px-2 py-1"
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
          />
          <span>—</span>
          <input
            type="number"
            value={priceRange[1]}
            className="w-24 rounded-card border border-default bg-surface-muted px-2 py-1"
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-default">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">{dict.detail.listings.columns.sku}</th>
              <th className="px-4 py-3">{dict.detail.listings.columns.product}</th>
              <th className="px-4 py-3">{dict.detail.listings.columns.status}</th>
              <th className="px-4 py-3">{dict.detail.listings.columns.price}</th>
              <th className="px-4 py-3">{dict.detail.listings.columns.stock}</th>
              <th className="px-4 py-3">{dict.detail.listings.columns.orders7d}</th>
              <th className="px-4 py-3">{dict.detail.listings.columns.buyBox}</th>
              <th className="px-4 py-3 text-right">{dict.common.actionsLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-accent-primary-soft/30">
                <td className="px-4 py-3 font-semibold text-primary">{l.sku}</td>
                <td className="px-4 py-3 text-secondary">{l.productName}</td>
                <td className="px-4 py-3 text-secondary">{l.status}</td>
                <td className="px-4 py-3 text-secondary">{formatCurrency(l.price, locale)}</td>
                <td className="px-4 py-3 text-secondary">{l.stock}</td>
                <td className="px-4 py-3 text-secondary">{l.orders7d}</td>
                <td className="px-4 py-3 text-secondary">{l.buyBoxShare ?? "-"}%</td>
                <td className="px-4 py-3 text-right text-xs">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/${locale}/app/listings`} className="text-accent-primary hover:underline">
                      {dict.actions.viewLogs}
                    </Link>
                    <button
                      type="button"
                      className="rounded-pill border border-default px-3 py-1 font-semibold text-primary hover:border-accent-primary"
                      onClick={() => openAdjust(l)}
                    >
                      {dict.detail.pricing.actions.adjust}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 ? <p className="text-sm text-secondary">{dict.detail.listings.empty}</p> : null}

      {priceDraft ? (
        <div className="fixed inset-0 z-40 flex items-center justify-end bg-black/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-md rounded-panel border border-default bg-surface p-6 shadow-token-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">{priceDraft.productName}</p>
                <p className="text-xs text-secondary">{priceDraft.sku}</p>
              </div>
              <button className="text-secondary hover:text-primary" onClick={() => setPriceDraft(null)}>
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <label className="flex flex-col gap-1 text-sm text-primary">
                {dict.detail.pricing.columns.price}
                <input
                  type="number"
                  value={draftPrice ?? priceDraft.price}
                  onChange={(e) => setDraftPrice(Number(e.target.value))}
                  className="rounded-card border border-default bg-surface px-3 py-2 text-sm"
                />
              </label>
              <p className="text-xs text-secondary">
                {dict.detail.pricing.summary}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-secondary text-xs"
                  type="button"
                  onClick={() => setPriceDraft(null)}
                >
                  {dict.actions.cancel}
                </button>
                <button className="btn btn-primary text-xs" type="button" onClick={saveDraftPrice}>
                  {dict.actions.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Orders = ({
  data,
  locale,
  dict,
}: {
  data: ChannelOrderSummary[];
  locale: Locale;
  dict: ChannelsDictionary;
}) => {
  const [status, setStatus] = useState<string>("ALL");
  const filtered = useMemo(
    () => data.filter((order) => status === "ALL" || order.status === status),
    [data, status],
  );

  return (
    <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <LabelPill
          label={dict.detail.orders.filters.status}
          options={["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELED", "RETURNED"]}
          active={status}
          onChange={setStatus}
        />
      </div>
      <div className="overflow-hidden rounded-card border border-default">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">{dict.detail.orders.columns.id}</th>
              <th className="px-4 py-3">{dict.detail.orders.columns.orderedAt}</th>
              <th className="px-4 py-3">{dict.detail.orders.columns.status}</th>
              <th className="px-4 py-3">{dict.detail.orders.columns.amount}</th>
              <th className="px-4 py-3">{dict.detail.orders.columns.fulfillment}</th>
              <th className="px-4 py-3">{dict.detail.orders.columns.sla}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-accent-primary-soft/30">
                <td className="px-4 py-3 font-semibold text-primary">{order.id}</td>
                <td className="px-4 py-3 text-secondary">{new Date(order.orderedAt).toLocaleString(locale)}</td>
                <td className="px-4 py-3 text-secondary">{order.status}</td>
                <td className="px-4 py-3 text-secondary">{formatCurrency(order.totalAmount, locale)}</td>
                <td className="px-4 py-3 text-secondary">{order.fulfillment}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-pill px-3 py-1 text-xs font-semibold ${
                      order.sla === "ON_TIME" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {order.sla}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Pricing = ({
  data,
  locale,
  dict,
}: {
  data: ChannelDetailSnapshot;
  locale: Locale;
  dict: ChannelsDictionary;
}) => {
  const insights = [
    { label: dict.detail.kpis.revenue7d, value: formatCurrency(data.financials.revenue7d, locale) },
    { label: dict.detail.pricing.columns.margin, value: `${data.financials.marginRate7d}%` },
    { label: dict.detail.kpis.profit7d, value: formatCurrency(data.financials.profit7d, locale) },
  ];
  const rows = data.topListings.map((l) => {
    const fee = Math.max(8, Math.min(22, Math.round(l.price * 0.0008)));
    const margin = Math.max(8, Math.min(45, Math.round(l.buyBoxShare ?? 28)));
    return { ...l, fee, margin };
  });
  const lowMargin = rows.filter((r) => r.margin < 20);

  return (
    <div className="space-y-4 rounded-panel border border-default bg-surface p-5 shadow-token-lg">
      <p className="text-sm font-semibold text-primary">{dict.detail.pricing.title}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {insights.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
      <p className="text-sm text-secondary">{dict.detail.pricing.summary}</p>
      <div className="overflow-hidden rounded-card border border-default">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">{dict.detail.pricing.columns.sku}</th>
              <th className="px-4 py-3">{dict.detail.pricing.columns.price}</th>
              <th className="px-4 py-3">{dict.detail.pricing.columns.fee}</th>
              <th className="px-4 py-3">{dict.detail.pricing.columns.margin}</th>
              <th className="px-4 py-3 text-right">{dict.detail.pricing.actions.adjust}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-accent-primary-soft/25">
                <td className="px-4 py-3 font-semibold text-primary">{row.sku}</td>
                <td className="px-4 py-3 text-secondary">{formatCurrency(row.price, locale)}</td>
                <td className="px-4 py-3 text-secondary">{row.fee}%</td>
                <td className="px-4 py-3 text-secondary">
                  <span
                    className={`rounded-pill px-2 py-1 text-xs font-semibold ${
                      row.margin < 20 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {row.margin}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold text-accent-primary hover:underline">
                    {dict.detail.pricing.actions.adjust}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-card border border-default bg-surface-muted p-4 shadow-soft">
        <p className="text-sm font-semibold text-primary">{dict.detail.pricing.suggestions}</p>
        <ul className="mt-2 space-y-2 text-sm text-secondary">
          {lowMargin.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-card border border-default bg-surface px-3 py-2">
              <span className="font-semibold text-primary">{item.productName}</span>
              <span className="text-xs text-muted">{item.margin}%</span>
            </li>
          ))}
          {lowMargin.length === 0 ? <li className="text-sm text-secondary">{dict.common.noRisk}</li> : null}
        </ul>
      </div>
    </div>
  );
};

const Health = ({
  data,
  locale,
  dict,
}: {
  data: ChannelDetailSnapshot;
  locale: Locale;
  dict: ChannelsDictionary;
}) => {
  const [kind, setKind] = useState<ChannelSyncLog["kind"] | "ALL">("ALL");
  const [status, setStatus] = useState<ChannelSyncLog["status"] | "ALL">("ALL");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const filteredLogs = useMemo(
    () =>
      data.recentSyncs.filter((log) => {
        const kindOk = kind === "ALL" || log.kind === kind;
        const statusOk = status === "ALL" || log.status === status;
        return kindOk && statusOk;
      }),
    [data.recentSyncs, kind, status],
  );

  const runConnectionTest = async () => {
    setTesting(true);
    const result = await ChannelService.testChannelConnection("demo-org", data.channel.id);
    if (!result.ok) {
      setTestResult(result.error ?? dict.wizard.error);
    } else {
      setTestResult(`${dict.detail.health.latency}: ${result.latencyMs} ms`);
    }
    setTesting(false);
  };

  const triggerSync = async (kindToRun: ChannelSyncLog["kind"]) => {
    await ChannelService.triggerChannelSync("demo-org", data.channel.id, kindToRun);
    setTestResult(`${dict.actions.runKindSync} ${kindToRun}`);
  };

  return (
    <div id="logs" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-3">
        <p className="text-sm font-semibold text-primary">{dict.detail.health.connection}</p>
        <div className="grid gap-2 md:grid-cols-2">
          <StatCard label={dict.detail.health.latency} value={`${data.health.apiLatencyMs} ms`} />
          <StatCard label={dict.detail.health.uptime} value={`${data.health.uptime30dPercent}%`} />
          <StatCard label={dict.detail.health.success} value={`${data.health.syncSuccessRate30d}%`} />
          <StatCard label={dict.detail.health.pending} value={`${data.health.pendingJobs}`} />
        </div>
        <div className="rounded-card border border-default bg-surface-muted p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">{dict.detail.health.incidents}</p>
          <p className="text-lg font-semibold text-primary">{data.health.incidentCount24h ?? 0}</p>
          {data.health.lastErrorMessage ? (
            <p className="mt-2 text-sm text-secondary">
              {dict.detail.overview.lastError}: {data.health.lastErrorMessage}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-secondary text-xs" type="button" onClick={runConnectionTest} disabled={testing}>
            {testing ? dict.common.testing : dict.actions.testConnection}
          </button>
          <button className="btn btn-primary text-xs" type="button" onClick={() => triggerSync("PRODUCTS")}>
            {dict.actions.syncNow}
          </button>
          {testResult ? <span className="text-xs text-accent-primary">{testResult}</span> : null}
        </div>
      </div>
      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <LabelPill
            label={dict.detail.health.filters.kind}
            options={["ALL", "PRODUCTS", "INVENTORY", "ORDERS", "PRICING", "REVIEWS"]}
            active={kind}
            onChange={(val) => setKind(val as ChannelSyncLog["kind"] | "ALL")}
          />
          <LabelPill
            label={dict.detail.health.filters.status}
            options={["ALL", "SUCCESS", "FAILED", "PARTIAL", "RUNNING"]}
            active={status}
            onChange={(val) => setStatus(val as ChannelSyncLog["status"] | "ALL")}
          />
        </div>
        <div className="overflow-hidden rounded-card border border-default">
          <table className="min-w-full divide-y divide-default text-sm">
            <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">{dict.detail.health.columns.kind}</th>
                <th className="px-4 py-3">{dict.detail.health.columns.status}</th>
                <th className="px-4 py-3">{dict.detail.health.columns.started}</th>
                <th className="px-4 py-3">{dict.detail.health.columns.duration}</th>
                <th className="px-4 py-3">{dict.detail.health.columns.items}</th>
                <th className="px-4 py-3">{dict.detail.health.columns.message}</th>
                <th className="px-4 py-3 text-right">{dict.actions.runKindSync}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default bg-white">
              {filteredLogs.map((log) => {
                const duration =
                  log.finishedAt && log.startedAt
                    ? `${Math.round(
                        (new Date(log.finishedAt).getTime() - new Date(log.startedAt).getTime()) / 1000,
                      )}s`
                    : "—";
                return (
                  <tr key={log.id} className="hover:bg-accent-primary-soft/25">
                    <td className="px-4 py-3 font-semibold text-primary">{log.kind}</td>
                    <td className="px-4 py-3">
                      <span className={statusColor(log.status)}>{log.status}</span>
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {new Date(log.startedAt).toLocaleString(locale)}
                    </td>
                    <td className="px-4 py-3 text-secondary">{duration}</td>
                    <td className="px-4 py-3 text-secondary">{log.itemCount ?? "—"}</td>
                    <td className="px-4 py-3 text-secondary">{log.errorMessage ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="text-xs font-semibold text-accent-primary hover:underline"
                        onClick={() => triggerSync(log.kind)}
                      >
                        {dict.actions.runKindSync}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Settings = ({
  data,
  locale,
  dict,
}: {
  data: ChannelDetailSnapshot;
  locale: Locale;
  dict: ChannelsDictionary;
}) => {
  const [preferences, setPreferences] = useState(data.syncPreferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const syncLabels: Record<keyof typeof preferences.autoSync, string> = {
    products: dict.wizard.syncProducts,
    inventory: dict.wizard.syncInventory,
    orders: dict.wizard.syncOrders,
    pricing: dict.wizard.syncPricing,
    reviews: dict.wizard.syncReviews,
  };
  const cadenceLabels: Record<keyof typeof preferences.cadenceMinutes, string> = {
    products: dict.wizard.syncProducts,
    inventory: dict.wizard.syncInventory,
    orders: dict.wizard.syncOrders,
    pricing: dict.wizard.syncPricing,
    reviews: dict.wizard.syncReviews,
  };

  const toggle = (key: keyof typeof preferences.autoSync) => {
    setPreferences((prev) => ({
      ...prev,
      autoSync: { ...prev.autoSync, [key]: !prev.autoSync[key] },
    }));
  };

  const updateCadence = (key: keyof typeof preferences.cadenceMinutes, value: number) => {
    setPreferences((prev) => ({
      ...prev,
      cadenceMinutes: { ...prev.cadenceMinutes, [key]: value },
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    await ChannelService.updateSyncPreferences("demo-org", data.channel.id, preferences);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fields = [
    { label: dict.detail.settings.title, value: data.channel.name },
    { label: dict.detail.header.status, value: data.channel.status },
    { label: dict.detail.header.region, value: data.channel.region },
    { label: dict.detail.header.account, value: data.channel.accountId ?? "—" },
    { label: dict.detail.header.connected, value: new Date(data.channel.connectedAt).toLocaleString(locale) },
  ];

  return (
    <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className="flex flex-col gap-1 text-sm text-primary">
            {field.label}
            <input
              readOnly
              value={field.value}
              className="rounded-card border border-default bg-surface px-3 py-2 text-sm text-secondary"
            />
          </label>
        ))}
      </div>

      <div className="space-y-3 rounded-card border border-default bg-surface-muted p-4 shadow-soft">
        <p className="text-sm font-semibold text-primary">{dict.detail.settings.syncPreferences}</p>
        <div className="grid gap-2 md:grid-cols-3">
          {Object.entries(preferences.autoSync).map(([key, value]) => (
            <ToggleRow
              key={key}
              label={syncLabels[key as keyof typeof preferences.autoSync] ?? key}
              checked={value}
              onChange={() => toggle(key as keyof typeof preferences.autoSync)}
            />
          ))}
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {Object.entries(preferences.cadenceMinutes).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between rounded-card border border-default bg-surface px-3 py-2 text-sm text-primary">
              <span className="capitalize">{cadenceLabels[key as keyof typeof preferences.cadenceMinutes] ?? key}</span>
              <input
                type="number"
                value={value}
                onChange={(e) => updateCadence(key as keyof typeof preferences.cadenceMinutes, Number(e.target.value))}
                className="w-20 rounded-card border border-default bg-surface-muted px-2 py-1 text-right text-sm"
              />
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-default"
            checked={preferences.notifyOnFailure}
            onChange={(e) => setPreferences((prev) => ({ ...prev, notifyOnFailure: e.target.checked }))}
          />
          {dict.detail.settings.notifyOnFailure}
        </label>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary text-xs" type="button" onClick={savePreferences} disabled={saving}>
            {saving ? dict.common.saving : dict.actions.save}
          </button>
          {saved ? <span className="text-xs text-accent-success">{dict.common.saved}</span> : null}
        </div>
      </div>

      <div className="rounded-card border border-default bg-rose-50 p-4">
        <p className="text-sm font-semibold text-rose-700">{dict.detail.settings.danger}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="btn btn-secondary text-xs" type="button">
            {dict.detail.settings.pause}
          </button>
          <button className="btn btn-primary text-xs" type="button">
            {dict.detail.settings.disconnect}
          </button>
        </div>
      </div>
    </div>
  );
};

const PerformanceChart = ({ points }: { points: ChannelDetailSnapshot["timeline"] }) => {
  const width = 520;
  const height = 180;

  const maxRevenue = Math.max(...points.map((p) => p.revenue));
  const maxOrders = Math.max(...points.map((p) => p.orders));

  const project = (value: number, max: number) => {
    if (max === 0) return height / 2;
    return height - (value / max) * (height - 30) - 10;
  };

  const pointString = (key: "revenue" | "orders") =>
    points
      .map((p, idx) => {
        const x = (idx / Math.max(points.length - 1, 1)) * (width - 20) + 10;
        const y = project(p[key], key === "revenue" ? maxRevenue : maxOrders);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <polyline
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="3"
        points={pointString("revenue")}
        strokeLinecap="round"
      />
      <polyline
        fill="none"
        stroke="rgb(16, 185, 129)"
        strokeWidth="2"
        points={pointString("orders")}
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      {points.map((p, idx) => {
        const x = (idx / Math.max(points.length - 1, 1)) * (width - 20) + 10;
        const y = project(p.revenue, maxRevenue);
        return <circle key={p.date} cx={x} cy={y} r={3} fill="var(--accent-primary)" />;
      })}
    </svg>
  );
};

const LabelPill = ({
  label,
  options,
  active,
  onChange,
  optionLabel,
}: {
  label: string;
  options: string[];
  active: string;
  onChange: (value: string) => void;
  optionLabel?: (value: string) => string;
}) => (
  <div className="inline-flex items-center gap-2 rounded-pill border border-default bg-surface-muted p-1 shadow-soft">
    <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
    <div className="flex items-center gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          className={`rounded-pill px-3 py-1 text-xs font-semibold transition ${
            opt === active ? "bg-accent-primary text-white shadow-token-sm" : "text-secondary hover:bg-accent-primary-soft"
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

const ToggleRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <div className="flex items-center justify-between rounded-card border border-default bg-surface px-3 py-2 shadow-soft">
    <span className="text-sm font-semibold text-primary">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? "bg-accent-primary" : "bg-default"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-card border border-default bg-surface-muted p-3 shadow-token-sm">
    <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    <p className="text-lg font-semibold text-primary">{value}</p>
  </div>
);

const statusColor = (status: ChannelSyncLog["status"]) =>
  `rounded-pill px-2 py-1 text-xs font-semibold ${
    status === "SUCCESS"
      ? "bg-emerald-100 text-emerald-700"
      : status === "FAILED"
        ? "bg-rose-100 text-rose-700"
        : status === "RUNNING"
          ? "bg-amber-100 text-amber-700"
          : "bg-indigo-100 text-indigo-700"
  }`;

const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "ja" ? "JPY" : "USD",
    maximumFractionDigits: 0,
  }).format(value);
