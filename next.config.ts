import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // product photos uploaded through /admin live in Supabase Storage
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            protocol: 'https' as const,
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
  },
  async redirects() {
    return [
      // old, hyphen-less category URL — keep any existing links and indexed pages alive
      { source: '/mental-healthrange', destination: '/mental-health-range', permanent: true },
    ];
  },
};

export default nextConfig;
