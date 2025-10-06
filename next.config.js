/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Autorise les images hébergées sur ton backend Render
  images: {
    domains: ["ecommerce-web-avec-tailwind.onrender.com"],
  },

  // ✅ Variable d’environnement publique accessible côté client
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://ecommerce-web-avec-tailwind.onrender.com",
  },

  // 🚫 Supprime complètement rewrites()
  // car Next 13.4.x ne permet pas l’usage de process.env ici au build
};

module.exports = nextConfig;
