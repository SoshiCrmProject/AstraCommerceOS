'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

type Props = {
  onSubmit: (prompt: string) => void;
  onClose: () => void;
};

export function AiWorkflowCopilot({ onSubmit, onClose }: Props) {
  const [prompt, setPrompt] = useState('');

  const suggestedPrompts = [
    'Alert me when Amazon JP orders spike above daily average',
    'Adjust prices when margins drop below 10%',
    'Tag and prioritize high-value orders over $1000',
    'Send Slack alert when inventory runs low',
    'Create replenishment task when stock falls below 7 days',
    'Email CX team when 1-star review is posted',
  ];

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-card border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Workflow Copilot</h2>
              <p className="text-sm text-gray-600">Describe what you want to automate</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 block">
              Your automation request
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Send me an email when inventory drops below 5 days of cover"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          <div>
            <div className="text-sm font-medium text-gray-900 mb-3">Suggested prompts:</div>
            <div className="grid gap-2">
              {suggestedPrompts.map((suggested, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(suggested)}
                  className="text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  {suggested}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Generate Workflow
          </button>
        </div>
      </div>
    </div>
  );
}
