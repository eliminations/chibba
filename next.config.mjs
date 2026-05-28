import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["three"],
  outputFileTracingRoot: __dirname,
  images: {
    // Static export has no image optimization server.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
