import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.gtafits.com', port: '', pathname: '/gta6/comps/**', search: '' },
      { protocol: 'https', hostname: 'cdn.gtafits.com', port: '', pathname: '/gta6/items/renders-v1/**', search: '' },
      { protocol: 'https', hostname: 'cdn.gtafits.com', port: '', pathname: '/gta6/items/icons-v1/**', search: '' },
    ],
    maximumRedirects: 0,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
