import type {
  ReviewSummary,
  ReviewDetail,
  ReviewFilter,
  ReviewOverviewSnapshot,
  ReviewTemplate,
  ChannelComparison,
} from './review-types';

import {
  mockReviews,
  mockReviewDetails,
  mockOverviewSnapshot,
  mockTemplates,
  mockChannelComparisons,
} from '@/lib/mocks/mock-reviews';

export class ReviewService {
  /**
   * Get overview snapshot with aggregates and trends
   */
  static async getReviewOverviewSnapshot(orgId: string): Promise<ReviewOverviewSnapshot> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockOverviewSnapshot;
  }

  /**
   * Get filtered and paginated reviews
   */
  static async getReviews(
    orgId: string,
    filter: ReviewFilter,
    pagination: { page: number; pageSize: number }
  ): Promise<{ items: ReviewSummary[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let filtered = [...mockReviews];

    // Apply filters
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.bodyPreview.toLowerCase().includes(searchLower) ||
          r.productName.toLowerCase().includes(searchLower) ||
          r.authorName?.toLowerCase().includes(searchLower) ||
          r.title?.toLowerCase().includes(searchLower)
      );
    }

    if (filter.channelType && filter.channelType !== 'ALL') {
      filtered = filtered.filter((r) => r.channelType === filter.channelType);
    }

    if (filter.sentiment && filter.sentiment !== 'ALL') {
      filtered = filtered.filter((r) => r.sentiment === filter.sentiment);
    }

    if (filter.rating && filter.rating !== 'ALL') {
      filtered = filtered.filter((r) => r.rating === filter.rating);
    }

    if (filter.status && filter.status !== 'ALL') {
      filtered = filtered.filter((r) => r.status === filter.status);
    }

    if (filter.priority && filter.priority !== 'ALL') {
      filtered = filtered.filter((r) => r.priority === filter.priority);
    }

    if (filter.onlyUnresponded) {
      filtered = filtered.filter((r) => r.status === 'NEW');
    }

    if (filter.dateFrom) {
      filtered = filtered.filter((r) => r.createdAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      filtered = filtered.filter((r) => r.createdAt <= filter.dateTo!);
    }

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const items = filtered.slice(start, end);

    return {
      items,
      total: filtered.length,
    };
  }

  /**
   * Get single review detail
   */
  static async getReviewDetail(orgId: string, reviewId: string): Promise<ReviewDetail | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const detail = mockReviewDetails[reviewId];
    if (detail) {
      return detail;
    }

    // If no detailed mock, build from summary
    const summary = mockReviews.find((r) => r.id === reviewId);
    if (!summary) return null;

    return {
      summary,
      bodyFull: summary.bodyPreview,
      tags: [],
      internalNotes: [],
    };
  }

  /**
   * Get review templates
   */
  static async getReviewTemplates(orgId: string): Promise<ReviewTemplate[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockTemplates;
  }

  /**
   * Get channel comparison data
   */
  static async getChannelComparisons(orgId: string): Promise<ChannelComparison[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockChannelComparisons;
  }

  /**
   * Generate AI reply for review
   */
  static async generateAIReply(params: {
    orgId: string;
    reviewId: string;
    language: 'en' | 'ja';
    tone: 'FORMAL' | 'NEUTRAL' | 'FRIENDLY';
  }): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const review = mockReviews.find((r) => r.id === params.reviewId);
    if (!review) return 'Thank you for your feedback.';

    // Mock AI-generated responses based on sentiment and language
    if (params.language === 'ja') {
      if (review.sentiment === 'NEGATIVE') {
        return `${review.authorName}様\n\nこの度は、ご不便をおかけしまして誠に申し訳ございません。お客様のご指摘を真摯に受け止め、早急に改善に取り組んでおります。\n\nつきましては、以下の対応をご提案させていただきます：\n• 商品の交換または全額返金\n• 次回ご利用時の割引クーポン\n\nお手数ですが、ご希望の対応方法をお知らせいただけますでしょうか。今後このようなことがないよう、品質管理を徹底してまいります。\n\n何卒よろしくお願いいたします。`;
      } else {
        return `${review.authorName}様\n\nこの度は素敵なレビューをいただき、誠にありがとうございます。お客様にご満足いただけたこと、スタッフ一同大変嬉しく思っております。\n\n今後もお客様のご期待に応えられるよう、商品とサービスの向上に努めてまいります。またのご利用を心よりお待ちしております。`;
      }
    } else {
      if (review.sentiment === 'NEGATIVE') {
        return `Dear ${review.authorName},\n\nWe sincerely apologize for the issues you experienced with your order. This is not the level of quality and service we strive to provide, and we take full responsibility.\n\nTo make this right, we'd like to offer:\n• A full replacement with expedited shipping\n• A complete refund\n• A discount code for your next purchase\n\nPlease let us know which option you prefer, and we'll process it immediately. We're committed to improving our processes to prevent this from happening again.\n\nThank you for bringing this to our attention.`;
      } else {
        return `Dear ${review.authorName},\n\nThank you so much for your wonderful review! We're thrilled to hear that you're happy with your purchase and that it met your expectations.\n\nYour feedback means a lot to us and motivates our team to continue delivering quality products and excellent service. We hope to serve you again soon!\n\nBest regards`;
      }
    }
  }

  /**
   * Update review status
   */
  static async updateReviewStatus(
    orgId: string,
    reviewId: string,
    status: ReviewSummary['status']
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // In production, would update database
    const review = mockReviews.find((r) => r.id === reviewId);
    if (review) {
      review.status = status;
    }
  }

  /**
   * Update review priority
   */
  static async updateReviewPriority(
    orgId: string,
    reviewId: string,
    priority: ReviewSummary['priority']
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const review = mockReviews.find((r) => r.id === reviewId);
    if (review) {
      review.priority = priority;
    }
  }

  /**
   * Add internal note to review
   */
  static async addInternalNote(
    orgId: string,
    reviewId: string,
    note: string,
    author: string
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    // In production, would save to database
  }

  /**
   * Add tag to review
   */
  static async addTag(orgId: string, reviewId: string, tag: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    // In production, would save to database
  }
}
