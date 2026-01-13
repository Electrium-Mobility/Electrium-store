/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverActions: {
    allowedOrigins: [
      "localhost:3000",
      "*.netlify.app",
      "electrium-mobility.netlify.app",
    ],
  },
  images: {
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
