import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Bypass Next.js image optimization — serve pre-compressed JPGs directly.
    // Shared hosting (Hostinger) restarts the Node process frequently and
    // doesn't persist .next/cache/images/, so on-the-fly optimization
    // re-runs on every cold start and causes timeouts/slow loads.
    unoptimized: true,
    // Allow-list of `quality` values used across the codebase via
    // next/image's `quality` prop. Required starting in Next.js 16; harmless
    // now even with unoptimized: true.
    qualities: [80, 85, 88, 90, 95, 100],
  }
};

export default withNextIntl(nextConfig);
