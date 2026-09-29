import Link from 'next/link';

/**
 * Invite / recovery landing page.
 *
 * Deliberately does NOT verify on load. Mail security scanners (Microsoft Defender
 * Safe Links, Mimecast and friends) fetch every link in an email before the recipient
 * sees it, and Supabase's token_hash is single-use — a GET handler that verifies would
 * be burned by the scanner, and the human would get "link invalid or expired".
 *
 * So the token is verified by the POST in ./verify, triggered by the button below.
 * Scanners follow links; they do not submit forms.
 */
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>;
}) {
  const { token_hash, type, next } = await searchParams;
  const valid = Boolean(token_hash && type);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-lg border border-[#e5e7eb] p-6 space-y-4 text-center">
        <h1 className="text-xl font-bold text-[#1a3a8f]">Botanical Aid</h1>

        {valid ? (
          <>
            <p className="text-sm text-gray-600">
              {type === 'recovery'
                ? 'Click below to continue and set a new password.'
                : 'Click below to accept your invitation and set a password.'}
            </p>

            <form action="/auth/confirm/verify" method="post" className="space-y-3">
              <input type="hidden" name="token_hash" value={token_hash} />
              <input type="hidden" name="type" value={type} />
              <input type="hidden" name="next" value={next ?? '/set-password'} />
              <button
                type="submit"
                className="w-full h-11 rounded-md bg-[#1a3a8f] text-white font-semibold cursor-pointer"
              >
                {type === 'recovery' ? 'Reset my password' : 'Accept invitation'}
              </button>
            </form>

            <p className="text-xs text-gray-400">This link can only be used once.</p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              This link is missing part of its address, so we can&apos;t continue.
            </p>
            <p className="text-sm text-gray-600">
              Open the link straight from the email rather than copying it, or ask for a new invitation.
            </p>
            <Link href="/" className="text-sm text-[#1a3a8f] hover:underline inline-block">
              Back to the shop
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
