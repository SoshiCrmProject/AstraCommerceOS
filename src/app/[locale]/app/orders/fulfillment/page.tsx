"use client";

import { useState } from "react";
import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getOrdersDictionary } from "@/i18n/getOrdersDictionary";
import { PageHeader } from "@/components/app/page-header";
import { OrderService } from "@/lib/services/order-service";
import { FulfillmentJobsTable } from "@/components/orders/fulfillment-jobs-table";
import { ExceptionsPanel } from "@/components/orders/exceptions-panel";
import type { FulfillmentJobStatus } from "@/lib/services/order-types";
import { use } from "react";

type FulfillmentWorkspacePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default function FulfillmentWorkspacePage({ params }: FulfillmentWorkspacePageProps) {
  const { locale } = use(params);
  const [appDict, setAppDict] = useState<Awaited<ReturnType<typeof getAppDictionary>> | null>(null);
  const [dict, setDict] = useState<Awaited<ReturnType<typeof getOrdersDictionary>> | null>(null);
  const [jobs, setJobs] = useState<Awaited<ReturnType<typeof OrderService.getFulfillmentJobs>> | null>(null);
  const [exceptions, setExceptions] = useState<Awaited<ReturnType<typeof OrderService.getFulfillmentExceptions>> | null>(null);
  const [jobStatusFilter, setJobStatusFilter] = useState<FulfillmentJobStatus | "ALL">("ALL");
  const [exceptionsOnlyFilter, setExceptionsOnlyFilter] = useState(false);
  const [showExceptionsOnly, setShowExceptionsOnly] = useState(false);

  // Load data on mount
  useState(() => {
    const loadData = async () => {
      const [appDictData, dictData, jobsData, exceptionsData] = await Promise.all([
        getAppDictionary(locale),
        getOrdersDictionary(locale),
        OrderService.getFulfillmentJobs("demo-org", { status: "ALL" }),
        OrderService.getFulfillmentExceptions("demo-org", { resolved: false }),
      ]);
      setAppDict(appDictData);
      setDict(dictData);
      setJobs(jobsData);
      setExceptions(exceptionsData);
    };
    loadData();
  });

  const handleJobStatusChange = async (status: string) => {
    const newStatus = status as FulfillmentJobStatus | "ALL";
    setJobStatusFilter(newStatus);
    const jobsData = await OrderService.getFulfillmentJobs("demo-org", { status: newStatus });
    setJobs(jobsData);
  };

  const handleExceptionsToggle = () => {
    setShowExceptionsOnly(!showExceptionsOnly);
  };

  if (!appDict || !dict || !jobs || !exceptions) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted">Loading fulfillment workspace...</p>
      </div>
    );
  }

  // Filter jobs to show only those with exceptions if toggle is on
  const filteredJobs = showExceptionsOnly
    ? jobs.filter((job) => exceptions.some((exc) => exc.orderId === job.orderId))
    : jobs;

  // Calculate stats
  const pendingJobs = jobs.filter((j) => j.status === "PENDING").length;
  const inProgressJobs = jobs.filter((j) => j.status === "IN_PROGRESS").length;
  const slaBreachedJobs = jobs.filter((j) => j.slaBreached).length;
  const unresolvedExceptions = exceptions.filter((e) => !e.resolved).length;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.fulfillmentWorkspace.title}
        subtitle={dict.fulfillmentWorkspace.subtitle}
        breadcrumbs={[
          { label: appDict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.title, href: `/${locale}/app/orders` },
          { label: dict.fulfillmentWorkspace.title },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-secondary text-xs sm:text-sm">
              {dict.fulfillmentWorkspace.actions.printPackingSlip}
            </button>
            <button className="btn btn-primary text-xs sm:text-sm">
              {dict.fulfillmentWorkspace.actions.suggestBatches}
            </button>
          </div>
        }
      />

      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-card border border-default bg-surface p-4 shadow-token-md">
          <p className="text-xs uppercase tracking-wide text-muted">Pending jobs</p>
          <p className="mt-2 text-2xl font-bold text-primary">{pendingJobs}</p>
        </div>
        <div className="rounded-card border border-default bg-surface p-4 shadow-token-md">
          <p className="text-xs uppercase tracking-wide text-muted">In progress</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{inProgressJobs}</p>
        </div>
        <div className="rounded-card border border-red-200 bg-red-50 p-4 shadow-token-md">
          <p className="text-xs uppercase tracking-wide text-red-700">SLA breached</p>
          <p className="mt-2 text-2xl font-bold text-red-700">{slaBreachedJobs}</p>
        </div>
        <div className="rounded-card border border-orange-200 bg-orange-50 p-4 shadow-token-md">
          <p className="text-xs uppercase tracking-wide text-orange-700">Unresolved exceptions</p>
          <p className="mt-2 text-2xl font-bold text-orange-700">{unresolvedExceptions}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={jobStatusFilter}
            onChange={(e) => handleJobStatusChange(e.target.value)}
            className="rounded-pill border border-default bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent-primary-soft focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary-soft"
          >
            <option value="ALL">{dict.filters.statusAll}</option>
            <option value="PENDING">{dict.fulfillmentWorkspace.jobStatus.PENDING}</option>
            <option value="IN_PROGRESS">{dict.fulfillmentWorkspace.jobStatus.IN_PROGRESS}</option>
            <option value="COMPLETED">{dict.fulfillmentWorkspace.jobStatus.COMPLETED}</option>
            <option value="FAILED">{dict.fulfillmentWorkspace.jobStatus.FAILED}</option>
          </select>

          <button
            onClick={handleExceptionsToggle}
            className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition ${
              showExceptionsOnly
                ? "border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100"
                : "border-default bg-white text-primary hover:bg-accent-primary-soft"
            }`}
          >
            {dict.fulfillmentWorkspace.filters.exceptionsOnly}
          </button>
        </div>
      </div>

      {/* Tabs for Jobs and Exceptions */}
      <div className="rounded-panel border border-default bg-surface shadow-token-lg">
        <div className="border-b border-default px-5 pt-4">
          <div className="flex gap-4">
            <button className="border-b-2 border-accent-primary px-3 pb-3 text-sm font-semibold text-accent-primary">
              {dict.fulfillmentWorkspace.jobs} ({filteredJobs.length})
            </button>
            <button className="border-b-2 border-transparent px-3 pb-3 text-sm font-semibold text-secondary hover:text-primary">
              {dict.fulfillmentWorkspace.exceptions} ({unresolvedExceptions})
            </button>
          </div>
        </div>
        <div className="p-5">
          <FulfillmentJobsTable jobs={filteredJobs} dict={dict} locale={locale} />
        </div>
      </div>

      {/* Exceptions panel */}
      {unresolvedExceptions > 0 && (
        <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">
              {dict.fulfillmentWorkspace.exceptions}
            </h3>
            <span className="rounded-pill bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              {unresolvedExceptions} unresolved
            </span>
          </div>
          <ExceptionsPanel exceptions={exceptions} dict={dict} locale={locale} />
        </div>
      )}

      {/* AI suggestion panel */}
      <div className="rounded-panel border-2 border-accent-primary bg-accent-primary-soft p-5 shadow-token-lg">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🤖</div>
          <div className="flex-1">
            <h4 className="font-semibold text-primary">AI-Powered Batch Optimization</h4>
            <p className="mt-1 text-sm text-secondary">
              {dict.fulfillmentWorkspace.ai.suggestBatches}
            </p>
            <button className="btn btn-primary mt-3 text-sm">
              {dict.fulfillmentWorkspace.actions.suggestBatches}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
