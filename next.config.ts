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
  images: {
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
    ],
  },
};

export default nextConfig;
