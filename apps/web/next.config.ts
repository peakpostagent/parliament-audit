import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@parliament-pulse/shared', '@parliament-pulse/db'],
};

export default nextConfig;
