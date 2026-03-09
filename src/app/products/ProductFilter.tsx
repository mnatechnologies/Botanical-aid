'use client';

import Link from 'next/link';

const filters = [
  { label: 'All Products', href: '/products', category: undefined },
  {
    label: 'Mental Health Range',
    href: '/mental-healthrange',
    category: 'mental-health',
  },
  {
    label: 'Post Treatment Skincare',
    href: '/post-treatment-skincare',
    category: 'post-treatment',
  },
];

export default function ProductFilter({
  currentCategory,
}: {
  currentCategory?: string;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filters.map((f) => {
        const isActive = currentCategory === f.category;
        return (
          <Link
            key={f.label}
            href={f.href}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {f.label}
          </Link>
        );
      })}
    </div>
  );
}
