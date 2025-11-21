'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { AIService } from '@/lib/services/ai-service';
import type { PromptTemplate } from '@/lib/services/ai-types';
import { Copy, Check, Filter } from 'lucide-react';

type Props = {
  dict: any;
};

export function PromptsPage({ dict }: Props) {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await AIService.getPromptTemplates('org-1');
    setTemplates(data);
  };

  const categories = [
    { value: 'all', label: dict.prompts?.allCategories || 'All' },
    { value: 'pricing', label: dict.prompts?.pricing || 'Pricing' },
    { value: 'inventory', label: dict.prompts?.inventory || 'Inventory' },
    { value: 'listings', label: dict.prompts?.listings || 'Listings' },
    { value: 'orders', label: dict.prompts?.orders || 'Orders' },
    { value: 'reviews', label: dict.prompts?.reviews || 'Reviews' },
    { value: 'automation', label: dict.prompts?.automation || 'Automation' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleCopyPrompt = async (template: PromptTemplate) => {
    await navigator.clipboard.writeText(template.prompt);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={dict.prompts?.title || 'Prompt Library'}
        subtitle={dict.prompts?.subtitle || 'Pre-built prompts for common tasks'}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Category Filter */}
        <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <PromptCard
              key={template.id}
              template={template}
              isCopied={copiedId === template.id}
              onCopy={() => handleCopyPrompt(template)}
              dict={dict}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">{dict.prompts?.noTemplates || 'No templates found'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PromptCard({ template, isCopied, onCopy, dict }: {
  template: PromptTemplate;
  isCopied: boolean;
  onCopy: () => void;
  dict: any;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{template.title}</h3>
          <p className="text-sm text-gray-600">{template.description}</p>
        </div>
        <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full capitalize flex-shrink-0">
          {template.category}
        </span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
        <code className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
          {template.template}
        </code>
      </div>

      {template.variables && template.variables.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-2">
            {dict.prompts?.variables || 'Variables:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {template.variables.map((variable, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-mono rounded border border-blue-200"
              >
                {`{${variable}}`}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onCopy}
        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            {dict.prompts?.copied || 'Copied!'}
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            {dict.prompts?.copyPrompt || 'Copy Prompt'}
          </>
        )}
      </button>
    </div>
  );
}
