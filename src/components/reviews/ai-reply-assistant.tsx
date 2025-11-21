'use client';

import { useState, useActionState } from 'react';
import type { ReviewSummary } from '@/lib/services/review-types';
import { Sparkles, Copy, CheckCircle } from 'lucide-react';

type Props = {
  review: ReviewSummary;
  dict: any;
  locale: string;
};

type AIState = {
  reply: string;
  loading: boolean;
  error?: string;
};

const initialState: AIState = {
  reply: '',
  loading: false,
};

async function generateReplyAction(prevState: AIState, formData: FormData): Promise<AIState> {
  const language = formData.get('language') as string;
  const tone = formData.get('tone') as string;
  const reviewText = formData.get('reviewText') as string;
  const rating = formData.get('rating') as string;

  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock AI-generated reply
  const mockReplies: Record<string, string> = {
    'en-FORMAL': `Dear valued customer,\n\nThank you for taking the time to share your feedback with us. We sincerely appreciate your ${parseInt(rating) >= 4 ? 'positive comments and' : ''} honest review.\n\n${parseInt(rating) < 3 ? 'We are truly sorry to hear about your experience and would like to make this right. Our customer service team will reach out to you within 24 hours to discuss how we can address your concerns.\n\n' : ''}We remain committed to providing exceptional service and quality products.\n\nBest regards,\nCustomer Support Team`,
    
    'en-FRIENDLY': `Hi there! 👋\n\nThanks so much for your review! ${parseInt(rating) >= 4 ? "We're thrilled you're enjoying our product!" : "We're sorry to hear things didn't meet your expectations."}\n\n${parseInt(rating) < 3 ? "We'd love to make this right! Our team will reach out soon to see how we can help.\n\n" : ''}We really appreciate your feedback and hope to serve you again soon!\n\nCheers,\nThe Team`,
    
    'ja-FORMAL': `お客様\n\nこの度は貴重なご意見を賜り、誠にありがとうございます。${parseInt(rating) >= 4 ? 'お褒めのお言葉' : 'ご指摘'}をいただき、心より感謝申し上げます。\n\n${parseInt(rating) < 3 ? 'ご不便をおかけし、大変申し訳ございません。24時間以内にカスタマーサポートチームよりご連絡させていただき、改善策をご提案させていただきます。\n\n' : ''}今後とも、より良いサービスと製品をご提供できるよう努めてまいります。\n\n何卒よろしくお願い申し上げます。\nカスタマーサポートチーム`,
    
    'ja-FRIENDLY': `お客様\n\nレビューをいただき、ありがとうございます！${parseInt(rating) >= 4 ? '高評価いただき、大変嬉しく思います！' : 'ご期待に添えず、申し訳ございません。'}\n\n${parseInt(rating) < 3 ? 'より良い体験をご提供できるよう、サポートチームからご連絡させていただきます。\n\n' : ''}またのご利用を心よりお待ちしております！\n\nカスタマーサポートチーム`,
  };

  const key = `${language}-${tone}`;
  const reply = mockReplies[key] || mockReplies['en-FORMAL'];

  return {
    reply,
    loading: false,
  };
}

export function AIReplyAssistant({ review, dict, locale }: Props) {
  const [state, formAction] = useActionState(generateReplyAction, initialState);
  const [language, setLanguage] = useState(locale === 'ja' ? 'ja' : 'en');
  const [tone, setTone] = useState<'FORMAL' | 'NEUTRAL' | 'FRIENDLY'>('FORMAL');
  const [copied, setCopied] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleGenerate = () => {
    const formData = new FormData();
    formData.append('language', language);
    formData.append('tone', tone);
    formData.append('reviewText', review.bodyPreview);
    formData.append('rating', review.rating.toString());
    
    formAction(formData);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(state.reply || replyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-sm font-semibold text-gray-900">{dict.detail.aiReplyAssistant}</h3>
      </div>

      <div className="space-y-4">
        {/* Language Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">{dict.detail.replyLanguage}</label>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ja')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                language === 'ja'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              日本語
            </button>
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">{dict.detail.tone}</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="FORMAL">{dict.detail.toneFormal}</option>
            <option value="NEUTRAL">{dict.detail.toneNeutral}</option>
            <option value="FRIENDLY">{dict.detail.toneFriendly}</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={state.loading}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {state.loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {dict.detail.generating}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {dict.buttons.generateReply}
            </>
          )}
        </button>

        {/* Reply Text Area */}
        {state.reply && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">{dict.detail.generatedReply}</label>
            <textarea
              value={state.reply}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={8}
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleCopy}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {dict.detail.copied}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {dict.buttons.copyToClipboard}
                  </>
                )}
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                {dict.buttons.markResolved}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
