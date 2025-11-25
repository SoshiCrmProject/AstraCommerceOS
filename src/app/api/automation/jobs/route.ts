import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { PrismaClient } from '@prisma/client';
import { manuallyTriggerFulfillment } from '@/lib/services/order-monitor';

const prisma = new PrismaClient();

/**
 * GET /api/automation/jobs
 * Get all auto-fulfillment jobs for the current organization
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await getUserWithOrg(supabase);
    
    if (!user || !user.org) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const where: any = { orgId: user.org.id };
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    const [jobs, total] = await Promise.all([
      prisma.autoFulfillmentJob.findMany({
        where,
        include: {
          order: {
            select: {
              customerName: true,
              total: true,
              channel: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.autoFulfillmentJob.count({ where }),
    ]);
    
    return NextResponse.json({
      jobs,
      total,
      limit,
      offset,
    });
    
  } catch (error: any) {
    console.error('[API] Get jobs error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/automation/jobs
 * Manually trigger auto-fulfillment for an order
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await getUserWithOrg(supabase);
    
    if (!user || !user.org) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { orderId } = body;
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    const result = await manuallyTriggerFulfillment(orderId, user.id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('[API] Trigger fulfillment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
