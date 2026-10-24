import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
