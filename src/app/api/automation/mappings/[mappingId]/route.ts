import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PATCH /api/automation/mappings/[mappingId]
 * Update a product mapping
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { mappingId: string } }
) {
  try {
    const supabase = await createClient();
    const user = await getUserWithOrg(supabase);
    
    if (!user || !user.org) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { mappingId } = params;
    const body = await request.json();
    
    // Verify mapping belongs to user's org
    const existing = await prisma.productMapping.findUnique({
      where: { id: mappingId },
    });
    
    if (!existing || existing.orgId !== user.org.id) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });
    }
    
    const mapping = await prisma.productMapping.update({
      where: { id: mappingId },
      data: {
        ...body,
        lastVerified: new Date(),
      },
    });
    
    return NextResponse.json(mapping);
    
  } catch (error: any) {
    console.error('[API] Update mapping error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/automation/mappings/[mappingId]
 * Delete a product mapping
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { mappingId: string } }
) {
  try {
    const supabase = await createClient();
    const user = await getUserWithOrg(supabase);
    
    if (!user || !user.org) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { mappingId } = params;
    
    // Verify mapping belongs to user's org
    const existing = await prisma.productMapping.findUnique({
      where: { id: mappingId },
    });
    
    if (!existing || existing.orgId !== user.org.id) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });
    }
    
    await prisma.productMapping.delete({
      where: { id: mappingId },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('[API] Delete mapping error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
