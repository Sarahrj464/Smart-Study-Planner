import path from "path";
import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  // Prevent Next from "guessing" the workspace root (useful when other lockfiles exist).
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { hostname: 'img.clerk.com' },
      { hostname: '*.supabase.co', pathname: '/storage/**' },
    ],
  },
};

export default nextConfig;
