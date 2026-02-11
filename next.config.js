/** @type {import('next').NextConfig} */

await import("./env.mjs");

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ← ADD THIS LINE
  },
};

export default nextConfig;
