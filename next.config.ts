import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["[::1]", "localhost"],
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "image.mux.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "i.kinescope.io" },
      { protocol: "https", hostname: "preview.kinescope.io" },
      // VK OAuth avatars
      { protocol: "https", hostname: "*.userapi.com" },
      { protocol: "https", hostname: "vk.com" },
      // Yandex ID avatars
      { protocol: "https", hostname: "avatars.yandex.net" },
      { protocol: "https", hostname: "avatars.mds.yandex.net" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
