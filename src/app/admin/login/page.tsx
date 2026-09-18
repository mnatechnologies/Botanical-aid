'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await createSupabaseBrowserClient().auth.signInWithPassword({ email, password });
    if (error) {
      setError('That email and password did not match. Please try again.');
      setBusy(false);
      return;
    }
    router.replace(params.get('next') || '/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-lg border border-[#e5e7eb] p-6 space-y-4">
      <h1 className="text-xl font-bold text-[#1a3a8f]">Botanical Aid admin</h1>
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input
          id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit" disabled={busy}
        className="w-full h-10 rounded-md bg-[#1a3a8f] text-white font-semibold disabled:opacity-50 cursor-pointer"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
