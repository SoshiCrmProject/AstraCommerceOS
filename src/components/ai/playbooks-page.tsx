'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { AIService } from '@/lib/services/ai-service';
import type { Playbook } from '@/lib/services/ai-types';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  dict: any;
};

export function PlaybooksPage({ dict }: Props) {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadPlaybooks();
  }, []);

  const loadPlaybooks = async () => {
    const data = await AIService.getPlaybooks('org-1');
    setPlaybooks(data);
  };

  const handleOpenPlaybook = async (playbook: Playbook) => {
    const newThread = await AIService.createCopilotThread(
      'org-1',
      'user-1',
      playbook.tool
    );
    router.push(`/app/ai?thread=${newThread.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={dict.playbooks.title}
        subtitle={dict.playbooks.subtitle}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playbooks.map((playbook) => (
            <PlaybookCard
              key={playbook.id}
              playbook={playbook}
              onOpen={() => handleOpenPlaybook(playbook)}
              dict={dict}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaybookCard({ playbook, onOpen, dict }: {
  playbook: Playbook;
  onOpen: () => void;
  dict: any;
}) {
  const toolLabels: Record<string, string> = {
    PRICING_ADVISOR: dict.modes?.pricingAdvisor || 'Pricing',
    INVENTORY_PLANNER: dict.modes?.inventoryPlanner || 'Inventory',
    LISTING_OPTIMIZER: dict.modes?.listingOptimizer || 'Listings',
    ORDERS_RISK: dict.modes?.ordersRisk || 'Orders',
    REVIEWS_ANALYZER: dict.modes?.reviewsAnalyzer || 'Reviews',
    AUTOMATION_DESIGNER: dict.modes?.automationDesigner || 'Automation',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        {playbook.tool && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {toolLabels[playbook.tool] || playbook.tool}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{playbook.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{playbook.description}</p>

      {playbook.tags && playbook.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {playbook.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onOpen}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
      >
        {dict.playbooks?.openInCopilot || 'Open in Copilot'}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
