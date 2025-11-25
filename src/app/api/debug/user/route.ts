import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getUserWithOrg();
    
    if (!user || !user.currentOrgId) {
      return NextResponse.json(
        { error: 'Not authenticated or no organization found' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      orgId: user.currentOrgId,
    });
  } catch (error) {
    console.error('Error in /api/debug/user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
