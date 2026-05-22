/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@marcelino/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
