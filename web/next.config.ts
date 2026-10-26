import type { NextConfig } from "next";

// A página de links virou a LP (pasta lp/). Em produção, defina LP_URL no build com o domínio dela.
const lpUrl = process.env.LP_URL ?? (process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001");

const nextConfig: NextConfig = {
  async redirects() {
    return lpUrl ? [{ source: "/links", destination: lpUrl, permanent: false }] : [];
  },
  // gera .next/standalone com um server.js mínimo para a imagem Docker
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
