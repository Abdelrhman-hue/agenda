import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.56.1'],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true, // اجعلها true إذا كان التحويل دائماً (308 Permanent)
      },
    ];
  },
};

export default nextConfig;
