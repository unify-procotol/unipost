import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  trailingSlash: false,
  /* config options here */
  transpilePackages: [
    "@unilab/urpc",
    "@unilab/urpc-core",
    "@unilab/urpc-next",
    "@unilab/builtin-plugin",
  ],
  async redirects() {
    return [
      // Redirect /blog/ to /blog (remove trailing slash) for all domains
      {
        source: '/blog/',
        destination: '/blog',
        permanent: false,
        has: [
          {
            type: 'host',
            value: 'mimo.exchange',
          },
        ],
      },
      {
        source: '/blog/',
        destination: '/blog',
        permanent: false,
        has: [
          {
            type: 'host',
            value: 'iotex.io',
          },
        ],
      },
      {
        source: '/blog/',
        destination: '/blog',
        permanent: false,
        has: [
          {
            type: 'host',
            value: 'blog.depinscan.io',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Rewrite /blog to project root for each domain
      {
        source: '/blog',
        destination: '/mimo',
        has: [
          {
            type: 'host',
            value: 'mimo.exchange',
          },
        ],
      },
      {
        source: '/blog',
        destination: '/iotex',
        has: [
          {
            type: 'host',
            value: 'iotex.io',
          },
        ],
      },
      {
        source: '/blog',
        destination: '/depinscan',
        has: [
          {
            type: 'host',
            value: 'blog.depinscan.io',
          },
        ],
      },
      // Rewrite /blog/* to project paths
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
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://unipost.uni-labs.org' : '',
  
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
