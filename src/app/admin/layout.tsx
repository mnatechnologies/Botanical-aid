import type { Metadata } from 'next';
import Link from 'next/link';
import { Toaster } from 'sonner';
import { getAdminUser } from '@/lib/admin-auth';
import SignOutButton from './SignOutButton';

export const metadata: Metadata = {
  title: 'Botanical Aid — Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser();

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {admin && (
        <header className="bg-white border-b border-[#e5e7eb]">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-bold text-[#1a3a8f]">Botanical Aid admin</Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/admin" className="hover:underline">Products</Link>
                <Link href="/admin/content" className="hover:underline">Website content</Link>
                <Link href="/admin/pages" className="hover:underline">Pages</Link>
                <Link href="/" className="hover:underline text-gray-500">View site</Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="hidden sm:inline">{admin.email}</span>
              <SignOutButton />
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
