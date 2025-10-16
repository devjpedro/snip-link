import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@snip-link/ui"],

  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:3333/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:3333/api/:path*",
      },
      {
        source: "/r/:path*",
        destination: "http://localhost:3333/r/:path*",
      },
    ];
  },
};

export default nextConfig;
