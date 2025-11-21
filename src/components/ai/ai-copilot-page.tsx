'use client';

import { useState, useActionState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { CopilotThreadList } from '@/components/ai/copilot-thread-list';
import { CopilotChat } from '@/components/ai/copilot-chat';
import { CopilotContextPanel } from '@/components/ai/copilot-context-panel';
import { AIService } from '@/lib/services/ai-service';
import type { CopilotThreadSummary, CopilotMessage, CopilotTool } from '@/lib/services/ai-types';
import { Sparkles, Menu, X } from 'lucide-react';

type Props = {
  dict: any;
};

type ChatState = {
  messages: CopilotMessage[];
  isLoading: boolean;
  error?: string;
};

const initialState: ChatState = {
  messages: [],
  isLoading: false,
};

async function sendMessageAction(prevState: ChatState, formData: FormData): Promise<ChatState> {
  const content = formData.get('content') as string;
  const threadId = formData.get('threadId') as string;
  const tool = formData.get('tool') as CopilotTool;

  if (!content?.trim()) {
    return prevState;
  }

  try {
    const response = await AIService.sendCopilotMessage('org-1', 'user-1', {
      threadId,
      tool,
      prompt: content,
      locale: 'en'
    });
    return {
      messages: response.messages,
      isLoading: false,
    };
  } catch (error) {
    return {
      ...prevState,
      isLoading: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}

export function AICopilotPage({ dict }: Props) {
  const [threads, setThreads] = useState<CopilotThreadSummary[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();
  const [activeTool, setActiveTool] = useState<CopilotTool>('GENERIC_QA');
  const [chatState, formAction] = useActionState(sendMessageAction, initialState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (activeThreadId) {
      loadThread(activeThreadId);
    }
  }, [activeThreadId]);

  const loadThreads = async () => {
    const data = await AIService.listCopilotThreads('org-1', 'user-1');
    setThreads(data);
    if (data.length > 0 && !activeThreadId) {
      setActiveThreadId(data[0].id);
    }
  };

  const loadThread = async (threadId: string) => {
    const thread = await AIService.getCopilotThread('org-1', 'user-1', threadId);
    if (thread) {
      chatState.messages = thread.messages;
      if (thread.tool) {
        setActiveTool(thread.tool);
      }
    }
  };

  const handleNewChat = async () => {
    const newThread = await AIService.createCopilotThread('org-1', 'user-1', activeTool);
    setThreads([newThread, ...threads]);
    setActiveThreadId(newThread.id);
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = (content: string) => {
    if (!activeThreadId) return;

    const formData = new FormData();
    formData.append('content', content);
    formData.append('threadId', activeThreadId);
    formData.append('tool', activeTool);

    chatState.isLoading = true;
    formAction(formData);
  };

  const handleRenameThread = async (newTitle: string) => {
    if (!activeThreadId) return;
    await AIService.renameCopilotThread('org-1', 'user-1', activeThreadId, newTitle);
    setThreads(threads.map(t => t.id === activeThreadId ? { ...t, title: newTitle } : t));
  };

  const handleSendPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const activeThread = threads.find(t => t.id === activeThreadId);
  const contextSummary = {
    hasDashboardSnapshot: true,
    hasPricingContext: true,
    hasInventoryContext: true,
    hasOrdersContext: true,
    hasListingsContext: true,
    hasReviewsContext: true,
    hasDatabaseAccess: true,
    hasAnalyticsAccess: true,
    hasInventoryAccess: true,
    hasPricingAccess: true,
    hasOrdersAccess: true,
    hasReviewsAccess: true,
  };

  const toolOptions: { value: CopilotTool; label: string; icon: string }[] = [
    { value: 'GENERIC_QA', label: dict.modes.general, icon: '💬' },
    { value: 'PRICING_ADVISOR', label: dict.modes.pricingAdvisor, icon: '💰' },
    { value: 'INVENTORY_PLANNER', label: dict.modes.inventoryPlanner, icon: '📦' },
    { value: 'LISTING_OPTIMIZER', label: dict.modes.listingOptimizer, icon: '✨' },
    { value: 'ORDERS_RISK', label: dict.modes.ordersRisk, icon: '📋' },
    { value: 'REVIEWS_ANALYZER', label: dict.modes.reviewsAnalyzer, icon: '⭐' },
    { value: 'AUTOMATION_DESIGNER', label: dict.modes.automationDesigner, icon: '⚡' },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{dict.title}</h1>
                <p className="text-sm text-gray-500">{dict.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setIsContextOpen(!isContextOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {toolOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveTool(option.value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTool === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Three-Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Threads */}
        <div className={`
          ${isSidebarOpen ? 'fixed inset-0 z-40' : 'hidden'} 
          lg:relative lg:block lg:w-80 bg-white border-r border-gray-200
        `}>
          {isSidebarOpen && (
            <div className="lg:hidden absolute top-4 right-4 z-50">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 bg-white rounded-lg shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <CopilotThreadList
            threads={threads}
            activeThreadId={activeThreadId}
            onSelectThread={handleSelectThread}
            onNewChat={handleNewChat}
            dict={dict}
          />
        </div>

        {/* Center - Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeThread ? (
            <CopilotChat
              messages={chatState.messages}
              threadTitle={activeThread.title}
              isLoading={chatState.isLoading}
              onSendMessage={handleSendMessage}
              onRenameThread={handleRenameThread}
              dict={dict}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{dict.chat.emptyTitle}</h3>
                <p className="text-sm text-gray-500">{dict.chat.emptyDesc}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Context & Shortcuts */}
        <div className={`
          ${isContextOpen ? 'fixed inset-0 z-40' : 'hidden'}
          lg:relative lg:block lg:w-80 bg-gray-50 border-l border-gray-200
        `}>
          {isContextOpen && (
            <div className="lg:hidden absolute top-4 right-4 z-50">
              <button
                onClick={() => setIsContextOpen(false)}
                className="p-2 bg-white rounded-lg shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <CopilotContextPanel
            contextSummary={contextSummary}
            activeTool={activeTool}
            onSendPrompt={handleSendPrompt}
            dict={dict}
          />
        </div>
      </div>

      {/* Mobile overlay */}
      {(isSidebarOpen || isContextOpen) && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsContextOpen(false);
          }}
        />
      )}
    </div>
  );
}
