'use server';

import { ChannelService } from '@/lib/services/channel.service';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Get all channels
 */
export async function getChannels() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const channels = await ChannelService.getChannels(user.currentOrgId);

    return { success: true, data: channels };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get single channel
 */
export async function getChannel(channelId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const channel = await ChannelService.getChannelById(user.currentOrgId, channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    return { success: true, data: channel };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Create channel
 */
export async function createChannel(formData: FormData) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const data = {
      channelType: formData.get('channelType') as string,
      channelName: formData.get('channelName') as string,
      credentials: JSON.parse(formData.get('credentials') as string),
      config: formData.has('config') ? JSON.parse(formData.get('config') as string) : undefined,
    };

    const channel = await ChannelService.createChannel(user.currentOrgId, data);

    revalidatePath('/[locale]/app/channels');

    return { success: true, data: channel };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update channel
 */
export async function updateChannel(channelId: string, formData: FormData) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const data: any = {};

    if (formData.has('channelName')) data.channelName = formData.get('channelName') as string;
    if (formData.has('credentials')) data.credentials = JSON.parse(formData.get('credentials') as string);
    if (formData.has('config')) data.config = JSON.parse(formData.get('config') as string);
    if (formData.has('status')) data.status = formData.get('status') as string;
    if (formData.has('autoSync')) data.autoSync = formData.get('autoSync') === 'true';
    if (formData.has('syncFrequency')) data.syncFrequency = parseInt(formData.get('syncFrequency') as string);

    const channel = await ChannelService.updateChannel(user.currentOrgId, channelId, data);

    revalidatePath('/[locale]/app/channels');
    revalidatePath(`/[locale]/app/channels/${channelId}`);

    return { success: true, data: channel };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete channel
 */
export async function deleteChannel(channelId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    await ChannelService.deleteChannel(user.currentOrgId, channelId);

    revalidatePath('/[locale]/app/channels');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Check channel health
 */
export async function checkChannelHealth(channelId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const health = await ChannelService.checkHealth(user.currentOrgId, channelId);

    revalidatePath('/[locale]/app/channels');
    revalidatePath(`/[locale]/app/channels/${channelId}`);

    return { success: true, data: health };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sync orders from channel
 */
export async function syncChannelOrders(channelId: string, since?: Date) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await ChannelService.syncOrders(user.currentOrgId, channelId, since);

    revalidatePath('/[locale]/app/channels');
    revalidatePath(`/[locale]/app/channels/${channelId}`);
    revalidatePath('/[locale]/app/orders');

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sync listings from channel
 */
export async function syncChannelListings(channelId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await ChannelService.syncListings(user.currentOrgId, channelId);

    revalidatePath('/[locale]/app/channels');
    revalidatePath(`/[locale]/app/channels/${channelId}`);
    revalidatePath('/[locale]/app/listings');

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sync inventory from channel
 */
export async function syncChannelInventory(channelId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await ChannelService.syncInventory(user.currentOrgId, channelId);

    revalidatePath('/[locale]/app/channels');
    revalidatePath(`/[locale]/app/channels/${channelId}`);
    revalidatePath('/[locale]/app/inventory');

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get sync history
 */
export async function getChannelSyncHistory(channelId: string, limit?: number) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const history = await ChannelService.getSyncHistory(user.currentOrgId, channelId, limit);

    return { success: true, data: history };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Test channel connection
 */
export async function testChannelConnection(channelType: string, credentials: any) {
  try {
    const result = await ChannelService.testConnection(channelType, credentials);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
