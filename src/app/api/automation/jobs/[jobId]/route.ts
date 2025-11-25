import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { PrismaClient } from '@prisma/client';
import { queueAutoFulfillmentJob } from '@/lib/automation/fulfillment-worker';

const prisma = new PrismaClient();

/**
 * PATCH /api/automation/jobs/[jobId]
 * Update a job (approve, retry, cancel)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const supabase = await createClient();
    const user = await getUserWithOrg(supabase);
    
    if (!user || !user.org) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { jobId } = params;
    const body = await request.json();
    const { action } = body; // 'approve', 'retry', 'cancel'
    
    // Verify job belongs to user's org
    const job = await prisma.autoFulfillmentJob.findUnique({
      where: { id: jobId },
      include: {
        order: {
          select: {
            shippingAddress: true,
            customerName: true,
          },
        },
      },
    });
    
    if (!job || job.orgId !== user.org.id) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    if (action === 'approve') {
      // Re-queue the job for processing
      const shippingAddress = typeof job.order?.shippingAddress === 'string'
        ? JSON.parse(job.order.shippingAddress)
        : job.order?.shippingAddress;
      
      await queueAutoFulfillmentJob({
        jobId: job.id,
        orgId: job.orgId,
        orderId: job.orderId,
        shopeeProductId: job.shopeeProductId,
        shopeeSku: job.shopeeSku,
        quantity: job.quantity,
        shopeePrice: job.shopeePrice,
        customerAddress: {
          name: shippingAddress?.name || job.order?.customerName || 'Customer',
          addressLine1: shippingAddress?.addressLine1 || '',
          addressLine2: shippingAddress?.addressLine2,
          city: shippingAddress?.city || '',
          state: shippingAddress?.state || '',
          postalCode: shippingAddress?.postalCode || '',
          country: shippingAddress?.country || 'JP',
          phone: shippingAddress?.phone || '',
        },
      });
      
      await prisma.autoFulfillmentJob.update({
        where: { id: jobId },
        data: { status: 'pending' },
      });
      
    } else if (action === 'retry') {
      // Reset status and re-queue
      await prisma.autoFulfillmentJob.update({
        where: { id: jobId },
        data: { 
          status: 'pending',
          errorMessage: null,
        },
      });
      
      const shippingAddress = typeof job.order?.shippingAddress === 'string'
        ? JSON.parse(job.order.shippingAddress)
        : job.order?.shippingAddress;
      
      await queueAutoFulfillmentJob({
        jobId: job.id,
        orgId: job.orgId,
        orderId: job.orderId,
        shopeeProductId: job.shopeeProductId,
        shopeeSku: job.shopeeSku,
        quantity: job.quantity,
        shopeePrice: job.shopeePrice,
        customerAddress: {
          name: shippingAddress?.name || job.order?.customerName || 'Customer',
          addressLine1: shippingAddress?.addressLine1 || '',
          addressLine2: shippingAddress?.addressLine2,
          city: shippingAddress?.city || '',
          state: shippingAddress?.state || '',
          postalCode: shippingAddress?.postalCode || '',
          country: shippingAddress?.country || 'JP',
          phone: shippingAddress?.phone || '',
        },
      });
      
    } else if (action === 'cancel') {
      await prisma.autoFulfillmentJob.update({
        where: { id: jobId },
        data: { 
          status: 'rejected',
          errorMessage: 'Cancelled by user',
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    const updatedJob = await prisma.autoFulfillmentJob.findUnique({
      where: { id: jobId },
    });
    
    return NextResponse.json(updatedJob);
    
  } catch (error: any) {
    console.error('[API] Update job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/automation/jobs/[jobId]
 * Get details for a specific job
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const supabase = await createClient();
    const user = await getUserWithOrg(supabase);
    
    if (!user || !user.org) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { jobId } = params;
    
    const job = await prisma.autoFulfillmentJob.findUnique({
      where: { id: jobId },
      include: {
        order: {
          include: {
            channel: true,
          },
        },
      },
    });
    
    if (!job || job.orgId !== user.org.id) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json(job);
    
  } catch (error: any) {
    console.error('[API] Get job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
