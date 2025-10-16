import type { NextConfig } from "next";

const apiPort = process.env.API_PORT ?? "3333";

const apiBaseUrl = `http://localhost:${apiPort}`;

const nextConfig: NextConfig = {
  transpilePackages: ["@snip-link/ui"],

  experimental: {
    proxyTimeout: 30_000, // 30 segundos
  },

  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${apiBaseUrl}/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
      {
        source: "/r/:path*",
        destination: `${apiBaseUrl}/r/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
