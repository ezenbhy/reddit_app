/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
    "www.gravatar.com",
    "localhost",
    "ec2-3-85-20-141.compute-1.amazonaws.com"],
  },
  swcMinify: true,
}

module.exports = nextConfig
