/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')
const WithTM = withTM(['@uiw/react-md-editor', '@uiw/react-markdown-preview'])

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

    return config;
  },
};

module.exports = WithTM(nextConfig);