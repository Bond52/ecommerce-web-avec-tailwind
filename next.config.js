/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Autorise le backend Render pour les images et les appels directs
  images: {
    domains: ["ecommerce-web-avec-tailwind.onrender.com"],
  },

  // ✅ Injecte la variable d'environnement utilisable dans tout ton frontend
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://ecommerce-web-avec-tailwind.onrender.com",
  },

  // ✅ Rewrites pour le développement local
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL + "/api/:path*", // proxy vers Render
      },
    ];
  },
};

module.exports = nextConfig;
