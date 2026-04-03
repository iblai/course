/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/**',
      },
    ],
  },
  turbopack: {
    root: '/Users/bimsaraimalka/Downloads/v0-ibl-ai-skills-new-bimsara-main',
  },
}

export default nextConfig
