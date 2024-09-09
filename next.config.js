/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true, // Enable top-level await
    };
    return config;
  },
};

module.exports = nextConfig;