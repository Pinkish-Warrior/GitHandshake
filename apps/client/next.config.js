/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/issues/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/issues/:path*`,
      },
      {
        source: "/api/github/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/github/:path*`,
      },
      {
        source: "/api/health",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/health`,
      },
    ];
  },
};

module.exports = nextConfig;
