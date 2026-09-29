'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

const field =
  'w-full h-10 px-3 rounded-md border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]';

export default function SetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 10) {
      setError('Use at least 10 characters.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }

    setBusy(true);
    const { error } = await createSupabaseBrowserClient().auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-lg border border-[#e5e7eb] p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#1a3a8f]">Choose a password</h1>
        {email && <p className="text-sm text-gray-500 mt-1">for {email}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">New password</label>
        <input
          id="password" type="password" autoComplete="new-password" required
          value={password} onChange={(e) => setPassword(e.target.value)} className={field}
        />
        <p className="text-xs text-gray-500">At least 10 characters. A few words together works well.</p>
      </div>

      <div className="space-y-1">
        <label htmlFor="confirm" className="text-sm font-medium">Type it again</label>
        <input
          id="confirm" type="password" autoComplete="new-password" required
          value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit" disabled={busy}
        className="w-full h-11 rounded-md bg-[#1a3a8f] text-white font-semibold disabled:opacity-50 cursor-pointer"
      >
        {busy ? 'Saving…' : 'Save password and continue'}
      </button>
    </form>
  );
}
