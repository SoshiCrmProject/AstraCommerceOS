'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Sparkles, Edit2, Check } from 'lucide-react';
import type { CopilotMessage } from '@/lib/services/ai-types';
import ReactMarkdown from 'react-markdown';

type Props = {
  messages: CopilotMessage[];
  threadTitle: string;
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onRenameThread?: (newTitle: string) => void;
  dict: any;
};

export function CopilotChat({ messages, threadTitle, isLoading, onSendMessage, onRenameThread, dict }: Props) {
  const [input, setInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(threadTitle);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setEditedTitle(threadTitle);
  }, [threadTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== threadTitle && onRenameThread) {
      onRenameThread(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 p-4">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') {
                  setEditedTitle(threadTitle);
                  setIsEditingTitle(false);
                }
              }}
              className="flex-1 px-2 py-1 text-lg font-semibold border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleTitleSave}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h2 className="text-lg font-semibold text-gray-900 flex-1">{threadTitle}</h2>
            {onRenameThread && (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{dict.chat.emptyTitle}</h3>
            <p className="text-sm text-gray-500 max-w-md">{dict.chat.emptyDesc}</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} dict={dict} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{dict.chat.thinking}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dict.chat.placeholder}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">{dict.chat.hint}</p>
      </div>
    </div>
  );
}

function MessageBubble({ message, dict }: { message: CopilotMessage; dict: any }) {
  const isUser = message.role === 'user';

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-gray-200' : 'bg-gradient-to-br from-blue-500 to-purple-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-gray-600" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className={`rounded-2xl p-4 ${
          isUser ? 'bg-gray-100 text-gray-900' : 'bg-blue-50 text-gray-900'
        }`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Referenced Entities */}
        {message.referencedEntities && message.referencedEntities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.referencedEntities.map((entity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600"
              >
                {entity.label}
              </span>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">{dict.chat.suggestions}</p>
            <div className="flex flex-wrap gap-2">
              {message.suggestedFollowUps.map((suggestion: string, idx: number) => (
                <button
                  key={idx}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
