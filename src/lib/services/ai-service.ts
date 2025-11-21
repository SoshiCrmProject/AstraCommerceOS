import type {
  CopilotThreadSummary,
  CopilotThread,
  CopilotTool,
  CopilotResponse,
  CopilotMessage,
  PromptTemplate,
  Playbook,
} from './ai-types';

import {
  getMockCopilotThreads,
  getMockCopilotThread,
  getMockPlaybooks,
  getMockPromptTemplates,
} from '@/lib/mocks/mock-copilot-data';

export class AIService {
  /**
   * List all copilot threads for a user
   */
  static async listCopilotThreads(
    orgId: string,
    userId: string
  ): Promise<CopilotThreadSummary[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getMockCopilotThreads(userId);
  }

  /**
   * Get a specific copilot thread with messages and context
   */
  static async getCopilotThread(
    orgId: string,
    userId: string,
    threadId: string
  ): Promise<CopilotThread | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return getMockCopilotThread(threadId);
  }

  /**
   * Create a new copilot thread
   */
  static async createCopilotThread(
    orgId: string,
    userId: string,
    initialTool?: CopilotTool
  ): Promise<CopilotThreadSummary> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const newThread: CopilotThreadSummary = {
      id: `thread-${Date.now()}`,
      title: 'New conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tool: initialTool,
      locale: 'en',
    };

    return newThread;
  }

  /**
   * Rename a copilot thread
   */
  static async renameCopilotThread(
    orgId: string,
    userId: string,
    threadId: string,
    title: string
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    // In production, this would update the database
  }

  /**
   * Send a message to the copilot and get a response
   */
  static async sendCopilotMessage(
    orgId: string,
    userId: string,
    params: {
      threadId: string;
      tool?: CopilotTool;
      prompt: string;
      locale: string;
    }
  ): Promise<CopilotResponse> {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get existing thread or create empty message history
    const existingThread = await this.getCopilotThread(orgId, userId, params.threadId);
    const previousMessages = existingThread?.messages || [];

    // Generate mock response based on tool and prompt
    const mockResponse = this.generateMockResponse(params.prompt, params.tool);

    const userMessage: CopilotMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: params.prompt,
      createdAt: new Date().toISOString(),
    };

    const assistantMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: mockResponse.content,
      createdAt: new Date().toISOString(),
      referencedEntities: mockResponse.entities,
      suggestedFollowUps: mockResponse.followUps,
    };

    return {
      message: assistantMessage,
      messages: [...previousMessages, userMessage, assistantMessage],
      suggestedFollowUps: mockResponse.followUps,
    };
  }

  /**
   * Get all playbooks
   */
  static async getPlaybooks(orgId: string): Promise<Playbook[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getMockPlaybooks();
  }

  /**
   * Get all prompt templates
   */
  static async getPromptTemplates(orgId: string): Promise<PromptTemplate[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getMockPromptTemplates();
  }

  /**
   * Generate a mock AI response (placeholder for real AI integration)
   */
  private static generateMockResponse(
    prompt: string,
    tool?: CopilotTool
  ): {
    content: string;
    entities?: CopilotMessage['referencedEntities'];
    followUps?: string[];
  } {
    const lowerPrompt = prompt.toLowerCase();

    // Pricing-related responses
    if (tool === 'PRICING_ADVISOR' || lowerPrompt.includes('pric')) {
      return {
        content: `I've analyzed your pricing data. Here are my recommendations:

**Key Findings:**
- 3 SKUs have margins below 10% and need immediate attention
- Average Buy Box share across Amazon channels is 78%
- Opportunity to increase prices on 12 high-demand items without losing competitiveness

**Top Priority Actions:**
1. Increase price on Wireless Headphones (WH-BT-001) by 8% to match market
2. Review pricing for USB-C cables - currently 15% below competitors
3. Set up automated repricing for gaming accessories category

Would you like me to create detailed pricing plans for any of these?`,
        entities: [
          { type: 'SKU', id: 'WH-BT-001', label: 'Wireless Headphones' },
          { type: 'SKU', id: 'USB-C-003', label: 'USB-C Cable' },
        ],
        followUps: [
          'Create pricing plan for wireless headphones',
          'Show all SKUs with negative margins',
          'Analyze competitor pricing trends',
        ],
      };
    }

    // Inventory-related responses
    if (tool === 'INVENTORY_PLANNER' || lowerPrompt.includes('inventor')) {
      return {
        content: `Based on your current inventory levels and sales velocity:

**Critical Stock Alerts:**
- Bluetooth Speakers: 4.2 days of cover (restock urgent)
- Power Banks: 5.8 days of cover
- Phone Cases: 6.1 days of cover

**Replenishment Recommendations:**
1. Order 500 units of Bluetooth Speakers by Dec 10
2. Increase safety stock for top 10 SKUs by 40% for holiday season
3. Set up automatic reorder points for fast-moving items

**30-Day Forecast:**
Based on historical trends, you'll need approximately 2,500 units across top categories to maintain service levels.`,
        followUps: [
          'Generate purchase orders for critical items',
          'Show overstock items for clearance',
          'Create holiday season inventory plan',
        ],
      };
    }

    // Listing optimization responses
    if (tool === 'LISTING_OPTIMIZER' || lowerPrompt.includes('listing')) {
      return {
        content: `I'll help you optimize your product listings. Here's what I found:

**Listing Quality Score:** 7.2/10

**Improvement Opportunities:**
1. **Title Optimization** - Include primary keywords earlier
2. **Bullet Points** - Expand to highlight unique features
3. **Product Description** - Add more detail about use cases
4. **Images** - Consider adding lifestyle images

**SEO Keywords Missing:**
- "wireless bluetooth headphones"
- "noise cancelling"
- "long battery life"

Would you like me to rewrite any specific section?`,
        followUps: [
          'Rewrite the product title',
          'Generate bullet points',
          'Localize for Japanese market',
        ],
      };
    }

    // Default general response
    return {
      content: `I'm here to help you with your AstraCommerce operations. I can assist with:

- **Pricing strategy** - Optimize prices across channels
- **Inventory planning** - Forecast demand and manage stock levels
- **Listing optimization** - Improve product listings for better conversion
- **Order management** - Identify risks and streamline fulfillment
- **Review analysis** - Understand customer feedback
- **Automation** - Design workflows to save time

What would you like to work on?`,
      followUps: [
        'Analyze my pricing strategy',
        'Help with inventory planning',
        'Optimize my product listings',
      ],
    };
  }
}
