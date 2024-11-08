import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['znoujhfvqhcxwjlafcvf.supabase.co','lh3.googleusercontent.com', 'img.iproperty.com.my'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/auth/callback',
        destination: '/',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
