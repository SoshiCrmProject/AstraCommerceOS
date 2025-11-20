import type { OrderPipelineSnapshot } from "@/lib/services/order-types";
import type { OrdersDictionary } from "@/i18n/getOrdersDictionary";

type ChannelBreakdownProps = {
  snapshot: OrderPipelineSnapshot;
  dict: OrdersDictionary;
};

export function ChannelBreakdown({ snapshot, dict }: ChannelBreakdownProps) {
  const { channelsBreakdown } = snapshot;

  // Calculate total for percentages
  const totalOrders = channelsBreakdown.reduce((sum, ch) => sum + ch.orders7d, 0);

  return (
    <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">
          {dict.channelBreakdown.title}
        </h3>
      </div>

      <div className="overflow-hidden rounded-card border border-default">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">{dict.channelBreakdown.channel}</th>
              <th className="px-4 py-3">{dict.channelBreakdown.orders}</th>
              <th className="px-4 py-3">{dict.channelBreakdown.revenue}</th>
              <th className="px-4 py-3">{dict.channelBreakdown.lateRate}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {channelsBreakdown.map((channel) => {
              const percentage = totalOrders > 0 
                ? ((channel.orders7d / totalOrders) * 100).toFixed(1) 
                : '0';
              
              return (
                <tr key={channel.channelType} className="hover:bg-accent-primary-soft/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{channel.channelName}</span>
                      <span className="text-xs text-muted">({percentage}%)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-secondary">
                    {channel.orders7d.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    ${channel.revenue7d.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-pill px-3 py-1 text-xs font-semibold ${
                        channel.lateRate < 2
                          ? "bg-green-100 text-green-700"
                          : channel.lateRate < 4
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {channel.lateRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
