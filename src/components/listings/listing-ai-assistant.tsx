'use client';

import { useState } from 'react';
import { ListingsDictionary } from '@/i18n/getListingsDictionary';
import { AiListingGeneration } from '@/lib/services/listing-types';
import { generateAiListing } from '@/lib/services/listing-service';

type ListingAiAssistantProps = {
  dict: ListingsDictionary;
  locale: 'en' | 'ja';
  onApply: (generation: AiListingGeneration, applyType: 'all' | 'title' | 'bullets') => void;
};

export function ListingAiAssistant({ dict, locale, onApply }: ListingAiAssistantProps) {
  const [mode, setMode] = useState<'generate' | 'improve' | 'localizeToJa' | 'localizeToEn'>('improve');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'premium' | 'technical'>('professional');
  const [includeSeo, setIncludeSeo] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generation, setGeneration] = useState<AiListingGeneration | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAiListing('Generate listing content', locale, tone);
      setGeneration(result);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 sm:text-lg">{dict.ai.title}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="generate">{dict.ai.modes.generate}</option>
            <option value="improve">{dict.ai.modes.improve}</option>
            <option value="localizeToJa">{dict.ai.modes.localizeToJa}</option>
            <option value="localizeToEn">{dict.ai.modes.localizeToEn}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {dict.ai.settings.tone}
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="professional">{dict.ai.tone.professional}</option>
            <option value="friendly">{dict.ai.tone.friendly}</option>
            <option value="premium">{dict.ai.tone.premium}</option>
            <option value="technical">{dict.ai.tone.technical}</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeSeo"
            checked={includeSeo}
            onChange={(e) => setIncludeSeo(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="includeSeo" className="ml-2 text-sm text-gray-700">
            {dict.ai.settings.includeSeo}
          </label>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : dict.ai.actions.generateDraft}
        </button>
      </div>

      {generation && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Generated Content</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <p className="text-sm text-gray-900 break-words">{generation.title}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Bullet Points</label>
                <ul className="text-sm text-gray-900 space-y-1">
                  {generation.bulletPoints.map((bullet, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 flex-shrink-0">•</span>
                      <span className="break-words">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <p className="text-sm text-gray-900 break-words">{generation.description}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => onApply(generation, 'all')}
              className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              {dict.ai.actions.applyAll}
            </button>
            <button
              onClick={() => onApply(generation, 'title')}
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="hidden sm:inline">{dict.ai.actions.applyTitle}</span>
              <span className="sm:hidden">Title</span>
            </button>
            <button
              onClick={() => onApply(generation, 'bullets')}
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="hidden sm:inline">{dict.ai.actions.applyBullets}</span>
              <span className="sm:hidden">Bullets</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}