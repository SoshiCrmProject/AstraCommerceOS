'use server';

/**
 * Analytics AI Server Actions
 * 
 * AI-powered explanations and insights for analytics data.
 */

export type AnalyticsAIRequest = {
  question: string;
  context?: {
    totalRevenue?: number;
    totalProfit?: number;
    profitMarginPercent?: number;
    revenueGrowthPercent?: number;
    topChannels?: string[];
  };
};

export type AnalyticsAIResponse = {
  answer: string;
  followUpQuestions?: string[];
};

/**
 * Generate AI explanation for analytics data
 */
export async function explainAnalyticsChart(
  chartType: 'revenue' | 'funnel' | 'channels' | 'general',
  context: any
): Promise<AnalyticsAIResponse> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock AI responses based on chart type
  const responses = {
    revenue: {
      answer: `Based on your revenue data:\n\n• Your revenue shows a strong upward trend with ${context.revenueGrowthPercent > 0 ? 'positive' : 'negative'} growth of ${Math.abs(context.revenueGrowthPercent)}% vs. the previous period.\n\n• The profit margin of ${context.profitMarginPercent}% indicates healthy unit economics.\n\n• Peak revenue days appear to cluster around weekends and promotional periods.\n\n• Consider optimizing your channel mix to improve overall profitability - some channels have higher margins than others.`,
      followUpQuestions: [
        'Which channels have the highest profit margins?',
        'What caused the revenue spike on specific dates?',
        'How can I increase my average order value?',
      ],
    },
    funnel: {
      answer: `Your conversion funnel analysis reveals:\n\n• Overall conversion rate from visits to orders is ${context.overallConversion}%.\n\n• The biggest drop-off occurs at the "${context.biggestDropStage}" stage with only ${context.biggestDropPercent}% conversion.\n\n• To improve:\n  - Optimize product pages to increase view-to-cart rate\n  - Simplify checkout process to reduce abandonment\n  - Implement cart recovery campaigns\n\n• Your checkout-to-order conversion of ${context.checkoutConversion}% is above industry average.`,
      followUpQuestions: [
        'What are the top reasons for cart abandonment?',
        'How do my conversion rates compare to benchmarks?',
        'Which products have the best conversion rates?',
      ],
    },
    channels: {
      answer: `Channel performance insights:\n\n• Your top-performing channel is ${context.topChannel} with ${context.topChannelRevenue} in revenue.\n\n• ${context.topChannel} also has the highest profit margin at ${context.topChannelMargin}%.\n\n• Consider scaling investment in high-margin channels while optimizing underperformers.\n\n• TikTok Shop shows rapid growth (+45%) but also higher return rates - monitor quality and customer expectations.`,
      followUpQuestions: [
        'Should I invest more in TikTok Shop despite high returns?',
        'How can I improve margins on lower-performing channels?',
        'Which channel has the best customer lifetime value?',
      ],
    },
    general: {
      answer: `Here's a summary of your overall performance:\n\n• Total revenue: ${context.totalRevenue} (+${context.revenueGrowthPercent}%)\n• Total profit: ${context.totalProfit} (+${context.profitGrowthPercent}%)\n• Profit margin: ${context.profitMarginPercent}%\n\nStrong points:\n  - Revenue growth is consistent\n  - Profit is growing faster than revenue\n  - Multi-channel diversification reduces risk\n\nWatch areas:\n  - Some channels have elevated return rates\n  - Funnel drop-off at product page level\n  - Seasonal inventory planning needed`,
      followUpQuestions: [
        'What products should I stock more of?',
        'How can I reduce my return rate?',
        'What is my forecast for next month?',
      ],
    },
  };

  return responses[chartType] || responses.general;
}

/**
 * Answer custom analytics question
 */
export async function askAnalyticsCopilot(
  request: AnalyticsAIRequest
): Promise<AnalyticsAIResponse> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Simple keyword matching for mock responses
  const question = request.question.toLowerCase();

  if (question.includes('revenue') || question.includes('sales')) {
    return {
      answer: `Looking at your revenue performance:\n\nYour total revenue of ${request.context?.totalRevenue || 'N/A'} represents a ${request.context?.revenueGrowthPercent || 0}% change vs. the previous period. This is driven primarily by:\n\n1. Strong performance on Amazon US (+12.4%)\n2. Rapid growth on TikTok Shop (+45.2%)\n3. Steady growth on Shopify (+8.7%)\n\nRevenue quality is good with a ${request.context?.profitMarginPercent || 0}% overall profit margin.`,
      followUpQuestions: [
        'Which products are driving the revenue growth?',
        'How does this compare to last year?',
        'What is my revenue forecast for next month?',
      ],
    };
  }

  if (question.includes('profit') || question.includes('margin')) {
    return {
      answer: `Your profit analysis:\n\nTotal profit is ${request.context?.totalProfit || 'N/A'} with a margin of ${request.context?.profitMarginPercent || 0}%.\n\nHighest-margin channels:\n• Shopify Store: 27.9%\n• Amazon US: 24.0%\n• Rakuten: 22.0%\n\nLowest-margin channels:\n• Walmart: 21.0% (down from 25%)\n• eBay: 20.0%\n\nConsider optimizing pricing and costs on lower-margin channels.`,
      followUpQuestions: [
        'Why did Walmart margin drop?',
        'How can I improve my overall margin?',
        'Which products have negative margins?',
      ],
    };
  }

  if (question.includes('channel') || question.includes('marketplace')) {
    return {
      answer: `Channel breakdown:\n\nYou are selling on 8 active channels with Amazon US being your largest at 856K revenue (43% share).\n\nFastest growing: TikTok Shop (+45%)\nMost profitable: Shopify (27.9% margin)\nNeeds attention: Walmart (declining -5.2%)\n\nRecommendation: Diversification is good, but focus on scaling your top 3-4 channels before expanding further.`,
      followUpQuestions: [
        'Should I add more channels?',
        'How do I scale TikTok Shop safely?',
        'What is causing the Walmart decline?',
      ],
    };
  }

  // Default response
  return {
    answer: `I can help you understand your analytics better. Here is what I can analyze:\n\nRevenue and Profit trends\nChannel performance\nConversion funnel\nProduct performance\nCustomer behavior\n\nTry asking:\n• "Why did revenue change last month?"\n• "Which channels are most profitable?"\n• "Where are customers dropping off?"\n• "What products should I focus on?"`,
    followUpQuestions: [
      'Summarize my performance this month',
      'Which channels are driving most profit?',
      'What products have the best margins?',
    ],
  };
}
