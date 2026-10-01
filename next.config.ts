import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.56.1'],
  
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