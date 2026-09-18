import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import StockControls from './StockControls';
import ImportButton from './ImportButton';

export const dynamic = 'force-dynamic';

type Row = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  size: string;
  stock: number;
  is_active: boolean;
  category: string;
};

export default async function AdminProductsPage() {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, price, size, stock, is_active, category')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  const products = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a8f]">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Changes go live on the website straight away.
          </p>
        </div>
        <ImportButton hasProducts={products.length > 0} />
      </div>

      {error && (
        <p className="text-sm text-red-600">Could not load products: {error.message}</p>
      )}

      {!error && products.length === 0 && (
        <p className="text-sm text-gray-600">
          No products in the database yet — import the ones currently on the website to get started.
        </p>
      )}

      <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">On the site</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[#e5e7eb]">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.category.replace('-', ' ')}</div>
                </td>
                <td className="px-4 py-3">{p.size}</td>
                <td className="px-4 py-3">${Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <StockControls productId={p.id} stock={p.stock} />
                </td>
                <td className="px-4 py-3">
                  <span className={p.is_active ? 'text-green-700' : 'text-gray-400'}>
                    {p.is_active ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-[#1a3a8f] font-medium hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
