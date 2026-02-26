import { NextResponse } from 'next/server';
import { createServerClient } from '@admissions-compass/database';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = {
      getAll(): { name: string; value: string }[] {
        const cookieHeader = request.headers.get('cookie') ?? '';
        return cookieHeader
          .split(';')
          .filter(Boolean)
          .map((cookie) => {
            const [name, ...rest] = cookie.trim().split('=');
            return { name, value: rest.join('=') };
          });
      },
      setAll(
        cookies: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[]
      ): void {
        cookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    };

    const response = NextResponse.redirect(`${origin}${next}`);

    // Re-assign setAll so it uses the created response
    cookieStore.setAll = (
      cookies: {
        name: string;
        value: string;
        options?: Record<string, unknown>;
      }[]
    ) => {
      cookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
    };

    const supabase = createServerClient(cookieStore);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  // Return the user to the login page with an error
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`
  );
}
