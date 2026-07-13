import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 30,
    }
  },
  turbopack: {
    root: process.cwd(),
  }
};

export default nextConfig;
