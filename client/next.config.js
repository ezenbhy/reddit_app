/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
    "www.gravatar.com",
    "localhost",
    "ec2-54-211-18-116.compute-1.amazonaws.com"],
  },
  swcMinify: true,
}

module.exports = nextConfig
