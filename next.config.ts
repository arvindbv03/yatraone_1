import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: process.env.BASE_PATH || "",
  assetPrefix: process.env.BASE_PATH || "",
  images: {
    unoptimized: true,
  },
  // cacheComponents and partialPrefetching are incompatible with static export
  // cacheComponents: true,
  // partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Export basePath as public env var for client-side access
if (process.env.BASE_PATH) {
  process.env.NEXT_PUBLIC_BASE_PATH = process.env.BASE_PATH;
}

export default nextConfig;
