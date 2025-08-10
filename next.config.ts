import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/btcPlus",
        permanent: false
      }
    ];
  },

  images: {
    domains: [
      "web3widgets.github.io",
      "avatar.sft-api.com",
      "sft-api.com",
      "images.sft-api.com",
      "res1.sft-api.com"
    ]
  }
};

export default nextConfig;
