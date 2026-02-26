// @admissions-compass/database client
// Supabase client factory for browser and server environments

import {
  createBrowserClient as createBrowserSupabaseClient,
  createServerClient as createServerSupabaseClient,
} from '@supabase/ssr';
import type { Database } from './types';

/**
 * Creates a Supabase client for use in browser/client components.
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from environment.
 */
export function createBrowserClient() {
  return createBrowserSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Cookie options for server-side cookie management.
 */
export interface CookieOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'lax' | 'strict' | 'none';
  secure?: boolean;
  [key: string]: unknown;
}

/**
 * Cookie store interface expected by the server client factory.
 * Compatible with Next.js cookies() from next/headers.
 */
export interface CookieStore {
  getAll: () => { name: string; value: string }[];
  setAll: (cookies: { name: string; value: string; options?: CookieOptions }[]) => void;
}

/**
 * Creates a Supabase client for use in server components, API routes,
 * and server actions. Requires a cookie store for session management.
 *
 * Usage with Next.js App Router:
 * ```ts
 * import { cookies } from 'next/headers';
 * import { createServerClient } from '@admissions-compass/database';
 *
 * const cookieStore = await cookies();
 * const supabase = createServerClient(cookieStore);
 * ```
 */
export function createServerClient(cookieStore: CookieStore) {
  return createServerSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookieStore.setAll(
              cookiesToSet.map(({ name, value, options }) => ({
                name,
                value,
                options,
              }))
            );
          } catch {
            // The `setAll` method may be called from a Server Component
            // where cookies cannot be set. This can be safely ignored if
            // middleware is configured to refresh user sessions.
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase admin client using the service role key.
 * WARNING: This bypasses RLS. Only use in trusted server-side contexts
 * such as background jobs, webhooks, or admin scripts.
 */
export async function createServiceClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
