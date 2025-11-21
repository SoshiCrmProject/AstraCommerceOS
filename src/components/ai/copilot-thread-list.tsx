'use client';

import { useState } from 'react';
import { Pin, MessageSquare, Clock } from 'lucide-react';
import type { CopilotThreadSummary, CopilotTool } from '@/lib/services/ai-types';

type Props = {
  threads: CopilotThreadSummary[];
  activeThreadId?: string;
  onSelectThread: (threadId: string) => void;
  onNewChat: () => void;
  dict: any;
};

const toolIcons: Record<CopilotTool, string> = {
  PRICING_ADVISOR: '💰',
  INVENTORY_PLANNER: '📦',
  LISTING_OPTIMIZER: '✨',
  ORDERS_RISK: '📋',
  REVIEWS_ANALYZER: '⭐',
  AUTOMATION_DESIGNER: '⚡',
  DASHBOARD_INSIGHTS: '📊',
  GENERIC_QA: '💬',
};

export function CopilotThreadList({ threads, activeThreadId, onSelectThread, onNewChat, dict }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = threads.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedThreads = filteredThreads.filter(t => t.pinned);
  const regularThreads = filteredThreads.filter(t => !t.pinned);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {dict.buttons.newChat}
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder={dict.threads.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto px-2">
        {/* Pinned */}
        {pinnedThreads.length > 0 && (
          <div className="mb-4">
            <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
              <Pin className="w-3 h-3" />
              {dict.threads.pinned}
            </div>
            {pinnedThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isActive={thread.id === activeThreadId}
                onClick={() => onSelectThread(thread.id)}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}

        {/* Regular */}
        {regularThreads.length > 0 && (
          <div>
            <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">
              {dict.threads.title}
            </div>
            {regularThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isActive={thread.id === activeThreadId}
                onClick={() => onSelectThread(thread.id)}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}

        {filteredThreads.length === 0 && (
          <div className="px-4 py-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">{dict.threads.noThreads}</p>
            <p className="text-xs text-gray-400 mt-1">{dict.threads.noThreadsDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ThreadItem({ thread, isActive, onClick, formatTime }: {
  thread: CopilotThreadSummary;
  isActive: boolean;
  onClick: () => void;
  formatTime: (date: string) => string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-colors ${
        isActive
          ? 'bg-blue-50 border border-blue-200'
          : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className={`text-sm font-medium line-clamp-1 ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
          {thread.title}
        </span>
        {thread.tool && (
          <span className="text-xs flex-shrink-0">{toolIcons[thread.tool]}</span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        {formatTime(thread.updatedAt)}
      </div>
    </button>
  );
}
