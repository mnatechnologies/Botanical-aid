import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Keeps the Supabase auth cookie fresh and keeps anonymous visitors out of /admin.
 * Authorisation (is this user actually an admin?) is re-checked server-side in
 * requireAdmin() — this is only the first gate.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // /set-password and /auth/* are here so the session cookie set by the invite
  // exchange is refreshed on the way through; only /admin is actually gated above.
  matcher: ['/admin/:path*', '/set-password', '/auth/:path*'],
};
