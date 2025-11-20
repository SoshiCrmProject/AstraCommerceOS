import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { PageHeader } from "@/components/app/page-header";
import { mockLogs } from "@/lib/mocks/mock-logs";

type LogsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function LogsPage({ params }: LogsPageProps) {
  const { locale } = await params;
  const dict = await getAppDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.logs.title}
        subtitle={dict.logs.subtitle}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.logs.title },
        ]}
      />

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="overflow-hidden rounded-card border border-default">
          <table className="min-w-full divide-y divide-default text-sm">
            <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default bg-white">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-accent-primary-soft/40">
                  <td className="px-4 py-3 font-semibold text-primary">{log.id}</td>
                  <td className="px-4 py-3 text-secondary">{log.module}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-pill px-3 py-1 text-xs font-semibold ${
                        log.severity === "error"
                          ? "bg-red-100 text-red-700"
                          : log.severity === "warning"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary">{log.message}</td>
                  <td className="px-4 py-3 text-secondary">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
