'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AutomationService } from '@/lib/services/automation-service';
import { WorkflowMap } from '@/components/automation/workflow-map';
import { ExecutionHistory } from '@/components/automation/execution-history';
import type {
  AutomationRuleDetail,
  AutomationTriggerType,
  AutomationCondition,
  AutomationAction,
  AutomationActionType,
  AutomationConditionOperator,
  AutomationExecution,
} from '@/lib/services/automation-types';

type Props = { locale: string; ruleId: string };

export function RuleBuilderContent({ locale, ruleId }: Props) {
  const router = useRouter();
  const [rule, setRule] = useState<Partial<AutomationRuleDetail>>({
    name: '',
    status: 'DRAFT',
    triggerType: 'ORDER_CREATED',
    triggerConfig: {},
    description: '',
    conditions: [],
    actions: [],
  });
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRule = async () => {
      if (ruleId !== 'new') {
        const data = await AutomationService.getAutomationRuleDetail('org-123', ruleId);
        if (data) {
          setRule(data);
          const execs = await AutomationService.getAutomationExecutions('org-123', { ruleId });
          setExecutions(execs);
        }
      }
      setLoading(false);
    };
    loadRule();
  }, [ruleId]);

  const handleSave = async () => {
    const result = await AutomationService.saveAutomationRule('org-123', rule as AutomationRuleDetail);
    if (result.success) {
      alert('Workflow saved successfully!');
      if (ruleId === 'new' && result.ruleId) {
        router.push(`/${locale}/app/automation/${result.ruleId}`);
      }
    }
  };

  const handleRunTest = async () => {
    if (ruleId !== 'new') {
      const result = await AutomationService.runTestAutomation('org-123', ruleId);
      if (result.success) {
        alert(`Test run started! Execution ID: ${result.executionId}`);
      }
    }
  };

  const handleToggleStatus = async () => {
    if (ruleId !== 'new') {
      const newStatus = rule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      await AutomationService.toggleAutomationStatus('org-123', ruleId, newStatus);
      setRule({ ...rule, status: newStatus });
    }
  };

  const addCondition = () => {
    const newCondition: AutomationCondition = {
      id: `cond-${Date.now()}`,
      field: 'order.totalAmount',
      operator: 'GREATER_THAN',
      value: '0',
    };
    setRule({ ...rule, conditions: [...(rule.conditions || []), newCondition] });
  };

  const updateCondition = (condId: string, updates: Partial<AutomationCondition>) => {
    setRule({
      ...rule,
      conditions: (rule.conditions || []).map((c) => (c.id === condId ? { ...c, ...updates } : c)),
    });
  };

  const removeCondition = (condId: string) => {
    setRule({
      ...rule,
      conditions: (rule.conditions || []).filter((c) => c.id !== condId),
    });
  };

  const addAction = () => {
    const newAction: AutomationAction = {
      id: `action-${Date.now()}`,
      type: 'SEND_EMAIL',
      label: 'Send email notification',
      config: {},
    };
    setRule({ ...rule, actions: [...(rule.actions || []), newAction] });
  };

  const updateAction = (actionId: string, updates: Partial<AutomationAction>) => {
    setRule({
      ...rule,
      actions: (rule.actions || []).map((a) => (a.id === actionId ? { ...a, ...updates } : a)),
    });
  };

  const removeAction = (actionId: string) => {
    setRule({
      ...rule,
      actions: (rule.actions || []).filter((a) => a.id !== actionId),
    });
  };

  if (loading) {
    return <div className="text-secondary">Loading rule...</div>;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Panel - Configuration */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-surface rounded-card border border-border-subtle p-4">
          <h3 className="text-sm font-semibold text-primary mb-3">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Rule Name</label>
              <input
                type="text"
                value={rule.name}
                onChange={(e) => setRule({ ...rule, name: e.target.value })}
                className="w-full px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="My automation rule"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1">Description</label>
              <textarea
                value={rule.description}
                onChange={(e) => setRule({ ...rule, description: e.target.value })}
                className="w-full px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                rows={2}
                placeholder="What does this automation do?"
              />
            </div>
          </div>
        </div>

        {/* Trigger Configuration */}
        <div className="bg-surface rounded-card border border-border-subtle p-4">
          <h3 className="text-sm font-semibold text-primary mb-3">Trigger</h3>
          <div>
            <label className="text-xs font-medium text-secondary block mb-1">When this happens...</label>
            <select
              value={rule.triggerType}
              onChange={(e) => setRule({ ...rule, triggerType: e.target.value as AutomationTriggerType })}
              className="w-full px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="ORDER_CREATED">Order is created</option>
              <option value="ORDER_STATUS_CHANGED">Order status changes</option>
              <option value="INVENTORY_BELOW_THRESHOLD">Inventory drops below threshold</option>
              <option value="PRICE_BELOW_MIN_MARGIN">Price falls below min margin</option>
              <option value="NEW_NEGATIVE_REVIEW">Negative review received</option>
              <option value="CHANNEL_SYNC_FAILED">Channel sync fails</option>
              <option value="DAILY_SCHEDULE">Daily schedule</option>
              <option value="WEEKLY_SCHEDULE">Weekly schedule</option>
            </select>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-surface rounded-card border border-border-subtle p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-primary">Conditions (IF)</h3>
            <button
              onClick={addCondition}
              className="px-3 py-1 text-xs bg-accent text-white rounded-card hover:bg-accent/90 transition-colors"
            >
              + Add Condition
            </button>
          </div>
          <div className="space-y-2">
            {(rule.conditions || []).map((cond) => (
              <div key={cond.id} className="bg-bg-page rounded border border-border-subtle p-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={cond.field}
                      onChange={(e) => updateCondition(cond.id, { field: e.target.value })}
                      className="w-full px-2 py-1 bg-surface border border-border-subtle rounded text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="field"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={cond.operator}
                      onChange={(e) => updateCondition(cond.id, { operator: e.target.value as AutomationConditionOperator })}
                      className="w-full px-2 py-1 bg-surface border border-border-subtle rounded text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="EQUALS">=</option>
                      <option value="NOT_EQUALS">!=</option>
                      <option value="GREATER_THAN">&gt;</option>
                      <option value="LESS_THAN">&lt;</option>
                      <option value="CONTAINS">contains</option>
                      <option value="NOT_CONTAINS">!contains</option>
                      <option value="IN">in</option>
                      <option value="NOT_IN">!in</option>
                    </select>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={cond.value}
                      onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                      className="w-full px-2 py-1 bg-surface border border-border-subtle rounded text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="value"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => removeCondition(cond.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(rule.conditions || []).length === 0 && (
              <div className="text-xs text-secondary text-center py-2">No conditions added</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-surface rounded-card border border-border-subtle p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-primary">Actions (THEN)</h3>
            <button
              onClick={addAction}
              className="px-3 py-1 text-xs bg-accent text-white rounded-card hover:bg-accent/90 transition-colors"
            >
              + Add Action
            </button>
          </div>
          <div className="space-y-2">
            {(rule.actions || []).map((action, idx) => (
              <div key={action.id} className="bg-bg-page rounded border border-border-subtle p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <select
                      value={action.type}
                      onChange={(e) => updateAction(action.id, { type: e.target.value as AutomationActionType })}
                      className="w-full px-2 py-1 bg-surface border border-border-subtle rounded text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="SEND_EMAIL">Send email</option>
                      <option value="SEND_SLACK_WEBHOOK">Send Slack message</option>
                      <option value="ADJUST_PRICE">Adjust price</option>
                      <option value="CREATE_REPLENISHMENT_TASK">Create replenishment task</option>
                      <option value="TAG_ORDER">Tag order</option>
                      <option value="TAG_PRODUCT">Tag product</option>
                      <option value="CREATE_SUPPORT_TICKET">Create support ticket</option>
                      <option value="RUN_CHANNEL_SYNC">Run channel sync</option>
                      <option value="RUN_AI_SUMMARY">Run AI summary</option>
                    </select>
                    <input
                      type="text"
                      value={action.label || ''}
                      onChange={(e) => updateAction(action.id, { label: e.target.value })}
                      className="w-full px-2 py-1 bg-surface border border-border-subtle rounded text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="Action label (optional)"
                    />
                  </div>
                  <button
                    onClick={() => removeAction(action.id)}
                    className="flex-shrink-0 text-red-500 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            {(rule.actions || []).length === 0 && (
              <div className="text-xs text-secondary text-center py-2">No actions added</div>
            )}
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-accent text-white rounded-card font-medium text-sm hover:bg-accent/90 transition-colors"
          >
            Save Workflow
          </button>
          {ruleId !== 'new' && (
            <>
              <button
                onClick={handleRunTest}
                className="px-4 py-2 bg-bg-page border border-border-subtle rounded-card text-sm hover:bg-surface transition-colors"
              >
                Run Test
              </button>
              <button
                onClick={handleToggleStatus}
                className="px-4 py-2 bg-bg-page border border-border-subtle rounded-card text-sm hover:bg-surface transition-colors"
              >
                {rule.status === 'ACTIVE' ? 'Pause' : 'Activate'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Visualization & History */}
      <div className="space-y-6">
        {rule.id && <WorkflowMap rule={rule as AutomationRuleDetail} />}
        {ruleId !== 'new' && executions.length > 0 && <ExecutionHistory executions={executions} />}
      </div>
    </div>
  );
}
