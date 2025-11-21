'use client';

import { useState, useEffect } from 'react';
import { ReviewService } from '@/lib/services/review-service';
import { FileText, Copy, Check, Sparkles } from 'lucide-react';

type Props = {
  dict: any;
  locale: string;
};

type Template = {
  id: string;
  name: string;
  language: string;
  tone: 'FORMAL' | 'NEUTRAL' | 'FRIENDLY';
  applicableTo: 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE' | 'ANY';
  body: string;
};

export function TemplatesView({ dict, locale }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterLang, setFilterLang] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await ReviewService.getReviewTemplates('org-1');
      setTemplates(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (template: Template) => {
    await navigator.clipboard.writeText(template.body);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTemplates = templates.filter(t => {
    if (filterLang !== 'ALL' && t.language !== filterLang) return false;
    if (filterType !== 'ALL' && t.applicableTo !== filterType) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">{dict.templates.language}</label>
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">{dict.templates.allLanguages}</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">{dict.templates.applicableTo}</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">{dict.templates.allTypes}</option>
              <option value="POSITIVE">{dict.sentiment.positive}</option>
              <option value="NEUTRAL">{dict.sentiment.neutral}</option>
              <option value="NEGATIVE">{dict.sentiment.negative}</option>
              <option value="ANY">{dict.templates.any}</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              {dict.templates.addTemplate}
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{template.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {template.language.toUpperCase()}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {dict.detail[`tone${template.tone.charAt(0) + template.tone.slice(1).toLowerCase()}`] || template.tone}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    template.applicableTo === 'POSITIVE' ? 'bg-green-100 text-green-700' :
                    template.applicableTo === 'NEGATIVE' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {template.applicableTo === 'ANY' ? dict.templates.any : dict.sentiment[template.applicableTo.toLowerCase()]}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
              <p className="text-xs text-gray-700 line-clamp-3">{template.body}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(template);
                }}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                {copiedId === template.id ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    {dict.detail.copied}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {dict.templates.copy}
                  </>
                )}
              </button>
              <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                {dict.templates.useInAI}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{dict.templates.noTemplates}</h3>
          <p className="text-sm text-gray-500">{dict.templates.noTemplatesDesc}</p>
        </div>
      )}

      {/* Preview Drawer */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="bg-white rounded-t-2xl lg:rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {selectedTemplate.language.toUpperCase()}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {selectedTemplate.tone}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedTemplate.applicableTo === 'POSITIVE' ? 'bg-green-100 text-green-700' :
                    selectedTemplate.applicableTo === 'NEGATIVE' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedTemplate.applicableTo}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedTemplate.body}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleCopy(selectedTemplate)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {dict.templates.copy}
              </button>
              <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                {dict.templates.useInAI}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
