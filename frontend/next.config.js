/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    const backendBase = process.env.BACKEND_URL || 'https://ap-public-school-erp.onrender.com';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendBase}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
