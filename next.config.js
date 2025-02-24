/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['images.ctfassets.net', 'lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
