import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getOrdersDictionary } from "@/i18n/getOrdersDictionary";
import { PageHeader } from "@/components/app/page-header";
import { OrderService } from "@/lib/services/order-service";
import { OrderItemsTable } from "@/components/orders/order-items-table";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { FulfillmentCard } from "@/components/orders/fulfillment-card";
import type { OrderAddress } from "@/lib/services/order-types";
import Link from "next/link";

type OrderDetailPageProps = {
  params: Promise<{ locale: Locale; orderId: string }>;
};

function AddressCard({ address, title }: { address: OrderAddress; title: string }) {
  return (
    <div className="rounded-card border border-default bg-surface p-4">
      <h4 className="mb-3 font-semibold text-primary">{title}</h4>
      <div className="space-y-1 text-sm text-secondary">
        <p className="font-semibold">{address.name}</p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>
          {address.city}
          {address.state && `, ${address.state}`} {address.postalCode}
        </p>
        <p>{address.country}</p>
        {address.phone && <p className="mt-2 text-xs text-muted">Tel: {address.phone}</p>}
      </div>
    </div>
  );
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { locale, orderId } = await params;
  const appDict = await getAppDictionary(locale);
  const dict = await getOrdersDictionary(locale);
  
  const orderDetail = await OrderService.getOrderDetail("demo-org", orderId);
  const { summary, items, shippingAddress, billingAddress, timeline, fulfillmentJob, notes } = orderDetail;

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

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.detail.title}
        breadcrumbs={[
          { label: appDict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.title, href: `/${locale}/app/orders` },
          { label: summary.id },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-secondary text-xs sm:text-sm">
              {dict.actions.openInChannel}
            </button>
            <button className="btn btn-secondary text-xs sm:text-sm">
              {dict.detail.createTicket}
            </button>
            <button className="btn btn-primary text-xs sm:text-sm">
              {dict.actions.markPriority}
            </button>
          </div>
        }
      />

      {/* Order header info */}
      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">{summary.id}</h2>
            <p className="mt-1 text-sm text-muted">
              {dict.detail.externalId}: {summary.externalId}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-pill border border-default bg-surface px-3 py-1 text-xs font-semibold text-secondary">
                {summary.channelName}
              </span>
              <span
                className={`rounded-pill px-3 py-1 text-xs font-semibold ${getStatusStyles(summary.status)}`}
              >
                {dict.statuses[summary.status]}
              </span>
              <span className="rounded-pill border border-default bg-surface px-3 py-1 text-xs font-semibold text-secondary">
                {dict.fulfillmentMethods[summary.fulfillmentMethod]}
              </span>
              {summary.slaBreached && (
                <span className="rounded-pill bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  ⚠️ {dict.sla.breached}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(summary.totalAmount, summary.currency)}
            </p>
            <p className="mt-1 text-sm text-muted">{summary.itemsCount} items</p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order items */}
          <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
            <h3 className="mb-4 text-lg font-semibold text-primary">{dict.detail.items}</h3>
            <OrderItemsTable items={items} dict={dict} locale={locale} />
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AddressCard address={shippingAddress} title={dict.detail.shipping} />
            {billingAddress && <AddressCard address={billingAddress} title={dict.detail.billing} />}
          </div>

          {/* Notes */}
          {notes && notes.length > 0 && (
            <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
              <h3 className="mb-3 text-lg font-semibold text-primary">{dict.detail.notes}</h3>
              <ul className="space-y-2">
                {notes.map((note, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-secondary">
                    <span className="text-muted">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column - Timeline & Fulfillment */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
            <h3 className="mb-4 text-lg font-semibold text-primary">{dict.detail.timeline}</h3>
            <OrderTimeline timeline={timeline} dict={dict} locale={locale} />
          </div>

          {/* Fulfillment */}
          {fulfillmentJob && (
            <FulfillmentCard job={fulfillmentJob} dict={dict} locale={locale} />
          )}

          {/* Quick actions */}
          <div className="rounded-card border border-default bg-surface p-4 shadow-token-md">
            <h4 className="mb-3 font-semibold text-primary">Quick actions</h4>
            <div className="space-y-2">
              <Link
                href={`/${locale}/app/orders/fulfillment`}
                className="btn btn-secondary w-full text-sm"
              >
                {dict.detail.viewInWorkspace}
              </Link>
              <button className="btn btn-secondary w-full text-sm">
                {dict.detail.addNote}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
