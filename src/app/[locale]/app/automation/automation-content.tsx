'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AutomationService } from '@/lib/services/automation-service';
import { AutomationKpiBar } from '@/components/automation/automation-kpi-bar';
import { AutomationFilters } from '@/components/automation/automation-filters';
import { RulesTable } from '@/components/automation/rules-table';
import { ExecutionHistory } from '@/components/automation/execution-history';
import { AiWorkflowCopilot } from '@/components/automation/ai-workflow-copilot';
import { Sparkles, Plus, BookTemplate } from 'lucide-react';
import type {
  AutomationFilter,
  AutomationRuleSummary,
  AutomationKpiSnapshot,
  AutomationExecution,
} from '@/lib/services/automation-types';

type Props = { locale: string };

export function AutomationContent({ locale }: Props) {
  const [filter, setFilter] = useState<AutomationFilter>({});
  const [data, setData] = useState<{
    rules: AutomationRuleSummary[];
    kpis: AutomationKpiSnapshot;
  } | null>(null);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

  useEffect(() => {
    loadData(filter);
    loadExecutions();
  }, []);

  const loadData = async (newFilter: AutomationFilter) => {
    setLoading(true);
    const result = await AutomationService.getAutomationRules('org-123', newFilter);
    setData(result);
    setLoading(false);
  };

  const loadExecutions = async () => {
    const result = await AutomationService.getAutomationExecutions('org-123', { status: 'ALL' });
    setExecutions(result);
  };

  const handleFilterChange = (newFilter: AutomationFilter) => {
    setFilter(newFilter);
    loadData(newFilter);
  };

  const handleCopilotSubmit = (prompt: string) => {
    console.log('AI Copilot prompt:', prompt);
    // In production, this would call an AI service
    alert(`AI suggestion for: "${prompt}"\n\nThis would create a workflow based on your request.`);
    setShowCopilot(false);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500">Loading automation data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/app/automation/new`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create Workflow
            </Link>
            <Link
              href={`/${locale}/app/automation/templates`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm"
            >
              <BookTemplate className="h-4 w-4" />
              Browse Templates
            </Link>
          </div>
          
          <button
            onClick={() => setShowCopilot(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            Ask Workflow Copilot
          </button>
        </div>

        {/* KPIs */}
        <AutomationKpiBar kpis={data.kpis} />

        {/* Filters */}
        <AutomationFilters filter={filter} onFilterChange={handleFilterChange} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-surface rounded-card border border-gray-200 p-12 text-center">
                <div className="text-sm text-gray-500">Applying filters...</div>
              </div>
            ) : (
              <RulesTable rules={data.rules} locale={locale} />
            )}
          </div>
          <div>
            <ExecutionHistory executions={executions} />
          </div>
        </div>
      </div>

      {showCopilot && (
        <AiWorkflowCopilot 
          onSubmit={handleCopilotSubmit} 
          onClose={() => setShowCopilot(false)}
        />
      )}
    </>
  );
}
