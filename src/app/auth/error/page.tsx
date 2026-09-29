import Link from 'next/link';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-lg border border-[#e5e7eb] p-6 space-y-4 text-center">
        <h1 className="text-xl font-bold text-[#1a3a8f]">That link didn&apos;t work</h1>
        <p className="text-sm text-gray-600">
          {reason === 'expired'
            ? 'Invitation links expire, and each one can only be used once. Ask for a new invitation and it will work.'
            : 'Something was missing from that link. Open it straight from the email rather than copying it.'}
        </p>
        <Link href="/admin/login" className="text-sm text-[#1a3a8f] hover:underline inline-block">
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
