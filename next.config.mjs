/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      // "utf-8-validate": "commonjs utf-8-validate",
      // bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    });
    // config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  },
  images: {
    domains: ['liveblocks.io'],
    // remotePatterns: [
    //   {
    //     protocol: 'https:',
    //     hostname: 'liveblocks.io',
    //     port: '3000'
    //   }
    // ]
  },
  experimental: {
    serverComponentsExternalPackages: ['fabric'],
  },
};

export default nextConfig;
