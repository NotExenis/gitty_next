/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['discord.js', 'zlib-sync', 'bufferutil', 'utf-8-validate'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;