'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AutomationService } from '@/lib/services/automation-service';
import { TemplatesGrid } from '@/components/automation/templates-grid';
import { X, Zap, Filter } from 'lucide-react';
import type { AutomationRuleSummary } from '@/lib/services/automation-types';

type Props = { locale: string };

export function TemplatesContent({ locale }: Props) {
  const router = useRouter();
  const [templates, setTemplates] = useState<AutomationRuleSummary[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<AutomationRuleSummary | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      const data = await AutomationService.getAutomationTemplates('org-123');
      setTemplates(data);
    };
    loadTemplates();
  }, []);

  const handleUseTemplate = async (templateId: string) => {
    // In production, this would create a new rule from the template
    const newRule = await AutomationService.createRuleFromTemplate('org-123', templateId);
    if (newRule) {
      router.push(`/${locale}/app/automation/${newRule.id}`);
    }
  };

  const handlePreview = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setPreviewTemplate(template);
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="font-medium">{templates.length} templates available</span>
        </div>
      </div>

      <TemplatesGrid 
        templates={templates} 
        onUseTemplate={handleUseTemplate}
        onPreview={handlePreview}
      />

      {/* Preview Drawer */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Template Preview</h2>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{previewTemplate.name}</h3>
                <p className="text-sm text-gray-600">{previewTemplate.description}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-900 mb-2">
                  <Zap className="w-4 h-4" />
                  Trigger
                </div>
                <p className="text-sm text-blue-800">
                  {previewTemplate.triggerType.replace(/_/g, ' ').toLowerCase()}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                  <Filter className="w-4 h-4" />
                  Actions
                </div>
                <p className="text-sm text-gray-700">
                  This template includes {previewTemplate.actionsCount} automated {previewTemplate.actionsCount === 1 ? 'action' : 'actions'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  What this template does
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Automatically triggers based on the specified condition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Executes predefined actions when conditions are met</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Can be customized after creation to fit your specific needs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUseTemplate(previewTemplate.id);
                  setPreviewTemplate(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
