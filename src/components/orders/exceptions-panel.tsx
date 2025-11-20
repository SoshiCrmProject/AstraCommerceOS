"use client";

import Link from "next/link";
import type { FulfillmentException } from "@/lib/services/order-types";
import type { OrdersDictionary } from "@/i18n/getOrdersDictionary";

type ExceptionsPanelProps = {
  exceptions: FulfillmentException[];
  dict: OrdersDictionary;
  locale: string;
};

export function ExceptionsPanel({ exceptions, dict, locale }: ExceptionsPanelProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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

  if (exceptions.length === 0) {
    return (
      <div className="rounded-panel border border-default bg-surface p-12 text-center shadow-token-lg">
        <p className="text-4xl">✅</p>
        <p className="mt-3 text-lg font-semibold text-secondary">
          {dict.empty.noExceptions}
        </p>
        <p className="mt-2 text-sm text-muted">{dict.empty.noExceptionsDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exceptions.map((exception) => (
        <div
          key={exception.id}
          className={`rounded-card border-2 p-4 shadow-token-md transition hover:shadow-token-lg ${
            exception.resolved ? "bg-gray-50 opacity-60" : "bg-white"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-pill border px-2.5 py-1 text-xs font-semibold ${getSeverityStyles(exception.severity)}`}
                >
                  {dict.fulfillmentWorkspace.severity[exception.severity]}
                </span>
                <span className="inline-flex rounded-pill bg-surface border border-default px-2.5 py-1 text-xs font-semibold text-secondary">
                  {dict.fulfillmentWorkspace.exceptionTypes[exception.type]}
                </span>
                {exception.resolved && (
                  <span className="inline-flex rounded-pill bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    ✓ Resolved
                  </span>
                )}
              </div>

              <div className="mt-2">
                <Link
                  href={`/${locale}/app/orders/${exception.orderId}`}
                  className="font-semibold text-accent-primary hover:underline"
                >
                  {exception.orderId}
                </Link>
                <span className="ml-2 text-xs text-muted">({exception.externalId})</span>
                <span className="ml-2 text-xs text-muted">
                  • {dict.channels[exception.channelType]}
                </span>
              </div>

              <p className="mt-2 text-sm text-secondary">{exception.summary}</p>

              <div className="mt-2 text-xs text-muted">
                Created {formatDate(exception.createdAt)}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {!exception.resolved && (
                <button className="btn btn-secondary text-xs whitespace-nowrap">
                  {dict.detail.markResolved}
                </button>
              )}
              <Link
                href={`/${locale}/app/orders/${exception.orderId}`}
                className="btn btn-primary text-xs whitespace-nowrap"
              >
                {dict.actions.viewOrder}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
