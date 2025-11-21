'use client';

import { Database, BarChart3, Package, Tag, ShoppingCart, Star, Zap, FileText, ExternalLink } from 'lucide-react';
import type { CopilotContextSummary, CopilotTool } from '@/lib/services/ai-types';

type Props = {
  contextSummary: CopilotContextSummary;
  activeTool: CopilotTool;
  onSendPrompt: (prompt: string) => void;
  dict: any;
};

export function CopilotContextPanel({ contextSummary, activeTool, onSendPrompt, dict }: Props) {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
      {/* Context Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{dict.context.title}</h3>
        <div className="space-y-2 text-xs">
          <ContextItem icon={Database} label={dict.context.database} active={contextSummary.hasDatabaseAccess} />
          <ContextItem icon={BarChart3} label={dict.context.analytics} active={contextSummary.hasAnalyticsAccess} />
          <ContextItem icon={Package} label={dict.context.inventory} active={contextSummary.hasInventoryAccess} />
          <ContextItem icon={Tag} label={dict.context.pricing} active={contextSummary.hasPricingAccess} />
          <ContextItem icon={ShoppingCart} label={dict.context.orders} active={contextSummary.hasOrdersAccess} />
          <ContextItem icon={Star} label={dict.context.reviews} active={contextSummary.hasReviewsAccess} />
        </div>
      </div>

      {/* Tool-Specific Shortcuts */}
      <ToolShortcuts activeTool={activeTool} onSendPrompt={onSendPrompt} dict={dict} />

      {/* Docs Helper */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4">
        <div className="flex items-start gap-2 mb-2">
          <FileText className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <h3 className="text-sm font-semibold text-gray-900">{dict.docs.title}</h3>
        </div>
        <p className="text-xs text-gray-600 mb-3">{dict.docs.desc}</p>
        <button
          onClick={() => onSendPrompt(dict.docs.prompt)}
          className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-50 transition-colors flex items-center justify-center gap-1"
        >
          {dict.docs.button}
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function ContextItem({ icon: Icon, label, active }: { icon: any; label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
        active ? 'bg-green-100' : 'bg-gray-100'
      }`}>
        <Icon className={`w-2.5 h-2.5 ${active ? 'text-green-600' : 'text-gray-400'}`} />
      </div>
      <span className={active ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
    </div>
  );
}

function ToolShortcuts({ activeTool, onSendPrompt, dict }: {
  activeTool: CopilotTool;
  onSendPrompt: (prompt: string) => void;
  dict: any;
}) {
  let shortcuts: { label: string; prompt: string; icon: any }[] = [];

  switch (activeTool) {
    case 'PRICING_ADVISOR':
      shortcuts = [
        { label: dict.shortcuts.pricing.margins, prompt: dict.shortcuts.pricing.marginsPrompt, icon: BarChart3 },
        { label: dict.shortcuts.pricing.buyBox, prompt: dict.shortcuts.pricing.buyBoxPrompt, icon: Tag },
        { label: dict.shortcuts.pricing.repricing, prompt: dict.shortcuts.pricing.repricingPrompt, icon: Zap },
      ];
      break;
    case 'INVENTORY_PLANNER':
      shortcuts = [
        { label: dict.shortcuts.inventory.stockouts, prompt: dict.shortcuts.inventory.stockoutsPrompt, icon: Package },
        { label: dict.shortcuts.inventory.reorder, prompt: dict.shortcuts.inventory.reorderPrompt, icon: ShoppingCart },
        { label: dict.shortcuts.inventory.forecast, prompt: dict.shortcuts.inventory.forecastPrompt, icon: BarChart3 },
      ];
      break;
    case 'LISTING_OPTIMIZER':
      shortcuts = [
        { label: dict.shortcuts.listings.quality, prompt: dict.shortcuts.listings.qualityPrompt, icon: Star },
        { label: dict.shortcuts.listings.seo, prompt: dict.shortcuts.listings.seoPrompt, icon: Tag },
        { label: dict.shortcuts.listings.errors, prompt: dict.shortcuts.listings.errorsPrompt, icon: FileText },
      ];
      break;
    case 'ORDERS_RISK':
      shortcuts = [
        { label: dict.shortcuts.orders.late, prompt: dict.shortcuts.orders.latePrompt, icon: ShoppingCart },
        { label: dict.shortcuts.orders.fraud, prompt: dict.shortcuts.orders.fraudPrompt, icon: Zap },
        { label: dict.shortcuts.orders.returns, prompt: dict.shortcuts.orders.returnsPrompt, icon: Package },
      ];
      break;
    case 'REVIEWS_ANALYZER':
      shortcuts = [
        { label: dict.shortcuts.reviews.negative, prompt: dict.shortcuts.reviews.negativePrompt, icon: Star },
        { label: dict.shortcuts.reviews.trends, prompt: dict.shortcuts.reviews.trendsPrompt, icon: BarChart3 },
        { label: dict.shortcuts.reviews.actionable, prompt: dict.shortcuts.reviews.actionablePrompt, icon: Zap },
      ];
      break;
    case 'AUTOMATION_DESIGNER':
      shortcuts = [
        { label: dict.shortcuts.automation.create, prompt: dict.shortcuts.automation.createPrompt, icon: Zap },
        { label: dict.shortcuts.automation.optimize, prompt: dict.shortcuts.automation.optimizePrompt, icon: BarChart3 },
        { label: dict.shortcuts.automation.debug, prompt: dict.shortcuts.automation.debugPrompt, icon: FileText },
      ];
      break;
    default:
      return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{dict.shortcuts.title}</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, idx) => (
          <button
            key={idx}
            onClick={() => onSendPrompt(shortcut.prompt)}
            className="w-full px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-start gap-2">
              <shortcut.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">
                {shortcut.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
