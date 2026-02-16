import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.mixkit.co",
      },
      {
        protocol: "https",
        hostname: "videos.pexels.com",
      },
      {
        protocol: "https",
        hostname: "6qi7zm8e9r.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
