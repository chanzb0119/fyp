import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['znoujhfvqhcxwjlafcvf.supabase.co'], // Replace with your Supabase project domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
