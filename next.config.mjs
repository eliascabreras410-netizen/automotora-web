/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ufnbgyfrwnmmfqpxqhdm.supabase.co',
      },
    ],
  },
};

export default nextConfig;