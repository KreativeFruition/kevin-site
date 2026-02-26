import type { NextConfig } from "next";

const rewrites = async () => [
  { source: "/favicon.ico", destination: "/icons/favicon.ico" },
  { source: "/apple-touch-icon.png", destination: "/icons/apple-touch-icon.png" },
  { source: "/icon-192.png", destination: "/icons/icon-192.png" },
  { source: "/icon-512.png", destination: "/icons/icon-512.png" },
];

const nextConfig: NextConfig = {
  rewrites,
};

export default nextConfig;
