import type { FulfillmentJobSummary } from "@/lib/services/order-types";
import type { OrdersDictionary } from "@/i18n/getOrdersDictionary";

type FulfillmentCardProps = {
  job: FulfillmentJobSummary;
  dict: OrdersDictionary;
  locale: string;
};

export function FulfillmentCard({ job, dict, locale }: FulfillmentCardProps) {
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

  return (
    <div className="rounded-card border border-default bg-surface p-4 shadow-token-md">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold text-primary">{dict.detail.fulfillment}</h4>
        <span
          className={`rounded-pill px-3 py-1 text-xs font-semibold ${getStatusStyles(job.status)}`}
        >
          {dict.fulfillmentWorkspace.jobStatus[job.status]}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">{dict.detail.fulfillment}:</span>
          <span className="font-semibold text-secondary">
            {dict.fulfillmentMethods[job.fulfillmentMethod]}
          </span>
        </div>

        {job.warehouseName && (
          <div className="flex justify-between">
            <span className="text-muted">{dict.detail.warehouseName}:</span>
            <span className="font-semibold text-secondary">{job.warehouseName}</span>
          </div>
        )}

        {job.carrier && (
          <div className="flex justify-between">
            <span className="text-muted">{dict.detail.carrier}:</span>
            <span className="font-semibold text-secondary">{job.carrier}</span>
          </div>
        )}

        {job.trackingNumber && (
          <div className="flex justify-between">
            <span className="text-muted">{dict.detail.trackingNumber}:</span>
            <span className="font-mono text-xs font-semibold text-primary">
              {job.trackingNumber}
            </span>
          </div>
        )}

        <div className="flex justify-between border-t border-default pt-3">
          <span className="text-muted">Last updated:</span>
          <span className="text-secondary">{formatDate(job.lastUpdatedAt)}</span>
        </div>

        {job.slaBreached && (
          <div className="rounded-card bg-red-50 p-3 text-xs">
            <p className="font-semibold text-red-700">⚠️ SLA Breached</p>
            <p className="mt-1 text-red-600">
              This order has exceeded its promised ship date.
            </p>
          </div>
        )}
      </div>

      {job.trackingNumber && (
        <div className="mt-4 flex gap-2">
          <button className="btn btn-secondary flex-1 text-xs">
            {dict.detail.copyTracking}
          </button>
          <button className="btn btn-primary flex-1 text-xs">
            {dict.detail.openTracking}
          </button>
        </div>
      )}
    </div>
  );
}
