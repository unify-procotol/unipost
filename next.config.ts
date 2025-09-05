import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /* config options here */
  transpilePackages: [
    "@unilab/urpc",
    "@unilab/urpc-core",
    "@unilab/urpc-next",
    "@unilab/builtin-plugin",
  ],
  async rewrites() {
    return [
      // Rewrite /blog/* to /mimo/* for Mimo project (mimo.exchange)
      {
        source: '/blog/:path*',
        destination: '/mimo/:path*',
        has: [
          {
            type: 'host',
            value: 'mimo.exchange',
          },
        ],
      },
      // Rewrite /blog/* to /iotex/* for IoTeX project (iotex.io)
      {
        source: '/blog/:path*',
        destination: '/iotex/:path*',
        has: [
          {
            type: 'host',
            value: 'iotex.io',
          },
        ],
      },
      // Rewrite /blog/* to /depinscan/* for DePINScan project (blog.depinscan.io)
      {
        source: '/blog/:path*',
        destination: '/depinscan/:path*',
        has: [
          {
            type: 'host',
            value: 'blog.depinscan.io',
          },
        ],
      },
      // Fallback: for direct access to unipost.uni-labs.org, keep original paths
      // This ensures direct access to /mimo/slug, /iotex/slug, /depinscan/slug works
    ];
  },
  images: {
    loader: process.env.NODE_ENV === 'production' ? 'custom' : 'default',
    loaderFile: process.env.NODE_ENV === 'production' ? './src/lib/image-loader.js' : undefined,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mimo.exchange',
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
  
  // CORS configuration
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
    ];
  },
};

export default nextConfig;
