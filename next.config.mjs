/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      allowedOrigins: ["associatevoicematters.com", "localhost:3000"],
    },
  },
};

export default nextConfig;
