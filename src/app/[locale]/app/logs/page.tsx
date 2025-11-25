/**

// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

 * Logs & Observability Page
 * Complete observability console for system logs
 */

import { type Locale } from '@/i18n/config';
import { getLogsDictionary } from '@/i18n/getLogsDictionary';
import { PageHeader } from '@/components/app/page-header';
import LogService from '@/lib/services/log-service';
import { LogLevelBadge, SourceBadge, EntityBadge } from '@/components/logs/log-badges';

type LogsPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LogsPage(props: LogsPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const dict = await getLogsDictionary(params.locale);

  // Parse filters from search params
  const level = (searchParams.level as string) || 'ALL';
  const source = (searchParams.source as string) || 'ALL';
  const page = parseInt((searchParams.page as string) || '1');
  const pageSize = parseInt((searchParams.pageSize as string) || '25');

  // Fetch data
  const overview = await LogService.getLogOverview('org-001', { 
    level: level !== 'ALL' ? level as any : undefined 
  });
  const { items: logs, total } = await LogService.getLogs(
    'org-001',
    { 
      level: level !== 'ALL' ? level as any : undefined,
      source: source !== 'ALL' ? source as any : undefined,
    },
    { page, pageSize }
  );

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <PageHeader
        title={dict.title}
        subtitle={dict.subtitle}
        actions={
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              {dict.buttons.exportLogs}
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              {dict.buttons.askCopilot}
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">{dict.kpis.totalLogs}</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{overview.stats.totalLogs.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">{dict.kpis.errors}</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{overview.stats.errorCount.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">{dict.kpis.warnings}</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{overview.stats.warnCount.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">{dict.kpis.uniqueRequests}</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{overview.stats.uniqueRequestIds.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">{dict.kpis.uniqueCorrelations}</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{overview.stats.uniqueCorrelationIds.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder={dict.filters.search}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="ALL">{dict.levels.ALL}</option>
            <option value="ERROR">{dict.levels.ERROR}</option>
            <option value="WARN">{dict.levels.WARN}</option>
            <option value="INFO">{dict.levels.INFO}</option>
            <option value="DEBUG">{dict.levels.DEBUG}</option>
            <option value="FATAL">{dict.levels.FATAL}</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="ALL">{dict.sources.ALL}</option>
            <option value="BACKEND">{dict.sources.BACKEND}</option>
            <option value="FRONTEND">{dict.sources.FRONTEND}</option>
            <option value="CONNECTOR">{dict.sources.CONNECTOR}</option>
            <option value="AUTOMATION">{dict.sources.AUTOMATION}</option>
            <option value="JOB_QUEUE">{dict.sources.JOB_QUEUE}</option>
            <option value="AUTH">{dict.sources.AUTH}</option>
            <option value="BILLING">{dict.sources.BILLING}</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="last24Hours">{dict.filters.last24Hours}</option>
            <option value="last1Hour">{dict.filters.last1Hour}</option>
            <option value="last7Days">{dict.filters.last7Days}</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.table.timestamp}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.table.level}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.table.source}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.table.message}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.table.entity}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.table.requestId}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-lg font-medium">{dict.table.noLogs}</div>
                      <div className="text-sm mt-1">{dict.table.noLogsDescription}</div>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString(params.locale)}
                    </td>
                    <td className="px-4 py-3">
                      <LogLevelBadge level={log.level} dict={dict} />
                    </td>
                    <td className="px-4 py-3">
                      <SourceBadge source={log.source} dict={dict} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate">
                      {log.message}
                    </td>
                    <td className="px-4 py-3">
                      <EntityBadge type={log.entityType} label={log.entityLabel} dict={dict} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono truncate max-w-[120px]">
                      {log.requestId || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {logs.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {dict.table.page} {page} {dict.table.of} {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ← Previous
              </button>
              <button
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
