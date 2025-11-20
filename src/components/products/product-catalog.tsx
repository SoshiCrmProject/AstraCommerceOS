"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { type ProductsDictionary } from "@/i18n/getProductsDictionary";
import {
  type ProductCopilotSuggestion,
  type ProductResearchMetrics,
  type ProductRow,
} from "@/lib/services/product-types";

type ProductsCatalogProps = {
  items: ProductRow[];
  totalCount: number;
  locale: Locale;
  dict: ProductsDictionary;
  onAskCopilot: (prompt: string) => Promise<ProductCopilotSuggestion[]>;
};

type UiFilters = {
  search: string;
  brand: string;
  category: string;
  tag: string;
  channel: string;
  stock: "" | "OK" | "LOW" | "OOS";
  sort: "REVENUE_7D" | "REVENUE_30D" | "ORDERS_7D" | "PROFIT_30D" | "CREATED_AT";
};

const stockStatusFor = (product: ProductRow): "OK" | "LOW" | "OOS" =>
  product.inventory.outOfStock ? "OOS" : product.inventory.lowStock ? "LOW" : "OK";

const normalizeChannelType = (value: string) =>
  value.toLowerCase().replace("_shop", "").replace("_shopping", "");

const formatCurrency = (value: number, locale: Locale, currencyHint?: string) => {
  const currency = currencyHint ?? (locale === "ja" ? "JPY" : "USD");
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 0,
  }).format(value);
};

const formatNumber = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);

const researchBadge = (product: ProductRow, dict: ProductsDictionary) => {
  if (product.inventory.outOfStock || product.inventory.lowStock) {
    return { label: dict.table.badges.needsAttention, tone: "warning" as const };
  }
  if (product.research?.roiPercent && product.research.roiPercent > 45) {
    return { label: dict.table.badges.highRoi, tone: "success" as const };
  }
  if (product.research?.competitionLevel === "HIGH") {
    return { label: dict.table.badges.crowded, tone: "danger" as const };
  }
  if ((product.research?.estimatedDailySales ?? 0) >= 25) {
    return { label: dict.table.badges.rising, tone: "info" as const };
  }
  return null;
};

export function ProductsCatalog({ items, totalCount, locale, dict, onAskCopilot }: ProductsCatalogProps) {
  const [filters, setFilters] = useState<UiFilters>({
    search: "",
    brand: "all",
    category: "all",
    tag: "all",
    channel: "all",
    stock: "",
    sort: "REVENUE_7D",
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    items[0]?.core.id ?? null,
  );
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResults, setAiResults] = useState<ProductCopilotSuggestion[]>([]);
  const [isPending, startTransition] = useTransition();

  const brands = useMemo(
    () => Array.from(new Set(items.map((i) => i.core.brand).filter(Boolean))) as string[],
    [items],
  );
  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.core.category).filter(Boolean))) as string[],
    [items],
  );
  const tags = useMemo(
    () => Array.from(new Set(items.flatMap((i) => i.core.tags ?? []))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        if (filters.search) {
          const search = filters.search.toLowerCase();
          const match =
            item.core.name.toLowerCase().includes(search) ||
            item.core.primarySku.toLowerCase().includes(search) ||
            (item.core.brand ?? "").toLowerCase().includes(search);
          if (!match) return false;
        }
        if (filters.brand !== "all" && item.core.brand !== filters.brand) return false;
        if (filters.category !== "all" && item.core.category !== filters.category) return false;
        if (filters.tag !== "all" && !(item.core.tags ?? []).includes(filters.tag)) return false;
        if (filters.stock && stockStatusFor(item) !== filters.stock) return false;
        if (filters.channel !== "all") {
          const matchesChannel = (item.listings ?? []).some(
            (listing) => normalizeChannelType(listing.channelType) === filters.channel,
          );
          if (!matchesChannel) return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case "REVENUE_7D":
            return b.sales.revenue7d - a.sales.revenue7d;
          case "REVENUE_30D":
            return b.sales.revenue30d - a.sales.revenue30d;
          case "ORDERS_7D":
            return b.sales.orders7d - a.sales.orders7d;
          case "PROFIT_30D":
            return b.sales.profit30d - a.sales.profit30d;
          case "CREATED_AT":
            return new Date(b.core.createdAt).getTime() - new Date(a.core.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [filters, items]);

  const effectiveSelectedId =
    selectedProductId && filtered.some((item) => item.core.id === selectedProductId)
      ? selectedProductId
      : filtered[0]?.core.id ?? null;

  const selectedProduct =
    filtered.find((item) => item.core.id === effectiveSelectedId) ?? filtered[0];

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filtered.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filtered.map((item) => item.core.id)));
    }
  };

  const handleCopilotPrompt = (prompt: string) => {
    startTransition(async () => {
      const results = await onAskCopilot(prompt);
      setAiPrompt(prompt);
      setAiResults(results);
      setAiOpen(true);
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.65fr_0.85fr]">
      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-strong hover:bg-accent-primary-soft sm:hidden"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              {dict.filters.stock} ▾
            </button>
            <p className="text-xs text-muted">
              {formatNumber(totalCount, locale)} {dict.labels.products} · {dict.subtitle}
            </p>
          </div>
        </div>

        <div
          className={`rounded-card border border-default bg-surface-muted/60 px-4 py-3 shadow-token-sm ${
            filtersOpen ? "" : "hidden sm:block"
          }`}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder={dict.filters.searchPlaceholder}
              className="w-full rounded-card border border-default bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <select
              value={filters.brand}
              onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
              className="w-full rounded-card border border-default bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="all">{dict.filters.brand}</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-card border border-default bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="all">{dict.filters.category}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={filters.tag}
              onChange={(e) => setFilters((prev) => ({ ...prev, tag: e.target.value }))}
              className="w-full rounded-card border border-default bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="all">{dict.filters.tags}</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {dict.filters.tagsOptions[tag as keyof typeof dict.filters.tagsOptions] ?? tag}
                </option>
              ))}
            </select>
            <select
              value={filters.channel}
              onChange={(e) => setFilters((prev) => ({ ...prev, channel: e.target.value }))}
              className="w-full rounded-card border border-default bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="all">{dict.filters.channel}</option>
              <option value="amazon">{dict.filters.channelOptions.amazon}</option>
              <option value="shopify">{dict.filters.channelOptions.shopify}</option>
              <option value="shopee">{dict.filters.channelOptions.shopee}</option>
              <option value="rakuten">{dict.filters.channelOptions.rakuten}</option>
              <option value="ebay">{dict.filters.channelOptions.ebay}</option>
              <option value="walmart">{dict.filters.channelOptions.walmart}</option>
              <option value="yahoo">{dict.filters.channelOptions.yahoo}</option>
              <option value="mercari">{dict.filters.channelOptions.mercari}</option>
              <option value="tiktok">{dict.filters.channelOptions.tiktok}</option>
            </select>
            <div className="flex items-center gap-2">
              {(["OK", "LOW", "OOS"] as const).map((status) => {
                const isActive = filters.stock === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, stock: isActive ? "" : status }))
                    }
                    className={`flex-1 rounded-pill border px-3 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "border-accent-primary bg-accent-primary-soft text-primary"
                        : "border-default bg-white text-secondary hover:border-strong"
                    }`}
                  >
                    {status === "OK"
                      ? dict.filters.stockOk
                      : status === "LOW"
                        ? dict.filters.stockLow
                        : dict.filters.stockOos}
                  </button>
                );
              })}
            </div>
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sort: e.target.value as UiFilters["sort"] }))
              }
              className="w-full rounded-card border border-default bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="REVENUE_7D">{dict.filters.sortOptions.revenue7d}</option>
              <option value="REVENUE_30D">{dict.filters.sortOptions.revenue30d}</option>
              <option value="ORDERS_7D">{dict.filters.sortOptions.orders7d}</option>
              <option value="PROFIT_30D">{dict.filters.sortOptions.profit30d}</option>
              <option value="CREATED_AT">{dict.filters.sortOptions.createdAt}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
            <input
              type="checkbox"
              checked={selectedRows.size === filtered.length && filtered.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-default text-accent-primary focus:ring-2 focus:ring-accent-primary"
              aria-label={dict.labels.selectAll}
            />
            <span>
              {dict.bulk.selected.replace("{{count}}", selectedRows.size.toString())} ·{" "}
              {dict.bulk.label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              className="rounded-pill border border-default px-3 py-1 font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
            >
              {dict.bulk.tagPriority}
            </button>
            <Link
              href={`/${locale}/app/pricing`}
              className="rounded-pill border border-default px-3 py-1 font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
            >
              {dict.bulk.openPricing}
            </Link>
            <Link
              href={`/${locale}/app/inventory`}
              className="rounded-pill border border-default px-3 py-1 font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
            >
              {dict.bulk.openInventory}
            </Link>
            <button
              type="button"
              className="rounded-pill border border-default px-3 py-1 font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
              onClick={() => alert(dict.actions.exportCsv)}
            >
              {dict.bulk.export}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-card border border-default">
          <table className="min-w-full divide-y divide-default text-sm">
            <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-3"></th>
                <th className="px-3 py-3">{dict.table.product}</th>
                <th className="px-3 py-3">{dict.table.revenue}</th>
                <th className="px-3 py-3">{dict.table.orders}</th>
                <th className="px-3 py-3">{dict.table.profit}</th>
                <th className="px-3 py-3">{dict.table.stock}</th>
                <th className="px-3 py-3">{dict.table.ratings}</th>
                <th className="px-3 py-3">{dict.table.research}</th>
                <th className="px-3 py-3 text-right">{dict.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default bg-white">
              {filtered.map((product) => {
                const badge = researchBadge(product, dict);
                const stockStatus = stockStatusFor(product);
                const isSelected = selectedProductId === product.core.id;
                const primaryCurrency = product.listings?.[0]?.currency;
                return (
                  <tr
                    key={product.core.id}
                    className={`cursor-pointer transition hover:bg-accent-primary-soft/30 ${
                      isSelected ? "bg-accent-primary-soft/30" : ""
                    }`}
                    onClick={() => setSelectedProductId(product.core.id)}
                  >
                    <td className="px-3 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(product.core.id)}
                        onChange={() => toggleSelectRow(product.core.id)}
                        className="h-4 w-4 rounded border-default text-accent-primary focus:ring-2 focus:ring-accent-primary"
                        aria-label={product.core.name}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-card border border-default bg-surface-muted">
                          {product.core.imageUrl ? (
                            <Image
                              src={product.core.imageUrl}
                              alt={product.core.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <span className="text-xs text-muted">{product.core.primarySku}</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-primary">{product.core.name}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-secondary">
                            <span>{product.core.brand}</span>
                            <span className="text-muted">•</span>
                            <span className="font-mono text-[11px] text-muted">
                              {product.core.primarySku}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(product.core.tags ?? []).slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-pill bg-accent-primary-soft px-2 py-[3px] text-[11px] font-semibold text-accent-primary"
                              >
                                {dict.filters.tagsOptions[tag as keyof typeof dict.filters.tagsOptions] ??
                                  tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-secondary">
                      <div className="font-semibold text-primary">
                        {formatCurrency(product.sales.revenue7d, locale, primaryCurrency)}
                      </div>
                      <p className="text-xs text-muted">
                        {dict.table.avgPrice}:{" "}
                        {formatCurrency(product.sales.avgSellingPrice, locale, primaryCurrency)}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-primary">
                        {formatNumber(product.sales.orders7d, locale)}
                      </p>
                      <p className="text-xs text-muted">{dict.table.orders}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-primary">
                        {formatCurrency(product.sales.profit30d, locale, primaryCurrency)}
                      </p>
                      <p className="text-xs text-muted">{dict.table.profit}</p>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">
                          {product.inventory.totalOnHand}
                        </span>
                        <span
                          className={`rounded-pill px-2 py-[3px] text-[11px] font-semibold ${
                            stockStatus === "OOS"
                              ? "bg-red-100 text-red-700"
                              : stockStatus === "LOW"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {stockStatus === "OOS"
                            ? dict.filters.stockOos
                            : stockStatus === "LOW"
                              ? dict.filters.stockLow
                              : dict.filters.stockOk}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        {product.inventory.totalReserved} {dict.labels.reserved}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-primary">
                        {product.review.avgRating30d.toFixed(1)} ★
                      </p>
                      <p className="text-xs text-muted">
                        {formatNumber(product.review.totalReviews, locale)} {dict.labels.reviews}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      {badge ? (
                        <span
                          className={`rounded-pill px-3 py-1 text-[11px] font-semibold ${
                            badge.tone === "success"
                              ? "bg-green-100 text-green-700"
                              : badge.tone === "danger"
                                ? "bg-red-100 text-red-700"
                                : badge.tone === "warning"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {badge.label}
                        </span>
                      ) : (
                        <span className="text-xs text-muted">-</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          href={`/${locale}/app/products/${product.core.id}`}
                          className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {dict.actions.open}
                        </Link>
                        <button
                          type="button"
                          className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductId(product.core.id);
                          }}
                        >
                          {dict.table.research}
                        </button>
                        <Link
                          href={`/${locale}/app/pricing?sku=${product.core.primarySku}`}
                          className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {dict.actions.openPricing}
                        </Link>
                        <Link
                          href={`/${locale}/app/inventory?sku=${product.core.primarySku}`}
                          className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {dict.actions.openInventory}
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <ResearchPanel product={selectedProduct} locale={locale} dict={dict} />
        <AiHelper
          open={aiOpen}
          onToggle={() => setAiOpen((open) => !open)}
          prompt={aiPrompt}
          onPreset={handleCopilotPrompt}
          onAsk={(prompt) => handleCopilotPrompt(prompt || aiPrompt)}
          results={aiResults}
          dict={dict}
          isPending={isPending}
        />
      </div>
    </div>
  );
}

const ResearchPanel = ({
  product,
  locale,
  dict,
}: {
  product: ProductRow | undefined;
  locale: Locale;
  dict: ProductsDictionary;
}) => {
  if (!product) {
    return (
      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <p className="text-sm font-semibold text-primary">{dict.researchPanel.title}</p>
        <p className="mt-2 text-sm text-muted">{dict.researchPanel.empty}</p>
      </div>
    );
  }

  const r: ProductResearchMetrics | undefined = product.research;
  const competition =
    r?.competitionLevel === "LOW"
      ? dict.researchPanel.levels.low
      : r?.competitionLevel === "HIGH"
        ? dict.researchPanel.levels.high
        : r?.competitionLevel === "MEDIUM"
          ? dict.researchPanel.levels.medium
          : "-";

  return (
    <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">{dict.researchPanel.title}</p>
          <p className="text-xs text-muted">{product.core.name}</p>
        </div>
        <Link
          href={`/${locale}/app/products/${product.core.id}`}
          className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
        >
          {dict.researchPanel.openDetail}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Metric label={dict.researchPanel.bsr} value={r?.bsrRank ? `#${r.bsrRank}` : "-"} />
        <Metric
          label={dict.researchPanel.estSales}
          value={
            r?.estimatedDailySales ? `${r.estimatedDailySales}${dict.labels.perDay}` : "-"
          }
        />
        <Metric label={dict.researchPanel.competition} value={competition} />
        <Metric
          label={dict.researchPanel.roi}
          value={r?.roiPercent ? `${r.roiPercent}%` : "-"}
        />
        <Metric
          label={dict.researchPanel.margin}
          value={r?.marginPercent ? `${r.marginPercent}%` : "-"}
        />
        <Metric
          label={dict.researchPanel.fees}
          value={r?.feesEstimate ? `${formatCurrency(r.feesEstimate, locale)}` : "-"}
        />
      </div>
      <div className="rounded-card border border-default bg-surface-muted p-3 text-sm text-secondary">
        <p className="font-semibold text-primary">{dict.researchPanel.notes}</p>
        <p className="mt-1 leading-relaxed">
          {r?.notes ?? dict.labels.noResearchNotes}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-secondary text-xs"
          onClick={() => alert(dict.researchPanel.openAi)}
        >
          {dict.researchPanel.openAi}
        </button>
        <Link
          href={
            product.core.defaultListingUrl
              ? product.core.defaultListingUrl
              : `/${locale}/app/listings`
          }
          className="btn btn-ghost text-xs underline"
        >
          {dict.researchPanel.goToListing}
        </Link>
      </div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-card border border-default bg-surface-muted p-3">
    <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
    <p className="text-sm font-semibold text-primary">{value}</p>
  </div>
);

const AiHelper = ({
  open,
  onToggle,
  prompt,
  onAsk,
  onPreset,
  results,
  dict,
  isPending,
}: {
  open: boolean;
  onToggle: () => void;
  prompt: string;
  onAsk: (prompt: string) => void;
  onPreset: (prompt: string) => void;
  results: ProductCopilotSuggestion[];
  dict: ProductsDictionary;
  isPending: boolean;
}) => {
  const [input, setInput] = useState(prompt);

  useEffect(() => {
    setInput(prompt);
  }, [prompt]);

  return (
    <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-primary">{dict.aiHelper.title}</p>
        <button
          type="button"
          className="text-xs font-semibold text-accent-primary"
          onClick={onToggle}
        >
          {open ? dict.labels.hide : dict.labels.show}
        </button>
      </div>
      {open && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <PresetChip
              label={dict.aiHelper.presets.highMargin}
              onClick={() => onPreset(dict.aiHelper.presets.highMargin)}
            />
            <PresetChip
              label={dict.aiHelper.presets.stockRisk}
              onClick={() => onPreset(dict.aiHelper.presets.stockRisk)}
            />
            <PresetChip
              label={dict.aiHelper.presets.expand}
              onClick={() => onPreset(dict.aiHelper.presets.expand)}
            />
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={dict.aiHelper.placeholder}
            className="w-full rounded-card border border-default bg-surface-muted p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="btn btn-primary text-xs"
              onClick={() => onAsk(input)}
              disabled={isPending}
            >
              {isPending ? dict.aiHelper.loading : dict.aiHelper.run}
            </button>
            <p className="text-xs text-muted">
              {results.length > 0 ? dict.aiHelper.resultTitle : dict.aiHelper.empty}
            </p>
          </div>
          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((res) => (
                <div
                  key={res.title}
                  className="rounded-card border border-default bg-surface-muted p-3"
                >
                  <p className="text-sm font-semibold text-primary">{res.title}</p>
                  <p className="text-xs text-secondary leading-relaxed">{res.details}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {res.skus.map((sku) => (
                      <span
                        key={sku}
                        className="rounded-pill bg-accent-primary-soft px-2 py-[3px] text-[11px] font-semibold text-accent-primary"
                      >
                        {sku}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PresetChip = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-pill border border-default px-3 py-1 text-xs font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
  >
    {label}
  </button>
);
