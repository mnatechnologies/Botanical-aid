import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import SetPasswordForm from './SetPasswordForm';

export const dynamic = 'force-dynamic';

/**
 * Reached after /auth/confirm has exchanged the invite token for a session.
 * Without that session there is nothing to set a password on, so bounce to sign in.
 */
export default async function SetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <SetPasswordForm email={user.email ?? ''} />
    </div>
  );
}
