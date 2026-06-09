/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@snip-link/ui"],
  // O Better Auth roda server-side no Next (handler /api/auth e getSession no
  // layout), usando o driver node-postgres. Marcar "pg" como externo evita que
  // o bundler tente empacotá-lo (e o require opcional de "pg-native").
  serverExternalPackages: ["pg"],
  async rewrites() {
    return [
      {
        // Proxy same-origin para a API (Railway). As chamadas do browser batem
        // em "/api/proxy/*" no próprio domínio do front e são reescritas para a
        // API. Mantém o cookie de sessão first-party, evitando os bloqueios de
        // cookies cross-site (Safari/Brave/Firefox) entre Vercel e Railway.
        source: "/api/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
