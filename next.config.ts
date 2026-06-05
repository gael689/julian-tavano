import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF encoding is too CPU-heavy for shared hosting — WebP only
    formats: ['image/webp'] as ['image/webp'],
    // Cache optimized images for 30 days so each is only processed once
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Limit srcset breakpoints to realistic screen sizes
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: []
  }
};

export default withNextIntl(nextConfig);
