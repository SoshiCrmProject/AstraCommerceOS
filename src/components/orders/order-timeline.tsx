import type { OrderTimelineEvent } from "@/lib/services/order-types";
import type { OrdersDictionary } from "@/i18n/getOrdersDictionary";

type OrderTimelineProps = {
  timeline: OrderTimelineEvent[];
  dict: OrdersDictionary;
  locale: string;
};

export function OrderTimeline({ timeline, dict, locale }: OrderTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "CREATED":
        return "📝";
      case "PAID":
        return "💳";
      case "FULFILLMENT_STARTED":
        return "📦";
      case "PICKED":
        return "✅";
      case "PACKED":
        return "📦";
      case "SHIPPED":
        return "🚚";
      case "OUT_FOR_DELIVERY":
        return "🚛";
      case "DELIVERED":
        return "✅";
      case "CANCELLED":
        return "❌";
      case "RETURN_REQUESTED":
        return "↩️";
      case "RETURN_COMPLETED":
        return "↩️";
      default:
        return "•";
    }
  };

  return (
    <div className="space-y-4">
      {timeline.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          {/* Timeline line and dot */}
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-primary-soft text-lg">
              {getEventIcon(event.type)}
            </div>
            {index < timeline.length - 1 && (
              <div className="w-0.5 flex-1 bg-border-default min-h-[40px]" />
            )}
          </div>

          {/* Event content */}
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-primary">
                  {dict.timeline[event.type as keyof typeof dict.timeline] || event.label}
                </p>
                {event.detail && (
                  <p className="mt-1 text-sm text-secondary">{event.detail}</p>
                )}
              </div>
              <span className="whitespace-nowrap text-xs text-muted">
                {formatDate(event.at)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
