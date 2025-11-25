/**
 * Job Queue Service
 * Manages background jobs for syncs, auto-fulfillment, analytics, etc.
 * Production-ready interface that can use in-memory queue (dev) or Redis/Bull (production)
 */

import prisma from './prisma';
import type { JobQueueItem, Prisma } from '@prisma/client';

export type JobType =
  | 'channel_sync'
  | 'auto_fulfillment_eval'
  | 'auto_fulfillment_purchase'
  | 'analytics_rollup'
  | 'automation_execution'
  | 'price_update'
  | 'inventory_sync'
  | 'email_send';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type JobPriority = number; // Higher = more important

export interface JobPayload {
  [key: string]: any;
}

export interface JobOptions {
  priority?: JobPriority;
  maxAttempts?: number;
  scheduledFor?: Date;
  orgId?: string;
}

export interface JobResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Job Queue Service Interface
 */
export class JobQueueService {
  /**
   * Enqueue a new job
   */
  static async enqueue(
    jobType: JobType,
    payload: JobPayload,
    options: JobOptions = {}
  ): Promise<JobQueueItem> {
    const job = await prisma.jobQueueItem.create({
      data: {
        jobType,
        payload: payload as Prisma.InputJsonValue,
        priority: options.priority ?? 0,
        maxAttempts: options.maxAttempts ?? 3,
        scheduledFor: options.scheduledFor ?? new Date(),
        orgId: options.orgId,
        status: 'pending',
      },
    });

    // In production with Redis: await this.queueProcessor.add(jobType, payload, options);
    
    return job;
  }

  /**
   * Get next pending job to process
   */
  static async getNextJob(): Promise<JobQueueItem | null> {
    const now = new Date();

    // Find highest priority pending job that's due
    const job = await prisma.jobQueueItem.findFirst({
      where: {
        status: 'pending',
        scheduledFor: {
          lte: now,
        },
        attempts: {
          lt: prisma.jobQueueItem.fields.maxAttempts,
        },
      },
      orderBy: [
        { priority: 'desc' },
        { scheduledFor: 'asc' },
      ],
    });

    if (!job) {
      return null;
    }

    // Mark as processing
    return prisma.jobQueueItem.update({
      where: { id: job.id },
      data: {
        status: 'processing',
        startedAt: new Date(),
        attempts: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Mark job as completed
   */
  static async completeJob(
    jobId: string,
    result: JobResult
  ): Promise<JobQueueItem> {
    return prisma.jobQueueItem.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        result: result as Prisma.InputJsonValue,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Mark job as failed
   */
  static async failJob(
    jobId: string,
    error: string
  ): Promise<JobQueueItem> {
    const job = await prisma.jobQueueItem.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Check if should retry
    const shouldRetry = job.attempts < job.maxAttempts;

    return prisma.jobQueueItem.update({
      where: { id: jobId },
      data: {
        status: shouldRetry ? 'pending' : 'failed',
        error,
        completedAt: shouldRetry ? undefined : new Date(),
        // Exponential backoff for retry
        scheduledFor: shouldRetry
          ? new Date(Date.now() + Math.pow(2, job.attempts) * 1000 * 60)
          : undefined,
      },
    });
  }

  /**
   * Get job by ID
   */
  static async getJob(jobId: string): Promise<JobQueueItem | null> {
    return prisma.jobQueueItem.findUnique({
      where: { id: jobId },
    });
  }

  /**
   * Get jobs for an organization
   */
  static async getOrgJobs(
    orgId: string,
    options: {
      status?: JobStatus;
      jobType?: JobType;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<JobQueueItem[]> {
    return prisma.jobQueueItem.findMany({
      where: {
        orgId,
        ...(options.status && { status: options.status }),
        ...(options.jobType && { jobType: options.jobType }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: options.limit ?? 50,
      skip: options.offset ?? 0,
    });
  }

  /**
   * Get job queue statistics
   */
  static async getQueueStats(orgId?: string): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    byType: Record<string, number>;
  }> {
    const where = orgId ? { orgId } : {};

    const [pending, processing, completed, failed, all] = await Promise.all([
      prisma.jobQueueItem.count({ where: { ...where, status: 'pending' } }),
      prisma.jobQueueItem.count({ where: { ...where, status: 'processing' } }),
      prisma.jobQueueItem.count({ where: { ...where, status: 'completed' } }),
      prisma.jobQueueItem.count({ where: { ...where, status: 'failed' } }),
      prisma.jobQueueItem.findMany({
        where,
        select: { jobType: true },
      }),
    ]);

    const byType: Record<string, number> = {};
    all.forEach((job) => {
      byType[job.jobType] = (byType[job.jobType] || 0) + 1;
    });

    return {
      pending,
      processing,
      completed,
      failed,
      byType,
    };
  }

  /**
   * Cancel a pending job
   */
  static async cancelJob(jobId: string): Promise<JobQueueItem> {
    return prisma.jobQueueItem.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        error: 'Cancelled by user',
        completedAt: new Date(),
      },
    });
  }

  /**
   * Retry a failed job
   */
  static async retryJob(jobId: string): Promise<JobQueueItem> {
    return prisma.jobQueueItem.update({
      where: { id: jobId },
      data: {
        status: 'pending',
        attempts: 0,
        error: null,
        startedAt: null,
        completedAt: null,
        scheduledFor: new Date(),
      },
    });
  }

  /**
   * Clean up old completed/failed jobs
   */
  static async cleanup(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await prisma.jobQueueItem.deleteMany({
      where: {
        OR: [
          { status: 'completed' },
          { status: 'failed' },
        ],
        completedAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}

/**
 * Job processor interface
 * Implement this for each job type
 */
export interface JobProcessor<T = any> {
  process(payload: T, orgId?: string): Promise<JobResult>;
}

/**
 * Job processor registry
 */
export class JobProcessorRegistry {
  private static processors = new Map<JobType, JobProcessor>();

  static register(jobType: JobType, processor: JobProcessor) {
    this.processors.set(jobType, processor);
  }

  static get(jobType: JobType): JobProcessor | undefined {
    return this.processors.get(jobType);
  }

  /**
   * Process a job using registered processor
   */
  static async processJob(job: JobQueueItem): Promise<JobResult> {
    const processor = this.get(job.jobType as JobType);
    
    if (!processor) {
      throw new Error(`No processor registered for job type: ${job.jobType}`);
    }

    return processor.process(job.payload, job.orgId ?? undefined);
  }
}

/**
 * Simple in-memory job worker for development
 * In production, use Bull/BullMQ with Redis
 */
export class JobWorker {
  private running = false;
  private interval: NodeJS.Timeout | null = null;

  /**
   * Start processing jobs
   */
  start(pollIntervalMs: number = 5000) {
    if (this.running) {
      return;
    }

    this.running = true;
    console.log('[JobWorker] Starting job worker...');

    this.interval = setInterval(async () => {
      try {
        await this.processNextJob();
      } catch (error) {
        console.error('[JobWorker] Error processing job:', error);
      }
    }, pollIntervalMs);
  }

  /**
   * Stop processing jobs
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.running = false;
    console.log('[JobWorker] Stopped job worker');
  }

  /**
   * Process next available job
   */
  private async processNextJob() {
    const job = await JobQueueService.getNextJob();
    
    if (!job) {
      return; // No jobs to process
    }

    console.log(`[JobWorker] Processing job ${job.id} (${job.jobType})`);

    try {
      const result = await JobProcessorRegistry.processJob(job);
      
      if (result.success) {
        await JobQueueService.completeJob(job.id, result);
        console.log(`[JobWorker] Job ${job.id} completed successfully`);
      } else {
        await JobQueueService.failJob(job.id, result.error || 'Job failed');
        console.log(`[JobWorker] Job ${job.id} failed: ${result.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await JobQueueService.failJob(job.id, errorMessage);
      console.error(`[JobWorker] Job ${job.id} threw error:`, error);
    }
  }
}

// Export singleton worker instance
export const jobWorker = new JobWorker();

// Auto-start in development (optional)
if (process.env.NODE_ENV === 'development' && process.env.AUTO_START_WORKER !== 'false') {
  // jobWorker.start();
}
