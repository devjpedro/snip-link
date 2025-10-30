/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@snip-link/ui"],
  // serverExternalPackages: ["bcrypt", "pg", "pg-pool"],
  // experimental: {
  //   serverComponentsExternalPackages: ["bcrypt", "pg", "pg-pool"],
  // },
};

export default nextConfig;
