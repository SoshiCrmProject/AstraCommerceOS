'use server';

/**
 * Authentication server actions
 * Handles sign-up, sign-in, sign-out, password reset
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';
import { createOrganization } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface AuthResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

/**
 * Sign up new user with email/password
 */
export async function signUpAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const orgName = formData.get('orgName') as string;
  const locale = formData.get('locale') as string || 'en';

  if (!email || !password || !name || !orgName) {
    return {
      success: false,
      error: 'All fields are required',
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create Supabase auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Failed to create user',
      };
    }

    // Create user in our database
    const user = await prisma.user.create({
      data: {
        email,
        authProviderId: data.user.id,
        name,
        emailVerified: false,
        locale,
      },
    });

    // Generate org slug from name
    const slug = orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Create organization
    const org = await createOrganization({
      userId: user.id,
      name: orgName,
      slug: slug + '-' + Date.now(), // Ensure uniqueness
    });

    // Set active org cookie
    const cookieStore = await cookies();
    cookieStore.set('selected-org-id', org.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });

    return {
      success: true,
      redirectTo: `/${locale}/app`,
    };
  } catch (error: any) {
    console.error('Sign-up error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create account',
    };
  }
}

/**
 * Sign in with email/password
 */
export async function signInAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const locale = formData.get('locale') as string || 'en';

  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Authentication failed',
      };
    }

    // Update last login
    await prisma.user.updateMany({
      where: { authProviderId: data.user.id },
      data: { lastLoginAt: new Date() },
    });

    // Set session cookie
    const cookieStore = await cookies();
    if (data.session) {
      cookieStore.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.session.expires_in,
      });
      cookieStore.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return {
      success: true,
      redirectTo: `/${locale}/app`,
    };
  } catch (error: any) {
    console.error('Sign-in error:', error);
    return {
      success: false,
      error: 'Failed to sign in',
    };
  }
}

/**
 * Sign out current user
 */
export async function signOutAction(locale: string = 'en') {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    await supabase.auth.signOut();

    // Clear all auth cookies
    const cookieStore = await cookies();
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');
    cookieStore.delete('selected-org-id');
  } catch (error) {
    console.error('Sign-out error:', error);
  }

  redirect(`/${locale}/sign-in`);
}

/**
 * Request password reset email
 */
export async function requestPasswordResetAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;

  if (!email) {
    return {
      success: false,
      error: 'Email is required',
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'Failed to send reset email',
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPasswordAction(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string;
  const locale = formData.get('locale') as string || 'en';

  if (!password) {
    return {
      success: false,
      error: 'Password is required',
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: 'Password must be at least 8 characters',
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      redirectTo: `/${locale}/app`,
    };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: 'Failed to reset password',
    };
  }
}

/**
 * Switch active organization
 */
export async function switchOrgAction(orgId: string, locale: string = 'en') {
  const cookieStore = await cookies();
  cookieStore.set('selected-org-id', orgId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect(`/${locale}/app`);
}
