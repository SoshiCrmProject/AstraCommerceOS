'use client';

import { useState } from 'react';
import { Package, Zap, ShoppingCart, Star, Calendar, AlertTriangle, Eye, Plus } from 'lucide-react';
import type { AutomationRuleSummary, AutomationTriggerType } from '@/lib/services/automation-types';

type Props = { 
  templates: AutomationRuleSummary[]; 
  onUseTemplate: (templateId: string) => void;
  onPreview: (templateId: string) => void;
};

const getTriggerIcon = (triggerType: AutomationTriggerType) => {
  switch (triggerType) {
    case 'ORDER_CREATED':
    case 'ORDER_STATUS_CHANGED':
      return ShoppingCart;
    case 'INVENTORY_BELOW_THRESHOLD':
      return Package;
    case 'PRICE_BELOW_MIN_MARGIN':
      return Zap;
    case 'NEW_NEGATIVE_REVIEW':
      return Star;
    case 'DAILY_SCHEDULE':
    case 'WEEKLY_SCHEDULE':
      return Calendar;
    default:
      return AlertTriangle;
  }
};

const getCategory = (triggerType: AutomationTriggerType): string => {
  if (triggerType.includes('INVENTORY')) return 'Inventory';
  if (triggerType.includes('PRICE')) return 'Pricing';
  if (triggerType.includes('ORDER')) return 'Orders';
  if (triggerType.includes('REVIEW')) return 'Reviews';
  if (triggerType.includes('SCHEDULE')) return 'Scheduled';
  return 'Other';
};

export function TemplatesGrid({ templates, onUseTemplate, onPreview }: Props) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => {
        const Icon = getTriggerIcon(template.triggerType);
        const category = getCategory(template.triggerType);
        
        return (
          <div
            key={template.id}
            className="bg-surface rounded-card border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            {/* Icon & Category */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {category}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
              {template.name}
            </h3>
            
            {/* Description */}
            <p className="text-xs text-gray-600 mb-4 line-clamp-2">
              {template.description}
            </p>
            
            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>{template.actionsCount} {template.actionsCount === 1 ? 'action' : 'actions'}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onUseTemplate(template.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Use Template
              </button>
              <button 
                onClick={() => onPreview(template.id)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        );
      })}
      {templates.length === 0 && (
        <div className="col-span-full text-center text-secondary py-12">
          No templates available
        </div>
      )}
    </div>
  );
}
