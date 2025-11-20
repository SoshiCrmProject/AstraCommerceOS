import { DashboardChannelSummary } from "@/lib/services/dashboard-types";
import Link from "next/link";

type SystemHealthProps = {
  channels: DashboardChannelSummary[];
  healthBadges: { label: string; status: "HEALTHY" | "WARNING" | "ERROR"; description: string }[];
  locale: string;
};

const statusColor = (status: "HEALTHY" | "WARNING" | "ERROR") =>
  status === "HEALTHY"
    ? "bg-green-100 text-green-700"
    : status === "WARNING"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

export function SystemHealth({ channels, healthBadges, locale }: SystemHealthProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {healthBadges.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center justify-between rounded-card border border-default bg-surface-muted px-3 py-2 shadow-soft"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-primary">{badge.label}</span>
              <span className="text-xs text-secondary">{badge.description}</span>
            </div>
            <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${statusColor(badge.status)}`}>
              {badge.status.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-card border border-default">
        <table className="min-w-full divide-y divide-default text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-3">Channel</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Revenue 7d</th>
              <th className="px-3 py-3">Orders 7d</th>
              <th className="px-3 py-3">Buy Box</th>
              <th className="px-3 py-3">Last sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default bg-white">
            {channels.map((channel) => (
              <tr key={channel.id} className="hover:bg-accent-primary-soft/30">
                <td className="px-3 py-3 font-semibold text-primary">{channel.name}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${statusColor(channel.status)}`}>
                    {channel.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-3 py-3 text-secondary">${(channel.revenue7d / 1000).toFixed(1)}k</td>
                <td className="px-3 py-3 text-secondary">{channel.orders7d.toLocaleString()}</td>
                <td className="px-3 py-3 text-secondary">{channel.buyBoxShare}%</td>
                <td className="px-3 py-3 text-secondary">
                  {channel.lastSyncAt ? new Date(channel.lastSyncAt).toLocaleTimeString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <Link href={`/${locale}/app/channels`} className="text-sm font-semibold text-accent-primary hover:underline">
          View channels
        </Link>
      </div>
    </div>
  );
}
