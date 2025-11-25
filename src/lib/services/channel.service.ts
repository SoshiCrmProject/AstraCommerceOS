/**
 * Channel Service
 * Manages marketplace channels and their connectors
 */

import prisma from '@/lib/prisma';
import { ConnectorRegistry } from '@/lib/connectors/registry';
import type { Prisma } from '@prisma/client';

export class ChannelService {
  /**
   * Get all channels for an organization
   */
  static async getChannels(orgId: string) {
    return prisma.channelConnection.findMany({
      where: { orgId },
      include: {
        _count: {
          select: {
            listings: true,
            orders: true,
            syncLogs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single channel
   */
  static async getChannelById(orgId: string, channelId: string) {
    return prisma.channelConnection.findFirst({
      where: { id: channelId, orgId },
      include: {
        _count: {
          select: {
            listings: true,
            orders: true,
          },
        },
      },
    });
  }

  /**
   * Create new channel connection
   */
  static async createChannel(
    orgId: string,
    data: {
      channelType: string;
      channelName: string;
      credentials: any;
      config?: any;
    }
  ) {
    // Validate connector exists
    if (!ConnectorRegistry.hasConnector(data.channelType)) {
      throw new Error(`Unsupported channel type: ${data.channelType}`);
    }

    return prisma.channelConnection.create({
      data: {
        orgId,
        channelType: data.channelType,
        channelName: data.channelName,
        credentials: data.credentials,
        config: data.config || {},
        status: 'active',
        health: 'unknown',
        autoSync: true,
        syncFrequency: 3600, // 1 hour default
      },
    });
  }

  /**
   * Update channel
   */
  static async updateChannel(
    orgId: string,
    channelId: string,
    data: Partial<{
      channelName: string;
      credentials: any;
      config: any;
      status: string;
      autoSync: boolean;
      syncFrequency: number;
    }>
  ) {
    return prisma.channelConnection.update({
      where: { id: channelId, orgId },
      data,
    });
  }

  /**
   * Delete channel
   */
  static async deleteChannel(orgId: string, channelId: string) {
    return prisma.channelConnection.delete({
      where: { id: channelId, orgId },
    });
  }

  /**
   * Check channel health
   */
  static async checkHealth(orgId: string, channelId: string) {
    const channel = await this.getChannelById(orgId, channelId);
    
    if (!channel) {
      throw new Error('Channel not found');
    }

    const connector = ConnectorRegistry.getConnector(channel.channelType);
    await connector.initialize(channel.credentials, channel.config);

    const health = await connector.getHealth();

    // Update channel health
    await prisma.channelConnection.update({
      where: { id: channelId },
      data: {
        health: health.status,
        lastHealthCheck: health.lastCheck,
      },
    });

    return health;
  }

  /**
   * Sync orders from channel
   */
  static async syncOrders(orgId: string, channelId: string, since?: Date) {
    const channel = await this.getChannelById(orgId, channelId);
    
    if (!channel) {
      throw new Error('Channel not found');
    }

    const connector = ConnectorRegistry.getConnector(channel.channelType);
    await connector.initialize(channel.credentials, channel.config);

    const startedAt = new Date();

    try {
      const result = await connector.syncOrders(since);

      // Log sync
      await prisma.channelSyncLog.create({
        data: {
          orgId,
          channelId,
          syncType: 'orders',
          status: result.success ? 'success' : result.itemsFailed > 0 ? 'partial' : 'failed',
          itemsProcessed: result.itemsProcessed,
          itemsSucceeded: result.itemsSucceeded,
          itemsFailed: result.itemsFailed,
          errors: result.errors || [],
          startedAt,
          completedAt: new Date(),
          duration: result.duration,
        },
      });

      // Update last synced
      await prisma.channelConnection.update({
        where: { id: channelId },
        data: { lastSyncedAt: new Date() },
      });

      return result;
    } catch (error: any) {
      // Log failed sync
      await prisma.channelSyncLog.create({
        data: {
          orgId,
          channelId,
          syncType: 'orders',
          status: 'failed',
          itemsProcessed: 0,
          itemsSucceeded: 0,
          itemsFailed: 0,
          errors: [{ item: 'sync', error: error.message }],
          startedAt,
          completedAt: new Date(),
          duration: Date.now() - startedAt.getTime(),
        },
      });

      throw error;
    }
  }

  /**
   * Sync listings from channel
   */
  static async syncListings(orgId: string, channelId: string) {
    const channel = await this.getChannelById(orgId, channelId);
    
    if (!channel) {
      throw new Error('Channel not found');
    }

    const connector = ConnectorRegistry.getConnector(channel.channelType);
    await connector.initialize(channel.credentials, channel.config);

    const startedAt = new Date();

    try {
      const result = await connector.syncListings();

      await prisma.channelSyncLog.create({
        data: {
          orgId,
          channelId,
          syncType: 'listings',
          status: result.success ? 'success' : 'partial',
          itemsProcessed: result.itemsProcessed,
          itemsSucceeded: result.itemsSucceeded,
          itemsFailed: result.itemsFailed,
          errors: result.errors || [],
          startedAt,
          completedAt: new Date(),
          duration: result.duration,
        },
      });

      await prisma.channelConnection.update({
        where: { id: channelId },
        data: { lastSyncedAt: new Date() },
      });

      return result;
    } catch (error: any) {
      await prisma.channelSyncLog.create({
        data: {
          orgId,
          channelId,
          syncType: 'listings',
          status: 'failed',
          itemsProcessed: 0,
          itemsSucceeded: 0,
          itemsFailed: 0,
          errors: [{ item: 'sync', error: error.message }],
          startedAt,
          completedAt: new Date(),
          duration: Date.now() - startedAt.getTime(),
        },
      });

      throw error;
    }
  }

  /**
   * Sync inventory from channel
   */
  static async syncInventory(orgId: string, channelId: string) {
    const channel = await this.getChannelById(orgId, channelId);
    
    if (!channel) {
      throw new Error('Channel not found');
    }

    const connector = ConnectorRegistry.getConnector(channel.channelType);
    await connector.initialize(channel.credentials, channel.config);

    const startedAt = new Date();

    try {
      const result = await connector.syncInventory();

      await prisma.channelSyncLog.create({
        data: {
          orgId,
          channelId,
          syncType: 'inventory',
          status: result.success ? 'success' : 'partial',
          itemsProcessed: result.itemsProcessed,
          itemsSucceeded: result.itemsSucceeded,
          itemsFailed: result.itemsFailed,
          errors: result.errors || [],
          startedAt,
          completedAt: new Date(),
          duration: result.duration,
        },
      });

      return result;
    } catch (error: any) {
      await prisma.channelSyncLog.create({
        data: {
          orgId,
          channelId,
          syncType: 'inventory',
          status: 'failed',
          itemsProcessed: 0,
          itemsSucceeded: 0,
          itemsFailed: 0,
          errors: [{ item: 'sync', error: error.message }],
          startedAt,
          completedAt: new Date(),
          duration: Date.now() - startedAt.getTime(),
        },
      });

      throw error;
    }
  }

  /**
   * Get sync history for channel
   */
  static async getSyncHistory(orgId: string, channelId: string, limit: number = 20) {
    return prisma.channelSyncLog.findMany({
      where: { orgId, channelId },
      orderBy: { startedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Test channel connection
   */
  static async testConnection(channelType: string, credentials: any) {
    if (!ConnectorRegistry.hasConnector(channelType)) {
      throw new Error(`Unsupported channel type: ${channelType}`);
    }

    const connector = ConnectorRegistry.getConnector(channelType);
    await connector.initialize(credentials);

    const health = await connector.getHealth();

    return {
      success: health.status === 'healthy',
      health,
    };
  }
}
