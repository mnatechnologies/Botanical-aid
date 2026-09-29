import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const ALLOWED_TYPES: EmailOtpType[] = ['invite', 'recovery', 'email', 'magiclink', 'signup', 'email_change'];

/** Only ever a POST: a GET here would let link scanners burn the single-use token. */
export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  const form = await request.formData();

  const tokenHash = String(form.get('token_hash') ?? '');
  const type = String(form.get('type') ?? '') as EmailOtpType;
  const rawNext = String(form.get('next') ?? '/set-password');

  // only same-site paths, so a crafted link can't bounce someone off to another host
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/set-password';

  if (!tokenHash || !ALLOWED_TYPES.includes(type)) {
    return NextResponse.redirect(`${origin}/auth/error?reason=missing`, { status: 303 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) {
    return NextResponse.redirect(`${origin}/auth/error?reason=expired`, { status: 303 });
  }

  // 303 so the browser follows with a GET rather than re-posting
  return NextResponse.redirect(`${origin}${next}`, { status: 303 });
}
