/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@snip-link/ui"],
  experimental: {
    serverMinification: false,
  },
};

export default nextConfig;
