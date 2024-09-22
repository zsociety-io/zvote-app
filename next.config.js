/** @type {import('next').NextConfig} */

const path = require("path");
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };

    // fix warnings for async functions in the browser (https://github.com/vercel/next.js/issues/64792)
    if (!isServer) {
      config.output.environment = { ...config.output.environment, asyncFunction: true };
    }
    config.resolve.alias['@'] = path.resolve(__dirname) + "/src";

    return config;
  },
};

module.exports = nextConfig;