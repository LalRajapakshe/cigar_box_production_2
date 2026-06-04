/** @type {import('next').NextConfig} */
const nextConfig = {

//basePath: "/cb",

  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Output configuration - use standalone for better server deployment
  output: 'standalone',
  
  // Optional: Image optimization (adjust if you have public images)
  images: {
    unoptimized: false,
  },
  
  // Performance settings
  compress: true,
  poweredByHeader: false,
  
  // Optional: Custom headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
