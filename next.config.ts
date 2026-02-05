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
};

export default nextConfig;
