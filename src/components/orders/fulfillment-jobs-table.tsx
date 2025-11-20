"use client";

import Link from "next/link";
import type { FulfillmentJobSummary } from "@/lib/services/order-types";
import type { OrdersDictionary } from "@/i18n/getOrdersDictionary";

type FulfillmentJobsTableProps = {
  jobs: FulfillmentJobSummary[];
  dict: OrdersDictionary;
  locale: string;
};

export function FulfillmentJobsTable({ jobs, dict, locale }: FulfillmentJobsTableProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  if (jobs.length === 0) {
    return (
      <div className="rounded-panel border border-default bg-surface p-12 text-center shadow-token-lg">
        <p className="text-lg font-semibold text-secondary">
          {dict.fulfillmentWorkspace.table.noJobs}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-default shadow-token-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">{dict.fulfillmentWorkspace.table.jobId}</th>
              <th className="px-4 py-3">{dict.fulfillmentWorkspace.table.orderId}</th>
              <th className="px-4 py-3">{dict.fulfillmentWorkspace.table.channel}</th>
              <th className="px-4 py-3">{dict.fulfillmentWorkspace.table.method}</th>
              <th className="px-4 py-3">{dict.fulfillmentWorkspace.table.warehouse}</th>
              <th className="px-4 py-3">{dict.fulfillmentWorkspace.table.status}</th>
              <th className="px-4 py-3">{dict.fulfillmentWorkspace.table.carrier}</th>
              <th className="px-4 py-3">{dict.fulfillmentWorkspace.table.sla}</th>
              <th className="px-4 py-3">{dict.fulfillmentWorkspace.table.lastUpdated}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-accent-primary-soft/40 transition cursor-pointer"
              >
                <td className="px-4 py-3 font-mono text-xs text-primary">{job.id}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/app/orders/${job.orderId}`}
                    className="font-semibold text-accent-primary hover:underline"
                  >
                    {job.orderId}
                  </Link>
                </td>
                <td className="px-4 py-3 text-secondary">{dict.channels[job.channelType]}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-pill border border-default bg-surface px-2 py-1 text-xs font-medium text-secondary">
                    {dict.fulfillmentMethods[job.fulfillmentMethod]}
                  </span>
                </td>
                <td className="px-4 py-3 text-secondary">{job.warehouseName || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-pill px-3 py-1 text-xs font-semibold ${getStatusStyles(job.status)}`}
                  >
                    {dict.fulfillmentWorkspace.jobStatus[job.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-secondary">{job.carrier || "—"}</div>
                  {job.trackingNumber && (
                    <div className="mt-1 font-mono text-xs text-muted">{job.trackingNumber}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {job.slaBreached ? (
                    <span className="inline-flex items-center rounded-pill bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                      {dict.sla.breached}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-pill bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      {dict.sla.onTime}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-secondary">{formatDate(job.lastUpdatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
