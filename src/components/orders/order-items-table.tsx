import type { OrderItem } from "@/lib/services/order-types";
import type { OrdersDictionary } from "@/i18n/getOrdersDictionary";

type OrderItemsTableProps = {
  items: OrderItem[];
  dict: OrdersDictionary;
  locale: string;
};

export function OrderItemsTable({ items, dict, locale }: OrderItemsTableProps) {
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
    <div className="overflow-hidden rounded-card border border-default">
      <table className="min-w-full divide-y divide-default text-sm">
        <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3">{dict.detail.product}</th>
            <th className="px-4 py-3">{dict.detail.sku}</th>
            <th className="px-4 py-3 text-right">{dict.detail.quantity}</th>
            <th className="px-4 py-3 text-right">{dict.detail.unitPrice}</th>
            <th className="px-4 py-3 text-right">{dict.detail.lineTotal}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-default bg-white">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-accent-primary-soft/40">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-card border border-default bg-surface-muted">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-primary">{item.productName}</p>
                    <p className="text-xs text-muted">ID: {item.productId}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-secondary">{item.sku}</td>
              <td className="px-4 py-3 text-right font-semibold text-primary">
                {item.quantity}
              </td>
              <td className="px-4 py-3 text-right text-secondary">
                {formatCurrency(item.unitPrice, item.currency)}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-primary">
                {formatCurrency(item.unitPrice * item.quantity, item.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
