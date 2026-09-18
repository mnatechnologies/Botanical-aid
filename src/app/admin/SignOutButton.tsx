'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await createSupabaseBrowserClient().auth.signOut();
        router.replace('/admin/login');
        router.refresh();
      }}
      className="px-3 py-1.5 rounded border border-[#e5e7eb] hover:bg-gray-50 cursor-pointer"
    >
      Sign out
    </button>
  );
}
