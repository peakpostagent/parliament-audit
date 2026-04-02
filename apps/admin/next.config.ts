import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@parliament-audit/shared', '@parliament-audit/db', '@parliament-audit/queue'],
};

export default nextConfig;
