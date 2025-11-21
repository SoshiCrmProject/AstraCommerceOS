"use client";

import { useState } from "react";
import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getOrdersDictionary } from "@/i18n/getOrdersDictionary";
import { PageHeader } from "@/components/app/page-header";
import { OrderService } from "@/lib/services/order-service";
import { PipelineKpiBar, type PipelineKpiCard } from "@/components/orders/pipeline-kpi-bar";
import { ChannelBreakdown } from "@/components/orders/channel-breakdown";
import { OrderFilters } from "@/components/orders/order-filters";
import { OrdersTable } from "@/components/orders/orders-table";
import type { OrderFilter } from "@/lib/services/order-types";
import Link from "next/link";
import { use } from "react";

type OrdersPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = use(params);
  const [appDict, setAppDict] = useState<Awaited<ReturnType<typeof getAppDictionary>> | null>(null);
  const [dict, setDict] = useState<Awaited<ReturnType<typeof getOrdersDictionary>> | null>(null);
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof OrderService.getOrderPipelineSnapshot>> | null>(null);
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof OrderService.getOrderList>> | null>(null);
  const [filter, setFilter] = useState<OrderFilter>({});

  // Load data on mount
  useState(() => {
    const loadData = async () => {
      const [appDictData, dictData, snapshotData, ordersData] = await Promise.all([
        getAppDictionary(locale),
        getOrdersDictionary(locale),
        OrderService.getOrderPipelineSnapshot("demo-org", {}),
        OrderService.getOrderList("demo-org", {}, { page: 1, pageSize: 50 }),
      ]);
      setAppDict(appDictData);
      setDict(dictData);
      setSnapshot(snapshotData);
      setOrders(ordersData);
    };
    loadData();
  });

  const handleFilterChange = async (newFilter: OrderFilter) => {
    setFilter(newFilter);
    const ordersData = await OrderService.getOrderList("demo-org", newFilter, { page: 1, pageSize: 50 });
    setOrders(ordersData);
  };

  if (!appDict || !dict || !snapshot || !orders) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted">Loading orders...</p>
      </div>
    );
  }

  const kpiCards = [
    {
      label: dict.kpis.ordersToday,
      value: snapshot.totalOrdersToday.toLocaleString(),
      change: "+8.2%",
      direction: "up" as const,
    },
    {
      label: dict.kpis.orders7d,
      value: snapshot.totalOrders7d.toLocaleString(),
      change: "+6.4%",
      direction: "up" as const,
    },
    {
      label: dict.kpis.pendingFulfillment,
      value: snapshot.pendingFulfillment.toLocaleString(),
      variant: snapshot.pendingFulfillment > 100 ? "warning" : "default",
    },
    {
      label: dict.kpis.shippedToday,
      value: snapshot.shippedToday.toLocaleString(),
      change: "+12.1%",
      direction: "up" as const,
    },
    {
      label: dict.kpis.delivered7d,
      value: snapshot.delivered7d.toLocaleString(),
      change: "+5.8%",
      direction: "up" as const,
    },
    {
      label: dict.kpis.cancelled7d,
      value: snapshot.cancelled7d.toLocaleString(),
      change: "-2.3%",
      direction: "down" as const,
      variant: "success" as const,
    },
    {
      label: dict.kpis.onTimeSla,
      value: `${snapshot.onTimeSlaRate}%`,
      change: "+0.6%",
      direction: "up" as const,
      variant: (snapshot.onTimeSlaRate >= 95 ? "success" : snapshot.onTimeSlaRate >= 90 ? "warning" : "danger") as "success" | "warning" | "danger",
    },
  ] as PipelineKpiCard[];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.title}
        subtitle={dict.subtitle}
        breadcrumbs={[
          { label: appDict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.title },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-secondary text-xs sm:text-sm">
              {dict.actions.exportOrders}
            </button>
            <Link href={`/${locale}/app/orders/fulfillment`} className="btn btn-primary text-xs sm:text-sm">
              {dict.actions.openFulfillmentWorkspace}
            </Link>
          </div>
        }
      />

      {/* Pipeline KPIs */}
      <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg sm:p-5">
        <PipelineKpiBar kpis={kpiCards} />
      </div>

      {/* Channel Breakdown */}
      <ChannelBreakdown snapshot={snapshot} dict={dict} />

      {/* Filters */}
      <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg sm:p-5">
        <OrderFilters dict={dict} onFilterChange={handleFilterChange} locale={locale} />
      </div>

      {/* Orders Table */}
      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">
            {dict.table.showing
              .replace("{{start}}", "1")
              .replace("{{end}}", orders.items.length.toString())
              .replace("{{total}}", orders.total.toString())}
          </h3>
        </div>
        <OrdersTable orders={orders.items} dict={dict} locale={locale} />
      </div>

      {/* AI Copilot suggestion */}
      <div className="rounded-panel border-2 border-accent-primary bg-accent-primary-soft p-5 shadow-token-lg">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🤖</div>
          <div className="flex-1">
            <h4 className="font-semibold text-primary">{dict.ai.askCopilot}</h4>
            <p className="mt-1 text-sm text-secondary">{dict.ai.atRiskQuestion}</p>
            <button className="btn btn-primary mt-3 text-sm">{dict.ai.askCopilot}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
