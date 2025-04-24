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
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
