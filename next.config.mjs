/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: '/Users/bimsaraimalka/Downloads/v0-ibl-ai-skills-new-bimsara-main',
  },
}

export default nextConfig
