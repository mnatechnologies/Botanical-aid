'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

/**
 * Sends the "Reset password" email. The link in that email comes from the Supabase
 * template (token_hash + type=recovery → /auth/confirm → /set-password), so the
 * redirect is decided there, not here.
 *
 * The confirmation message is the same whether or not the address has an account,
 * so this page can't be used to find out who has admin access.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await createSupabaseBrowserClient().auth.resetPasswordForEmail(email.trim());
    setBusy(false);

    // Supabase rate-limits these; surface that one, swallow everything else so the
    // response never reveals whether the address exists.
    if (error && (error.status === 429 || /security purposes|rate limit/i.test(error.message))) {
      setError('Too many requests. Please wait a minute and try again.');
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-lg border border-[#e5e7eb] p-6 space-y-4">
        <h1 className="text-xl font-bold text-[#1a3a8f]">Reset your password</h1>

        {sent ? (
          <>
            <p className="text-sm text-gray-600">
              If <strong>{email.trim()}</strong> has an account, we&apos;ve emailed it a link to choose a new
              password. It can take a couple of minutes to arrive — check your junk folder too.
            </p>
            <p className="text-sm text-gray-600">The link can only be used once.</p>
            <Link href="/admin/login" className="text-sm text-[#1a3a8f] hover:underline inline-block">
              Back to sign in
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter the email you sign in with and we&apos;ll send you a link to choose a new password.
            </p>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email" type="email" autoComplete="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit" disabled={busy}
              className="w-full h-10 rounded-md bg-[#1a3a8f] text-white font-semibold disabled:opacity-50 cursor-pointer"
            >
              {busy ? 'Sending…' : 'Send reset link'}
            </button>
            <Link href="/admin/login" className="text-sm text-gray-500 hover:underline inline-block">
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
