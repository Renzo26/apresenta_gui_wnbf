import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  // gera .next/standalone com um server.js mínimo — base da imagem Docker
  output: "standalone",
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // black.delamadridteam.com abre direto na página da Black (a URL continua na raiz)
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", has: [{ type: "host", value: "black\\..*" }], destination: "/black" }],
    };
  },
  // endereços do site anterior (WordPress) caem nas páginas novas, mantendo os UTMs
  async redirects() {
    return [
      { source: "/links", destination: "/", permanent: false },
      { source: "/links-2", destination: "/", permanent: false },
      { source: "/consultoria", destination: "/", permanent: false },
      { source: "/black-friday", destination: "/black", permanent: false },
      { source: "/hello-world", destination: "/", permanent: false },
      { source: "/teste", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
