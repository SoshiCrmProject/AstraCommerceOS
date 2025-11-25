'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  orderId: string;
  shopeeSku: string;
  asin: string | null;
  quantity: number;
  shopeePrice: number;
  amazonPrice: number | null;
  expectedProfit: number | null;
  status: string;
  createdAt: string;
  errorMessage: string | null;
  order?: {
    customerName: string;
    channel: { name: string };
  };
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  evaluating: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  purchasing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function JobsTable({ dict }: { dict: any }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    loadJobs();
  }, [statusFilter]);
  
  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: statusFilter, limit: '50' });
      const res = await fetch(`/api/automation/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAction = async (jobId: string, action: string) => {
    try {
      const res = await fetch(`/api/automation/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (res.ok) {
        loadJobs();
      } else {
        alert('Action failed');
      }
    } catch (error) {
      console.error('Action error:', error);
      alert('Action failed');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{dict.automation.jobs.empty}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{dict.automation.jobs.emptyDescription}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="all">{dict.automation.jobs.allStatuses}</option>
          <option value="pending">{dict.automation.jobs.status.pending}</option>
          <option value="evaluating">{dict.automation.jobs.status.evaluating}</option>
          <option value="approved">{dict.automation.jobs.status.approved}</option>
          <option value="purchasing">{dict.automation.jobs.status.purchasing}</option>
          <option value="completed">{dict.automation.jobs.status.completed}</option>
          <option value="failed">{dict.automation.jobs.status.failed}</option>
          <option value="rejected">{dict.automation.jobs.status.rejected}</option>
        </select>
        
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {total} {total === 1 ? 'job' : 'jobs'}
        </span>
      </div>
      
      {/* Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.jobs.table.orderId}</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.jobs.table.sku}</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.jobs.table.asin}</th>
              <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.jobs.table.profit}</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.jobs.table.status}</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{dict.automation.jobs.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">{job.orderId.slice(0, 8)}</div>
                  <div className="text-gray-500 dark:text-gray-400">{job.order?.channel.name}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {job.shopeeSku}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {job.asin || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                  {job.expectedProfit !== null ? (
                    <span className={job.expectedProfit > 0 ? 'text-green-600' : 'text-red-600'}>
                      ¥{job.expectedProfit.toFixed(0)}
                    </span>
                  ) : '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[job.status]}`}>
                    {dict.automation.jobs.status[job.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-2">
                    {job.status === 'approved' && (
                      <button
                        onClick={() => handleAction(job.id, 'approve')}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                      >
                        {dict.automation.jobs.actions.approve}
                      </button>
                    )}
                    {job.status === 'failed' && (
                      <button
                        onClick={() => handleAction(job.id, 'retry')}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                      >
                        {dict.automation.jobs.actions.retry}
                      </button>
                    )}
                    <Link
                      href={`/app/automation/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                    >
                      {dict.automation.jobs.actions.view}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
