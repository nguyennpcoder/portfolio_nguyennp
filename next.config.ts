import type { NextConfig } from "next";

/**
 * Client-only portfolio. Everything renders on the client and the build is a
 * fully static site (`out/`) — no server runtime, no route handlers, no
 * server actions, no database.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
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
