import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/automation/mappings
 * Get all product mappings for the current organization
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await getUserWithOrg(supabase);
    
    if (!user || !user.org) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const isActive = searchParams.get('isActive') === 'true';
    
    const where: any = { orgId: user.org.id };
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    
    const [mappings, total] = await Promise.all([
      prisma.productMapping.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.productMapping.count({ where }),
    ]);
    
    return NextResponse.json({
      mappings,
      total,
      limit,
      offset,
    });
    
  } catch (error: any) {
    console.error('[API] Get mappings error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/automation/mappings
 * Create a new product mapping
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
      shopeeProductId,
      shopeeSku,
      amazonAsin,
      amazonUrl,
      confidence,
    } = body;
    
    if (!shopeeSku || !amazonAsin) {
      return NextResponse.json(
        { error: 'Shopee SKU and Amazon ASIN are required' },
        { status: 400 }
      );
    }
    
    const mapping = await prisma.productMapping.create({
      data: {
        orgId: user.org.id,
        shopeeProductId: shopeeProductId || shopeeSku,
        shopeeSku,
        amazonAsin,
        amazonUrl: amazonUrl || `https://www.amazon.com/dp/${amazonAsin}`,
        mappingType: 'manual',
        confidence: confidence || 1.0,
        verificationStatus: 'verified',
        isActive: true,
      },
    });
    
    return NextResponse.json(mapping);
    
  } catch (error: any) {
    console.error('[API] Create mapping error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
