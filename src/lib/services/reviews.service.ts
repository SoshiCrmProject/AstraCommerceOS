/**
 * Reviews Service
 * Manages customer reviews and sentiment analysis
 */

import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface ReviewFilters {
  search?: string;
  channel?: string;
  productId?: string;
  rating?: number;
  sentiment?: string;
  status?: string;
  priority?: string;
}

export class ReviewsService {
  /**
   * Get reviews with filters
   */
  static async getReviews(
    orgId: string,
    filters: ReviewFilters = {},
    page: number = 1,
    limit: number = 50
  ) {
    const where: Prisma.ReviewWhereInput = {
      orgId,
    };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { body: { contains: filters.search, mode: 'insensitive' } },
        { customerName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.channel) {
      where.channel = filters.channel;
    }

    if (filters.productId) {
      where.productId = filters.productId;
    }

    if (filters.rating) {
      where.rating = filters.rating;
    }

    if (filters.sentiment) {
      where.sentiment = filters.sentiment;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          product: true,
        },
        orderBy: { reviewedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single review
   */
  static async getReviewById(orgId: string, reviewId: string) {
    return prisma.review.findFirst({
      where: { id: reviewId, orgId },
      include: {
        product: true,
      },
    });
  }

  /**
   * Update review
   */
  static async updateReview(
    orgId: string,
    reviewId: string,
    data: Partial<{
      status: string;
      priority: string;
      reply: string;
      internalNotes: string;
      tags: string[];
    }>
  ) {
    const updateData: any = { ...data };

    if (data.reply) {
      updateData.repliedAt = new Date();
    }

    return prisma.review.update({
      where: { id: reviewId, orgId },
      data: updateData,
    });
  }

  /**
   * Reply to review
   */
  static async replyToReview(orgId: string, reviewId: string, reply: string, repliedBy?: string) {
    return this.updateReview(orgId, reviewId, {
      reply,
      status: 'reviewed',
    });
  }

  /**
   * Get review statistics
   */
  static async getReviewStats(orgId: string, days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const reviews = await prisma.review.findMany({
      where: {
        orgId,
        reviewedAt: { gte: since },
      },
    });

    const total = reviews.length;
    const avgRating = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

    const byRating = reviews.reduce(
      (acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    const bySentiment = reviews.reduce(
      (acc, review) => {
        const sentiment = review.sentiment || 'neutral';
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const pending = reviews.filter((r) => r.status === 'pending').length;
    const replied = reviews.filter((r) => r.reply).length;

    return {
      total,
      avgRating,
      byRating,
      bySentiment,
      pending,
      replied,
      replyRate: total > 0 ? (replied / total) * 100 : 0,
    };
  }

  /**
   * Analyze sentiment (simplified - in production would use AI)
   */
  static analyzeSentiment(text: string, rating: number): {
    sentiment: string;
    score: number;
  } {
    // Simple rule-based sentiment
    if (rating >= 4) {
      return { sentiment: 'positive', score: 0.7 + rating * 0.1 };
    } else if (rating === 3) {
      return { sentiment: 'neutral', score: 0 };
    } else {
      return { sentiment: 'negative', score: -0.7 - (5 - rating) * 0.1 };
    }
  }

  /**
   * Create review (from marketplace sync)
   */
  static async createReview(
    orgId: string,
    data: {
      productId?: string;
      externalId?: string;
      channel?: string;
      customerName?: string;
      title?: string;
      body: string;
      rating: number;
      reviewedAt?: Date;
    }
  ) {
    const { sentiment, score } = this.analyzeSentiment(data.body, data.rating);

    return prisma.review.create({
      data: {
        orgId,
        productId: data.productId,
        externalId: data.externalId,
        channel: data.channel,
        customerName: data.customerName,
        title: data.title,
        body: data.body,
        rating: data.rating,
        sentiment,
        sentimentScore: score,
        status: 'pending',
        priority: data.rating <= 2 ? 'high' : 'normal',
        reviewedAt: data.reviewedAt || new Date(),
      },
    });
  }

  /**
   * Get trending review topics
   */
  static async getTrendingTopics(orgId: string, days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const reviews = await prisma.review.findMany({
      where: {
        orgId,
        reviewedAt: { gte: since },
      },
      select: {
        body: true,
        rating: true,
      },
    });

    // Simple keyword extraction (in production would use NLP)
    const keywords = new Map<string, { count: number; avgRating: number; totalRating: number }>();

    reviews.forEach((review) => {
      const words = review.body.toLowerCase().split(/\W+/);
      words.forEach((word) => {
        if (word.length > 4) { // Filter short words
          const existing = keywords.get(word) || { count: 0, avgRating: 0, totalRating: 0 };
          existing.count++;
          existing.totalRating += review.rating;
          existing.avgRating = existing.totalRating / existing.count;
          keywords.set(word, existing);
        }
      });
    });

    return Array.from(keywords.entries())
      .map(([keyword, data]) => ({
        keyword,
        count: data.count,
        avgRating: data.avgRating,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }
}
