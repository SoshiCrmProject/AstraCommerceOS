"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { type ProductsDictionary } from "@/i18n/getProductsDictionary";
import {
  type ProductActivityLog,
  type ProductChannelListing,
  type ProductDetail,
  type ProductPerformancePoint,
} from "@/lib/services/product-types";

type ProductDetailViewProps = {
  product: ProductDetail;
  locale: Locale;
  dict: ProductsDictionary;
};

type TabKey = "overview" | "inventory" | "channels" | "reviews" | "research" | "activity";

const formatCurrency = (value: number, locale: Locale, currency: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 0,
  }).format(value);

const formatNumber = (value: number, locale: Locale, fractionDigits = 0) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits }).format(value);

const stockStatusForLocation = (onHand: number, reorderPoint: number) => {
  if (onHand === 0) return "OOS" as const;
  if (onHand <= reorderPoint) return "LOW" as const;
  return "OK" as const;
};

export function ProductDetailView({ product, locale, dict }: ProductDetailViewProps) {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [strategyOutput, setStrategyOutput] = useState<string | null>(null);
  const currency = product.listings?.[0]?.currency ?? (locale === "ja" ? "JPY" : "USD");

  const summary = useMemo(
    () => ({
      revenue: range === "7d" ? product.sales.revenue7d : product.sales.revenue30d,
      orders: range === "7d" ? product.sales.orders7d : product.sales.orders30d,
      profit: range === "7d" ? product.sales.profit7d : product.sales.profit30d,
    }),
    [product.sales, range],
  );

  const activeListings = product.listings.filter((l) => l.status === "ACTIVE").length;

  const handleStrategy = (prompt: "pricing" | "channels" | "risks") => {
    if (!product.research) return;
    const roi = product.research.roiPercent ?? 0;
    const margin = product.research.marginPercent ?? 0;
    if (prompt === "pricing") {
      setStrategyOutput(
        `${dict.detail.research.prompts.pricing}\n• Target ROI ${roi}% with floor at ${formatCurrency(
          product.research.landedCostEstimate ? product.research.landedCostEstimate * 1.4 : product.sales.avgSellingPrice * 0.92,
          locale,
          currency,
        )}\n• Guard Buy Box share above ${(product.listings[0]?.buyBoxShare ?? 0) + 5}% by keeping ASP near ${formatCurrency(
          product.sales.avgSellingPrice,
          locale,
          currency,
        )}`,
      );
    }
    if (prompt === "channels") {
      setStrategyOutput(
        `${dict.detail.research.prompts.channels}\n• (${activeListings}) live channels; expand to Walmart/eBay after stabilizing margin ${margin}%\n• Repurpose PDP content that mentions ${product.review.topKeywords
          .slice(0, 2)
          .join(", ")} for new channels`,
      );
    }
    if (prompt === "risks") {
      setStrategyOutput(
        `${dict.detail.research.prompts.risks}\n• Refund rate ${product.sales.refundRate30d}% with ${product.review.negativeReviews30d} negatives\n• Inventory status: ${
          product.inventory.outOfStock ? dict.filters.stockOos : product.inventory.lowStock ? dict.filters.stockLow : dict.filters.stockOk
        } · reorder at ${(product.inventory.locations[0]?.reorderPoint ?? 0)} units`,
      );
    }
    setActiveTab("research");
  };

  const channelTypeLabels: Record<ProductChannelListing["channelType"], string> = {
    AMAZON: dict.filters.channelOptions.amazon,
    SHOPIFY: dict.filters.channelOptions.shopify,
    SHOPEE: dict.filters.channelOptions.shopee,
    RAKUTEN: dict.filters.channelOptions.rakuten,
    EBAY: dict.filters.channelOptions.ebay,
    WALMART: dict.filters.channelOptions.walmart,
    YAHOO_SHOPPING: dict.filters.channelOptions.yahoo,
    MERCARI: dict.filters.channelOptions.mercari,
    TIKTOK_SHOP: dict.filters.channelOptions.tiktok,
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: dict.detail.tabs.overview },
    { key: "inventory", label: dict.detail.tabs.inventory },
    { key: "channels", label: dict.detail.tabs.channels },
    { key: "reviews", label: dict.detail.tabs.reviews },
    { key: "research", label: dict.detail.tabs.research },
    { key: "activity", label: dict.detail.tabs.activity },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-card border border-default bg-surface-muted">
            {product.core.imageUrl ? (
              <Image
                src={product.core.imageUrl}
                alt={product.core.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
                sizes="64px"
              />
            ) : (
              <span className="text-xs text-muted">{product.core.primarySku}</span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-primary">{product.core.name}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-secondary">
              <span>{product.core.brand}</span>
              <span className="text-muted">•</span>
              <span className="font-mono text-xs text-muted">{product.core.primarySku}</span>
              <span className="text-muted">•</span>
              <span className="text-xs text-muted">{product.core.category}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(product.core.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-pill bg-accent-primary-soft px-3 py-1 text-[11px] font-semibold text-accent-primary"
                >
                  {dict.detail.tags[tag as keyof typeof dict.detail.tags] ?? tag}
                </span>
              ))}
              {product.inventory.lowStock ? (
                <span className="rounded-pill bg-yellow-100 px-3 py-1 text-[11px] font-semibold text-yellow-700">
                  {dict.detail.tags.low_stock}
                </span>
              ) : null}
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <Link
              href={`/${locale}/app/channels`}
              className="rounded-pill border border-default px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
            >
              {dict.actions.openChannels}
            </Link>
            <button
              type="button"
              className="rounded-pill border border-default px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
              onClick={() => setActiveTab("research")}
            >
              {dict.actions.askCopilot}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-sm font-semibold text-primary">{dict.title}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-pill border px-3 py-1 text-xs font-semibold ${
                range === "7d"
                  ? "border-accent-primary bg-accent-primary-soft text-primary"
                  : "border-default text-secondary"
              }`}
              onClick={() => setRange("7d")}
            >
              {dict.detail.summary.toggle7d}
            </button>
            <button
              type="button"
              className={`rounded-pill border px-3 py-1 text-xs font-semibold ${
                range === "30d"
                  ? "border-accent-primary bg-accent-primary-soft text-primary"
                  : "border-default text-secondary"
              }`}
              onClick={() => setRange("30d")}
            >
              {dict.detail.summary.toggle30d}
            </button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard label={dict.detail.summary.revenue} value={formatCurrency(summary.revenue, locale, currency)} badge={range === "7d" ? dict.detail.summary.toggle7d : dict.detail.summary.toggle30d} />
          <SummaryCard label={dict.detail.summary.orders} value={formatNumber(summary.orders, locale)} badge={range === "7d" ? dict.detail.summary.toggle7d : dict.detail.summary.toggle30d} />
          <SummaryCard label={dict.detail.summary.profit} value={formatCurrency(summary.profit, locale, currency)} badge={range === "7d" ? dict.detail.summary.toggle7d : dict.detail.summary.toggle30d} />
          <SummaryCard
            label={dict.detail.summary.asp}
            value={formatCurrency(product.sales.avgSellingPrice, locale, currency)}
            badge={dict.table.avgPrice}
          />
          <SummaryCard
            label={dict.detail.summary.refund}
            value={`${product.sales.refundRate30d}%`}
            badge={dict.detail.summary.toggle30d}
          />
        </div>
      </div>

      <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg">
        <div className="flex flex-wrap items-center gap-2 border-b border-default pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`rounded-pill px-3 py-1 text-xs font-semibold transition ${
                activeTab === tab.key
                  ? "bg-accent-primary text-white shadow-token-sm"
                  : "text-secondary hover:bg-accent-primary-soft"
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {activeTab === "overview" && (
            <OverviewTab
              product={product}
              locale={locale}
              dict={dict}
              currency={currency}
              onOpenResearch={() => setActiveTab("research")}
            />
          )}
          {activeTab === "inventory" && (
            <InventoryTab product={product} locale={locale} dict={dict} />
          )}
          {activeTab === "channels" && (
            <ChannelsTab
              product={product}
              locale={locale}
              dict={dict}
              currency={currency}
              channelTypeLabels={channelTypeLabels}
            />
          )}
          {activeTab === "reviews" && (
            <ReviewsTab product={product} locale={locale} dict={dict} />
          )}
          {activeTab === "research" && (
            <ResearchTab
              product={product}
              locale={locale}
              dict={dict}
              currency={currency}
              strategyOutput={strategyOutput}
              onGenerate={handleStrategy}
            />
          )}
          {activeTab === "activity" && <ActivityTab product={product} locale={locale} dict={dict} />}
        </div>
      </div>
    </div>
  );
}

const SummaryCard = ({ label, value, badge }: { label: string; value: string; badge?: string }) => (
  <div className="rounded-card border border-default bg-surface-muted p-3 shadow-token-sm">
    <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    <p className="text-lg font-semibold text-primary">{value}</p>
    {badge ? <p className="text-[11px] font-semibold text-muted">{badge}</p> : null}
  </div>
);

const OverviewTab = ({
  product,
  locale,
  dict,
  currency,
  onOpenResearch,
}: {
  product: ProductDetail;
  locale: Locale;
  dict: ProductsDictionary;
  currency: string;
  onOpenResearch: () => void;
}) => {
  const latestInventory = product.inventory.locations.slice(0, 3);
  const activeChannels = product.listings.filter((l) => l.status === "ACTIVE").length;
  const pendingChannels = product.listings.filter((l) => l.status === "PENDING").length;
  const oosChannels = product.listings.filter((l) => l.status === "OUT_OF_STOCK").length;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        <div className="rounded-card border border-default bg-surface-muted p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">{dict.detail.overview.performance}</p>
            <span className="text-xs text-muted">{dict.detail.overview.channelsLive.replace("{{count}}", activeChannels.toString())}</span>
          </div>
          <div className="mt-2">
            <Sparkline data={product.performance} />
          </div>
        </div>
        <div className="rounded-card border border-default bg-surface-muted p-4 space-y-3">
          <p className="text-sm font-semibold text-primary">{dict.detail.overview.copilot}</p>
          <p className="text-sm leading-relaxed text-secondary">{product.aiSummary}</p>
          <button
            type="button"
            className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
            onClick={onOpenResearch}
          >
            {dict.actions.askCopilot}
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-card border border-default bg-surface-muted p-4">
          <p className="text-sm font-semibold text-primary">{dict.detail.overview.inventory}</p>
          <div className="mt-2 space-y-2">
            {latestInventory.map((loc) => {
              const status = stockStatusForLocation(loc.onHand, loc.reorderPoint);
              return (
                <div key={loc.locationId} className="flex items-center justify-between rounded-card border border-default bg-white px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-primary">{loc.locationName}</p>
                    <p className="text-[11px] text-muted">
                      {dict.detail.inventory.types[loc.type]} · {dict.detail.inventory.table.onHand}: {loc.onHand} ·{" "}
                      {dict.detail.inventory.table.reserved || dict.labels.reserved}: {loc.reserved}
                    </p>
                  </div>
                  <StatusPill
                    tone={
                      status === "OOS" ? "danger" : status === "LOW" ? "warning" : "success"
                    }
                    label={
                      status === "OOS"
                        ? dict.filters.stockOos
                        : status === "LOW"
                          ? dict.filters.stockLow
                          : dict.filters.stockOk
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-card border border-default bg-surface-muted p-4 space-y-2">
          <p className="text-sm font-semibold text-primary">{dict.detail.overview.channels}</p>
          <div className="flex flex-wrap gap-2">
            <Chip label={dict.detail.channels.labels.status} value={dict.detail.overview.channelsLive.replace("{{count}}", activeChannels.toString())} />
            <Chip
              label={dict.detail.channels.statusLabels.PENDING}
              value={`${pendingChannels} ${dict.detail.channels.statusLabels.PENDING}`}
            />
            <Chip
              label={dict.table.badges.needsAttention}
              value={`${oosChannels} ${dict.filters.stockOos}`}
            />
          </div>
          <p className="text-xs text-muted">
            {product.listings
              .map((l) => `${l.channelName} · ${formatCurrency(l.price, locale, currency)}`)
              .slice(0, 3)
              .join(" / ")}
          </p>
        </div>
      </div>
    </div>
  );
};

const InventoryTab = ({
  product,
  locale,
  dict,
}: {
  product: ProductDetail;
  locale: Locale;
  dict: ProductsDictionary;
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-primary">{dict.detail.inventory.title}</p>
      <div className="overflow-hidden rounded-card border border-default">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">{dict.detail.inventory.table.location}</th>
              <th className="px-4 py-3">{dict.detail.inventory.table.type}</th>
              <th className="px-4 py-3">{dict.detail.inventory.table.onHand}</th>
              <th className="px-4 py-3">{dict.detail.inventory.table.reserved}</th>
              <th className="px-4 py-3">{dict.detail.inventory.table.reorder}</th>
              <th className="px-4 py-3">{dict.detail.inventory.table.status}</th>
              <th className="px-4 py-3 text-right">{dict.detail.inventory.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {product.inventory.locations.map((loc) => {
              const status = stockStatusForLocation(loc.onHand, loc.reorderPoint);
              return (
                <tr key={loc.locationId} className="hover:bg-accent-primary-soft/30">
                  <td className="px-4 py-3 font-semibold text-primary">{loc.locationName}</td>
                  <td className="px-4 py-3 text-secondary">
                    {dict.detail.inventory.types[loc.type]}
                  </td>
                  <td className="px-4 py-3 text-secondary">{loc.onHand}</td>
                  <td className="px-4 py-3 text-secondary">{loc.reserved}</td>
                  <td className="px-4 py-3 text-secondary">{loc.reorderPoint}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      tone={
                        status === "OOS" ? "danger" : status === "LOW" ? "warning" : "success"
                      }
                      label={
                        status === "OOS"
                          ? dict.filters.stockOos
                          : status === "LOW"
                            ? dict.filters.stockLow
                            : dict.filters.stockOk
                      }
                    />
                    <div className="text-[11px] text-muted">
                      {status !== "OK" ? dict.detail.inventory.warnings.belowReorder : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/${locale}/app/inventory?sku=${product.core.primarySku}`}
                        className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                      >
                        {dict.detail.inventory.table.openInventory}
                      </Link>
                      <button
                        type="button"
                        className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                        onClick={() => alert(dict.detail.inventory.table.createPo)}
                      >
                        {dict.detail.inventory.table.createPo}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ChannelsTab = ({
  product,
  locale,
  dict,
  currency,
  channelTypeLabels,
}: {
  product: ProductDetail;
  locale: Locale;
  dict: ProductsDictionary;
  currency: string;
  channelTypeLabels: Record<ProductChannelListing["channelType"], string>;
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-primary">{dict.detail.channels.title}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {product.listings.map((listing) => {
          const needsAttention =
            product.inventory.lowStock ||
            product.inventory.outOfStock ||
            listing.status === "OUT_OF_STOCK" ||
            listing.status === "ERROR";
          const statusTone =
            listing.status === "ACTIVE"
              ? "success"
              : listing.status === "PAUSED"
                ? "warning"
                : listing.status === "OUT_OF_STOCK"
                  ? "danger"
                  : listing.status === "ERROR"
                    ? "danger"
                    : "info";
          return (
            <div
              key={listing.channelId}
              className="rounded-card border border-default bg-surface-muted p-4 shadow-token-sm space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">{listing.channelName}</p>
                  <p className="text-xs text-muted">
                    {channelTypeLabels[listing.channelType]} · {listing.region}
                  </p>
                </div>
                <StatusPill
                  tone={statusTone}
                  label={dict.detail.channels.statusLabels[listing.status]}
                />
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-secondary">
                <span>
                  {dict.detail.channels.labels.price}:{" "}
                  {formatCurrency(listing.price, locale, currency)}
                </span>
                <span>
                  {dict.detail.channels.labels.orders}: {listing.orders7d}
                </span>
                <span>
                  {dict.detail.channels.labels.buyBox}: {listing.buyBoxShare ?? 0}%
                </span>
              </div>
              {needsAttention ? (
                <span className="rounded-pill bg-yellow-100 px-3 py-1 text-[11px] font-semibold text-yellow-700">
                  {dict.detail.channels.labels.attention}
                </span>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/${locale}/app/listings?sku=${product.core.primarySku}&channelId=${listing.channelId}`}
                  className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                >
                  {dict.detail.channels.ctaListings}
                </Link>
                <Link
                  href={`/${locale}/app/pricing?sku=${product.core.primarySku}`}
                  className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                >
                  {dict.actions.openPricing}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReviewsTab = ({
  product,
  locale,
  dict,
}: {
  product: ProductDetail;
  locale: Locale;
  dict: ProductsDictionary;
}) => {
  const total = product.review.positiveReviews30d + product.review.negativeReviews30d;
  const positivePct = total > 0 ? Math.round((product.review.positiveReviews30d / total) * 100) : 0;
  const negativePct = total > 0 ? Math.round((product.review.negativeReviews30d / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-primary">{dict.detail.reviews.title}</p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-card border border-default bg-surface-muted p-4">
          <p className="text-xs uppercase tracking-wide text-muted">{dict.detail.reviews.avgRating}</p>
          <p className="text-2xl font-semibold text-primary">
            {product.review.avgRating30d.toFixed(1)} ★
          </p>
          <p className="text-xs text-muted">
            {formatNumber(product.review.totalReviews, locale)} {dict.labels.reviews}
          </p>
        </div>
        <div className="rounded-card border border-default bg-surface-muted p-4 space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted">{dict.detail.reviews.positive}</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border-subtle">
            <div
              className="h-2 bg-green-500"
              style={{ width: `${positivePct}%` }}
              aria-label={dict.detail.reviews.positive}
            />
          </div>
          <p className="text-xs text-secondary">{product.review.positiveReviews30d} ({positivePct}%)</p>
        </div>
        <div className="rounded-card border border-default bg-surface-muted p-4 space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted">{dict.detail.reviews.negative}</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border-subtle">
            <div
              className="h-2 bg-red-500"
              style={{ width: `${negativePct}%` }}
              aria-label={dict.detail.reviews.negative}
            />
          </div>
          <p className="text-xs text-secondary">{product.review.negativeReviews30d} ({negativePct}%)</p>
        </div>
      </div>
      <div className="rounded-card border border-default bg-surface-muted p-4 space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted">{dict.detail.reviews.keywords}</p>
        <div className="flex flex-wrap gap-2">
          {product.review.topKeywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-pill bg-accent-primary-soft px-3 py-1 text-[11px] font-semibold text-accent-primary"
            >
              {keyword}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/app/reviews?sku=${product.core.primarySku}`}
            className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
          >
            {dict.detail.reviews.viewAll}
          </Link>
          <button
            type="button"
            className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
            onClick={() => alert(dict.detail.reviews.reply)}
          >
            {dict.detail.reviews.reply}
          </button>
        </div>
      </div>
    </div>
  );
};

const ResearchTab = ({
  product,
  locale,
  dict,
  currency,
  strategyOutput,
  onGenerate,
}: {
  product: ProductDetail;
  locale: Locale;
  dict: ProductsDictionary;
  currency: string;
  strategyOutput: string | null;
  onGenerate: (prompt: "pricing" | "channels" | "risks") => void;
}) => {
  const research = product.research;
  const notes = research?.notes
    ? research.notes.split(".").map((note) => note.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-primary">{dict.detail.research.title}</p>
      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard label={dict.detail.research.bsr} value={research?.bsrRank ? `#${research.bsrRank}` : "-"} />
        <SummaryCard
          label={dict.detail.research.estSales}
          value={
            research?.estimatedDailySales
              ? `${research.estimatedDailySales}${dict.labels.perDay}`
              : "-"
          }
        />
        <SummaryCard label={dict.detail.research.competition} value={research?.competitionLevel ? dict.researchPanel.levels[research.competitionLevel.toLowerCase() as "low" | "medium" | "high"] : "-"} />
        <SummaryCard label={dict.detail.research.roi} value={research?.roiPercent ? `${research.roiPercent}%` : "-"} />
        <SummaryCard label={dict.detail.research.margin} value={research?.marginPercent ? `${research.marginPercent}%` : "-"} />
        <SummaryCard
          label={dict.detail.research.landedCost}
          value={
            research?.landedCostEstimate
              ? formatCurrency(research.landedCostEstimate, locale, currency)
              : "-"
          }
        />
        <SummaryCard
          label={dict.detail.research.fees}
          value={research?.feesEstimate ? formatCurrency(research.feesEstimate, locale, currency) : "-"}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-card border border-default bg-surface-muted p-4 space-y-2">
          <p className="text-sm font-semibold text-primary">{dict.detail.research.notes}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-secondary">
            {notes.length > 0
              ? notes.map((note) => <li key={note}>{note}</li>)
              : <li>{dict.labels.noResearchNotes}</li>}
          </ul>
        </div>
        <div className="rounded-card border border-default bg-surface-muted p-4 space-y-3">
          <p className="text-sm font-semibold text-primary">{dict.detail.research.strategy}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
              onClick={() => onGenerate("pricing")}
            >
              {dict.detail.research.prompts.pricing}
            </button>
            <button
              type="button"
              className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
              onClick={() => onGenerate("channels")}
            >
              {dict.detail.research.prompts.channels}
            </button>
            <button
              type="button"
              className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
              onClick={() => onGenerate("risks")}
            >
              {dict.detail.research.prompts.risks}
            </button>
          </div>
          <div className="rounded-card border border-default bg-white p-3 text-sm text-secondary">
            {strategyOutput ?? dict.aiHelper.empty}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityTab = ({
  product,
  locale,
  dict,
}: {
  product: ProductDetail;
  locale: Locale;
  dict: ProductsDictionary;
}) => {
  const sorted = [...product.activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const toneForType = (type: ProductActivityLog["type"]): "success" | "warning" | "danger" | "info" => {
    switch (type) {
      case "REVIEW":
        return "success";
      case "PRICE_CHANGE":
        return "info";
      case "AUTOMATION":
        return "warning";
      case "LISTING":
        return "info";
      case "SYNC":
      default:
        return "info";
    }
  };
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-primary">{dict.detail.activity.title}</p>
      <div className="overflow-hidden rounded-card border border-default">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">{dict.detail.activity.timestamp}</th>
              <th className="px-4 py-3">{dict.detail.activity.type}</th>
              <th className="px-4 py-3">{dict.detail.activity.source}</th>
              <th className="px-4 py-3">{dict.detail.activity.description}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {sorted.map((log) => (
              <tr key={log.id} className="hover:bg-accent-primary-soft/30">
                <td className="px-4 py-3 text-secondary">
                  {new Date(log.timestamp).toLocaleString(locale)}
                </td>
                <td className="px-4 py-3">
                  <StatusPill
                    tone={toneForType(log.type)}
                    label={dict.detail.activity.types[log.type]}
                  />
                </td>
                <td className="px-4 py-3 text-secondary">{log.source}</td>
                <td className="px-4 py-3 text-secondary">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusPill = ({ tone, label }: { tone: "success" | "warning" | "danger" | "info"; label: string }) => {
  const styles =
    tone === "success"
      ? "bg-green-100 text-green-700"
      : tone === "danger"
        ? "bg-red-100 text-red-700"
        : tone === "warning"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-blue-100 text-blue-700";
  return <span className={`rounded-pill px-3 py-1 text-[11px] font-semibold ${styles}`}>{label}</span>;
};

const Chip = ({ label, value }: { label: string; value: string }) => (
  <span className="rounded-pill border border-default px-3 py-1 text-[11px] font-semibold text-secondary">
    {label}: {value}
  </span>
);

const Sparkline = ({ data }: { data: ProductPerformancePoint[] }) => {
  if (!data.length) return null;
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const points = data.map((point, idx) => {
    const x = (idx / Math.max(data.length - 1, 1)) * 100;
    const y = 40 - (point.revenue / maxRevenue) * 40;
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 100 40" className="h-20 w-full text-accent-primary">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points.join(" ")}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};
