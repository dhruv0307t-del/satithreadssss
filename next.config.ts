import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/product/:id',
        destination: '/products/:id',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/',
      },
    ]
  },
};

export default nextConfig;
