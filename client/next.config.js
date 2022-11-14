/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com","localhost",],
  },
  swcMinify: true,
}

module.exports = nextConfig
