/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  images: {
    domains: ["rhwkcqrojvsiaklnyclo.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rhwkcqrojvsiaklnyclo.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
};

module.exports = nextConfig;
