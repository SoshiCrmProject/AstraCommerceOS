/**
 * Job Queues Panel
 */

'use client';

import type { JobQueueSummary } from '@/lib/services/admin-types';
import { Pause, Play, Trash2 } from 'lucide-react';

type JobQueuesPanelProps = {
  queues: JobQueueSummary[];
  dict: any;
};

export function JobQueuesPanel({ queues, dict }: JobQueuesPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">{dict.jobQueues.title}</h3>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.jobQueues.queueName}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.jobQueues.pending}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.jobQueues.active}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.jobQueues.completed}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.jobQueues.failed}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.jobQueues.actions}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {queues.map((queue) => (
            <tr key={queue.name} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {dict.jobQueues[queue.name] || queue.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{queue.pending.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{queue.active.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm text-green-600 font-medium">{queue.completed.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm text-red-600 font-medium">{queue.failed.toLocaleString()}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-700"
                    title={dict.jobQueues.pauseQueue}
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-700"
                    title={dict.jobQueues.resumeQueue}
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700"
                    title={dict.jobQueues.clearQueue}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
