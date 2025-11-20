"use client";

import Link from "next/link";
import type { OrderSummary } from "@/lib/services/order-types";
import type { OrdersDictionary } from "@/i18n/getOrdersDictionary";

type OrdersTableProps = {
  orders: OrderSummary[];
  dict: OrdersDictionary;
  locale: string;
};

export function OrdersTable({ orders, dict, locale }: OrdersTableProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
      case "AWAITING_PAYMENT":
        return "bg-yellow-100 text-yellow-700";
      case "PAID":
        return "bg-blue-100 text-blue-700";
      case "FULFILLING":
        return "bg-purple-100 text-purple-700";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-gray-100 text-gray-700";
      case "RETURN_REQUESTED":
      case "RETURNED":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSlaIndicator = (order: OrderSummary) => {
    if (order.slaBreached) {
      return (
        <span className="inline-flex items-center rounded-pill bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
          {dict.sla.breached}
        </span>
      );
    }

    // Check if at risk (within 6 hours of promised ship date)
    if (order.promisedShipDate && !order.shippedAt) {
      const now = new Date();
      const promisedDate = new Date(order.promisedShipDate);
      const hoursUntilPromised = (promisedDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilPromised < 6 && hoursUntilPromised > 0) {
        return (
          <span className="inline-flex items-center rounded-pill bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
            {dict.sla.atRisk}
          </span>
        );
      }
    }

    return (
      <span className="inline-flex items-center rounded-pill bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
        {dict.sla.onTime}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      USD: "$",
      JPY: "¥",
      EUR: "€",
      GBP: "£",
      SGD: "S$",
    };

    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-panel border border-default bg-surface p-12 text-center shadow-token-lg">
        <p className="text-lg font-semibold text-secondary">{dict.empty.noResults}</p>
        <p className="mt-2 text-sm text-muted">{dict.empty.noResultsDescription}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-default shadow-token-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">{dict.table.orderId}</th>
              <th className="px-4 py-3">{dict.table.channel}</th>
              <th className="px-4 py-3">{dict.table.created}</th>
              <th className="px-4 py-3">{dict.table.customer}</th>
              <th className="px-4 py-3">{dict.table.status}</th>
              <th className="px-4 py-3">{dict.table.fulfillment}</th>
              <th className="px-4 py-3">{dict.table.amount}</th>
              <th className="px-4 py-3">{dict.table.sla}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-accent-primary-soft/40 transition cursor-pointer"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/app/orders/${order.id}`}
                    className="block hover:underline"
                  >
                    <div className="font-semibold text-primary">{order.id}</div>
                    <div className="text-xs text-muted">{order.externalId}</div>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-secondary">{order.channelName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-secondary">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="text-secondary">{order.customerName || "—"}</div>
                  <div className="text-xs text-muted">{order.destinationCountry}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-pill px-3 py-1 text-xs font-semibold ${getStatusStyles(order.status)}`}
                  >
                    {dict.statuses[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-pill border border-default bg-surface px-2 py-1 text-xs font-medium text-secondary">
                    {dict.fulfillmentMethods[order.fulfillmentMethod]}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-primary">
                  {formatCurrency(order.totalAmount, order.currency)}
                </td>
                <td className="px-4 py-3">{getSlaIndicator(order)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
