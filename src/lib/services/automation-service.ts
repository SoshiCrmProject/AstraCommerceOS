import type {
  AutomationRuleSummary,
  AutomationRuleDetail,
  AutomationExecution,
  AutomationFilter,
  AutomationKpiSnapshot,
  AutomationExecutionStatus,
} from './automation-types';
import {
  getMockAutomationRules,
  getMockAutomationRuleDetail,
  getMockAutomationExecutions,
  getMockAutomationTemplates,
} from '../mocks/mock-automation-data';

export class AutomationService {
  static async getAutomationRules(
    orgId: string,
    filter?: AutomationFilter
  ): Promise<{ rules: AutomationRuleSummary[]; kpis: AutomationKpiSnapshot }> {
    let { rules, kpis } = getMockAutomationRules();

    // Apply filters
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      rules = rules.filter(
        (r) =>
          r.name.toLowerCase().includes(s) || r.description?.toLowerCase().includes(s)
      );
    }
    if (filter?.status && filter.status !== 'ALL') {
      rules = rules.filter((r) => r.status === filter.status);
    }
    if (filter?.triggerType && filter.triggerType !== 'ALL') {
      rules = rules.filter((r) => r.triggerType === filter.triggerType);
    }

    return { rules, kpis };
  }

  static async getAutomationRuleDetail(
    orgId: string,
    ruleId: string
  ): Promise<AutomationRuleDetail | null> {
    return getMockAutomationRuleDetail(ruleId);
  }

  static async getAutomationExecutions(
    orgId: string,
    filter: { ruleId?: string; status?: AutomationExecutionStatus | 'ALL' }
  ): Promise<AutomationExecution[]> {
    return getMockAutomationExecutions(filter);
  }

  static async getAutomationTemplates(orgId: string): Promise<AutomationRuleSummary[]> {
    return getMockAutomationTemplates();
  }

  static async saveAutomationRule(
    orgId: string,
    rule: Partial<AutomationRuleDetail>
  ): Promise<{ success: boolean; ruleId?: string }> {
    // TODO: implement with DB
    console.log('Save automation rule', { orgId, rule });
    return { success: true, ruleId: rule.id || 'new-rule-id' };
  }

  static async runTestAutomation(
    orgId: string,
    ruleId: string
  ): Promise<{ success: boolean; executionId?: string }> {
    // TODO: implement with execution engine
    console.log('Run test automation', { orgId, ruleId });
    return { success: true, executionId: 'test-execution-id' };
  }

  static async toggleAutomationStatus(
    orgId: string,
    ruleId: string,
    status: 'ACTIVE' | 'PAUSED'
  ): Promise<{ success: boolean }> {
    // TODO: implement with DB
    console.log('Toggle automation status', { orgId, ruleId, status });
    return { success: true };
  }

  static async createRuleFromTemplate(
    orgId: string,
    templateId: string
  ): Promise<{ id: string } | null> {
    // TODO: implement with DB - clone template and customize for org
    console.log('Create rule from template', { orgId, templateId });
    return { id: `rule-${Date.now()}` };
  }
}

