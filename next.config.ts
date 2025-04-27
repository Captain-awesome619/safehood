import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['fra.cloud.appwrite.io'], // Add this line to allow images from Appwrite
  },
};

export default nextConfig;
