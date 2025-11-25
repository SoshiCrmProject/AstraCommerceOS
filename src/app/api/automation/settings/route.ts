import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { PrismaClient } from '@prisma/client';
import { encryptAmazonCredentials } from '@/lib/services/encryption';

const prisma = new PrismaClient();

/**
 * GET /api/automation/settings
 * Get auto-fulfillment settings for the current organization
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await getUserWithOrg(supabase);
    
    if (!user || !user.org) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const config = await prisma.autoFulfillmentConfig.findFirst({
      where: { orgId: user.org.id },
    });
    
    if (!config) {
      // Return default config
      return NextResponse.json({
        enabled: false,
        includeAmazonPoints: true,
        includeDomesticShipping: false,
        maxDeliveryDays: 7,
        minExpectedProfit: 500,
        shopeeCommissionRate: 0.05,
        eligibleChannels: [],
        maxDailyOrders: 10,
        requireManualApproval: false,
      });
    }
    
    // Don't send encrypted credentials to client
    const { amazonCredentials, ...safeConfig } = config;
    
    return NextResponse.json({
      ...safeConfig,
      hasAmazonCredentials: !!amazonCredentials,
    });
    
  } catch (error: any) {
    console.error('[API] Get settings error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/automation/settings
 * Create or update auto-fulfillment settings
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await getUserWithOrg(supabase);
    
    if (!user || !user.org) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const {
      enabled,
      includeAmazonPoints,
      includeDomesticShipping,
      maxDeliveryDays,
      minExpectedProfit,
      shopeeCommissionRate,
      eligibleChannels,
      maxDailyOrders,
      requireManualApproval,
      amazonEmail,
      amazonPassword,
      amazonTotpSecret,
    } = body;
    
    // Validate required fields
    if (enabled && !amazonEmail) {
      return NextResponse.json(
        { error: 'Amazon email is required when auto-fulfillment is enabled' },
        { status: 400 }
      );
    }
    
    // Prepare data
    const data: any = {
      orgId: user.org.id,
      enabled: enabled ?? false,
      includeAmazonPoints: includeAmazonPoints ?? true,
      includeDomesticShipping: includeDomesticShipping ?? false,
      maxDeliveryDays: maxDeliveryDays ?? 7,
      minExpectedProfit: minExpectedProfit ?? 500,
      shopeeCommissionRate: shopeeCommissionRate ?? 0.05,
      eligibleChannels: eligibleChannels ?? [],
      maxDailyOrders: maxDailyOrders ?? 10,
      requireManualApproval: requireManualApproval ?? false,
    };
    
    // Encrypt Amazon credentials if provided
    if (amazonEmail && amazonPassword) {
      data.amazonEmail = amazonEmail;
      data.amazonCredentials = encryptAmazonCredentials({
        email: amazonEmail,
        password: amazonPassword,
        totpSecret: amazonTotpSecret || undefined,
      });
    }
    
    // Upsert config
    const config = await prisma.autoFulfillmentConfig.upsert({
      where: {
        orgId: user.org.id,
      },
      create: data,
      update: data,
    });
    
    const { amazonCredentials, ...safeConfig } = config;
    
    return NextResponse.json({
      ...safeConfig,
      hasAmazonCredentials: !!amazonCredentials,
    });
    
  } catch (error: any) {
    console.error('[API] Save settings error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
