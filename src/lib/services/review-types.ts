export type ReviewChannelType =
  | 'AMAZON'
  | 'SHOPIFY'
  | 'SHOPEE'
  | 'RAKUTEN'
  | 'EBAY'
  | 'WALMART'
  | 'YAHOO_SHOPPING'
  | 'MERCARI'
  | 'TIKTOK_SHOP';

export type ReviewSentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export type ReviewStatus =
  | 'NEW'
  | 'IN_PROGRESS'
  | 'RESPONDED'
  | 'RESOLVED'
  | 'ESCALATED';

export type ReviewPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReviewSummary = {
  id: string;
  channelType: ReviewChannelType;
  channelName: string;
  region: string;
  rating: number; // 1–5
  title?: string;
  bodyPreview: string;
  sentiment: ReviewSentiment;
  status: ReviewStatus;
  priority: ReviewPriority;
  productId: string;
  productName: string;
  skuCode?: string;
  mainImageUrl?: string;
  authorName?: string;
  language?: string; // e.g. 'en', 'ja'
  createdAt: string;
  lastUpdatedAt: string;
  hasAiSuggestedReply: boolean;
};

export type ReviewDetail = {
  summary: ReviewSummary;
  bodyFull: string;
  orderId?: string;
  tags: string[];
  internalNotes: { id: string; author: string; note: string; createdAt: string }[];
};

export type ReviewAggregates = {
  totalReviews: number;
  avgRating: number;
  totalPositive: number;
  totalNeutral: number;
  totalNegative: number;
  newReviews24h: number;
  negativeLast7d: number;
  respondedRateLast7d: number;
};

export type ReviewTimeSeriesPoint = {
  date: string; // ISO date
  count: number;
  avgRating: number;
  negativeCount: number;
};

export type ReviewKeywordInsight = {
  keyword: string;
  sentiment: ReviewSentiment | 'MIXED';
  count: number;
  samplePhrase?: string;
};

export type ReviewOverviewSnapshot = {
  aggregates: ReviewAggregates;
  timeSeries: ReviewTimeSeriesPoint[];
  topPositiveKeywords: ReviewKeywordInsight[];
  topNegativeKeywords: ReviewKeywordInsight[];
};

export type ReviewFilter = {
  search?: string;
  channelType?: ReviewChannelType | 'ALL';
  sentiment?: ReviewSentiment | 'ALL';
  rating?: number | 'ALL';
  status?: ReviewStatus | 'ALL';
  priority?: ReviewPriority | 'ALL';
  dateFrom?: string;
  dateTo?: string;
  onlyUnresponded?: boolean;
};

export type ReviewTemplate = {
  id: string;
  name: string;
  language: string;
  tone: 'FORMAL' | 'NEUTRAL' | 'FRIENDLY';
  applicableTo: 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE' | 'ANY';
  body: string;
};

export type ChannelComparison = {
  channelType: ReviewChannelType;
  channelName: string;
  avgRating: number;
  reviewCount: number;
  negativePercentage: number;
};
