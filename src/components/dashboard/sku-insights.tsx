import { DashboardSkuInsight } from "@/lib/services/dashboard-types";
import Link from "next/link";

type SkuInsightsProps = {
  skus: DashboardSkuInsight[];
  locale: string;
};

const metricLabel: Record<DashboardSkuInsight["metric"], string> = {
  TOP_SELLER: "Top seller",
  AT_RISK: "At-risk",
  LOW_MARGIN: "Low margin",
  RISING_STAR: "Rising star",
};

export function SkuInsights({ skus, locale }: SkuInsightsProps) {
  return (
    <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
      <div className="overflow-hidden rounded-card border border-default">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Orders (7d)</th>
              <th className="px-4 py-3">Margin</th>
              <th className="px-4 py-3">Inventory</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {skus.map((sku) => (
              <tr key={sku.sku} className="hover:bg-accent-primary-soft/30">
                <td className="px-4 py-3 font-semibold text-primary">{sku.sku}</td>
                <td className="px-4 py-3 text-secondary">{sku.productName}</td>
                <td className="px-4 py-3 text-secondary">{sku.channelName}</td>
                <td className="px-4 py-3 text-secondary">{metricLabel[sku.metric]}</td>
                <td className="px-4 py-3 text-secondary">{sku.orders7d ?? "-"}</td>
                <td className="px-4 py-3 text-secondary">
                  {sku.marginPercent ? `${sku.marginPercent}%` : "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-pill px-3 py-1 text-xs font-semibold ${
                      sku.inventoryStatus === "ok"
                        ? "bg-green-100 text-green-700"
                        : sku.inventoryStatus === "low"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {sku.inventoryStatus || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/${locale}/app/products`}
                      className="rounded-pill border border-default px-3 py-1 font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                    >
                      Open product
                    </Link>
                    <Link
                      href={`/${locale}/app/pricing`}
                      className="rounded-pill border border-default px-3 py-1 font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                    >
                      Adjust price
                    </Link>
                    <Link
                      href={`/${locale}/app/inventory`}
                      className="rounded-pill border border-default px-3 py-1 font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
                    >
                      View inventory
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
