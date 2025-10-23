import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "@unilab/urpc",
    "@unilab/urpc-core",
    "@unilab/urpc-next",
    "@unilab/builtin-plugin",
  ],
  images: {
    loader: process.env.NODE_ENV === 'production' ? 'custom' : 'default',
    loaderFile: process.env.NODE_ENV === 'production' ? './src/lib/image-loader.js' : undefined,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mimo.exchange',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'iopay.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'iotex.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.depinscan.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unipost.uni-labs.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://unipost.uni-labs.org' : '',

  // AMP rewrites
  async rewrites() {
    return [
      // Project article AMP routes
      {
        source: '/iotex/:slug/amp',
        destination: '/iotex/:slug?amp=1'
      },
      {
        source: '/mimo/:slug/amp',
        destination: '/mimo/:slug?amp=1'
      },
      {
        source: '/iopay/:slug/amp',
        destination: '/iopay/:slug?amp=1'
      },
      {
        source: '/depinscan/:slug/amp',
        destination: '/depinscan/:slug?amp=1'
      },
      // Localized article AMP routes
      {
        source: '/:locale/:project/:slug/amp',
        destination: '/:locale/:project/:slug?amp=1'
      },
      // Project list AMP routes
      {
        source: '/iotex/amp',
        destination: '/iotex?amp=1'
      },
      {
        source: '/mimo/amp',
        destination: '/mimo?amp=1'
      },
      {
        source: '/iopay/amp',
        destination: '/iopay?amp=1'
      },
      {
        source: '/depinscan/amp',
        destination: '/depinscan?amp=1'
      },
      // Localized project list AMP routes
      {
        source: '/:locale/:project/amp',
        destination: '/:locale/:project?amp=1'
      },
      // Home page AMP route
      {
        source: '/amp',
        destination: '/?amp=1'
      }
    ];
  },

  // CORS and caching configuration
  async headers() {
    return [
      {
        // Apply CORS headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Cache static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Cache content pages with short-term caching
        source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=15, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
