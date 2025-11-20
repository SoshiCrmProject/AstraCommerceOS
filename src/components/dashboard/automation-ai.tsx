import Link from "next/link";
import { DashboardAutomationSummary } from "@/lib/services/dashboard-types";

type AutomationAiProps = {
  automation: DashboardAutomationSummary;
  aiSummary: string;
  locale: string;
  automationCta: string;
  aiCta: string;
};

export function AutomationAiSummary({
  automation,
  aiSummary,
  locale,
  automationCta,
  aiCta,
}: AutomationAiProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary">Automation</p>
          <Link href={`/${locale}/app/automation`} className="text-sm font-semibold text-accent-primary hover:underline">
            {automationCta}
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Stat label="Total rules" value={automation.totalRules.toString()} />
          <Stat label="Active" value={automation.activeRules.toString()} />
          <Stat label="Failures (24h)" value={automation.failedExecutions24h.toString()} />
          <Stat label="Last execution" value={automation.lastExecutionAt ? new Date(automation.lastExecutionAt).toLocaleTimeString() : "-"} />
        </div>
        {automation.mostTriggeredRule ? (
          <div className="mt-4 rounded-card border border-default bg-surface-muted p-3">
            <p className="text-sm font-semibold text-primary">Most triggered</p>
            <p className="text-sm text-secondary">{automation.mostTriggeredRule.name}</p>
            <p className="text-xs text-muted">{automation.mostTriggeredRule.triggerDescription}</p>
            <p className="text-xs text-secondary mt-1">24h executions: {automation.mostTriggeredRule.executions24h}</p>
          </div>
        ) : null}
      </div>
      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary">AI Copilot</p>
          <Link href={`/${locale}/app/ai`} className="text-sm font-semibold text-accent-primary hover:underline">
            {aiCta}
          </Link>
        </div>
        <p className="mt-3 text-sm text-secondary">{aiSummary}</p>
        <div className="mt-4 flex gap-2">
          <Link href={`/${locale}/app/ai`} className="btn btn-primary text-sm">
            Open in Copilot
          </Link>
          <Link href={`/${locale}/app/automation`} className="btn btn-secondary text-sm">
            Apply suggestion
          </Link>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-card border border-default bg-surface-muted p-3 shadow-token-sm">
    <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    <p className="text-lg font-semibold text-primary">{value}</p>
  </div>
);
