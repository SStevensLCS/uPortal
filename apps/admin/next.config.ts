import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@admissions-compass/shared',
    '@admissions-compass/ui',
    '@admissions-compass/database',
  ],
};

export default nextConfig;
