import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@parliament-pulse/shared', '@parliament-pulse/db', '@parliament-pulse/queue'],
};

export default nextConfig;
