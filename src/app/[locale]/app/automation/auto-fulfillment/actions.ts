/**
 * Auto-Fulfillment Server Actions
 * Server-side mutations for auto-fulfillment operations
 */

'use server';

import { revalidatePath } from 'next/cache';
import AutoFulfillmentService from '@/lib/services/auto-fulfillment-service';
import type { AutoFulfillmentRuleConfig } from '@/lib/services/auto-fulfillment-types';

export async function saveConfigAction(orgId: string, config: AutoFulfillmentRuleConfig) {
  try {
    await AutoFulfillmentService.updateAutoFulfillmentConfig(orgId, config);
    revalidatePath('/[locale]/app/automation/auto-fulfillment');
    return { success: true };
  } catch (error) {
    console.error('Failed to save auto-fulfillment config:', error);
    return { success: false, error: 'Failed to save configuration' };
  }
}

export async function evaluateCandidatesAction(orgId: string) {
  try {
    const config = await AutoFulfillmentService.getAutoFulfillmentConfig(orgId);
    const candidates = await AutoFulfillmentService.fetchAutoFulfillmentCandidates(orgId);
    const evaluated = await AutoFulfillmentService.evaluateCandidates(orgId, config, candidates);
    
    revalidatePath('/[locale]/app/automation/auto-fulfillment');
    
    return { success: true, count: evaluated.length };
  } catch (error) {
    console.error('Failed to evaluate candidates:', error);
    return { success: false, error: 'Failed to evaluate candidates' };
  }
}

export async function queuePurchasesAction(orgId: string) {
  try {
    const candidates = await AutoFulfillmentService.fetchAutoFulfillmentCandidates(orgId, {
      onlyEligible: true,
    });
    
    const count = await AutoFulfillmentService.queueEligiblePurchases(orgId, candidates);
    
    revalidatePath('/[locale]/app/automation/auto-fulfillment');
    
    return { success: true, count };
  } catch (error) {
    console.error('Failed to queue purchases:', error);
    return { success: false, error: 'Failed to queue purchases' };
  }
}

export async function downloadCsvAction(orgId: string) {
  try {
    const candidates = await AutoFulfillmentService.fetchAutoFulfillmentCandidates(orgId);
    const csv = await AutoFulfillmentService.exportNonFulfilledToCsv(orgId, candidates);
    
    return { success: true, csv };
  } catch (error) {
    console.error('Failed to generate CSV:', error);
    return { success: false, error: 'Failed to generate CSV' };
  }
}
